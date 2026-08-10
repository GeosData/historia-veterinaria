from fastapi import APIRouter, Depends, status

from app.middleware.auth import require_clinic
from app.repositories import vaccines
from app.schemas.models import Vaccine, VaccineCreate
from app.services import patients as patients_service

router = APIRouter(tags=["vaccines"])


@router.post(
    "/patients/{patient_id}/vaccines",
    response_model=Vaccine,
    status_code=status.HTTP_201_CREATED,
)
def create_vaccine(
    patient_id: str,
    payload: VaccineCreate,
    clinic_id: str = Depends(require_clinic),
) -> Vaccine:
    patients_service.ensure_patient(clinic_id, patient_id)
    row = vaccines.insert(
        clinic_id=clinic_id,
        patient_id=patient_id,
        name=payload.name,
        applied_at=payload.applied_at,
        next_due=payload.next_due,
    )
    return Vaccine.model_validate(row)
