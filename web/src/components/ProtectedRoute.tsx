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
  const clinic = useAuthStore((state) => state.clinic)
  const clinicStatus = useAuthStore((state) => state.clinicStatus)

  if (clinicStatus !== 'ready') return <FullScreenLoader />
  if (!clinic) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50">
      <Spinner />
    </div>
  )
}
