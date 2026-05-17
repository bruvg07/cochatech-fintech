import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ADMIN_REQUESTS, getAdminRequestByCi, getAdminUserByCi } from './adminRequestsUsersData'
import './admin-user-detail.css'

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 4.5h15A2.25 2.25 0 0 1 21.75 6.75v7.5A2.25 2.25 0 0 1 19.5 16.5H10.8l-4.3 3.4v-3.4h-2A2.25 2.25 0 0 1 2.25 14.25v-7.5A2.25 2.25 0 0 1 4.5 4.5Z" />
    </svg>
  )
}

type RouteState = {
  user?: {
    name: string
    ci: string
    score: 'A' | 'B' | 'C' | 'D' | 'E'
  }
}

export function AdminUserDetailScreen() {
  const { ci } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const routeUser = (location.state as RouteState | null | undefined)?.user
  const user = useMemo(() => routeUser ?? getAdminUserByCi(ci), [routeUser, ci])
  const request = useMemo(() => getAdminRequestByCi(ci) ?? ADMIN_REQUESTS[0], [ci])

  if (!user) {
    return (
      <main className="admin-detail">
        <section className="admin-detail__shell card-surface">
          <h1>Usuario no encontrado</h1>
          <button type="button" className="admin-detail__back" onClick={() => navigate(-1)}>
            Volver
          </button>
        </section>
      </main>
    )
  }

  const tableRows = [
    { cuota: 'Cuota 1', calific: 'A', justificacion: '-' },
    { cuota: 'Cuota 2', calific: 'C', justificacion: 'Pago parcial' },
    { cuota: 'Cuota 3', calific: 'A', justificacion: '-' },
    { cuota: 'Cuota 4', calific: 'B', justificacion: 'Retraso leve' },
  ]

  return (
    <main className="admin-detail">
      <section className="admin-detail__shell">
        <header className="admin-detail__top card-surface">
          <div className="admin-detail__brand-frame">
            <div className="admin-detail__brand">
              <div className="admin-detail__logo" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3 3.5 8v8.5L12 21l8.5-4.5V8L12 3Zm0 2.1 6.5 3.8v6.2L12 19.1 5.5 15.1V8.9L12 5.1Z" fill="#1a5336" />
                  <path d="M7.5 12h9v1.5h-9z" fill="#fff" />
                </svg>
              </div>
              <div>
                <p className="admin-detail__eyebrow">BMSC</p>
                <h1>Detalle de Usuario y Solicitudes</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-detail__grid">
          <section className="admin-detail__left card-surface">
            <div className="admin-detail__identity">
              <p className="admin-detail__label">Información Personal</p>
              <h2>{user.name}</h2>
              <span>CI: {user.ci}</span>
            </div>

            <div className="admin-detail__table-block">
              <h3>CREDITO 1</h3>
              <table className="admin-detail__table">
                <thead>
                  <tr>
                    <th>Cuotas</th>
                    <th>Calific.</th>
                    <th>Justificación</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.cuota}>
                      <td>{row.cuota}</td>
                      <td>{row.calific}</td>
                      <td>{row.justificacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="admin-detail__right card-surface">
            <h2>Solicitudes:</h2>

            <article className="admin-detail__request-card">
              <div className="admin-detail__request-head">
                <span className="admin-detail__request-pill">Activa</span>
                <span className="admin-detail__request-title">{request.title}</span>
              </div>

              <div className="admin-detail__request-meta">
                <p><strong>Tipo de trámite:</strong> {request.type}</p>
                <p><strong>Origen:</strong> {request.origin}</p>
                <p><strong>Motivo del cliente:</strong> {request.reason}</p>
              </div>

              <button type="button" className="admin-detail__contact">
                <ChatIcon />
                Contactar
              </button>
            </article>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default AdminUserDetailScreen