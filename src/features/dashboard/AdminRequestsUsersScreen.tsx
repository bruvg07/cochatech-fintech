import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './admin-requests-users.css'
import { AdminLayout } from './AdminLayout'
import { fetchAdminRequestsUsers, type AdminRequestItem, type AdminUserCard } from '../../lib/backendApi'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
      <path d="m15.76 15.06 4.47 4.47-1.06 1.06-4.47-4.47 1.06-1.06Z" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3 1.75 20.5h20.5L12 3Zm0 4.2 5.7 9.8H6.3L12 7.2Z" />
      <path d="M11.25 10h1.5v5h-1.5zM11.25 16.5h1.5V18h-1.5z" />
    </svg>
  )
}

function UserScoreBadge({ score }: { score: AdminUserCard['score'] }) {
  return <span className={`admin-users__score admin-users__score--${score}`}>{score}</span>
}

export function AdminRequestsUsersScreen() {
  const [ciFilter, setCiFilter] = useState('')
  const [users, setUsers] = useState<AdminUserCard[]>([])
  const [requests, setRequests] = useState<AdminRequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true

    async function loadAdminData() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchAdminRequestsUsers(ciFilter.trim() || undefined)
        if (!alive) {
          return
        }

        setUsers(response.users)
        setRequests(response.requests)
      } catch (loadError) {
        if (!alive) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el panel de solicitudes.')
      } finally {
        if (alive) {
          setIsLoading(false)
        }
      }
    }

    const debounce = setTimeout(loadAdminData, 250)

    return () => {
      alive = false
      clearTimeout(debounce)
    }
  }, [ciFilter])

  const filteredUsers = useMemo(
    () => users.filter((user) => user.ci.includes(ciFilter.trim())),
    [users, ciFilter]
  )

  return (
    <AdminLayout>
      <main className="admin-users">
        <section className="admin-users__shell">
          <div className="admin-users__grid-layout">
          <section className="admin-users__left card-surface">
            <div className="admin-users__search">
              <label htmlFor="ci-search">CI:</label>
              <div className="admin-users__search-field">
                <SearchIcon />
                <input
                  id="ci-search"
                  value={ciFilter}
                  onChange={(event) => setCiFilter(event.target.value)}
                  placeholder="Buscar por carnet de identidad"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="admin-users__cards-grid" aria-label="Usuarios filtrados">
              {isLoading && <p>Cargando usuarios...</p>}
              {!isLoading && error && <p>{error}</p>}
              {!isLoading && !error && filteredUsers.map((user) => (
                <button
                  key={user.ci}
                  type="button"
                  className="admin-users__card"
                  onClick={() => navigate(`/admin/requests-users/${user.ci}`, { state: { user } })}
                >
                  <div>
                    <h2>{user.name}</h2>
                    <p>CI: {user.ci}</p>
                  </div>
                  <UserScoreBadge score={user.score} />
                </button>
              ))}
            </div>
          </section>

          <aside className="admin-users__right card-surface">
            <div className="admin-users__panel-head">
              <h2>Solicitudes</h2>
              <span>{requests.length} pendientes</span>
            </div>

            <div className="admin-users__requests-list">
              {isLoading && <p>Cargando solicitudes...</p>}
              {!isLoading && !error && requests.map((request) => (
                <article key={request.id} className="admin-users__request-card">
                  <div className="admin-users__request-icon" aria-hidden="true">
                    <AlertIcon />
                  </div>
                  <div className="admin-users__request-copy">
                    <h3>{request.title}</h3>
                    <p>Prioridad {request.priority}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
    </AdminLayout>
  )
}

export default AdminRequestsUsersScreen