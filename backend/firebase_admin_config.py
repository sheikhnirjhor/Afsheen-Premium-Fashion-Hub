import firebase_admin
from firebase_admin import credentials, firestore, auth
from config import settings
import os
import json

_firebase_app = None
_db = None


def initialize_firebase():
    global _firebase_app, _db

    if _firebase_app is not None:
        return _firebase_app

    # Method 1: Firebase credentials JSON string from environment variable (for Render)
    firebase_cred_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
    if firebase_cred_json:
        try:
            cred_dict = json.loads(firebase_cred_json)
            cred = credentials.Certificate(cred_dict)
            _firebase_app = firebase_admin.initialize_app(cred)
            _db = firestore.client()
            return _firebase_app
        except json.JSONDecodeError:
            pass

    # Method 2: Service account key file path (for local development)
    cred_path = settings.FIREBASE_CREDENTIALS_PATH
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        _firebase_app = firebase_admin.initialize_app(cred)
    else:
        # Method 3: Use default credentials (e.g., in production on GCP)
        try:
            _firebase_app = firebase_admin.initialize_app()
        except ValueError:
            # Already initialized
            _firebase_app = firebase_admin.get_app()

    _db = firestore.client()
    return _firebase_app


def get_firestore_db():
    global _db
    if _db is None:
        initialize_firebase()
    return _db


def get_auth():
    return auth
