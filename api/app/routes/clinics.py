from fastapi import APIRouter, status

from app.schemas.models import ClinicCreate, ClinicRegistered
from app.services import clinics as clinics_service

router = APIRouter(tags=["clinics"])


@router.post("/clinics", response_model=ClinicRegistered, status_code=status.HTTP_201_CREATED)
def register_clinic(payload: ClinicCreate) -> ClinicRegistered:
    return clinics_service.register_clinic(payload)
