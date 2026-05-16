import './debt-detail.css'
import type { Debt } from './DebtsScreen'
import { useState } from 'react'

export type Payment = {
  id: string
  title: string
  amount: number
  dueDate: string
  debtId: string
}

type DebtDetailProps = {
  debt: Debt
  onBack: () => void
  onPay?: (payment: Payment) => void
}

export function DebtDetail({ debt, onBack, onPay }: DebtDetailProps) {
  const [tab, setTab] = useState<'upcoming' | 'paid'>('upcoming')

  const handlePay = (p: Payment) => {
    onPay?.(p)
  }

  return (
    <main className="debt-detail">
      <header className="debt-detail__header card-surface">
        <button className="debt-detail__back" onClick={onBack} aria-label="Volver">
          ←
        </button>
        <h1 className="debt-detail__title">Deuda 1</h1>
      </header>

      <div className="debt-detail__tabs card-surface">
        <button
          className={`debt-detail__tab ${tab === 'upcoming' ? 'is-active' : ''}`}
          onClick={() => setTab('upcoming')}
        >
          Próximas Cuotas
        </button>
        <button
          className={`debt-detail__tab ${tab === 'paid' ? 'is-active' : ''}`}
          onClick={() => setTab('paid')}
        >
          Pagos Realizados
        </button>
      </div>

      <section className="debt-detail__body">
        {tab === 'upcoming' && (
          <div className="debt-detail__list">
            <article className="installment-card card-surface">
              <div className="installment-card__head">
                <h3>2DO CUOTA</h3>
                <span className="installment-card__amount">2000 BS</span>
              </div>
              <div className="installment-card__row">
                <span className="label">Fecha límite</span>
                <span>03/06/26</span>
              </div>
              <div className="installment-card__cta-row">
                <button
                  className="btn-pay"
                  onClick={() =>
                    handlePay({
                      id: `${debt.id}-2`,
                      title: '2DO CUOTA',
                      amount: 2000,
                      dueDate: '03/06/26',
                      debtId: debt.id,
                    })
                  }
                >
                  Pagar
                </button>
              </div>
            </article>

            <article className="installment-card card-surface">
              <div className="installment-card__head">
                <h3>3ERA CUOTA</h3>
                <span className="installment-card__amount">2000 BS</span>
              </div>
              <div className="installment-card__row">
                <span className="label">Fecha límite</span>
                <span>03/07/26</span>
              </div>
              <div className="installment-card__cta-row">
                <button
                  className="btn-pay"
                  onClick={() =>
                    handlePay({
                      id: `${debt.id}-3`,
                      title: '3ERA CUOTA',
                      amount: 2000,
                      dueDate: '03/07/26',
                      debtId: debt.id,
                    })
                  }
                >
                  Pagar
                </button>
              </div>
            </article>
          </div>
        )}

        {tab === 'paid' && (
          <div className="debt-detail__list">
            <article className="installment-card card-surface">
              <div className="installment-card__head">
                <h3>1ERA CUOTA</h3>
                <span className="installment-card__amount">2000 BS</span>
              </div>
              <div className="installment-card__row">
                <span className="label">Fecha</span>
                <span>15/05/26</span>
              </div>
              <div className="installment-card__row">
                <span className="label">Mora</span>
                <span className="mora">12 días</span>
              </div>
            </article>
          </div>
        )}
      </section>
    </main>
  )
}

export default DebtDetail
