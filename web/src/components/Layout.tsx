import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { Button } from './Button'

const navItems = [
  { to: '/pacientes', label: 'Pacientes', icon: PawIcon },
  { to: '/recordatorios', label: 'Recordatorios', icon: BellIcon },
]

export function Layout() {
  const navigate = useNavigate()
  const clinic = useAuthStore((state) => state.clinic)
  const logout = useAuthStore((state) => state.logout)

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-ink-100 bg-white lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:flex-col lg:items-stretch lg:gap-8">
          <Brand />
          <nav className="flex gap-1 lg:flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                  }`
                }
              >
                <item.icon />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden lg:mt-auto lg:block">
            <ClinicCard name={clinic?.name} vet={clinic?.vet_name} />
            <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={onLogout}>
              Salir
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onLogout}>
            Salir
          </Button>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl px-5 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <PawIcon />
      </span>
      <span className="font-display text-base font-bold leading-tight text-ink-950">
        Historia
        <br className="hidden lg:block" /> <span className="text-brand-600">Clínica</span>
      </span>
    </div>
  )
}

function ClinicCard({ name, vet }: { name?: string; vet?: string }) {
  if (!name && !vet) return null
  return (
    <div className="rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5">
      {name && <p className="truncate text-sm font-semibold text-ink-800">{name}</p>}
      {vet && <p className="truncate text-xs text-ink-500">{vet}</p>}
    </div>
  )
}

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <circle cx="6.5" cy="10" r="2" />
      <circle cx="17.5" cy="10" r="2" />
      <circle cx="9.5" cy="6" r="2" />
      <circle cx="14.5" cy="6" r="2" />
      <path d="M12 12.5c2.6 0 4.7 1.9 4.7 4.2 0 1.5-1.2 2.3-2.7 2.3-.9 0-1.4-.4-2-.4s-1.1.4-2 .4c-1.5 0-2.7-.8-2.7-2.3 0-2.3 2.1-4.2 4.7-4.2Z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10.5 20a2 2 0 0 0 3 0" />
    </svg>
  )
}
