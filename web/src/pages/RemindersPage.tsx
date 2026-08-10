import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Badge, EmptyState, ErrorNote, Spinner } from '../components/Feedback'
import { api, ApiError } from '../lib/api'
import { daysUntil, dueLabel, formatDate } from '../lib/format'
import { useAuthStore } from '../store/auth'
import type { Reminder } from '../types'

export function RemindersPage() {
  const clinicId = useAuthStore((state) => state.activeClinicId)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clinicId) return
    let active = true
    setLoading(true)
    setError(null)
    api
      .listReminders(clinicId)
      .then((data) => {
        if (active) setReminders(data)
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los recordatorios.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [clinicId])

  const sorted = useMemo(
    () =>
      [...reminders].sort(
        (a, b) => (daysUntil(a.next_due) ?? Infinity) - (daysUntil(b.next_due) ?? Infinity),
      ),
    [reminders],
  )

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink-950">Recordatorios</h1>
        <p className="text-sm text-ink-500">Próximas revacunaciones ordenadas por urgencia.</p>
      </header>

      {error && <ErrorNote message={error} />}

      {loading ? (
        <Spinner label="Cargando recordatorios…" />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="No hay revacunaciones pendientes"
          description="Cuando registres una vacuna con próxima dosis, aparecerá aquí."
        />
      ) : (
        <ul className="space-y-3">
          {sorted.map((reminder) => {
            const remaining = daysUntil(reminder.next_due)
            const urgent = remaining !== null && remaining <= 7
            return (
              <li key={reminder.vaccine_id}>
                <Card className={`p-5 ${urgent ? 'border-accent-300' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/pacientes/${reminder.patient_id}`}
                          className="font-display text-lg font-semibold text-ink-950 hover:text-brand-700"
                        >
                          {reminder.patient_name}
                        </Link>
                        <Badge tone="brand">{reminder.vaccine_name}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-ink-500">
                        {reminder.owner_name ?? 'Sin dueño'}
                        {reminder.owner_phone && (
                          <>
                            {' · '}
                            <a
                              href={`tel:${reminder.owner_phone}`}
                              className="font-medium text-brand-600 hover:text-brand-700"
                            >
                              {reminder.owner_phone}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge tone={urgent ? 'danger' : 'neutral'}>{dueLabel(remaining)}</Badge>
                      <p className="mt-1 text-sm text-ink-500">{formatDate(reminder.next_due)}</p>
                    </div>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
