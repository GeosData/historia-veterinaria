import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card, Section } from '../components/Card'
import { Badge, EmptyState, ErrorNote, Spinner } from '../components/Feedback'
import { Field, Select, TextArea, TextInput } from '../components/Field'
import { Modal } from '../components/Modal'
import { api, ApiError } from '../lib/api'
import { daysUntil, dueLabel, examToText, formatDate, today, vetLabel } from '../lib/format'
import { useAuthStore } from '../store/auth'
import type {
  Consultation,
  ConsultationCreate,
  PatientHistory,
  VaccineCreate,
  Vet,
} from '../types'

export function PatientDetailPage() {
  const { id = '' } = useParams()
  const clinicId = useAuthStore((state) => state.activeClinicId)
  const [history, setHistory] = useState<PatientHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [consultOpen, setConsultOpen] = useState(false)
  const [vaccineOpen, setVaccineOpen] = useState(false)

  const load = async () => {
    if (!clinicId) return
    setLoading(true)
    setError(null)
    try {
      setHistory(await api.getPatient(clinicId, id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cargar la ficha.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [id, clinicId])

  const consultations = useMemo(() => {
    if (!history) return []
    return [...history.consultations].sort(sortByDateDesc)
  }, [history])

  const vaccines = useMemo(() => {
    if (!history) return []
    return [...history.vaccines].sort(
      (a, b) => timeOf(b.applied_at ?? b.created_at) - timeOf(a.applied_at ?? a.created_at),
    )
  }, [history])

  if (loading) return <Spinner label="Cargando ficha…" />
  if (error) return <ErrorNote message={error} />
  if (!history) return null

  const { patient } = history

  return (
    <div className="space-y-8">
      <div>
        <Link to="/pacientes" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          ← Pacientes
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-950">{patient.name}</h1>
            <p className="mt-1 text-ink-500">
              {[patient.species, patient.breed].filter(Boolean).join(' · ') || 'Sin datos de especie'}
            </p>
          </div>
          {patient.neutered && <Badge tone="brand">Esterilizado</Badge>}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
          <Meta label="Sexo" value={patient.sex} />
          <Meta label="Nacimiento" value={formatDate(patient.birthdate)} />
          <Meta label="Peso" value={patient.weight_kg != null ? `${patient.weight_kg} kg` : undefined} />
          <Meta label="Color" value={patient.color} />
        </dl>
      </Card>

      <Section
        title="Consultas"
        action={<Button size="sm" onClick={() => setConsultOpen(true)}>+ Nueva consulta</Button>}
      >
        {consultations.length === 0 ? (
          <EmptyState title="Sin consultas registradas" />
        ) : (
          <ol className="space-y-3">
            {consultations.map((consultation) => (
              <ConsultationItem key={consultation.id} consultation={consultation} />
            ))}
          </ol>
        )}
      </Section>

      <Section
        title="Vacunas"
        action={<Button size="sm" variant="accent" onClick={() => setVaccineOpen(true)}>+ Registrar vacuna</Button>}
      >
        {vaccines.length === 0 ? (
          <EmptyState title="Sin vacunas registradas" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {vaccines.map((vaccine) => {
              const remaining = daysUntil(vaccine.next_due)
              return (
                <Card key={vaccine.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-ink-900">{vaccine.name}</p>
                    {vaccine.next_due && (
                      <Badge tone={remaining !== null && remaining <= 7 ? 'danger' : 'neutral'}>
                        {dueLabel(remaining)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink-500">
                    Aplicada: {formatDate(vaccine.applied_at)}
                    {vaccine.next_due && <> · Próxima: {formatDate(vaccine.next_due)}</>}
                  </p>
                </Card>
              )
            })}
          </div>
        )}
      </Section>

      <ConsultationModal
        open={consultOpen}
        clinicId={clinicId}
        patientId={id}
        onClose={() => setConsultOpen(false)}
        onSaved={() => {
          setConsultOpen(false)
          void load()
        }}
      />
      <VaccineModal
        open={vaccineOpen}
        clinicId={clinicId}
        patientId={id}
        onClose={() => setVaccineOpen(false)}
        onSaved={() => {
          setVaccineOpen(false)
          void load()
        }}
      />
    </div>
  )
}

function ConsultationItem({ consultation }: { consultation: Consultation }) {
  const exam = examToText(consultation.exam)
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display font-semibold text-ink-900">
          {formatDate(consultation.date ?? consultation.created_at)}
        </p>
        {consultation.next_visit && (
          <Badge tone="accent">Próxima visita: {formatDate(consultation.next_visit)}</Badge>
        )}
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <Row label="Motivo" value={consultation.reason} />
        <Row label="Examen" value={exam} />
        <Row label="Dx presuntivo" value={consultation.dx_presumptive} />
        <Row label="Dx definitivo" value={consultation.dx_definitive} />
        <Row label="Tratamiento" value={consultation.treatment} />
      </dl>
    </Card>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3">
      <dt className="text-xs uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="whitespace-pre-line text-ink-700">{value}</dd>
    </div>
  )
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="text-ink-800">{value || '—'}</dd>
    </div>
  )
}

interface ConsultationModalProps {
  open: boolean
  clinicId: string | null
  patientId: string
  onClose: () => void
  onSaved: () => void
}

const emptyConsultation = {
  date: today(),
  reason: '',
  exam: '',
  dx_presumptive: '',
  dx_definitive: '',
  treatment: '',
  next_visit: '',
  vet_id: '',
}

function ConsultationModal({ open, clinicId, patientId, onClose, onSaved }: ConsultationModalProps) {
  const [form, setForm] = useState(emptyConsultation)
  const [vets, setVets] = useState<Vet[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm({ ...emptyConsultation, date: today() })
    if (!clinicId) {
      setVets([])
      return
    }
    void api
      .listClinicVets(clinicId)
      .then(setVets)
      .catch(() => setVets([]))
  }, [open, clinicId])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!clinicId) return
    setError(null)
    setSubmitting(true)
    try {
      const payload: ConsultationCreate = {
        date: form.date || null,
        reason: form.reason || null,
        exam: form.exam.trim() ? { notes: form.exam.trim() } : null,
        dx_presumptive: form.dx_presumptive || null,
        dx_definitive: form.dx_definitive || null,
        treatment: form.treatment || null,
        next_visit: form.next_visit || null,
        vet_id: form.vet_id || null,
      }
      await api.createConsultation(clinicId, patientId, payload)
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar la consulta.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title="Nueva consulta" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorNote message={error} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Fecha" required={false}>
            <TextInput
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>
          <Field label="Próxima visita" required={false}>
            <TextInput
              type="date"
              value={form.next_visit}
              onChange={(e) => setForm({ ...form, next_visit: e.target.value })}
            />
          </Field>
        </div>
        <Field
          label="Médico que atendió"
          required={false}
          hint={vets.length === 0 ? 'No hay médicos asociados a esta clínica.' : undefined}
        >
          <Select
            value={form.vet_id}
            onChange={(e) => setForm({ ...form, vet_id: e.target.value })}
            disabled={vets.length === 0}
          >
            <option value="">Sin especificar</option>
            {vets.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vetLabel(vet)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Motivo de consulta" required={false}>
          <TextInput
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </Field>
        <Field label="Examen físico (hallazgos)" required={false}>
          <TextArea
            rows={3}
            value={form.exam}
            onChange={(e) => setForm({ ...form, exam: e.target.value })}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Diagnóstico presuntivo" required={false}>
            <TextInput
              value={form.dx_presumptive}
              onChange={(e) => setForm({ ...form, dx_presumptive: e.target.value })}
            />
          </Field>
          <Field label="Diagnóstico definitivo" required={false}>
            <TextInput
              value={form.dx_definitive}
              onChange={(e) => setForm({ ...form, dx_definitive: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Tratamiento" required={false}>
          <TextArea
            rows={3}
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
          />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            Guardar consulta
          </Button>
        </div>
      </form>
    </Modal>
  )
}

interface VaccineModalProps {
  open: boolean
  clinicId: string | null
  patientId: string
  onClose: () => void
  onSaved: () => void
}

function VaccineModal({ open, clinicId, patientId, onClose, onSaved }: VaccineModalProps) {
  const [form, setForm] = useState({ name: '', applied_at: today(), next_due: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setError(null)
      setForm({ name: '', applied_at: today(), next_due: '' })
    }
  }, [open])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!clinicId) return
    setError(null)
    setSubmitting(true)
    try {
      const payload: VaccineCreate = {
        name: form.name.trim(),
        applied_at: form.applied_at || null,
        next_due: form.next_due || null,
      }
      await api.createVaccine(clinicId, patientId, payload)
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar la vacuna.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title="Registrar vacuna" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorNote message={error} />}
        <Field label="Vacuna" hint="Ej. Quíntuple, Antirrábica, Sextuple…">
          <TextInput
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Fecha de aplicación">
            <TextInput
              type="date"
              value={form.applied_at}
              onChange={(e) => setForm({ ...form, applied_at: e.target.value })}
            />
          </Field>
          <Field label="Próxima dosis" hint="Genera el recordatorio">
            <TextInput
              type="date"
              value={form.next_due}
              onChange={(e) => setForm({ ...form, next_due: e.target.value })}
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="accent" loading={submitting}>
            Guardar vacuna
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function timeOf(value?: string | null): number {
  if (!value) return 0
  const iso = value.length <= 10 ? `${value}T00:00:00` : value
  const time = new Date(iso).getTime()
  return Number.isNaN(time) ? 0 : time
}

function sortByDateDesc(a: Consultation, b: Consultation): number {
  return timeOf(b.date ?? b.created_at) - timeOf(a.date ?? a.created_at)
}
