import './debt-detail.css'
import { useMemo, useState } from 'react'
import type { CreditDetailResponse, CreditDetailPayment } from '../../lib/backendApi'

export type Payment = {
  id: string
  title: string
  amount: number
  dueDate: string
  debtId: string
  requiresJustification: boolean
}

type DebtDetailProps = {
  detail: CreditDetailResponse
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

function formatDate(value?: string | null) {
  if (!value) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(new Date(value))
}

function getCreditTitle(tipoCredito: string) {
  const normalized = tipoCredito.toLowerCase()

  if (normalized.includes('vivi')) {
    return 'Crédito de vivienda'
  }

  if (normalized.includes('micro')) {
    return 'Crédito microempresa'
  }

  return 'Crédito de consumo'
}

function mapPayment(payment: CreditDetailPayment): Payment {
  return {
    id: payment.id,
    title: payment.title,
    amount: payment.amount,
    dueDate: payment.due_date,
    debtId: payment.debt_id,
    requiresJustification: payment.requires_justification,
  }
}

export function DebtDetail({ detail, onBack, onPay }: DebtDetailProps) {
  const [tab, setTab] = useState<'upcoming' | 'paid'>('upcoming')

  const credit = detail.credito
  const upcomingPayments = useMemo(() => detail.proximas_cuotas.map(mapPayment), [detail.proximas_cuotas])
  const paidPayments = useMemo(() => detail.pagos_realizados.map(mapPayment), [detail.pagos_realizados])
  const latestAlert = detail.alertas[0]

  return (
    <main className="debt-detail">
      <header className="debt-detail__header card-surface">
        <button className="debt-detail__back" onClick={onBack} aria-label="Volver">
          ←
        </button>
        <div>
          <p className="debt-detail__eyebrow">Detalle del crédito</p>
          <h1 className="debt-detail__title">{getCreditTitle(credit.tipo_credito)}</h1>
        </div>
      </header>

      <section className="debt-detail__summary card-surface">
        <div className="debt-detail__summary-item">
          <span className="debt-detail__summary-label">Saldo pendiente</span>
          <strong>{formatCurrency(detail.resumen.saldo_pendiente)}</strong>
        </div>
        <div className="debt-detail__summary-item">
          <span className="debt-detail__summary-label">Cuota mensual</span>
          <strong>{formatCurrency(credit.cuota_mensual)}</strong>
        </div>
        <div className="debt-detail__summary-item">
          <span className="debt-detail__summary-label">Vencimiento</span>
          <strong>{formatDate(credit.fecha_vencimiento)}</strong>
        </div>
        <div className="debt-detail__summary-item">
          <span className="debt-detail__summary-label">Estado</span>
          <strong>{credit.estado}</strong>
        </div>
      </section>

      <section className="debt-detail__banner card-surface">
        <p className="debt-detail__banner-eyebrow">Análisis del crédito</p>
        <h2>{detail.mensaje}</h2>
        <p>
          {detail.resumen.pagos_con_retraso > 0
            ? `Se detectaron ${detail.resumen.pagos_con_retraso} pagos con retraso en este crédito.`
            : 'No hay pagos con retraso en este crédito.'}
        </p>
      </section>

      {latestAlert && (
        <section className="debt-detail__alert card-surface">
          <p className="debt-detail__banner-eyebrow">Última alerta</p>
          <h3>{latestAlert.tipo ?? 'Alerta financiera'}</h3>
          <p>{latestAlert.mensaje}</p>
        </section>
      )}

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
                  <h3>Sin cuotas pendientes</h3>
                  <span className="installment-card__amount">{formatCurrency(0)}</span>
                </div>
                <div className="installment-card__row">
                  <span className="label">Estado</span>
                  <span>Este crédito no tiene pagos próximos disponibles.</span>
                </div>
              </article>
            ) : (
              upcomingPayments.map((payment) => (
                <article key={payment.id} className="installment-card card-surface">
                  <div className="installment-card__head">
                    <h3>{payment.title}</h3>
                    <span className="installment-card__amount">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="installment-card__row">
                    <span className="label">Fecha límite</span>
                    <span>{formatDate(payment.dueDate)}</span>
                  </div>
                  <div className="installment-card__cta-row">
                    <button className="btn-pay" onClick={() => onPay?.(payment)}>
                      Pagar
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {tab === 'paid' && (
          <div className="debt-detail__list">
            {paidPayments.length === 0 ? (
              <article className="installment-card card-surface">
                <div className="installment-card__head">
                  <h3>Sin pagos registrados</h3>
                  <span className="installment-card__amount">{formatCurrency(0)}</span>
                </div>
              </article>
            ) : (
              paidPayments.map((payment) => (
                <article key={payment.id} className="installment-card card-surface">
                  <div className="installment-card__head">
                    <h3>{payment.title}</h3>
                    <span className="installment-card__amount">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="installment-card__row">
                    <span className="label">Fecha de pago</span>
                    <span>{formatDate(payment.dueDate)}</span>
                  </div>
                  <div className="installment-card__row">
                    <span className="label">Estado</span>
                    <span className="mora">{payment.requiresJustification ? 'Con justificación' : 'Completado'}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default DebtDetail
