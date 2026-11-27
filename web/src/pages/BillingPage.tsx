import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import { Button } from '../components/Button'

interface BillingState {
  status: string
  plan_name: string
  trial_days: number
}

const STATUS_LABEL: Record<string, { text: string; badge: string }> = {
  authorized: { text: 'Suscripción activa', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  active: { text: 'Suscripción activa', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { text: 'Pago pendiente de confirmación', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  paused: { text: 'Suscripción pausada', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  cancelled: { text: 'Suscripción cancelada', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  none: { text: 'Periodo de prueba gratuito (14 días)', badge: 'bg-brand-50 text-brand-700 border-brand-200' },
}

export function BillingPage() {
  const [billing, setBilling] = useState<BillingState | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getBillingSubscription()
      .then((data) => {
        setBilling(data)
        setLoading(false)
      })
      .catch(() => {
        setBilling({ status: 'none', plan_name: 'Independiente ($29.000 COP/mes)', trial_days: 14 })
        setLoading(false)
      })
  }, [])

  const handleSubscribe = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const { init_point } = await api.createBillingSubscription()
      window.location.href = init_point
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos abrir Mercado Pago. Intenta de nuevo.')
      setSubmitting(false)
    }
  }

  const current = STATUS_LABEL[billing?.status ?? 'none'] ?? STATUS_LABEL.none

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Plan y suscripción</h1>
        <p className="mt-1 text-sm text-ink-500">
          Gestiona tu suscripción mensual segura por Mercado Pago (PSE, Nequi o tarjeta). Sin cláusula de permanencia.
        </p>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Estado actual</p>
            <p className="mt-1 text-lg font-semibold text-ink-900">
              {loading ? 'Consultando estado...' : billing?.plan_name}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${current.badge}`}>
            {current.text}
          </span>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border-2 border-brand-500 bg-brand-50/30 p-5 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">1 veterinario · Independiente</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">
              $29.000 <span className="text-sm font-normal text-ink-500">COP / mes</span>
            </p>
            <p className="mt-0.5 text-xs text-brand-700 font-medium">14 días gratis · cancela cuando quieras</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700 flex-1">
              <li>• Historias clínicas COMVEZCOL y pacientes ilimitados</li>
              <li>• Panel de vacunas y recordatorios por WhatsApp</li>
              <li>• Respaldo en la nube + exportación completa</li>
            </ul>
            <Button className="mt-5 w-full" onClick={handleSubscribe} disabled={submitting}>
              {submitting ? 'Abriendo Mercado Pago...' : 'Activar plan con Mercado Pago'}
            </Button>
          </div>

          <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-5 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Hasta 4 profesionales · Consultorio</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">
              $59.000 <span className="text-sm font-normal text-ink-500">COP / mes</span>
            </p>
            <p className="mt-0.5 text-xs text-ink-500">o $590.000 COP / año (2 meses gratis)</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700 flex-1">
              <li>• Todo lo del plan Independiente</li>
              <li>• Varios veterinarios y auxiliares en la misma clínica</li>
              <li>• Soporte prioritario directo por WhatsApp</li>
            </ul>
            <a
              href="https://wa.me/573156189586?text=Hola,%20quiero%20activar%20el%20Plan%20Consultorio%20($59.000)%20de%20Historia%20Veterinaria"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-lg border border-ink-300 bg-white px-4 py-2 text-sm font-medium text-ink-800 hover:bg-ink-100 transition"
            >
              Activar Consultorio por WhatsApp
            </a>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
