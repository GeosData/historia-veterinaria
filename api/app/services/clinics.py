import secrets

from app.repositories import clinics
from app.schemas.models import ClinicCreate, ClinicRegistered

API_KEY_BYTES = 24


def register_clinic(payload: ClinicCreate) -> ClinicRegistered:
    api_key = secrets.token_hex(API_KEY_BYTES)
    row = clinics.insert(
        name=payload.name,
        vet_name=payload.vet_name,
        email=str(payload.email),
        api_key=api_key,
    )
    return ClinicRegistered(id=str(row["id"]), api_key=row["api_key"])
