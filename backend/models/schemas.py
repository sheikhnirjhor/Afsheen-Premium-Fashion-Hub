from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    email: str
    password: str
    displayName: str
    phone: Optional[str] = ""
    role: Optional[str] = "customer"


class UserResponse(BaseModel):
    uid: str
    email: str
    displayName: str
    phone: str = ""
    role: str = "customer"
    address: str = ""
    createdAt: str = ""


class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    originalPrice: Optional[float] = None
    description: str
    sizes: List[str] = []
    colors: List[str] = []
    images: List[str] = []
    stock: int = 0
    tags: List[str] = []
    featured: Optional[bool] = False


class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    price: float
    originalPrice: Optional[float] = None
    description: str
    sizes: List[str] = []
    colors: List[str] = []
    images: List[str] = []
    stock: int = 0
    rating: float = 0.0
    reviews: int = 0
    tags: List[str] = []
    featured: bool = False
    createdAt: str = ""


class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    size: str = ""
    color: str = ""


class OrderCreate(BaseModel):
    items: List[OrderItem]
    shippingAddress: dict
    paymentMethod: str
    couponCode: Optional[str] = None
    subtotal: float
    discount: float = 0
    shipping: float = 0
    total: float
    note: Optional[str] = ""


class OrderResponse(BaseModel):
    id: str
    userId: str
    items: List[OrderItem]
    shippingAddress: dict
    paymentMethod: str
    status: str
    subtotal: float
    discount: float
    shipping: float
    total: float
    note: str = ""
    createdAt: str = ""


class CouponCreate(BaseModel):
    code: str
    discount: float
    type: str  # "percent" or "fixed"
    maxDiscount: Optional[float] = None
    minOrder: float = 0
    active: bool = True
    usageLimit: Optional[int] = None


class ChatMessage(BaseModel):
    sender: str  # "customer", "agent", "bot"
    text: str
    timestamp: Optional[str] = None


class ChatSessionCreate(BaseModel):
    customerId: str
    customerName: str


class ChatSessionResponse(BaseModel):
    id: str
    customerId: str
    customerName: str
    agentId: Optional[str] = None
    status: str  # "active", "closed"
    createdAt: str = ""
