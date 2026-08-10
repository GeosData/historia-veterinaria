import { getApiKey } from '../store/auth'
import type {
  ClinicCreate,
  ClinicRegistered,
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
  const { method = 'GET', body, auth = true } = options
  const headers: Record<string, string> = {}

  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (auth) {
    const apiKey = getApiKey()
    if (!apiKey) throw new ApiError(401, 'Falta la clave de acceso.')
    headers['X-API-Key'] = apiKey
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

export function registerClinic(input: ClinicCreate): Promise<ClinicRegistered> {
  return request<ClinicRegistered>('/clinics', { method: 'POST', body: input, auth: false })
}

export const api = {
  listOwners: () => request<Owner[]>('/owners'),
  createOwner: (input: OwnerCreate) =>
    request<Owner>('/owners', { method: 'POST', body: input }),

  listPatients: () => request<PatientListItem[]>('/patients'),
  createPatient: (input: PatientCreate) =>
    request<Patient>('/patients', { method: 'POST', body: input }),
  getPatient: (id: string) => request<PatientHistory>(`/patients/${id}`),

  createConsultation: (patientId: string, input: ConsultationCreate) =>
    request<Consultation>(`/patients/${patientId}/consultations`, {
      method: 'POST',
      body: input,
    }),
  createVaccine: (patientId: string, input: VaccineCreate) =>
    request<Vaccine>(`/patients/${patientId}/vaccines`, { method: 'POST', body: input }),

  listReminders: () => request<Reminder[]>('/reminders'),
}
