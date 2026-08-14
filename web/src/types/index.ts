export interface ClinicCreate {
  name: string
}

export interface Clinic {
  id: string
  name: string
  created_at: string
}

export interface VetCreate {
  name: string
  title?: string | null
  license?: string | null
  email?: string | null
}

export interface VetUpdate {
  name?: string
  title?: string | null
  license?: string | null
  email?: string | null
}

export interface Vet {
  id: string
  name: string
  title?: string | null
  license?: string | null
  email?: string | null
  created_at: string
}

export interface SpeciesCreate {
  name: string
}

export interface Species {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface OwnerCreate {
  name: string
  document?: string | null
  phone?: string | null
  address?: string | null
}

export interface Owner {
  id: string
  clinic_id: string
  name: string
  document?: string | null
  phone?: string | null
  address?: string | null
  created_at: string
}

export interface PatientCreate {
  owner_id?: string | null
  name: string
  species?: string | null
  breed?: string | null
  sex?: string | null
  birthdate?: string | null
  weight_kg?: number | null
  color?: string | null
  neutered?: boolean | null
}

export interface Patient {
  id: string
  clinic_id: string
  owner_id?: string | null
  name: string
  species?: string | null
  breed?: string | null
  sex?: string | null
  birthdate?: string | null
  weight_kg?: number | string | null
  color?: string | null
  neutered?: boolean | null
  created_at: string
}

export interface PatientListItem extends Patient {
  owner_name?: string | null
}

export type ExamFindings = Record<string, unknown>

export interface ConsultationCreate {
  date?: string | null
  reason?: string | null
  exam?: ExamFindings | null
  dx_presumptive?: string | null
  dx_definitive?: string | null
  treatment?: string | null
  next_visit?: string | null
  vet_id?: string | null
}

export interface Consultation {
  id: string
  clinic_id: string
  patient_id: string
  date?: string | null
  reason?: string | null
  exam?: ExamFindings | null
  dx_presumptive?: string | null
  dx_definitive?: string | null
  treatment?: string | null
  next_visit?: string | null
  vet_id?: string | null
  created_at: string
}

export interface VaccineCreate {
  name: string
  applied_at?: string | null
  next_due?: string | null
}

export interface Vaccine {
  id: string
  clinic_id: string
  patient_id: string
  name: string
  applied_at?: string | null
  next_due?: string | null
  created_at: string
}

export interface PatientHistory {
  patient: Patient
  consultations: Consultation[]
  vaccines: Vaccine[]
}

export interface Reminder {
  vaccine_id: string
  vaccine_name: string
  next_due: string
  patient_id: string
  patient_name: string
  owner_name?: string | null
  owner_phone?: string | null
}
