from fastapi import APIRouter, Depends, status

from app.middleware.auth import require_clinic
from app.repositories import consultations
from app.schemas.models import Consultation, ConsultationCreate
from app.services import patients as patients_service

router = APIRouter(tags=["consultations"])


@router.post(
    "/patients/{patient_id}/consultations",
    response_model=Consultation,
    status_code=status.HTTP_201_CREATED,
)
def create_consultation(
    patient_id: str,
    payload: ConsultationCreate,
    clinic_id: str = Depends(require_clinic),
) -> Consultation:
    patients_service.ensure_patient(clinic_id, patient_id)
    row = consultations.insert(
        clinic_id=clinic_id,
        patient_id=patient_id,
        consult_date=payload.date,
        reason=payload.reason,
        exam=payload.exam,
        dx_presumptive=payload.dx_presumptive,
        dx_definitive=payload.dx_definitive,
        treatment=payload.treatment,
        next_visit=payload.next_visit,
    )
    return Consultation.model_validate(row)
