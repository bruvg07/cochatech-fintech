import './BottomNav.css'

interface BottomNavProps {
  activeTab: 'home' | 'debts'
  onTabChange: (tab: 'home' | 'debts') => void
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10.5 19.5v-7.5h3v7.5h4.5v-9h2.25L12 3.75 2.25 10.5H4.5v9h6z" />
    </svg>
  )
}

function DebtIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M19.5 4.5h-15a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5zm0 13.5h-15V6h15v12zm-3-9h-9v1.5h9V9zm0 3h-9v1.5h9v-1.5zm0 3h-9v1.5h9v-1.5z" />
    </svg>
  )
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navigation">
      <button
        className={`bottom-nav__item ${activeTab === 'home' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTabChange('home')}
        aria-current={activeTab === 'home' ? 'page' : undefined}
      >
        <span className="bottom-nav__icon">
          <HomeIcon />
        </span>
        <span className="bottom-nav__label">Inicio</span>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'debts' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => onTabChange('debts')}
        aria-current={activeTab === 'debts' ? 'page' : undefined}
      >
        <span className="bottom-nav__icon">
          <DebtIcon />
        </span>
        <span className="bottom-nav__label">Mis deudas</span>
      </button>
    </nav>
  )
}
