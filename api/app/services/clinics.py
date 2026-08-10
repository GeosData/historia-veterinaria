from typing import Any

from app.repositories import clinics
from app.schemas.models import Clinic, ClinicCreate


def list_clinics(uid: str) -> list[Clinic]:
    return [_to_clinic(row) for row in clinics.list_for_user(uid)]


def create_clinic(payload: ClinicCreate, uid: str, email: str) -> Clinic:
    row = clinics.insert(name=payload.name, email=email, user_id=uid)
    return _to_clinic(row)


def get_clinic(clinic_id: str) -> Clinic:
    row = clinics.find(clinic_id)
    return _to_clinic(row)


def _to_clinic(row: dict[str, Any]) -> Clinic:
    return Clinic.model_validate(row)
