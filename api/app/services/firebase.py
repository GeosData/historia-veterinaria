import threading

import firebase_admin
from firebase_admin import auth

from app.config import get_settings

_lock = threading.Lock()


def _ensure_app() -> None:
    if firebase_admin._apps:
        return
    with _lock:
        if firebase_admin._apps:
            return
        settings = get_settings()
        firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id})


def verify_id_token(token: str) -> dict:
    _ensure_app()
    return auth.verify_id_token(token)
