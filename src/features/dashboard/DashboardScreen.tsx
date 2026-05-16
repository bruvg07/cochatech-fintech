import './dashboard.css'

type DashboardScreenProps = {
  onLogout: () => void
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.25 3.5 10.5v9.75h6.25V14h4.5v6.25h6.25V10.5L12 3.25Z" />
    </svg>
  )
}

function DebtIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 4.75h12a1.25 1.25 0 0 1 1.25 1.25v12A1.25 1.25 0 0 1 18 19.25H6A1.25 1.25 0 0 1 4.75 18V6A1.25 1.25 0 0 1 6 4.75Zm0 1.5a.25.25 0 0 0-.25.25v12c0 .14.11.25.25.25h12a.25.25 0 0 0 .25-.25V6.5a.25.25 0 0 0-.25-.25H6Z" />
      <path d="M8 8.5h8v1.5H8zm0 3h8V13H8zm0 3h5v1.5H8z" />
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

export function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const riskColor = '#00d1b2'

  return (
    <main className="dashboard">
      <section className="dashboard__shell">
        <header className="dashboard__header card-surface">
          <div>
            <p className="dashboard__eyebrow">Escudo Financiero</p>
            <h1>Hola Sarah!</h1>
          </div>

          <button className="dashboard__logout" type="button" onClick={onLogout}>
            Salir
          </button>
        </header>

        <section className="dashboard__hero card-surface">
          <div className="dashboard__score">
            <div
              className="dashboard__score-ring"
              style={{ ['--risk-color' as '--risk-color']: riskColor }}
            >
              <span className="dashboard__score-letter">A</span>
            </div>

            <div className="dashboard__score-copy">
              <p className="dashboard__label">Calificación ASFI</p>
              <h2>Tu salud financiera se ve sólida</h2>
              <p>
                Mantienes un comportamiento crediticio saludable y el historial
                está bajo control.
              </p>
              <div className="dashboard__score-chip">Riesgo bajo</div>
            </div>
          </div>
        </section>

        <section className="dashboard__banner card-surface">
          <p className="dashboard__banner-title">IA financiera</p>
          <p>
            ¡Vas genial! Sigue así para mantener tu récord y conservar acceso a
            mejores condiciones.
          </p>
        </section>

        <section className="dashboard__metrics">
          <article className="dashboard__metric card-surface">
            <span className="dashboard__metric-icon dashboard__metric-icon--primary">
              <WalletIcon />
            </span>
            <p>Deuda actual</p>
            <strong>10 000 Bs.</strong>
          </article>

          <article className="dashboard__metric card-surface">
            <span className="dashboard__metric-icon dashboard__metric-icon--secondary">
              <TrendIcon />
            </span>
            <p>Deuda pagada</p>
            <strong>15 000 Bs.</strong>
          </article>

          <article className="dashboard__metric card-surface dashboard__metric--full">
            <span className="dashboard__metric-icon dashboard__metric-icon--accent">
              <HomeIcon />
            </span>
            <p>Total crédito</p>
            <strong>25 000 Bs.</strong>
          </article>
        </section>
      </section>

      <nav className="dashboard-nav" aria-label="Navegación inferior">
        <button className="dashboard-nav__item dashboard-nav__item--active" type="button">
          <DebtIcon />
          <span>Deuda</span>
          <small>Simulador / pagos</small>
        </button>

        <button className="dashboard-nav__home" type="button" aria-label="Inicio">
          <HomeIcon />
        </button>

        <button className="dashboard-nav__item" type="button">
          <TrendIcon />
          <span>Resumen</span>
          <small>Estado general</small>
        </button>
      </nav>
    </main>
  )
}