import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './admin-user-detail.css'
import { AdminLayout } from './AdminLayout'
import { fetchAdminUserDetail, type AdminUserDetailResponse } from '../../lib/backendApi'

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 4.5h15A2.25 2.25 0 0 1 21.75 6.75v7.5A2.25 2.25 0 0 1 19.5 16.5H10.8l-4.3 3.4v-3.4h-2A2.25 2.25 0 0 1 2.25 14.25v-7.5A2.25 2.25 0 0 1 4.5 4.5Z" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m10.53 6.47-4.75 4.75 4.75 4.75 1.06-1.06-2.94-2.94H19v-1.5H8.65l2.94-2.94-1.06-1.06Z" />
    </svg>
  )
}

export function AdminUserDetailScreen() {
  const { ci } = useParams()
  const navigate = useNavigate()

  const [detail, setDetail] = useState<AdminUserDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function loadUserDetail() {
      if (!ci) {
        setError('Usuario no encontrado.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchAdminUserDetail(ci)
        if (!alive) {
          return
        }

        setDetail(response)
      } catch (loadError) {
        if (!alive) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el detalle del usuario.')
      } finally {
        if (alive) {
          setIsLoading(false)
        }
      }
    }

    loadUserDetail()

    return () => {
      alive = false
    }
  }, [ci])

  if (isLoading) {
    return (
      <AdminLayout>
        <main className="admin-detail">
          <section className="admin-detail__shell card-surface">
            <h2>Cargando usuario...</h2>
          </section>
        </main>
      </AdminLayout>
    )
  }

  if (error || !detail) {
    return (
      <AdminLayout>
        <main className="admin-detail">
          <section className="admin-detail__shell card-surface">
            <h2>No se pudo cargar el usuario</h2>
            <p>{error ?? 'Intenta nuevamente.'}</p>
            <button type="button" className="admin-detail__back" onClick={() => navigate('/admin/requests-users')}>
              Volver a creditos
            </button>
          </section>
        </main>
      </AdminLayout>
    )
  }

  const user = detail.user
  const request = detail.request
  const tableRows = detail.rows

  return (
    <AdminLayout>
      <main className="admin-detail">
        <section className="admin-detail__shell">
          <header className="admin-detail__hero card-surface">
            <div className="admin-detail__hero-copy">
              <button type="button" className="admin-detail__back admin-detail__back--ghost" onClick={() => navigate('/admin/requests-users')}>
                <BackIcon />
                Volver a creditos
              </button>
              <p className="admin-detail__eyebrow">Mercantil AlivIA</p>
              <h2>{user.name}</h2>
              <p>CI {user.ci} | Vista consolidada de credito, calificacion y solicitud activa.</p>
            </div>

            <div className="admin-detail__hero-score">
              <span>Calificacion</span>
              <strong>{user.score}</strong>
            </div>
          </header>

          <div className="admin-detail__grid">
            <section className="admin-detail__left card-surface">
              <div className="admin-detail__section-head">
                <div>
                  <p className="admin-detail__label">Credito observado</p>
                  <h3>{detail.credit.name}</h3>
                </div>
              </div>

              <div className="admin-detail__table-wrap">
                <table className="admin-detail__table">
                  <thead>
                    <tr>
                      <th>Cuota</th>
                      <th>Calific.</th>
                      <th>Justificacion</th>
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

            <aside className="admin-detail__right">
              <section className="admin-detail__card card-surface">
                <h3>Solicitud actual</h3>

                <article className="admin-detail__request-card">
                  <div className="admin-detail__request-head">
                    <span className="admin-detail__request-pill">{request?.status ?? 'Sin estado'}</span>
                    <span className="admin-detail__request-title">{request?.title ?? 'Sin solicitud activa'}</span>
                  </div>

                  <div className="admin-detail__request-meta">
                    <p><strong>Tipo de tramite:</strong> {request?.type ?? 'Sin registro'}</p>
                    <p><strong>Origen:</strong> {request?.origin ?? 'Sin registro'}</p>
                    <p><strong>Motivo del cliente:</strong> {request?.reason ?? 'Sin registro'}</p>
                  </div>

                  <button type="button" className="admin-detail__contact">
                    <ChatIcon />
                    Contactar
                  </button>
                </article>
              </section>

              <section className="admin-detail__card card-surface">
                <h3>Acciones rapidas</h3>
                <div className="admin-detail__quick-actions">
                  <button type="button" className="admin-detail__quick-button" onClick={() => navigate('/admin/requests-users')}>
                    Volver a lista de creditos
                  </button>
                  <button type="button" className="admin-detail__quick-button admin-detail__quick-button--secondary" onClick={() => navigate('/admin/dashboard')}>
                    Ir al dashboard admin
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </AdminLayout>
  )
}

export default AdminUserDetailScreen
