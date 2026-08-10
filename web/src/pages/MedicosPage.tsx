import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Badge, EmptyState, ErrorNote, Spinner } from '../components/Feedback'
import { Field, TextInput } from '../components/Field'
import { Modal } from '../components/Modal'
import { api, ApiError } from '../lib/api'
import { useAuthStore } from '../store/auth'
import type { Vet, VetCreate } from '../types'

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

  const toggleAssociation = async (vet: Vet) => {
    if (!clinicId) return
    setError(null)
    setPendingId(vet.id)
    const isAssociated = associatedIds.has(vet.id)
    try {
      if (isAssociated) {
        await api.removeClinicVet(clinicId, vet.id)
      } else {
        await api.addClinicVet(clinicId, vet.id)
      }
      setAssociatedIds((prev) => {
        const next = new Set(prev)
        if (isAssociated) next.delete(vet.id)
        else next.add(vet.id)
        return next
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar la asociación.')
    } finally {
      setPendingId(null)
    }
  }

  const onDelete = async (vet: Vet) => {
    if (!window.confirm(`¿Eliminar a ${vet.name}? Esta acción no se puede deshacer.`)) return
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Médicos</h1>
          <p className="text-sm text-ink-500">
            Gestiona tus veterinarios y asócialos a{' '}
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
        <div className="grid gap-3 sm:grid-cols-2">
          {vets.map((vet) => {
            const associated = associatedIds.has(vet.id)
            const busy = pendingId === vet.id
            return (
              <Card key={vet.id} className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-950">{vet.name}</p>
                    <p className="text-sm text-ink-500">
                      {vet.license ? `T.P. ${vet.license}` : 'Sin tarjeta profesional'}
                    </p>
                    {vet.email && <p className="text-sm text-ink-500">{vet.email}</p>}
                  </div>
                  {associated && <Badge tone="brand">Asociado</Badge>}
                </div>

                <label className="flex items-center gap-2 text-sm text-ink-700">
                  <input
                    type="checkbox"
                    checked={associated}
                    disabled={busy}
                    onChange={() => void toggleAssociation(vet)}
                    className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
                  />
                  Atiende en {activeClinic?.name ?? 'esta clínica'}
                </label>

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

interface VetModalProps {
  open: boolean
  vet: Vet | null
  onClose: () => void
  onSaved: () => void
}

function VetModal({ open, vet, onClose, onSaved }: VetModalProps) {
  const [form, setForm] = useState({ name: '', license: '', email: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm({
      name: vet?.name ?? '',
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
        <Field label="Nombre">
          <TextInput
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Dra. Ana Ríos"
          />
        </Field>
        <Field label="Tarjeta profesional">
          <TextInput
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
            placeholder="12345"
          />
        </Field>
        <Field label="Email">
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
