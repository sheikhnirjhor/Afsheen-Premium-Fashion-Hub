import firebase_admin
from firebase_admin import credentials, firestore, auth
from config import settings
import os

_firebase_app = None
_db = None


def initialize_firebase():
    global _firebase_app, _db

    if _firebase_app is not None:
        return _firebase_app

    cred_path = settings.FIREBASE_CREDENTIALS_PATH
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        _firebase_app = firebase_admin.initialize_app(cred)
    else:
        # Use default credentials (e.g., in production on GCP)
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
