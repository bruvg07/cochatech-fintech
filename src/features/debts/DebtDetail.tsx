import './debt-detail.css'
import type { Debt } from './DebtsScreen'
import { useState } from 'react'

export type Payment = {
  id: string
  title: string
  amount: number
  dueDate: string
  debtId: string
  requiresJustification: boolean
}

type DebtDetailProps = {
  debt: Debt
  onBack: () => void
  onPay?: (payment: Payment) => void
}

function formatCurrency(value: number) {
  return value.toLocaleString('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 0,
  })
}

function addDays(dateValue: string, days: number) {
  const date = new Date(dateValue)
  date.setDate(date.getDate() + days)
  return date
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date)
}

function getDebtTitle(debt: Debt) {
  if (debt.tipo === 'VIVIENDA') {
    return 'Crédito de vivienda'
  }

  if (debt.tipo === 'MICROEMPRESA') {
    return 'Crédito microempresa'
  }

  return 'Crédito de consumo'
}

export function DebtDetail({ debt, onBack, onPay }: DebtDetailProps) {
  const [tab, setTab] = useState<'upcoming' | 'paid'>('upcoming')

  const upcomingPayments: Payment[] = debt.estado === 'CANCELADO'
    ? []
    : [0, 30].map((daysOffset, index) => ({
        id: `${debt.id}-cuota-${index + 1}`,
        title: index === 0 ? 'Cuota actual' : 'Próxima cuota'
        ,
        amount: debt.cuotaMensual,
        dueDate: formatDate(addDays(debt.proximaFecha, daysOffset)),
        debtId: debt.id,
        requiresJustification: debt.diasMora > 0,
      }))

  const paidPayments: Payment[] = [
    {
      id: `${debt.id}-cuota-anterior`,
      title: 'Cuota anterior',
      amount: debt.cuotaMensual,
      dueDate: formatDate(addDays(debt.proximaFecha, -30)),
      debtId: debt.id,
      requiresJustification: false,
    },
  ]

  const handlePay = (p: Payment) => {
    onPay?.(p)
  }

  return (
    <main className="debt-detail">
      <header className="debt-detail__header card-surface">
        <button className="debt-detail__back" onClick={onBack} aria-label="Volver">
          ←
        </button>
        <h1 className="debt-detail__title">{getDebtTitle(debt)}</h1>
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
            {upcomingPayments.length === 0 ? (
              <article className="installment-card card-surface">
                <div className="installment-card__head">
                  <h3>Crédito cancelado</h3>
                  <span className="installment-card__amount">{formatCurrency(0)}</span>
                </div>
                <div className="installment-card__row">
                  <span className="label">Estado</span>
                  <span>Sin cuotas pendientes</span>
                </div>
              </article>
            ) : upcomingPayments.map((payment) => (
              <article key={payment.id} className="installment-card card-surface">
                <div className="installment-card__head">
                  <h3>{payment.title}</h3>
                  <span className="installment-card__amount">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="installment-card__row">
                  <span className="label">Fecha límite</span>
                  <span>{payment.dueDate}</span>
                </div>
                <div className="installment-card__cta-row">
                  <button className="btn-pay" onClick={() => handlePay(payment)}>
                    Pagar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === 'paid' && (
          <div className="debt-detail__list">
            {paidPayments.map((payment) => (
              <article key={payment.id} className="installment-card card-surface">
                <div className="installment-card__head">
                  <h3>{payment.title}</h3>
                  <span className="installment-card__amount">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="installment-card__row">
                  <span className="label">Fecha</span>
                  <span>{payment.dueDate}</span>
                </div>
                <div className="installment-card__row">
                  <span className="label">Mora</span>
                  <span className="mora">{debt.diasMora > 0 ? `${debt.diasMora} días` : '0 días'}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default DebtDetail
