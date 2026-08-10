from fastapi import APIRouter, Depends, status

from app.middleware.auth import require_clinic_access, require_user
from app.schemas.models import Clinic, ClinicCreate
from app.services import clinics as clinics_service

router = APIRouter(tags=["clinics"])


@router.get("/clinics", response_model=list[Clinic])
def list_clinics(user: dict[str, str | None] = Depends(require_user)) -> list[Clinic]:
    return clinics_service.list_clinics(str(user["uid"]))


@router.post("/clinics", response_model=Clinic, status_code=status.HTTP_201_CREATED)
def create_clinic(
    payload: ClinicCreate,
    user: dict[str, str | None] = Depends(require_user),
) -> Clinic:
    return clinics_service.create_clinic(
        payload,
        uid=str(user["uid"]),
        email=str(user["email"]),
    )


@router.get("/clinics/{clinic_id}", response_model=Clinic)
def get_clinic(clinic_id: str = Depends(require_clinic_access)) -> Clinic:
    return clinics_service.get_clinic(clinic_id)
