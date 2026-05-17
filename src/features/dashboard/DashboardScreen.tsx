import { useEffect, useState, type CSSProperties } from 'react'
import { clearSession, fetchDashboardInitial, type DashboardResponse } from '../../lib/backendApi'
import './dashboard.css'

type DashboardScreenProps = {
  onLogout?: () => void
}

type StaticGradeMessage = {
  headline: string
  summary: string
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
  switch (nivelRiesgo.toUpperCase()) {
    case 'F':
    case 'CRITICO':
      return { color: '#b42318', label: 'Riesgo critico' }
    case 'E':
      return { color: '#d92d20', label: 'Riesgo muy alto' }
    case 'D':
    case 'ALTO':
      return { color: '#f97316', label: 'Riesgo alto' }
    case 'C':
    case 'MEDIO':
      return { color: '#f59e0b', label: 'Riesgo medio' }
    case 'B':
      return { color: '#d4a017', label: 'Riesgo controlado' }
    case 'A':
    case 'BAJO':
    default:
      return { color: '#00a67d', label: 'Riesgo bajo' }
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(value)
}

function getGradeMessage(grade: string): StaticGradeMessage {
  switch ((grade || '').toUpperCase()) {
    case 'A':
      return {
        headline: 'Tu perfil se mantiene estable y saludable.',
        summary: 'Tu calificacion A refleja buen comportamiento de pago. Mantener cuotas puntuales te ayuda a conservar condiciones favorables.',
      }
    case 'B':
      return {
        headline: 'Tu perfil sigue fuerte, con pequenas alertas a vigilar.',
        summary: 'Tienes un perfil solido, pero conviene evitar retrasos nuevos para volver a un nivel optimo y sostener tu historial.',
      }
    case 'C':
      return {
        headline: 'Tu perfil necesita seguimiento cercano.',
        summary: 'La calificacion C sugiere revisar fechas y montos proximos para reducir presion sobre tus cuotas y mejorar tu historial.',
      }
    case 'D':
      return {
        headline: 'Tu perfil muestra riesgo elevado en este momento.',
        summary: 'Conviene priorizar pagos pendientes y considerar una ampliacion de plazo si necesitas reorganizar tus cuotas cuanto antes.',
      }
    case 'E':
      return {
        headline: 'Tu perfil requiere acciones inmediatas de regularizacion.',
        summary: 'Hay senales importantes de atraso. Actuar ahora con pagos o reprogramacion puede ayudarte a contener un deterioro mayor.',
      }
    case 'F':
      return {
        headline: 'Tu perfil esta en nivel critico de seguimiento.',
        summary: 'La calificacion F indica alta urgencia. Te conviene regularizar cuotas pendientes y solicitar apoyo de reprogramacion lo antes posible.',
      }
    default:
      return {
        headline: 'Tu perfil crediticio esta siendo monitoreado.',
        summary: 'Revisa tus creditos activos y manten tus pagos al dia para conservar un historial estable.',
      }
  }
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

  const grade = dashboard?.cliente.calificacion ?? 'A'
  const risk = riskStyles(grade)
  const staticMessage = getGradeMessage(grade)

  if (isLoading) {
    return (
      <main className="dashboard">
        <section className="dashboard__shell">
          <header className="dashboard__header card-surface">
            <div>
              <p className="dashboard__eyebrow">Mercantil AlivIA</p>
              <h1>Cargando tu informacion...</h1>
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
              <p className="dashboard__eyebrow">Mercantil AlivIA</p>
              <h1>No se pudo cargar el dashboard</h1>
            </div>
            {onLogout && (
              <button className="dashboard__logout" type="button" onClick={onLogout}>
                Volver al login
              </button>
            )}
          </header>
          <section className="dashboard__banner card-surface">
            <p className="dashboard__banner-title">Estado</p>
            <p>{error ?? 'Intenta iniciar sesion nuevamente.'}</p>
          </section>
        </section>
      </main>
    )
  }

  const { cliente, score, resumen } = dashboard

  return (
    <main className="dashboard">
      <section className="dashboard__shell">
        <header className="dashboard__header card-surface">
          <div>
            <p className="dashboard__eyebrow">{cliente.ciudad ?? 'Mercantil AlivIA'}</p>
            <h1>Hola {cliente.nombre.split(' ')[0]}!</h1>
          </div>

          {onLogout && (
            <button className="dashboard__logout" type="button" onClick={onLogout}>
              Salir
            </button>
          )}
        </header>

        <section className="dashboard__main-grid">
          <section className="dashboard__hero card-surface">
            <div className="dashboard__score">
              <div
                className="dashboard__score-ring"
                style={{ '--risk-color': risk.color } as CSSProperties}
              >
                <span className="dashboard__score-letter">{cliente.calificacion}</span>
              </div>

              <div className="dashboard__score-copy">
                <p className="dashboard__label">Calificacion ASFI</p>
                <h2>{staticMessage.headline}</h2>
                <p>
                  Registra {score.numero_creditos} creditos y {resumen.pagos_con_retraso} pagos con retraso.
                  Esta lectura se muestra de forma estatica segun tu calificacion actual.
                </p>
                <div className="dashboard__score-chip">{risk.label}</div>
              </div>
            </div>
          </section>

          <aside className="dashboard__banner card-surface">
            <p className="dashboard__banner-title">Guia financiera</p>
            <p>{staticMessage.summary}</p>
          </aside>
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
            <p>Total credito</p>
            <strong>{formatCurrency(resumen.total_creditos)} Bs.</strong>
          </article>
        </section>
      </section>
    </main>
  )
}
