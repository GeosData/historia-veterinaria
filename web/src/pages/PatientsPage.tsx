import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Badge, EmptyState, ErrorNote, Spinner } from '../components/Feedback'
import { Field, Select, TextInput } from '../components/Field'
import { Modal } from '../components/Modal'
import { Tooltip } from '../components/Tooltip'
import { api, ApiError } from '../lib/api'
import { formatDate } from '../lib/format'
import { useAuthStore } from '../store/auth'
import type { Owner, PatientCreate, PatientListItem, Species } from '../types'

export function PatientsPage() {
  const clinicId = useAuthStore((state) => state.activeClinicId)
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const load = async () => {
    if (!clinicId) return
    setLoading(true)
    setError(null)
    try {
      setPatients(await api.listPatients(clinicId))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los pacientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [clinicId])

  const filtered = patients.filter((patient) => {
    const haystack = `${patient.name} ${patient.owner_name ?? ''} ${patient.species ?? ''}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Pacientes</h1>
          <p className="text-sm text-ink-500">
            {patients.length} {patients.length === 1 ? 'paciente registrado' : 'pacientes registrados'}
          </p>
        </div>
        {patients.length > 0 && (
          <Button onClick={() => setModalOpen(true)}>+ Nuevo paciente</Button>
        )}
      </header>

      {patients.length > 0 && (
        <TextInput
          placeholder="Buscar por nombre, dueño o especie…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
      )}

      {error && <ErrorNote message={error} />}

      {loading ? (
        <Spinner label="Cargando pacientes…" />
      ) : patients.length === 0 ? (
        <EmptyState
          title="Todavía no hay pacientes"
          description="Registra tu primer paciente para empezar a llevar su historia clínica."
          action={<Button onClick={() => setModalOpen(true)}>+ Nuevo paciente</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((patient) => (
            <Link key={patient.id} to={`/pacientes/${patient.id}`}>
              <Card className="h-full p-5 transition hover:border-brand-300 hover:shadow-pop">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-950">{patient.name}</p>
                    <p className="text-sm text-ink-500">{patient.owner_name ?? 'Sin dueño asignado'}</p>
                  </div>
                  {patient.species && <Badge tone="brand">{patient.species}</Badge>}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <Meta label="Raza" value={patient.breed} />
                  <Meta label="Sexo" value={patient.sex} />
                  <Meta label="Nacimiento" value={formatDate(patient.birthdate)} />
                  <Meta
                    label="Peso"
                    value={patient.weight_kg != null ? `${patient.weight_kg} kg` : undefined}
                  />
                </dl>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <NewPatientModal
        open={modalOpen}
        clinicId={clinicId}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setModalOpen(false)
          void load()
        }}
      />
    </div>
  )
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="text-ink-700">{value || '—'}</dd>
    </div>
  )
}

interface NewPatientModalProps {
  open: boolean
  clinicId: string | null
  onClose: () => void
  onCreated: () => void
}

const emptyPatient: PatientCreate = {
  name: '',
  species: '',
  breed: '',
  sex: '',
  birthdate: '',
  color: '',
}

const emptyNewOwner = { name: '', phone: '', address: '' }

function NewPatientModal({ open, clinicId, onClose, onCreated }: NewPatientModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [owners, setOwners] = useState<Owner[]>([])
  const [documentId, setDocumentId] = useState('')
  const [searched, setSearched] = useState(false)
  const [foundOwner, setFoundOwner] = useState<Owner | null>(null)
  const [newOwner, setNewOwner] = useState(emptyNewOwner)
  const [patient, setPatient] = useState<PatientCreate>(emptyPatient)
  const [weight, setWeight] = useState('')
  const [neutered, setNeutered] = useState(false)
  const [species, setSpecies] = useState<Species[]>([])
  const [addingSpecies, setAddingSpecies] = useState(false)
  const [newSpecies, setNewSpecies] = useState('')
  const [speciesSubmitting, setSpeciesSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open || !clinicId) return
    setStep(1)
    setError(null)
    setDocumentId('')
    setSearched(false)
    setFoundOwner(null)
    setPatient(emptyPatient)
    setWeight('')
    setNeutered(false)
    setNewOwner(emptyNewOwner)
    setAddingSpecies(false)
    setNewSpecies('')
    void api
      .listOwners(clinicId)
      .then(setOwners)
      .catch(() => setOwners([]))
    void api
      .listSpecies()
      .then(setSpecies)
      .catch(() => setSpecies([]))
  }, [open, clinicId])

  const addSpecies = async () => {
    const value = newSpecies.trim()
    if (!value) return
    setError(null)
    setSpeciesSubmitting(true)
    try {
      const created = await api.createSpecies({ name: value })
      setSpecies(await api.listSpecies())
      setPatient((prev) => ({ ...prev, species: created.name }))
      setNewSpecies('')
      setAddingSpecies(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo agregar la especie.')
    } finally {
      setSpeciesSubmitting(false)
    }
  }

  const searchOwner = () => {
    setError(null)
    const doc = documentId.trim()
    const match = doc
      ? owners.find((owner) => (owner.document ?? '').trim() === doc) ?? null
      : null
    setFoundOwner(match)
    setSearched(true)
  }

  const goToPatientStep = () => {
    setError(null)
    if (!searched) {
      setError('Busca el documento del dueño para continuar.')
      return
    }
    if (!foundOwner && !newOwner.name.trim()) {
      setError('Ingresa el nombre del dueño para continuar.')
      return
    }
    setStep(2)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!clinicId) return
    setError(null)
    if (!patient.name.trim()) {
      setError('Ingresa el nombre del paciente.')
      return
    }
    if (!patient.species) {
      setError('Selecciona la especie del paciente.')
      return
    }
    setSubmitting(true)
    try {
      let resolvedOwnerId: string | null = null
      if (foundOwner) {
        resolvedOwnerId = foundOwner.id
      } else if (newOwner.name.trim()) {
        const created = await api.createOwner(clinicId, {
          name: newOwner.name.trim(),
          document: documentId.trim() || null,
          phone: newOwner.phone || null,
          address: newOwner.address || null,
        })
        resolvedOwnerId = created.id
      }

      await api.createPatient(clinicId, {
        owner_id: resolvedOwnerId,
        name: patient.name.trim(),
        species: patient.species || null,
        breed: patient.breed || null,
        sex: patient.sex || null,
        birthdate: patient.birthdate || null,
        color: patient.color || null,
        weight_kg: weight ? Number(weight) : null,
        neutered,
      })
      onCreated()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo registrar el paciente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title="Nuevo paciente" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-5">
        <WizardSteps step={step} />

        {error && <ErrorNote message={error} />}

        {step === 1 ? (
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-ink-800">1. Dueño</legend>
            <Field
              label="Documento del dueño"
              tooltip="Busca por cédula. Si ya está registrado cargamos sus datos; si no, lo creamos."
            >
              <div className="flex gap-2">
                <TextInput
                  value={documentId}
                  onChange={(e) => {
                    setDocumentId(e.target.value)
                    setSearched(false)
                    setFoundOwner(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      searchOwner()
                    }
                  }}
                  placeholder="Número de documento…"
                />
                <Button type="button" onClick={searchOwner} disabled={!documentId.trim()}>
                  Buscar
                </Button>
              </div>
            </Field>

            {!searched && (
              <button
                type="button"
                onClick={() => {
                  setFoundOwner(null)
                  setSearched(true)
                }}
                className="text-xs font-medium text-brand-600 transition hover:text-brand-700"
              >
                El dueño no tiene documento
              </button>
            )}

            {searched && foundOwner && (
              <div className="rounded-lg border border-brand-300 bg-brand-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                  Dueño encontrado
                </p>
                <p className="mt-1 font-medium text-ink-900">{foundOwner.name}</p>
                <p className="text-sm text-ink-500">
                  {[foundOwner.document, foundOwner.phone].filter(Boolean).join(' · ') ||
                    'Sin más datos'}
                </p>
              </div>
            )}

            {searched && !foundOwner && (
              <div className="space-y-3">
                <p className="text-sm text-ink-500">
                  {documentId.trim()
                    ? 'No hay un dueño con ese documento. Registra uno nuevo.'
                    : 'Registra los datos del dueño.'}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nombre del dueño" required>
                    <TextInput
                      value={newOwner.name}
                      onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                      placeholder="María López"
                    />
                  </Field>
                  <Field label="Teléfono" required={false}>
                    <TextInput
                      value={newOwner.phone}
                      onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                    />
                  </Field>
                  <Field label="Dirección" required={false}>
                    <TextInput
                      value={newOwner.address}
                      onChange={(e) => setNewOwner({ ...newOwner, address: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="button" onClick={goToPatientStep} disabled={!searched}>
                Siguiente
              </Button>
            </div>
          </fieldset>
        ) : (
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-ink-800">2. Paciente</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nombre" required>
                <TextInput
                  value={patient.name}
                  onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  placeholder="Firulais"
                />
              </Field>
              <Field label="Especie" required tooltip="Elegí de tu lista o agregá una nueva.">
                <Select
                  value={patient.species ?? ''}
                  onChange={(e) => setPatient({ ...patient, species: e.target.value })}
                >
                  <option value="">Seleccioná…</option>
                  {species.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                {addingSpecies ? (
                  <div className="mt-2 flex gap-2">
                    <TextInput
                      autoFocus
                      value={newSpecies}
                      onChange={(e) => setNewSpecies(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          void addSpecies()
                        }
                      }}
                      placeholder="Nueva especie…"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void addSpecies()}
                      loading={speciesSubmitting}
                      disabled={!newSpecies.trim()}
                    >
                      Agregar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAddingSpecies(false)
                        setNewSpecies('')
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingSpecies(true)}
                    className="mt-1.5 text-xs font-medium text-brand-600 transition hover:text-brand-700"
                  >
                    + Agregar especie
                  </button>
                )}
              </Field>
              <Field label="Raza" required={false}>
                <TextInput
                  value={patient.breed ?? ''}
                  onChange={(e) => setPatient({ ...patient, breed: e.target.value })}
                />
              </Field>
              <Field label="Sexo" required={false}>
                <Select
                  value={patient.sex ?? ''}
                  onChange={(e) => setPatient({ ...patient, sex: e.target.value })}
                >
                  <option value="">Sin especificar</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </Select>
              </Field>
              <Field label="Fecha de nacimiento" required={false}>
                <TextInput
                  type="date"
                  value={patient.birthdate ?? ''}
                  onChange={(e) => setPatient({ ...patient, birthdate: e.target.value })}
                />
              </Field>
              <Field label="Peso (kg)" required={false}>
                <TextInput
                  type="number"
                  step="0.1"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </Field>
              <Field label="Color" required={false}>
                <TextInput
                  value={patient.color ?? ''}
                  onChange={(e) => setPatient({ ...patient, color: e.target.value })}
                />
              </Field>
              <div className="flex items-center gap-2 pt-7 text-sm text-ink-700">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={neutered}
                    onChange={(e) => setNeutered(e.target.checked)}
                    className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
                  />
                  Esterilizado / castrado
                </label>
                <Tooltip text="Marca si la mascota está esterilizada o castrada. Opcional." />
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                ← Atrás
              </Button>
              <Button type="submit" loading={submitting}>
                Guardar paciente
              </Button>
            </div>
          </fieldset>
        )}
      </form>
    </Modal>
  )
}

function WizardSteps({ step }: { step: 1 | 2 }) {
  const steps = [
    { n: 1 as const, label: 'Dueño' },
    { n: 2 as const, label: 'Paciente' },
  ]
  return (
    <div className="flex items-center gap-3">
      {steps.map((item, index) => (
        <div key={item.n} className="flex flex-1 items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition ${
                step >= item.n ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
              }`}
            >
              {item.n}
            </span>
            <span
              className={`text-sm font-medium ${step >= item.n ? 'text-ink-800' : 'text-ink-400'}`}
            >
              {item.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span
              className={`h-0.5 flex-1 rounded transition ${
                step > item.n ? 'bg-brand-400' : 'bg-ink-100'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

