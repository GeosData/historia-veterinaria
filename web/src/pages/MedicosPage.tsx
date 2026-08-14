import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState, ErrorNote, Spinner } from '../components/Feedback'
import { Field, Select, TextInput } from '../components/Field'
import { Modal } from '../components/Modal'
import { api, ApiError } from '../lib/api'
import { vetLabel } from '../lib/format'
import { useAuthStore } from '../store/auth'
import type { Vet, VetCreate } from '../types'

const TITLE_OPTIONS = ['MV', 'MVZ']

export function MedicosPage() {
  const clinicId = useAuthStore((state) => state.activeClinicId)
  const clinics = useAuthStore((state) => state.clinics)
  const activeClinic = clinics.find((clinic) => clinic.id === clinicId)

  const [vets, setVets] = useState<Vet[]>([])
  const [associatedIds, setAssociatedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [modalVet, setModalVet] = useState<Vet | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const load = async () => {
    if (!clinicId) return
    setLoading(true)
    setError(null)
    try {
      const [allVets, clinicVets] = await Promise.all([
        api.listVets(),
        api.listClinicVets(clinicId),
      ])
      setVets(allVets)
      setAssociatedIds(new Set(clinicVets.map((vet) => vet.id)))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los médicos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [clinicId])

  const associate = async (vet: Vet) => {
    if (!clinicId) return
    setError(null)
    setPendingId(vet.id)
    try {
      await api.addClinicVet(clinicId, vet.id)
      setAssociatedIds((prev) => new Set(prev).add(vet.id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo asociar el médico.')
    } finally {
      setPendingId(null)
    }
  }

  const disassociate = async (vet: Vet) => {
    if (!clinicId) return
    setError(null)
    setPendingId(vet.id)
    try {
      await api.removeClinicVet(clinicId, vet.id)
      setAssociatedIds((prev) => {
        const next = new Set(prev)
        next.delete(vet.id)
        return next
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo quitar el médico.')
    } finally {
      setPendingId(null)
    }
  }

  const onDelete = async (vet: Vet) => {
    if (!window.confirm(`¿Eliminar a ${vetLabel(vet)}? Esta acción no se puede deshacer.`)) return
    setError(null)
    setPendingId(vet.id)
    try {
      await api.deleteVet(vet.id)
      setVets((prev) => prev.filter((item) => item.id !== vet.id))
      setAssociatedIds((prev) => {
        const next = new Set(prev)
        next.delete(vet.id)
        return next
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar el médico.')
    } finally {
      setPendingId(null)
    }
  }

  const openCreate = () => {
    setModalVet(null)
    setModalOpen(true)
  }

  const openEdit = (vet: Vet) => {
    setModalVet(vet)
    setModalOpen(true)
  }

  const associatedVets = vets.filter((vet) => associatedIds.has(vet.id))
  const availableVets = vets.filter((vet) => !associatedIds.has(vet.id))

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Médicos</h1>
          <p className="text-sm text-ink-500">
            Gestiona tus veterinarios y asígnalos a{' '}
            <span className="font-medium text-ink-700">
              {activeClinic?.name ?? 'la clínica activa'}
            </span>
            .
          </p>
        </div>
        <Button onClick={openCreate}>+ Nuevo médico</Button>
      </header>

      {error && <ErrorNote message={error} />}

      {loading ? (
        <Spinner label="Cargando médicos…" />
      ) : vets.length === 0 ? (
        <EmptyState
          title="Todavía no hay médicos"
          description="Registra a tus veterinarios para asignarlos a las consultas."
          action={<Button onClick={openCreate}>+ Nuevo médico</Button>}
        />
      ) : (
        <>
          <Card className="space-y-4 p-5">
            <div>
              <p className="font-display text-lg font-semibold text-ink-950">
                Atienden en {activeClinic?.name ?? 'esta clínica'}
              </p>
              <p className="text-sm text-ink-500">
                Estos médicos aparecen al registrar consultas en esta clínica.
              </p>
            </div>

            {associatedVets.length === 0 ? (
              <p className="text-sm text-ink-400">
                Aún no hay médicos asignados a esta clínica.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {associatedVets.map((vet) => (
                  <span
                    key={vet.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-medium text-brand-700 ring-1 ring-inset ring-brand-200"
                  >
                    {vetLabel(vet)}
                    <button
                      type="button"
                      aria-label={`Quitar a ${vetLabel(vet)}`}
                      disabled={pendingId === vet.id}
                      onClick={() => void disassociate(vet)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-brand-500 transition hover:bg-brand-100 hover:text-brand-800 disabled:opacity-40"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <AddVetPicker
              vets={availableVets}
              pendingId={pendingId}
              onPick={(vet) => void associate(vet)}
            />
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            {vets.map((vet) => {
              const busy = pendingId === vet.id
              return (
                <Card key={vet.id} className="flex h-full flex-col gap-4 p-5">
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-950">
                      {vetLabel(vet)}
                    </p>
                    <p className="text-sm text-ink-500">
                      {vet.license
                        ? `Matrícula COMVEZCOL ${vet.license}`
                        : 'Sin matrícula profesional'}
                    </p>
                    {vet.email && <p className="text-sm text-ink-500">{vet.email}</p>}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => openEdit(vet)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => void onDelete(vet)}>
                      Eliminar
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      <VetModal
        open={modalOpen}
        vet={modalVet}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false)
          void load()
        }}
      />
    </div>
  )
}

interface AddVetPickerProps {
  vets: Vet[]
  pendingId: string | null
  onPick: (vet: Vet) => void
}

function AddVetPicker({ vets, pendingId, onPick }: AddVetPickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative inline-block">
      <Button
        size="sm"
        variant="outline"
        disabled={vets.length === 0 || pendingId !== null}
        onClick={() => setOpen((value) => !value)}
      >
        + Agregar médico
      </Button>
      {vets.length === 0 && (
        <span className="ml-3 text-xs text-ink-400">Todos tus médicos ya atienden aquí.</span>
      )}
      {open && vets.length > 0 && (
        <div className="absolute z-10 mt-2 w-64 overflow-hidden rounded-card border border-ink-200 bg-white py-1 shadow-pop">
          {vets.map((vet) => (
            <button
              key={vet.id}
              type="button"
              disabled={pendingId !== null}
              onClick={() => {
                setOpen(false)
                onPick(vet)
              }}
              className="block w-full px-4 py-2 text-left text-sm text-ink-700 transition hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40"
            >
              {vetLabel(vet)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface VetModalProps {
  open: boolean
  vet: Vet | null
  onClose: () => void
  onSaved: () => void
}

function VetModal({ open, vet, onClose, onSaved }: VetModalProps) {
  const [form, setForm] = useState({ name: '', title: '', license: '', email: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm({
      name: vet?.name ?? '',
      title: vet?.title ?? '',
      license: vet?.license ?? '',
      email: vet?.email ?? '',
    })
  }, [open, vet])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload: VetCreate = {
        name: form.name.trim(),
        title: form.title || null,
        license: form.license.trim() || null,
        email: form.email.trim() || null,
      }
      if (vet) await api.updateVet(vet.id, payload)
      else await api.createVet(payload)
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el médico.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} title={vet ? 'Editar médico' : 'Nuevo médico'} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorNote message={error} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre" required>
            <TextInput
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ana Ríos"
            />
          </Field>
          <Field
            label="Título"
            required={false}
            tooltip="MV (Médico Veterinario) o MVZ (Médico Veterinario Zootecnista), según tu formación."
          >
            <Select
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            >
              <option value="">Sin especificar</option>
              {TITLE_OPTIONS.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field
          label="Matrícula profesional (COMVEZCOL)"
          required={false}
          tooltip="Número de tu matrícula del Consejo Profesional de Medicina Veterinaria (COMVEZCOL). Opcional."
        >
          <TextInput
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
            placeholder="12345"
          />
        </Field>
        <Field label="Email" required={false}>
          <TextInput
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ana@clinica.com"
          />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            {vet ? 'Guardar cambios' : 'Guardar médico'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
