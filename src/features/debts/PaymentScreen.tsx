import { useState } from 'react'
import { registerCreditPayment } from '../../lib/backendApi'
import './payment.css'
import type { Payment } from './DebtDetail'

type PaymentScreenProps = {
  payment: Payment
  onBack: () => void
  onVerify: () => void
}

export function PaymentScreen({ payment, onBack, onVerify }: PaymentScreenProps) {
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [justification, setJustification] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const qrData = `pago:${payment.id};monto:${payment.amount};deuda:${payment.debtId}`

  const handleVerifyClick = () => {
    setShowVerifyModal(true)
  }

  const handleConfirmVerification = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await registerCreditPayment(payment.debtId, {
        amount: payment.amount,
        title: payment.title,
        due_date: payment.dueDate,
        requires_justification: payment.requiresJustification,
        justification: payment.requiresJustification ? justification.trim() : undefined,
      })

      onVerify()
      setShowVerifyModal(false)
      setJustification('')
    } catch (registerError) {
      setSubmitError(registerError instanceof Error ? registerError.message : 'No se pudo registrar el pago.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="payment-screen">
      <header className="payment-screen__header card-surface">
        <button className="payment-screen__back" onClick={onBack} aria-label="Volver">←</button>
        <h1>Pago: {payment.title}</h1>
      </header>

      <section className="payment-screen__body card-surface">
        <p className="payment-screen__instruction">Escanea este QR para pagar en tu banco o agente autorizado.</p>

        <div className="payment-screen__qr" data-qr={qrData} aria-hidden>
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
          <button className="btn-verify" type="button" onClick={handleVerifyClick}>
            Verificar pago
          </button>
        </div>

        {submitError && <p className="payment-screen__error">{submitError}</p>}
      </section>

      {showVerifyModal && (
        <div className="payment-modal__backdrop" role="presentation">
          <section
            className="payment-modal card-surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            aria-describedby="payment-modal-description"
          >
            <div className="payment-modal__header">
              <p className="payment-modal__eyebrow">Verificación de pago</p>
              <h2 id="payment-modal-title">
                {payment.requiresJustification
                  ? 'Tu pago requiere una justificación'
                  : 'Confirmar verificación del pago'}
              </h2>
              <p id="payment-modal-description">
                {payment.requiresJustification
                  ? 'La deuda tiene mora, por lo que necesitamos una breve justificación antes de continuar.'
                  : 'Confirma para registrar la verificación del pago y continuar con el proceso.'}
              </p>
            </div>

            {payment.requiresJustification && (
              <label className="payment-modal__field">
                <span className="payment-modal__label">Justificación</span>
                <textarea
                  className="payment-modal__input payment-modal__input--textarea"
                  placeholder="Escribe una breve justificación"
                  rows={4}
                  value={justification}
                  onChange={(event) => setJustification(event.target.value)}
                />
              </label>
            )}

            <div className="payment-modal__actions">
              <button className="payment-modal__button payment-modal__button--ghost" type="button" onClick={() => setShowVerifyModal(false)}>
                Cancelar
              </button>
              <button
                className="payment-modal__button payment-modal__button--primary"
                type="button"
                onClick={handleConfirmVerification}
                disabled={isSubmitting || (payment.requiresJustification && justification.trim().length === 0)}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default PaymentScreen
