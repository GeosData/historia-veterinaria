from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth import require_clinic
from app.repositories import owners, patients
from app.schemas.models import Patient, PatientCreate, PatientHistory, PatientListItem
from app.services import patients as patients_service

router = APIRouter(tags=["patients"])


@router.post("/patients", response_model=Patient, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate, clinic_id: str = Depends(require_clinic)) -> Patient:
    if payload.owner_id is not None and not owners.exists(clinic_id, payload.owner_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")
    row = patients.insert(
        clinic_id=clinic_id,
        owner_id=payload.owner_id,
        name=payload.name,
        species=payload.species,
        breed=payload.breed,
        sex=payload.sex,
        birthdate=payload.birthdate,
        weight_kg=payload.weight_kg,
        color=payload.color,
        neutered=payload.neutered,
    )
    return Patient.model_validate(row)


@router.get("/patients", response_model=list[PatientListItem])
def list_patients(clinic_id: str = Depends(require_clinic)) -> list[PatientListItem]:
    rows = patients.list_for_clinic(clinic_id)
    return [PatientListItem.model_validate(row) for row in rows]


@router.get("/patients/{patient_id}", response_model=PatientHistory)
def get_patient(patient_id: str, clinic_id: str = Depends(require_clinic)) -> PatientHistory:
    return patients_service.build_history(clinic_id, patient_id)
