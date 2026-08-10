from fastapi import HTTPException, status

from app.repositories import clinics
from app.schemas.models import Clinic, ClinicCreate


def register_clinic(payload: ClinicCreate, uid: str, email: str) -> Clinic:
    if clinics.find_id_by_user_id(uid) is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="clinic_exists")
    row = clinics.insert(
        name=payload.name,
        vet_name=payload.vet_name,
        email=email,
        user_id=uid,
    )
    return _to_clinic(row)


def get_clinic(uid: str) -> Clinic | None:
    row = clinics.find_by_user_id(uid)
    if row is None:
        return None
    return _to_clinic(row)


def _to_clinic(row: dict) -> Clinic:
    return Clinic(
        id=str(row["id"]),
        name=row["name"],
        vet_name=row["vet_name"],
        email=row["email"],
        created_at=row["created_at"],
    )
