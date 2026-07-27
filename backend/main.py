from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from firebase_admin_config import initialize_firebase
from routes import auth, products, orders, chat

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API for Afsheen Premium Fashion Hub - Premium Ethnic Fashion & Luxury Accessories",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
@app.on_event("startup")
async def startup_event():
    initialize_firebase()

# Routes
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(products.router, prefix=settings.API_PREFIX)
app.include_router(orders.router, prefix=settings.API_PREFIX)
app.include_router(chat.router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "endpoints": {
            "auth": f"{settings.API_PREFIX}/auth",
            "products": f"{settings.API_PREFIX}/products",
            "orders": f"{settings.API_PREFIX}/orders",
            "chat": f"{settings.API_PREFIX}/chat",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
