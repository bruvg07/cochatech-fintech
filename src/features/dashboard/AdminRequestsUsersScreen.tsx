import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ADMIN_USERS, ADMIN_REQUESTS } from './adminRequestsUsersData'
import './admin-requests-users.css'

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

function UserScoreBadge({ score }: { score: (typeof ADMIN_USERS)[number]['score'] }) {
  return <span className={`admin-users__score admin-users__score--${score}`}>{score}</span>
}

export function AdminRequestsUsersScreen() {
  const [ciFilter, setCiFilter] = useState('')
  const navigate = useNavigate()

  const filteredUsers = useMemo(
    () => ADMIN_USERS.filter((user) => user.ci.includes(ciFilter.trim())),
    [ciFilter]
  )

  return (
    <main className="admin-users">
      <section className="admin-users__shell">
        <header className="admin-users__top card-surface">
          <div className="admin-users__brand-frame">
            <div className="admin-users__brand">
              <div className="admin-users__logo" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3 3.5 8v8.5L12 21l8.5-4.5V8L12 3Zm0 2.1 6.5 3.8v6.2L12 19.1 5.5 15.1V8.9L12 5.1Z" fill="#1a5336" />
                  <path d="M7.5 12h9v1.5h-9z" fill="#fff" />
                </svg>
              </div>
              <div>
                <p className="admin-users__eyebrow">BMSC</p>
                <h1>Análisis Crediticio</h1>
              </div>
            </div>
          </div>

          <div className="admin-users__top-meta">
            <span>Solicitudes y Usuarios</span>
            <span>Vista Web Administrador</span>
          </div>
        </header>

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
              {filteredUsers.map((user) => (
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
              <span>{ADMIN_REQUESTS.length} pendientes</span>
            </div>

            <div className="admin-users__requests-list">
              {ADMIN_REQUESTS.map((request) => (
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
  )
}

export default AdminRequestsUsersScreen