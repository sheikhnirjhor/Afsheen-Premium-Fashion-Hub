from fastapi import APIRouter, HTTPException, Depends, Query
from firebase_admin_config import get_firestore_db
from models.schemas import ProductCreate, ProductResponse
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    size: Optional[str] = Query(None),
    in_stock: Optional[bool] = Query(None),
    featured: Optional[bool] = Query(None),
    sort_by: Optional[str] = Query("featured"),
    limit: int = Query(50, le=100),
):
    db = get_firestore_db()
    query = db.collection("products")

    if category:
        query = query.where("category", "==", category)
    if featured is not None:
        query = query.where("featured", "==", featured)
    if in_stock:
        query = query.where("stock", ">", 0)

    docs = query.stream()
    products = []

    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id

        if min_price is not None and data.get("price", 0) < min_price:
            continue
        if max_price is not None and data.get("price", 0) > max_price:
            continue
        if size and size not in data.get("sizes", []):
            continue
        if search:
            q = search.lower()
            if q not in data.get("name", "").lower() and q not in data.get("description", "").lower():
                tags = [t.lower() for t in data.get("tags", [])]
                if not any(q in t for t in tags):
                    continue

        products.append(ProductResponse(**data))

    if sort_by == "price-low":
        products.sort(key=lambda x: x.price)
    elif sort_by == "price-high":
        products.sort(key=lambda x: x.price, reverse=True)
    elif sort_by == "rating":
        products.sort(key=lambda x: x.rating, reverse=True)
    else:
        products.sort(key=lambda x: x.featured, reverse=True)

    return products[:limit]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    db = get_firestore_db()
    doc = db.collection("products").document(product_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    data = doc.to_dict()
    data["id"] = doc.id
    return ProductResponse(**data)


@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    db = get_firestore_db()
    product_data = product.model_dump()
    product_data["rating"] = 0.0
    product_data["reviews"] = 0
    product_data["createdAt"] = datetime.utcnow().isoformat()

    doc_ref = db.collection("products").add(product_data)
    created_id = doc_ref[1].id

    return ProductResponse(id=created_id, **product_data)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductCreate):
    db = get_firestore_db()
    doc = db.collection("products").document(product_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")

    updates = product.model_dump()
    db.collection("products").document(product_id).update(updates)

    updated_doc = db.collection("products").document(product_id).get()
    data = updated_doc.to_dict()
    data["id"] = updated_doc.id
    return ProductResponse(**data)


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    db = get_firestore_db()
    doc = db.collection("products").document(product_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    db.collection("products").document(product_id).delete()
    return {"message": "Product deleted successfully"}


@router.put("/{product_id}/stock")
async def update_stock(product_id: str, stock: int):
    db = get_firestore_db()
    doc = db.collection("products").document(product_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    db.collection("products").document(product_id).update({"stock": stock})
    return {"message": f"Stock updated to {stock}"}
