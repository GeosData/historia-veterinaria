import { useEffect, useState, type ReactNode } from 'react'

const LOADING_MESSAGES = [
  'Preparando el consultorio…',
  'Revisando historias clínicas…',
  'Buscando a los pacientes…',
  'Acomodando los carnets de vacunas…',
  'Saludando a las mascotas…',
  'Ordenando los expedientes…',
  'Afilando el estetoscopio…',
  'Poniendo al día las vacunas…',
  'Llamando a los dueños…',
  'Contando las croquetas…',
]

export function Spinner({ label }: { label?: string }) {
  const [message, setMessage] = useState(LOADING_MESSAGES[0])
  useEffect(() => {
    if (label) return
    const pick = () => setMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])
    pick()
    const id = setInterval(pick, 1800)
    return () => clearInterval(id)
  }, [label])
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-ink-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-300 border-t-transparent" />
      <span className="text-sm">{label ?? message}</span>
    </div>
  )
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-800">
      {message}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-ink-200 bg-white/60 px-6 py-12 text-center">
      <p className="font-display text-base font-semibold text-ink-800">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-500">{description}</p>}
      {action}
    </div>
  )
}

interface BadgeProps {
  children: ReactNode
  tone?: 'brand' | 'accent' | 'neutral' | 'danger'
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200',
  neutral: 'bg-ink-100 text-ink-600 ring-ink-200',
  danger: 'bg-accent-100 text-accent-800 ring-accent-300',
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
