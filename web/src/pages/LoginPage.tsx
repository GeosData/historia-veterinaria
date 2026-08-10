import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ErrorNote, Spinner } from '../components/Feedback'
import { loginWithGoogle } from '../lib/firebase'
import { useAuthStore } from '../store/auth'

export function LoginPage() {
  const user = useAuthStore((state) => state.user)
  const clinic = useAuthStore((state) => state.clinic)
  const clinicStatus = useAuthStore((state) => state.clinicStatus)

  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    if (clinicStatus !== 'ready') {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink-50">
          <Spinner />
        </div>
      )
    }
    return <Navigate to={clinic ? '/pacientes' : '/onboarding'} replace />
  }

  const onGoogle = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await loginWithGoogle()
    } catch {
      setError('No se pudo iniciar sesión con Google. Intenta de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden lg:block">
        <img
          src="/hero.jpg"
          alt="Veterinaria acariciando a un gato durante la consulta"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-900/55 to-brand-800/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-brand-50">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <PawMark />
            </span>
            <span className="font-display text-lg font-bold text-white">Historia Clínica</span>
          </div>
          <div className="space-y-5">
            <h1 className="max-w-sm font-display text-4xl font-bold leading-tight text-white">
              La historia clínica de tus pacientes, en un solo lugar.
            </h1>
            <p className="max-w-sm text-brand-50/90">
              Pacientes, consultas, vacunas y recordatorios de revacunación para tu consultorio
              veterinario.
            </p>
          </div>
          <p className="text-sm text-brand-100/80">Un producto Geosdata</p>
        </div>
      </aside>

      <main className="flex items-center justify-center bg-ink-50 px-5 py-12">
        <Card className="w-full max-w-md overflow-hidden">
          <div className="relative h-40 lg:hidden">
            <img
              src="/hero.jpg"
              alt="Veterinaria acariciando a un gato durante la consulta"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" />
          </div>

          <div className="space-y-6 p-8">
            <header className="space-y-1">
              <h2 className="font-display text-2xl font-bold text-ink-950">Bienvenido</h2>
              <p className="text-sm text-ink-500">
                Entra con tu cuenta de Google para gestionar tu clínica veterinaria.
              </p>
            </header>

            {error && <ErrorNote message={error} />}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              loading={submitting}
              onClick={onGoogle}
            >
              {!submitting && <GoogleMark />}
              Entrar con Google
            </Button>

            <p className="text-center text-xs text-ink-400">
              Al continuar aceptas usar la plataforma para el manejo de historias clínicas de tu
              consultorio.
            </p>
          </div>
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

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.28a12 12 0 0 0 0 10.76l3.99-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}
