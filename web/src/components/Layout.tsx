import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../lib/firebase'
import { useAuthStore } from '../store/auth'
import { Button } from './Button'

const NEW_CLINIC_VALUE = '__new__'

type NavItem = {
  to: string
  label: string
  icon: () => ReactNode
  children?: { to: string; label: string }[]
}

const navItems: NavItem[] = [
  { to: '/pacientes', label: 'Pacientes', icon: PawIcon },
  { to: '/medicos', label: 'Médicos', icon: StethoscopeIcon },
  { to: '/recordatorios', label: 'Recordatorios', icon: BellIcon },
  {
    to: '/ajustes',
    label: 'Ajustes',
    icon: GearIcon,
    children: [{ to: '/ajustes/especies', label: 'Especies' }],
  },
]

export function Layout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-ink-100 bg-white lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:flex-col lg:items-stretch lg:gap-8">
          <Brand />
          <nav className="flex gap-1 lg:flex-col">
            {navItems.map((item) =>
              item.children ? (
                <NavGroup key={item.to} item={item} pathname={pathname} />
              ) : (
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
              ),
            )}
          </nav>
          <div className="hidden lg:mt-auto lg:block">
            <ClinicSwitcher />
            <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={onLogout}>
              Salir
            </Button>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <ClinicSwitcher />
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Salir
            </Button>
          </div>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl px-5 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(pathname.startsWith(item.to))
  const children = item.children ?? []

  return (
    <div className="lg:space-y-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          pathname.startsWith(item.to)
            ? 'bg-brand-50 text-brand-700'
            : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
        }`}
        aria-expanded={open}
      >
        <item.icon />
        {item.label}
        <ChevronIcon className={`ml-auto h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-4 flex gap-1 border-l border-ink-100 pl-3 lg:flex-col">
          {children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm transition ${
                  isActive ? 'font-medium text-brand-700' : 'text-ink-500 hover:text-ink-800'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ClinicSwitcher() {
  const navigate = useNavigate()
  const clinics = useAuthStore((state) => state.clinics)
  const activeClinicId = useAuthStore((state) => state.activeClinicId)
  const setActiveClinic = useAuthStore((state) => state.setActiveClinic)

  const onChange = (value: string) => {
    if (value === NEW_CLINIC_VALUE) {
      navigate('/onboarding')
      return
    }
    if (value === activeClinicId) return
    setActiveClinic(value)
    navigate('/pacientes')
  }

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-ink-400">
        Clínica activa
      </span>
      <select
        value={activeClinicId ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      >
        {clinics.map((clinic) => (
          <option key={clinic.id} value={clinic.id}>
            {clinic.name}
          </option>
        ))}
        <option value={NEW_CLINIC_VALUE}>+ Nueva clínica</option>
      </select>
    </label>
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

function StethoscopeIcon() {
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
      <path d="M5 3v5a4 4 0 0 0 8 0V3" />
      <path d="M9 15a5 5 0 0 0 5 5 4 4 0 0 0 4-4v-2" />
      <circle cx="18" cy="10" r="2" />
    </svg>
  )
}

function GearIcon() {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
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
