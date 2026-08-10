import { auth } from './firebase'
import type {
  Clinic,
  ClinicCreate,
  Consultation,
  ConsultationCreate,
  Owner,
  OwnerCreate,
  Patient,
  PatientCreate,
  PatientHistory,
  PatientListItem,
  Reminder,
  Vaccine,
  VaccineCreate,
  Vet,
  VetCreate,
  VetUpdate,
} from '../types'

const baseUrl = (
  import.meta.env.VITE_API_URL ??
  'https://historia-veterinaria-api-448285277410.us-central1.run.app'
).replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth: requireAuth = true } = options
  const headers: Record<string, string> = {}

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (requireAuth) {
    const token = await auth.currentUser?.getIdToken()
    if (!token) throw new ApiError(401, 'Sesión no iniciada.')
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new ApiError(response.status, await readError(response))
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json()
    const detail = (data as { detail?: unknown }).detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string }
      if (first.msg) return first.msg
    }
  } catch {
    /* body was not json */
  }
  return `Error ${response.status}`
}

export function listClinics(): Promise<Clinic[]> {
  return request<Clinic[]>('/clinics')
}

export function getClinic(clinicId: string): Promise<Clinic> {
  return request<Clinic>(`/clinics/${clinicId}`)
}

export function createClinic(input: ClinicCreate): Promise<Clinic> {
  return request<Clinic>('/clinics', { method: 'POST', body: input })
}

export const api = {
  listVets: () => request<Vet[]>('/vets'),
  createVet: (input: VetCreate) => request<Vet>('/vets', { method: 'POST', body: input }),
  updateVet: (vetId: string, input: VetUpdate) =>
    request<Vet>(`/vets/${vetId}`, { method: 'PATCH', body: input }),
  deleteVet: (vetId: string) => request<void>(`/vets/${vetId}`, { method: 'DELETE' }),

  listClinicVets: (clinicId: string) => request<Vet[]>(`/clinics/${clinicId}/vets`),
  addClinicVet: (clinicId: string, vetId: string) =>
    request<Vet>(`/clinics/${clinicId}/vets`, { method: 'POST', body: { vet_id: vetId } }),
  removeClinicVet: (clinicId: string, vetId: string) =>
    request<void>(`/clinics/${clinicId}/vets/${vetId}`, { method: 'DELETE' }),

  listOwners: (clinicId: string) => request<Owner[]>(`/clinics/${clinicId}/owners`),
  createOwner: (clinicId: string, input: OwnerCreate) =>
    request<Owner>(`/clinics/${clinicId}/owners`, { method: 'POST', body: input }),

  listPatients: (clinicId: string) =>
    request<PatientListItem[]>(`/clinics/${clinicId}/patients`),
  createPatient: (clinicId: string, input: PatientCreate) =>
    request<Patient>(`/clinics/${clinicId}/patients`, { method: 'POST', body: input }),
  getPatient: (clinicId: string, patientId: string) =>
    request<PatientHistory>(`/clinics/${clinicId}/patients/${patientId}`),

  createConsultation: (clinicId: string, patientId: string, input: ConsultationCreate) =>
    request<Consultation>(`/clinics/${clinicId}/patients/${patientId}/consultations`, {
      method: 'POST',
      body: input,
    }),
  createVaccine: (clinicId: string, patientId: string, input: VaccineCreate) =>
    request<Vaccine>(`/clinics/${clinicId}/patients/${patientId}/vaccines`, {
      method: 'POST',
      body: input,
    }),

  listReminders: (clinicId: string) => request<Reminder[]>(`/clinics/${clinicId}/reminders`),
}
