from fastapi import APIRouter, HTTPException, Depends, Query
from firebase_admin_config import get_firestore_db
from models.schemas import OrderCreate, OrderResponse, CouponCreate
from routes.auth import verify_token
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate, user=Depends(verify_token)):
    db = get_firestore_db()
    uid = user["uid"]

    order_data = {
        "userId": uid,
        "items": [item.model_dump() for item in order.items],
        "shippingAddress": order.shippingAddress,
        "paymentMethod": order.paymentMethod,
        "couponCode": order.couponCode,
        "subtotal": order.subtotal,
        "discount": order.discount,
        "shipping": order.shipping,
        "total": order.total,
        "note": order.note,
        "status": "Pending",
        "createdAt": datetime.utcnow().isoformat(),
    }

    doc_ref = db.collection("orders").add(order_data)
    order_id = doc_ref[1].id

    # Update product stock
    for item in order.items:
        product_ref = db.collection("products").document(item.productId)
        product_doc = product_ref.get()
        if product_doc.exists:
            current_stock = product_doc.to_dict().get("stock", 0)
            new_stock = max(0, current_stock - item.quantity)
            product_ref.update({"stock": new_stock})

    return OrderResponse(id=order_id, **order_data)


@router.get("/", response_model=List[OrderResponse])
async def list_user_orders(user=Depends(verify_token)):
    db = get_firestore_db()
    uid = user["uid"]

    query = db.collection("orders").where("userId", "==", uid).order_by("createdAt", direction="DESCENDING")
    docs = query.stream()

    orders = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        orders.append(OrderResponse(**data))

    return orders


@router.get("/all", response_model=List[OrderResponse])
async def list_all_orders(
    status: Optional[str] = Query(None),
    user=Depends(verify_token),
):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    db = get_firestore_db()
    query = db.collection("orders")

    if status:
        query = query.where("status", "==", status)

    docs = query.order_by("createdAt", direction="DESCENDING").stream()
    orders = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        orders.append(OrderResponse(**data))

    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, user=Depends(verify_token)):
    db = get_firestore_db()
    doc = db.collection("orders").document(order_id).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")

    data = doc.to_dict()
    data["id"] = doc.id

    if user.get("role") != "admin" and data["userId"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Access denied")

    return OrderResponse(**data)


@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str, user=Depends(verify_token)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    valid_statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    db = get_firestore_db()
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")

    db.collection("orders").document(order_id).update({"status": status})
    return {"message": f"Order status updated to {status}"}


# Coupons
@router.post("/coupons", tags=["Coupons"])
async def create_coupon(coupon: CouponCreate, user=Depends(verify_token)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    db = get_firestore_db()
    coupon_data = coupon.model_dump()
    coupon_data["createdAt"] = datetime.utcnow().isoformat()
    coupon_data["usedCount"] = 0

    db.collection("coupons").document(coupon.code.upper()).set(coupon_data)
    return {"message": "Coupon created successfully"}


@router.post("/coupons/validate", tags=["Coupons"])
async def validate_coupon(code: str):
    db = get_firestore_db()
    doc = db.collection("coupons").document(code.upper()).get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Invalid coupon code")

    data = doc.to_dict()
    if not data.get("active", False):
        raise HTTPException(status_code=400, detail="Coupon is no longer active")

    usage_limit = data.get("usageLimit")
    used_count = data.get("usedCount", 0)
    if usage_limit and used_count >= usage_limit:
        raise HTTPException(status_code=400, detail="Coupon usage limit reached")

    return data
