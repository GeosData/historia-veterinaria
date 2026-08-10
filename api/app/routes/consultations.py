from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth import require_clinic_access
from app.repositories import clinic_vets, consultations
from app.schemas.models import Consultation, ConsultationCreate
from app.services import patients as patients_service

router = APIRouter(tags=["consultations"])


@router.post(
    "/clinics/{clinic_id}/patients/{patient_id}/consultations",
    response_model=Consultation,
    status_code=status.HTTP_201_CREATED,
)
def create_consultation(
    patient_id: str,
    payload: ConsultationCreate,
    clinic_id: str = Depends(require_clinic_access),
) -> Consultation:
    patients_service.ensure_patient(clinic_id, patient_id)
    if payload.vet_id is not None and not clinic_vets.is_associated(clinic_id, payload.vet_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="vet_not_associated")
    row = consultations.insert(
        clinic_id=clinic_id,
        patient_id=patient_id,
        vet_id=payload.vet_id,
        consult_date=payload.date,
        reason=payload.reason,
        exam=payload.exam,
        dx_presumptive=payload.dx_presumptive,
        dx_definitive=payload.dx_definitive,
        treatment=payload.treatment,
        next_visit=payload.next_visit,
    )
    return Consultation.model_validate(row)
