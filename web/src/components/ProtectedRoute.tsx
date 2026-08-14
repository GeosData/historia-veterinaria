import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from './Feedback'
import { useAuthStore } from '../store/auth'

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function ClinicGate() {
  const clinics = useAuthStore((state) => state.clinics)
  const clinicsStatus = useAuthStore((state) => state.clinicsStatus)
  const refreshClinics = useAuthStore((state) => state.refreshClinics)

  if (clinicsStatus === 'idle' || clinicsStatus === 'loading') return <FullScreenLoader />
  if (clinicsStatus === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center">
        <p className="text-sm text-ink-600">No pudimos cargar tus clínicas. Revisa tu conexión.</p>
        <button
          onClick={() => void refreshClinics()}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Reintentar
        </button>
      </div>
    )
  }
  if (clinics.length === 0) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50">
      <Spinner />
    </div>
  )
}
