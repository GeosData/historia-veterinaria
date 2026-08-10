import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ErrorNote, Spinner } from '../components/Feedback'
import { Field, TextInput } from '../components/Field'
import { ApiError, createClinic } from '../lib/api'
import { logout } from '../lib/firebase'
import { useAuthStore } from '../store/auth'

export function OnboardingPage() {
  const clinic = useAuthStore((state) => state.clinic)
  const clinicStatus = useAuthStore((state) => state.clinicStatus)
  const setClinic = useAuthStore((state) => state.setClinic)
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', vet_name: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (clinicStatus !== 'ready') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <Spinner />
      </div>
    )
  }

  if (clinic) return <Navigate to="/pacientes" replace />

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const created = await createClinic(form)
      setClinic(created)
      navigate('/pacientes', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear la clínica.')
      setSubmitting(false)
    }
  }

  const onLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-12">
      <Card className="w-full max-w-md p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <header className="space-y-1">
            <h1 className="font-display text-2xl font-bold text-ink-950">Configura tu clínica</h1>
            <p className="text-sm text-ink-500">
              Cuéntanos de tu consultorio para empezar a registrar pacientes.
            </p>
          </header>

          {error && <ErrorNote message={error} />}

          <Field label="Nombre de la clínica" htmlFor="name">
            <TextInput
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Veterinaria San Roque"
            />
          </Field>
          <Field label="Veterinario(a) responsable" htmlFor="vet">
            <TextInput
              id="vet"
              required
              value={form.vet_name}
              onChange={(e) => setForm({ ...form, vet_name: e.target.value })}
              placeholder="Dra. Ana Ríos"
            />
          </Field>

          <Button type="submit" className="w-full" loading={submitting}>
            Crear clínica y entrar
          </Button>

          <button
            type="button"
            onClick={onLogout}
            className="block w-full text-center text-sm text-ink-500 hover:text-ink-700"
          >
            Cerrar sesión
          </button>
        </form>
      </Card>
    </div>
  )
}
