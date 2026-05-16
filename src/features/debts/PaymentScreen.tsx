import './payment.css'
import type { Payment } from './DebtDetail'

type PaymentScreenProps = {
  payment: Payment
  onBack: () => void
  onVerify: (id: string) => void
}

export function PaymentScreen({ payment, onBack, onVerify }: PaymentScreenProps) {
  // Placeholder QR data
  const qrData = `pago:${payment.id};monto:${payment.amount};deuda:${payment.debtId}`

  return (
    <main className="payment-screen">
      <header className="payment-screen__header card-surface">
        <button className="payment-screen__back" onClick={onBack} aria-label="Volver">←</button>
        <h1>Pago: {payment.title}</h1>
      </header>

      <section className="payment-screen__body card-surface">
        <p className="payment-screen__instruction">Escanea este QR para pagar en tu banco o agente autorizado.</p>

        <div className="payment-screen__qr" aria-hidden>
          {/* Simple SVG placeholder for QR */}
          <svg width="180" height="180" viewBox="0 0 180 180">
            <rect width="180" height="180" fill="#ffffff" rx="8" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#1a5336" fontSize="10">QR</text>
          </svg>
        </div>

        <div className="payment-screen__summary">
          <div>
            <span className="label">Concepto</span>
            <div className="value">{payment.title}</div>
          </div>
          <div>
            <span className="label">Monto</span>
            <div className="value">{payment.amount} BS</div>
          </div>
        </div>

        <div className="payment-screen__actions">
          <button className="btn-verify" onClick={() => onVerify(payment.id)}>Verificar pago</button>
        </div>
      </section>
    </main>
  )
}

export default PaymentScreen
