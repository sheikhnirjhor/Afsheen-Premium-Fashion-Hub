from fastapi import APIRouter, HTTPException, Depends, Header
from firebase_admin_config import get_firestore_db, get_auth
from models.schemas import UserCreate, UserResponse
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    token = authorization.split("Bearer ")[1]
    try:
        decoded = get_auth().verify_id_token(token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    db = get_firestore_db()
    try:
        user_record = get_auth().create_user(
            email=user.email,
            password=user.password,
            display_name=user.displayName,
        )
        user_data = {
            "email": user.email,
            "displayName": user.displayName,
            "phone": user.phone or "",
            "role": user.role or "customer",
            "address": "",
            "createdAt": datetime.utcnow().isoformat(),
        }
        db.collection("users").document(user_record.uid).set(user_data)
        return UserResponse(uid=user_record.uid, **user_data)
    except get_auth().EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_current_user(user=Depends(verify_token)):
    db = get_firestore_db()
    uid = user["uid"]
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    data = doc.to_dict()
    return UserResponse(uid=uid, **data)


@router.put("/me", response_model=UserResponse)
async def update_profile(
    displayName: Optional[str] = None,
    phone: Optional[str] = None,
    address: Optional[str] = None,
    user=Depends(verify_token),
):
    db = get_firestore_db()
    uid = user["uid"]
    updates = {}
    if displayName is not None:
        updates["displayName"] = displayName
    if phone is not None:
        updates["phone"] = phone
    if address is not None:
        updates["address"] = address

    if updates:
        db.collection("users").document(uid).update(updates)

    doc = db.collection("users").document(uid).get()
    data = doc.to_dict()
    return UserResponse(uid=uid, **data)


@router.get("/users/{uid}", response_model=UserResponse)
async def get_user(uid: str, user=Depends(verify_token)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    db = get_firestore_db()
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    data = doc.to_dict()
    return UserResponse(uid=uid, **data)
