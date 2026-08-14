const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function parseDate(value?: string | null): Date | null {
  if (!value) return null
  const iso = value.length <= 10 ? `${value}T00:00:00` : value
  const parsed = new Date(iso)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatDate(value?: string | null): string {
  const parsed = parseDate(value)
  return parsed ? dateFormatter.format(parsed) : '—'
}

export function today(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export function daysUntil(value?: string | null): number | null {
  const target = parseDate(value)
  if (!target) return null
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - start.getTime()) / 86400000)
}

export function dueLabel(days: number | null): string {
  if (days === null) return 'Sin fecha'
  if (days < 0) return `Vencida hace ${Math.abs(days)} d`
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  return `En ${days} días`
}

export function vetLabel(vet: { name: string; title?: string | null }): string {
  const name = vet.name.trim()
  const title = vet.title?.trim()
  return title ? `${name}, ${title}` : name
}

export function examToText(exam?: Record<string, unknown> | null): string {
  if (!exam) return ''
  const notes = exam.notes
  if (typeof notes === 'string') return notes
  return Object.entries(exam)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join('\n')
}
