import google.auth.transport.requests
from google.oauth2 import id_token as google_id_token

from app.config import get_settings

_request = google.auth.transport.requests.Request()


def verify_id_token(token: str) -> dict:
    settings = get_settings()
    claims = google_id_token.verify_firebase_token(
        token, _request, audience=settings.firebase_project_id
    )
    if not claims:
        raise ValueError("invalid firebase token")
    uid = claims.get("user_id") or claims.get("sub")
    if not uid:
        raise ValueError("token without uid")
    return {"uid": uid, "email": claims.get("email"), "name": claims.get("name")}
