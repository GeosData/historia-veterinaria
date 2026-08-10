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

  if (clinicsStatus !== 'ready') return <FullScreenLoader />
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
