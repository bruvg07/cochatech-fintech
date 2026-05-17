import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearSession } from '../../lib/backendApi'
import './admin-layout.css'

type AdminLayoutProps = {
  children?: ReactNode
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.75 4.75h6.5v6.5h-6.5zM12.75 4.75h6.5v4.5h-6.5zM12.75 10.75h6.5v8.5h-6.5zM4.75 12.75h6.5v6.5h-6.5z" />
    </svg>
  )
}

function CreditsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2 0v10.5c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75V6.75a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75Z" />
      <path d="M8 8.25h8v1.5H8zM8 11.25h8v1.5H8zM8 14.25h5v1.5H8z" />
    </svg>
  )
}

const navigationItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/admin/requests-users', label: 'Creditos', icon: <CreditsIcon /> },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearSession()
    navigate('/auth', { replace: true, state: { role: 'admin' } })
  }

  return (
    <main className="admin-layout">
      <div className="admin-layout__container">
        <header className="admin-layout__header card-surface">
          <div className="admin-layout__brand">
            <div className="admin-layout__logo" aria-hidden="true">
              <span>MA</span>
            </div>
            <div>
              <p className="admin-layout__eyebrow">Mercantil AlivIA</p>
              <h1 className="admin-layout__title">Centro de administracion</h1>
            </div>
          </div>

          <nav className="admin-layout__nav" aria-label="Navegacion admin">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-layout__nav-link${isActive ? ' is-active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <button type="button" className="admin-layout__logout" onClick={handleLogout}>
            Salir
          </button>
        </header>

        <section className="admin-layout__content">{children}</section>
      </div>
    </main>
  )
}

export default AdminLayout
