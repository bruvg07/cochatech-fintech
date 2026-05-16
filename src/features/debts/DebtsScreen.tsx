import './debts.css'

export interface Debt {
  id: string
  tipo: 'CONSUMO' | 'VIVIENDA' | 'MICROEMPRESA'
  saldoPendiente: number
  cuotaMensual: number
  diasMora: number
  estado: 'VIGENTE' | 'EN_MORA' | 'CANCELADO'
  proximaFecha: string
}

interface DebtsScreenProps {
  onDebtSelect?: (debt: Debt) => void
}

function DebtTypeIcon(type: string) {
  if (type === 'VIVIENDA') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 2 12h2v8h6v-6h4v6h6v-8h2L12 2zm0 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
      </svg>
    )
  }
  if (type === 'MICROEMPRESA') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm-2 15l-5-5 1.41-1.41L10 12.17l7.59-7.59L19 6l-9 9z" />
    </svg>
  )
}

export function DebtsScreen({ onDebtSelect }: DebtsScreenProps) {
  const staticDebts: Debt[] = [
    {
      id: '1',
      tipo: 'CONSUMO',
      saldoPendiente: 3500,
      cuotaMensual: 350,
      diasMora: 0,
      estado: 'VIGENTE',
      proximaFecha: '2025-06-15',
    },
    {
      id: '2',
      tipo: 'VIVIENDA',
      saldoPendiente: 4200,
      cuotaMensual: 500,
      diasMora: 5,
      estado: 'VIGENTE',
      proximaFecha: '2025-06-20',
    },
    {
      id: '3',
      tipo: 'MICROEMPRESA',
      saldoPendiente: 2300,
      cuotaMensual: 400,
      diasMora: 0,
      estado: 'VIGENTE',
      proximaFecha: '2025-06-10',
    },
  ]

  return (
    <main className="debts-screen">
      <header className="debts-header">
        <h1>Mis deudas</h1>
        <p className="debts-header__subtitle">Tus créditos activos y su estado</p>
      </header>

      <section className="debts-content">
        <div className="debts-summary card-surface">
          <div className="debts-summary__item">
            <span className="debts-summary__label">Total deuda</span>
            <strong className="debts-summary__value">9,000 Bs.</strong>
          </div>
          <div className="debts-summary__divider" />
          <div className="debts-summary__item">
            <span className="debts-summary__label">Próximo pago</span>
            <strong className="debts-summary__value">350 Bs.</strong>
          </div>
        </div>

        <div className="debts-list">
          {staticDebts.map((debt) => (
            <button
              key={debt.id}
              className={`debt-card card-surface debt-card--${debt.estado.toLowerCase()}`}
              onClick={() => onDebtSelect?.(debt)}
              type="button"
            >
              <div className="debt-card__header">
                <span className="debt-card__icon">{DebtTypeIcon(debt.tipo)}</span>
                <div className="debt-card__title-group">
                  <h3 className="debt-card__type">
                    {debt.tipo === 'CONSUMO'
                      ? 'Crédito de consumo'
                      : debt.tipo === 'VIVIENDA'
                        ? 'Crédito de vivienda'
                        : 'Crédito microempresa'}
                  </h3>
                  {debt.diasMora > 0 && (
                    <span className="debt-card__mora-badge">{debt.diasMora} días de mora</span>
                  )}
                </div>
                <span
                  className={`debt-card__status debt-card__status--${debt.estado.toLowerCase()}`}
                >
                  {debt.estado === 'VIGENTE' ? '✓' : debt.estado === 'EN_MORA' ? '!' : '✓'}
                </span>
              </div>

              <div className="debt-card__body">
                <div className="debt-card__row">
                  <span className="debt-card__label">Saldo pendiente</span>
                  <strong className="debt-card__amount">
                    {debt.saldoPendiente.toLocaleString('es-BO', {
                      style: 'currency',
                      currency: 'BOB',
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                </div>

                <div className="debt-card__row">
                  <span className="debt-card__label">Cuota mensual</span>
                  <strong>
                    {debt.cuotaMensual.toLocaleString('es-BO', {
                      style: 'currency',
                      currency: 'BOB',
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                </div>

                <div className="debt-card__row debt-card__row--highlight">
                  <span className="debt-card__label">Próximo pago</span>
                  <strong>
                    {new Intl.DateTimeFormat('es-BO', {
                      month: 'short',
                      day: 'numeric',
                    }).format(new Date(debt.proximaFecha))}
                  </strong>
                </div>
              </div>

              <div className="debt-card__footer">
                <span className="debt-card__cta">Ver detalles →</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
