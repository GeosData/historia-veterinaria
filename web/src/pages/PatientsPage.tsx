import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Badge, EmptyState, ErrorNote, Spinner } from '../components/Feedback'
import { Field, Select, TextInput } from '../components/Field'
import { Modal } from '../components/Modal'
import { api, ApiError } from '../lib/api'
import { formatDate } from '../lib/format'
import type { Owner, PatientCreate, PatientListItem } from '../types'

export function PatientsPage() {
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setPatients(await api.listPatients())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los pacientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

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
        <Button onClick={() => setModalOpen(true)}>+ Nuevo paciente</Button>
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

function NewPatientModal({ open, onClose, onCreated }: NewPatientModalProps) {
  const [owners, setOwners] = useState<Owner[]>([])
  const [ownerMode, setOwnerMode] = useState<'existing' | 'new'>('new')
  const [ownerId, setOwnerId] = useState('')
  const [newOwner, setNewOwner] = useState({ name: '', document: '', phone: '', address: '' })
  const [patient, setPatient] = useState<PatientCreate>(emptyPatient)
  const [weight, setWeight] = useState('')
  const [neutered, setNeutered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setError(null)
    setPatient(emptyPatient)
    setWeight('')
    setNeutered(false)
    setNewOwner({ name: '', document: '', phone: '', address: '' })
    void api
      .listOwners()
      .then((data) => {
        setOwners(data)
        setOwnerMode(data.length > 0 ? 'existing' : 'new')
      })
      .catch(() => setOwners([]))
  }, [open])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      let resolvedOwnerId: string | null = null
      if (ownerMode === 'existing') {
        resolvedOwnerId = ownerId || null
      } else if (newOwner.name.trim()) {
        const created = await api.createOwner({
          name: newOwner.name.trim(),
          document: newOwner.document || null,
          phone: newOwner.phone || null,
          address: newOwner.address || null,
        })
        resolvedOwnerId = created.id
      }

      await api.createPatient({
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
        {error && <ErrorNote message={error} />}

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-ink-800">Dueño</legend>
          <div className="flex gap-2">
            <ModeToggle
              active={ownerMode === 'existing'}
              disabled={owners.length === 0}
              onClick={() => setOwnerMode('existing')}
            >
              Existente
            </ModeToggle>
            <ModeToggle active={ownerMode === 'new'} onClick={() => setOwnerMode('new')}>
              Nuevo dueño
            </ModeToggle>
          </div>

          {ownerMode === 'existing' ? (
            <Field label="Selecciona un dueño">
              <Select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
                <option value="">Sin dueño</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                    {owner.phone ? ` · ${owner.phone}` : ''}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nombre del dueño">
                <TextInput
                  value={newOwner.name}
                  onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                  placeholder="María López"
                />
              </Field>
              <Field label="Documento">
                <TextInput
                  value={newOwner.document}
                  onChange={(e) => setNewOwner({ ...newOwner, document: e.target.value })}
                />
              </Field>
              <Field label="Teléfono">
                <TextInput
                  value={newOwner.phone}
                  onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                />
              </Field>
              <Field label="Dirección">
                <TextInput
                  value={newOwner.address}
                  onChange={(e) => setNewOwner({ ...newOwner, address: e.target.value })}
                />
              </Field>
            </div>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-ink-800">Paciente</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nombre">
              <TextInput
                required
                value={patient.name}
                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                placeholder="Firulais"
              />
            </Field>
            <Field label="Especie">
              <TextInput
                value={patient.species ?? ''}
                onChange={(e) => setPatient({ ...patient, species: e.target.value })}
                placeholder="Canino, Felino…"
              />
            </Field>
            <Field label="Raza">
              <TextInput
                value={patient.breed ?? ''}
                onChange={(e) => setPatient({ ...patient, breed: e.target.value })}
              />
            </Field>
            <Field label="Sexo">
              <Select
                value={patient.sex ?? ''}
                onChange={(e) => setPatient({ ...patient, sex: e.target.value })}
              >
                <option value="">Sin especificar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </Select>
            </Field>
            <Field label="Fecha de nacimiento">
              <TextInput
                type="date"
                value={patient.birthdate ?? ''}
                onChange={(e) => setPatient({ ...patient, birthdate: e.target.value })}
              />
            </Field>
            <Field label="Peso (kg)">
              <TextInput
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Field>
            <Field label="Color">
              <TextInput
                value={patient.color ?? ''}
                onChange={(e) => setPatient({ ...patient, color: e.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2 pt-7 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={neutered}
                onChange={(e) => setNeutered(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
              />
              Esterilizado / castrado
            </label>
          </div>
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            Guardar paciente
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function ModeToggle({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-40 ${
        active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
      }`}
    >
      {children}
    </button>
  )
}
