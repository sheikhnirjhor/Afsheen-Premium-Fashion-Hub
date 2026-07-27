import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Afsheen Premium Fashion Hub"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "your-project-id")

    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://afsheen-fashion.web.app",
    ]

    # Payment Gateway (SSLCommerz)
    SSLCOMMERZ_STORE_ID: str = os.getenv("SSLCOMMERZ_STORE_ID", "")
    SSLCOMMERZ_STORE_PASS: str = os.getenv("SSLCOMMERZ_STORE_PASS", "")
    SSLCOMMERZ_IS_LIVE: bool = os.getenv("SSLCOMMERZ_IS_LIVE", "False").lower() == "true"

settings = Settings()
