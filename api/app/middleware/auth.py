from fastapi import Depends, Header, HTTPException, status

from app.repositories import clinics
from app.services import firebase


def require_user(authorization: str | None = Header(default=None)) -> dict[str, str | None]:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )
    token = authorization.split(" ", 1)[1].strip()
    try:
        decoded = firebase.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return {"uid": decoded["uid"], "email": decoded.get("email")}


def require_clinic_access(
    clinic_id: str,
    user: dict[str, str | None] = Depends(require_user),
) -> str:
    if not clinics.belongs_to_user(clinic_id, str(user["uid"])):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="clinic_not_found",
        )
    return clinic_id
