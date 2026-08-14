import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ErrorNote, Spinner } from '../components/Feedback'
import { Field, TextInput } from '../components/Field'
import { ApiError, createClinic } from '../lib/api'
import { logout } from '../lib/firebase'
import { useAuthStore } from '../store/auth'

export function OnboardingPage() {
  const clinics = useAuthStore((state) => state.clinics)
  const clinicsStatus = useAuthStore((state) => state.clinicsStatus)
  const refreshClinics = useAuthStore((state) => state.refreshClinics)
  const setActiveClinic = useAuthStore((state) => state.setActiveClinic)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const hasClinics = clinics.length > 0

  if (clinicsStatus !== 'ready') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <Spinner />
      </div>
    )
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const created = await createClinic({ name: name.trim() })
      await refreshClinics()
      setActiveClinic(created.id)
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
            <h1 className="font-display text-2xl font-bold text-ink-950">
              {hasClinics ? 'Nueva clínica' : 'Configura tu clínica'}
            </h1>
            <p className="text-sm text-ink-500">
              {hasClinics
                ? 'Agrega otra clínica a tu cuenta para gestionarla por separado.'
                : 'Dale un nombre a tu consultorio para empezar a registrar pacientes.'}
            </p>
          </header>

          {error && <ErrorNote message={error} />}

          <Field label="Nombre de la clínica" htmlFor="name" required>
            <TextInput
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Veterinaria San Roque"
            />
          </Field>

          <Button type="submit" className="w-full" loading={submitting}>
            {hasClinics ? 'Crear clínica' : 'Crear clínica y entrar'}
          </Button>

          {hasClinics ? (
            <Link
              to="/pacientes"
              className="block w-full text-center text-sm text-ink-500 hover:text-ink-700"
            >
              Volver
            </Link>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="block w-full text-center text-sm text-ink-500 hover:text-ink-700"
            >
              Cerrar sesión
            </button>
          )}
        </form>
      </Card>
    </div>
  )
}
