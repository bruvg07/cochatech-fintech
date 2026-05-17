import { useNavigate } from 'react-router-dom'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import './landing.css'

function LogoBMSC() {
  return (
    <svg viewBox="0 0 120 120" className="landing__logo" aria-hidden="true">
      <defs>
        <linearGradient id="landing-logo-fill" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#244d38" />
          <stop offset="100%" stopColor="#0f241a" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
      <circle cx="60" cy="60" r="46" fill="url(#landing-logo-fill)" />
      <path d="M60 27 82 37v18.5C82 71 72.5 85 60 91 47.5 85 38 71 38 55.5V37l22-10Z" fill="#f6f0df" opacity="0.95" />
      <path d="M48 60.5 56 68l16-18" fill="none" stroke="#1a5336" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="landing__install-icon" aria-hidden="true" focusable="false">
      <path d="M12 3.5a.75.75 0 0 1 .75.75v8.19l2.72-2.72 1.06 1.06L12 15.31l-4.53-4.53 1.06-1.06 2.72 2.72V4.25A.75.75 0 0 1 12 3.5Z" fill="currentColor" />
      <path d="M5 18.25h14v1.5H5z" fill="currentColor" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="landing__role-icon" aria-hidden="true" focusable="false">
      <path d="M12 3.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 9.75c4 0 7.25 2.61 7.25 5.83V20.5H4.75v-1.42c0-3.22 3.25-5.83 7.25-5.83Z" fill="currentColor" />
    </svg>
  )
}

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" className="landing__role-icon" aria-hidden="true" focusable="false">
      <path d="m12 2.5 7 3v5.13c0 4.41-3.06 8.47-7 10.37-3.94-1.9-7-5.96-7-10.37V5.5l7-3Z" fill="currentColor" />
      <path d="m9.35 12.44 1.2-1.12 1.49 1.6 2.92-3.15 1.2 1.12-4.12 4.43-2.69-2.88Z" fill="#f4f7f1" />
    </svg>
  )
}

function DeviceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="landing__mini-icon" aria-hidden="true" focusable="false">
      <path d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v12A2.25 2.25 0 0 1 17 20.25H7A2.25 2.25 0 0 1 4.75 18V6A2.25 2.25 0 0 1 7 3.75Zm0 1.5a.75.75 0 0 0-.75.75v12c0 .41.34.75.75.75h10a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H7Z" fill="currentColor" />
      <path d="M10 16.5h4v1.5h-4z" fill="currentColor" />
    </svg>
  )
}

const highlights = [
  'Instalable desde el navegador con experiencia tipo app.',
  'Flujo separado para cliente y administrador desde la portada.',
  'Acceso rapido a creditos, alertas y solicitudes importantes.',
]

export function LandingScreen() {
  const navigate = useNavigate()
  const { isInstallable, isInstalled, handleInstallClick } = useInstallPrompt()

  return (
    <main className="landing">
      <div className="landing__halo landing__halo--top" aria-hidden="true" />
      <div className="landing__halo landing__halo--bottom" aria-hidden="true" />

      <section className="landing__hero">
        <div className="landing__hero-copy">
          <span className="landing__eyebrow">PWA bancaria lista para instalar</span>
          <h1 className="landing__title">Escudo Financiero</h1>
          <p className="landing__subtitle">
            Una entrada clara para que cada perfil comience en la pantalla correcta y pueda instalar la app en segundos.
          </p>

          <div className="landing__cta-row">
            {isInstallable && !isInstalled ? (
              <button className="landing__install-button" type="button" onClick={handleInstallClick}>
                <DownloadIcon />
                Instalar aplicacion
              </button>
            ) : (
              <div className="landing__install-state">
                <DeviceIcon />
                <span>{isInstalled ? 'Aplicacion instalada en este dispositivo' : 'Abre esta pagina en Chrome o Edge para instalar'}</span>
              </div>
            )}

            <button className="landing__ghost-button" type="button" onClick={() => navigate('/auth', { state: { role: 'user' } })}>
              Entrar ahora
            </button>
          </div>

          <div className="landing__highlights">
            {highlights.map((item) => (
              <div key={item} className="landing__highlight">
                <span className="landing__highlight-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="landing__hero-card card-surface">
          <div className="landing__hero-brand">
            <LogoBMSC />
            <div>
              <p className="landing__panel-kicker">Experiencia principal</p>
              <h2>Instala y elige tu acceso</h2>
            </div>
          </div>

          <div className="landing__stats">
            <article className="landing__stat">
              <strong>PWA</strong>
              <span>Acceso desde inicio del telefono o escritorio</span>
            </article>
            <article className="landing__stat">
              <strong>2 perfiles</strong>
              <span>Usuario normal y administrador con rutas separadas</span>
            </article>
            <article className="landing__stat">
              <strong>Seguro</strong>
              <span>Sesion recordada y redireccion segun el rol</span>
            </article>
          </div>
        </div>
      </section>

      <section className="landing__roles">
        <button
          className="landing__role-button landing__role-button--user"
          type="button"
          onClick={() => navigate('/auth', { state: { role: 'user' } })}
        >
          <div className="landing__role-badge">
            <UserIcon />
          </div>
          <div className="landing__role-copy">
            <span className="landing__role-label">Usuario</span>
            <span className="landing__role-desc">Consulta tus creditos, pagos y ampliaciones desde una vista movil.</span>
          </div>
        </button>

        <button
          className="landing__role-button landing__role-button--admin"
          type="button"
          onClick={() => navigate('/auth', { state: { role: 'admin' } })}
        >
          <div className="landing__role-badge">
            <AdminIcon />
          </div>
          <div className="landing__role-copy">
            <span className="landing__role-label">Administrador</span>
            <span className="landing__role-desc">Entra al panel de analisis, revision de cartera y solicitudes pendientes.</span>
          </div>
        </button>
      </section>

      <footer className="landing__footer">
        <p>Banco Mercantil Santa Cruz | Escudo Financiero 2026</p>
      </footer>
    </main>
  )
}

export default LandingScreen
