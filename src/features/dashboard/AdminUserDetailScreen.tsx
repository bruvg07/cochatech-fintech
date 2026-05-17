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
      <main className="admin-detail">
        <section className="admin-detail__shell card-surface">
          <h1>Cargando usuario...</h1>
        </section>
      </main>
    )
  }

  if (error || !detail) {
    return (
      <main className="admin-detail">
        <section className="admin-detail__shell card-surface">
          <h1>No se pudo cargar el usuario</h1>
          <p>{error ?? 'Intenta nuevamente.'}</p>
          <button type="button" className="admin-detail__back" onClick={() => navigate(-1)}>
            Volver
          </button>
        </section>
      </main>
    )
  }

  const user = detail.user
  const request = detail.request
  const tableRows = detail.rows

  return (
    <AdminLayout>
      <main className="admin-detail">
        <section className="admin-detail__shell">
          <div className="admin-detail__grid">
            <section className="admin-detail__left card-surface">
            <div className="admin-detail__identity">
              <p className="admin-detail__label">Información Personal</p>
              <h2>{user.name}</h2>
              <span>CI: {user.ci}</span>
            </div>

            <div className="admin-detail__table-block">
              <h3>{detail.credit.name.toUpperCase()}</h3>
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
                <span className="admin-detail__request-pill">{request?.status ?? 'Sin estado'}</span>
                <span className="admin-detail__request-title">{request?.title ?? 'Sin solicitud activa'}</span>
              </div>

              <div className="admin-detail__request-meta">
                <p><strong>Tipo de trámite:</strong> {request?.type ?? 'Sin registro'}</p>
                <p><strong>Origen:</strong> {request?.origin ?? 'Sin registro'}</p>
                <p><strong>Motivo del cliente:</strong> {request?.reason ?? 'Sin registro'}</p>
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
    </AdminLayout>
  )
}

export default AdminUserDetailScreen