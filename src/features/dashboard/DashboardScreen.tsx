import { useEffect, useState, type CSSProperties } from 'react'
import { clearSession, fetchDashboardInitial, type DashboardResponse } from '../../lib/backendApi'
import './dashboard.css'

type DashboardScreenProps = {
  onLogout?: () => void
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.25 3.5 10.5v9.75h6.25V14h4.5v6.25h6.25V10.5L12 3.25Z" />
    </svg>
  )
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.75 17.25h14.5v1.5H4.75v-1.5Zm1.5-2.75 3.4-3.4 2.9 2.9 5.73-5.73v2.49h1.5V6.75H13.3v1.5h2.5l-4.15 4.15-2.9-2.9-4.46 4.46 1.06 1.06Z" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 6.5h13.25a2.25 2.25 0 0 1 2.25 2.25v6.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.75 2.75 0 0 1 4 14.75v-6a2.25 2.25 0 0 1 1-1.9V6.5Zm0 1.5a.75.75 0 0 0-.75.75v6a1.25 1.25 0 0 0 1.25 1.25h11.75a.75.75 0 0 0 .75-.75v-6.5a.75.75 0 0 0-.75-.75H5Z" />
      <path d="M15.25 10.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
    </svg>
  )
}

function riskStyles(nivelRiesgo: string) {
  switch (nivelRiesgo.toLowerCase()) {
    case 'critico':
      return { color: '#c0392b', label: 'Riesgo crítico' }
    case 'alto':
      return { color: '#d98c1f', label: 'Riesgo alto' }
    case 'medio':
      return { color: '#b3975a', label: 'Riesgo medio' }
    default:
      return { color: '#00a67d', label: 'Riesgo bajo' }
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(value)
}

export function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function loadDashboard() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchDashboardInitial()
        if (alive) {
          setDashboard(response)
        }
      } catch (dashboardError) {
        if (!alive) {
          return
        }

        const message = dashboardError instanceof Error ? dashboardError.message : 'No se pudo cargar el dashboard.'
        setError(message)
        clearSession()
        onLogout?.()
      } finally {
        if (alive) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      alive = false
    }
  }, [onLogout])

  const risk = riskStyles(dashboard?.score.nivel_riesgo ?? dashboard?.cliente.calificacion ?? 'bajo')

  if (isLoading) {
    return (
      <main className="dashboard">
        <section className="dashboard__shell">
          <header className="dashboard__header card-surface">
            <div>
              <p className="dashboard__eyebrow">Escudo Financiero</p>
              <h1>Cargando tu información...</h1>
            </div>
          </header>
        </section>
      </main>
    )
  }

  if (error || !dashboard) {
    return (
      <main className="dashboard">
        <section className="dashboard__shell">
          <header className="dashboard__header card-surface">
            <div>
              <p className="dashboard__eyebrow">Escudo Financiero</p>
              <h1>No se pudo cargar el dashboard</h1>
            </div>
            {onLogout && (
              <button className="dashboard__logout" type="button" onClick={onLogout}>
                Volver al login
              </button>
            )}
          </header>
          <section className="dashboard__banner card-surface">
            <p className="dashboard__banner-title">Error</p>
            <p>{error ?? 'Intenta iniciar sesión nuevamente.'}</p>
          </section>
        </section>
      </main>
    )
  }

  const { cliente, score, resumen, mensaje } = dashboard

  return (
    <main className="dashboard">
      <section className="dashboard__shell">
        <header className="dashboard__header card-surface">
          <div>
            <p className="dashboard__eyebrow">{cliente.ciudad ?? 'Escudo Financiero'}</p>
            <h1>Hola {cliente.nombre.split(' ')[0]}!</h1>
          </div>

          {onLogout && (
            <button className="dashboard__logout" type="button" onClick={onLogout}>
              Salir
            </button>
          )}
        </header>

        <section className="dashboard__hero card-surface">
          <div className="dashboard__score">
            <div
              className="dashboard__score-ring"
              style={{ '--risk-color': risk.color } as CSSProperties}
            >
              <span className="dashboard__score-letter">{cliente.calificacion}</span>
            </div>

            <div className="dashboard__score-copy">
              <p className="dashboard__label">Calificación ASFI</p>
              <h2>{mensaje}</h2>
              <p>
                Registra {score.numero_creditos} créditos y {resumen.pagos_con_retraso} pagos con retraso. El monitoreo
                se actualiza desde la API.
              </p>
              <div className="dashboard__score-chip">{risk.label}</div>
            </div>
          </div>
        </section>

        <section className="dashboard__banner card-surface">
          <p className="dashboard__banner-title">IA financiera</p>
          <p>{mensaje}</p>
        </section>

        <section className="dashboard__metrics">
          <article className="dashboard__metric card-surface">
            <span className="dashboard__metric-icon dashboard__metric-icon--primary">
              <WalletIcon />
            </span>
            <p>Deuda actual</p>
            <strong>{formatCurrency(resumen.saldo_pendiente)} Bs.</strong>
          </article>

          <article className="dashboard__metric card-surface">
            <span className="dashboard__metric-icon dashboard__metric-icon--secondary">
              <TrendIcon />
            </span>
            <p>Deuda pagada</p>
            <strong>{formatCurrency(resumen.saldo_pagado)} Bs.</strong>
          </article>

          <article className="dashboard__metric card-surface dashboard__metric--full">
            <span className="dashboard__metric-icon dashboard__metric-icon--accent">
              <HomeIcon />
            </span>
            <p>Total crédito</p>
            <strong>{formatCurrency(resumen.total_creditos)} Bs.</strong>
          </article>
        </section>
      </section>
    </main>
  )
}