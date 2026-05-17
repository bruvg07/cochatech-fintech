import { useEffect, useMemo, useState } from 'react'
import { fetchDashboardInitial, type DashboardCredit } from '../../lib/backendApi'
import './debts.css'

export interface Debt {
  id: string
  tipo: 'CONSUMO' | 'VIVIENDA' | 'MICROEMPRESA'
  saldoPendiente: number
  cuotaMensual: number
  diasMora: number
  estado: 'VIGENTE' | 'EN_MORA' | 'CANCELADO'
  proximaFecha: string
}

interface DebtsScreenProps {
  onDebtSelect?: (debt: Debt) => void
}

type DashboardSnapshot = Awaited<ReturnType<typeof fetchDashboardInitial>>

function mapCreditToDebt(credit: DashboardCredit): Debt {
  const tipoCredito = credit.tipo_credito.toLowerCase()

  return {
    id: credit.id,
    tipo: tipoCredito.includes('vivi') ? 'VIVIENDA' : tipoCredito.includes('micro') ? 'MICROEMPRESA' : 'CONSUMO',
    saldoPendiente: credit.saldo_pendiente,
    cuotaMensual: credit.cuota_mensual,
    diasMora: credit.dias_mora,
    estado: credit.estado.toUpperCase().includes('MORA')
      ? 'EN_MORA'
      : credit.estado.toUpperCase().includes('CANCEL')
        ? 'CANCELADO'
        : 'VIGENTE',
    proximaFecha: credit.fecha_vencimiento ?? new Date().toISOString().slice(0, 10),
  }
}

function getCreditLabel(type: Debt['tipo']) {
  if (type === 'VIVIENDA') {
    return 'Crédito de vivienda'
  }

  if (type === 'MICROEMPRESA') {
    return 'Crédito microempresa'
  }

  return 'Crédito de consumo'
}

function formatCurrency(value: number) {
  return value.toLocaleString('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 0,
  })
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-BO', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

function DebtTypeIcon(type: string) {
  if (type === 'VIVIENDA') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 2 12h2v8h6v-6h4v6h6v-8h2L12 2zm0 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
      </svg>
    )
  }
  if (type === 'MICROEMPRESA') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm-2 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
    </svg>
  )
}

export function DebtsScreen({ onDebtSelect }: DebtsScreenProps) {
  const [dashboard, setDashboard] = useState<DashboardSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function loadCredits() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchDashboardInitial()
        if (alive) {
          setDashboard(response)
        }
      } catch (loadError) {
        if (!alive) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar tus créditos.')
      } finally {
        if (alive) {
          setIsLoading(false)
        }
      }
    }

    loadCredits()

    return () => {
      alive = false
    }
  }, [])

  const credits = useMemo(() => dashboard?.creditos.map(mapCreditToDebt) ?? [], [dashboard])
  const totalPending = dashboard?.resumen.saldo_pendiente ?? 0
  const nextPayment = useMemo(() => {
    if (credits.length === 0) {
      return 0
    }

    return credits.reduce((lowest, current) => (current.cuotaMensual < lowest ? current.cuotaMensual : lowest), credits[0].cuotaMensual)
  }, [credits])

  if (isLoading) {
    return (
      <main className="debts-screen">
        <section className="debts-content">
          <header className="debts-header">
            <h1>Mis créditos</h1>
            <p className="debts-header__subtitle">Cargando tus créditos activos...</p>
          </header>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="debts-screen">
        <section className="debts-content">
          <header className="debts-header">
            <h1>Mis créditos</h1>
            <p className="debts-header__subtitle">No pudimos cargar la información.</p>
          </header>
          <div className="debts-summary card-surface">
            <div className="debts-summary__item">
              <span className="debts-summary__label">Error</span>
              <strong className="debts-summary__value">{error}</strong>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="debts-screen">
      <header className="debts-header">
        <h1>Mis créditos</h1>
        <p className="debts-header__subtitle">Tus créditos activos y su estado</p>
      </header>

      <section className="debts-content">
        <div className="debts-summary card-surface">
          <div className="debts-summary__item">
            <span className="debts-summary__label">Saldo pendiente</span>
            <strong className="debts-summary__value">{formatCurrency(totalPending)}</strong>
          </div>
          <div className="debts-summary__divider" />
          <div className="debts-summary__item">
            <span className="debts-summary__label">Próxima cuota</span>
            <strong className="debts-summary__value">{formatCurrency(nextPayment)}</strong>
          </div>
        </div>

        <div className="debts-list">
          {credits.map((debt) => (
            <button
              key={debt.id}
              className={`debt-card card-surface debt-card--${debt.estado.toLowerCase()}`}
              onClick={() => onDebtSelect?.(debt)}
              type="button"
            >
              <div className="debt-card__header">
                <span className="debt-card__icon">{DebtTypeIcon(debt.tipo)}</span>
                <div className="debt-card__title-group">
                  <h3 className="debt-card__type">
                    {getCreditLabel(debt.tipo)}
                  </h3>
                  {debt.diasMora > 0 && (
                    <span className="debt-card__mora-badge">{debt.diasMora} días de mora</span>
                  )}
                </div>
                <span
                  className={`debt-card__status debt-card__status--${debt.estado.toLowerCase()}`}
                >
                  {debt.estado === 'VIGENTE' ? '✓' : debt.estado === 'EN_MORA' ? '!' : '✓'}
                </span>
              </div>

              <div className="debt-card__body">
                <div className="debt-card__row">
                  <span className="debt-card__label">Saldo pendiente</span>
                  <strong className="debt-card__amount">
                    {debt.saldoPendiente.toLocaleString('es-BO', {
                      style: 'currency',
                      currency: 'BOB',
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                </div>

                <div className="debt-card__row">
                  <span className="debt-card__label">Cuota mensual</span>
                  <strong>
                    {debt.cuotaMensual.toLocaleString('es-BO', {
                      style: 'currency',
                      currency: 'BOB',
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                </div>

                <div className="debt-card__row debt-card__row--highlight">
                  <span className="debt-card__label">Vencimiento</span>
                  <strong>{formatDate(debt.proximaFecha)}</strong>
                </div>
              </div>

              <div className="debt-card__footer">
                <span className="debt-card__cta">Ver crédito →</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
