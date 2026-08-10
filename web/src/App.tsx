import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ClinicGate, ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PatientDetailPage } from './pages/PatientDetailPage'
import { PatientsPage } from './pages/PatientsPage'
import { RemindersPage } from './pages/RemindersPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<ClinicGate />}>
            <Route element={<Layout />}>
              <Route path="/pacientes" element={<PatientsPage />} />
              <Route path="/pacientes/:id" element={<PatientDetailPage />} />
              <Route path="/recordatorios" element={<RemindersPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/pacientes" replace />} />
        <Route path="*" element={<Navigate to="/pacientes" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
