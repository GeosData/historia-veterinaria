import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ErrorNote } from '../components/Feedback'
import { Field, TextInput } from '../components/Field'
import { ApiError } from '../lib/api'
import { useAuthStore } from '../store/auth'

export function LoginPage() {
  const apiKey = useAuthStore((state) => state.apiKey)
  const register = useAuthStore((state) => state.register)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const [mode, setMode] = useState<'register' | 'existing'>('register')
  const [form, setForm] = useState({ name: '', vet_name: '', email: '' })
  const [existingKey, setExistingKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (apiKey) return <Navigate to="/pacientes" replace />

  const onRegister = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(form)
      navigate('/pacientes', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo crear la clínica.')
    } finally {
      setSubmitting(false)
    }
  }

  const onUseExisting = (event: FormEvent) => {
    event.preventDefault()
    if (!existingKey.trim()) {
      setError('Pega tu clave de acceso.')
      return
    }
    login(existingKey)
    navigate('/pacientes', { replace: true })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand-700 p-12 text-brand-50 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <PawMark />
          </span>
          <span className="font-display text-lg font-bold">Historia Clínica</span>
        </div>
        <div className="space-y-5">
          <h1 className="max-w-sm font-display text-4xl font-bold leading-tight text-white">
            La historia clínica de tus pacientes, en un solo lugar.
          </h1>
          <p className="max-w-sm text-brand-100">
            Pacientes, consultas, vacunas y recordatorios de revacunación para tu consultorio
            veterinario.
          </p>
        </div>
        <p className="text-sm text-brand-200">Un producto Geosdata</p>
      </aside>

      <main className="flex items-center justify-center bg-ink-50 px-5 py-12">
        <Card className="w-full max-w-md p-8">
          {mode === 'register' ? (
            <form onSubmit={onRegister} className="space-y-5">
              <header className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-ink-950">Crea tu clínica</h2>
                <p className="text-sm text-ink-500">
                  Registra tu consultorio y obtén tu clave de acceso al instante.
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
              <Field label="Correo" htmlFor="email">
                <TextInput
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="clinica@correo.com"
                />
              </Field>

              <Button type="submit" className="w-full" loading={submitting}>
                Crear clínica y entrar
              </Button>

              <p className="text-center text-sm text-ink-500">
                ¿Ya tienes tu clave de acceso?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('existing')
                    setError(null)
                  }}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  Entra con tu clave
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={onUseExisting} className="space-y-5">
              <header className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-ink-950">Entrar con tu clave</h2>
                <p className="text-sm text-ink-500">
                  Pega la clave de acceso (API key) que recibiste al registrarte.
                </p>
              </header>

              {error && <ErrorNote message={error} />}

              <Field label="Clave de acceso" htmlFor="apiKey">
                <TextInput
                  id="apiKey"
                  value={existingKey}
                  onChange={(e) => setExistingKey(e.target.value)}
                  placeholder="hv_..."
                  autoComplete="off"
                />
              </Field>

              <Button type="submit" className="w-full">
                Entrar
              </Button>

              <p className="text-center text-sm text-ink-500">
                ¿No tienes clínica todavía?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setError(null)
                  }}
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  Regístrate
                </button>
              </p>
            </form>
          )}
        </Card>
      </main>
    </div>
  )
}

function PawMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden="true">
      <circle cx="6.5" cy="10" r="2" />
      <circle cx="17.5" cy="10" r="2" />
      <circle cx="9.5" cy="6" r="2" />
      <circle cx="14.5" cy="6" r="2" />
      <path d="M12 12.5c2.6 0 4.7 1.9 4.7 4.2 0 1.5-1.2 2.3-2.7 2.3-.9 0-1.4-.4-2-.4s-1.1.4-2 .4c-1.5 0-2.7-.8-2.7-2.3 0-2.3 2.1-4.2 4.7-4.2Z" />
    </svg>
  )
}
