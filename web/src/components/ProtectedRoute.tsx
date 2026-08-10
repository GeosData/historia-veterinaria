import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export function ProtectedRoute() {
  const apiKey = useAuthStore((state) => state.apiKey)
  if (!apiKey) return <Navigate to="/login" replace />
  return <Outlet />
}
