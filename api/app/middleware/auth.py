from fastapi import Header, HTTPException, status

from app.repositories import clinics


def require_clinic(x_api_key: str | None = Header(default=None, alias="X-API-Key")) -> str:
    if not x_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing X-API-Key")
    clinic_id = clinics.find_id_by_api_key(x_api_key)
    if clinic_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
    return clinic_id
