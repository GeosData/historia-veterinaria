from fastapi import HTTPException, status

from app.repositories import consultations, patients, vaccines
from app.schemas.models import Consultation, PatientHistory, Patient, Vaccine


def build_history(clinic_id: str, patient_id: str) -> PatientHistory:
    patient_row = patients.find(clinic_id, patient_id)
    if patient_row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")

    consultation_rows = consultations.list_for_patient(clinic_id, patient_id)
    vaccine_rows = vaccines.list_for_patient(clinic_id, patient_id)

    return PatientHistory(
        patient=Patient.model_validate(patient_row),
        consultations=[Consultation.model_validate(row) for row in consultation_rows],
        vaccines=[Vaccine.model_validate(row) for row in vaccine_rows],
    )


def ensure_patient(clinic_id: str, patient_id: str) -> None:
    if not patients.exists(clinic_id, patient_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
