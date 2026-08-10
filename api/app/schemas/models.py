from datetime import date, datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, Field

DateValue = date


class ClinicCreate(BaseModel):
    name: str
    vet_name: str


class Clinic(BaseModel):
    id: str
    name: str
    vet_name: str | None = None
    email: str
    created_at: datetime


class OwnerCreate(BaseModel):
    name: str
    document: str | None = None
    phone: str | None = None
    address: str | None = None


class Owner(BaseModel):
    id: str
    clinic_id: str
    name: str
    document: str | None = None
    phone: str | None = None
    address: str | None = None
    created_at: datetime


class PatientCreate(BaseModel):
    owner_id: str | None = None
    name: str
    species: str | None = None
    breed: str | None = None
    sex: str | None = None
    birthdate: date | None = None
    weight_kg: Decimal | None = None
    color: str | None = None
    neutered: bool | None = None


class Patient(BaseModel):
    id: str
    clinic_id: str
    owner_id: str | None = None
    name: str
    species: str | None = None
    breed: str | None = None
    sex: str | None = None
    birthdate: date | None = None
    weight_kg: Decimal | None = None
    color: str | None = None
    neutered: bool | None = None
    created_at: datetime


class PatientListItem(Patient):
    owner_name: str | None = None


class ConsultationCreate(BaseModel):
    date: DateValue | None = None
    reason: str | None = None
    exam: dict[str, Any] | None = None
    dx_presumptive: str | None = None
    dx_definitive: str | None = None
    treatment: str | None = None
    next_visit: DateValue | None = None


class Consultation(BaseModel):
    id: str
    clinic_id: str
    patient_id: str
    date: DateValue | None = None
    reason: str | None = None
    exam: dict[str, Any] | None = None
    dx_presumptive: str | None = None
    dx_definitive: str | None = None
    treatment: str | None = None
    next_visit: DateValue | None = None
    created_at: datetime


class VaccineCreate(BaseModel):
    name: str
    applied_at: date | None = None
    next_due: date | None = None


class Vaccine(BaseModel):
    id: str
    clinic_id: str
    patient_id: str
    name: str
    applied_at: date | None = None
    next_due: date | None = None
    created_at: datetime


class PatientHistory(BaseModel):
    patient: Patient
    consultations: list[Consultation] = Field(default_factory=list)
    vaccines: list[Vaccine] = Field(default_factory=list)


class Reminder(BaseModel):
    vaccine_id: str
    vaccine_name: str
    next_due: date
    patient_id: str
    patient_name: str
    owner_name: str | None = None
    owner_phone: str | None = None
