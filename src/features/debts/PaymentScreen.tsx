import { useState } from 'react'
import { registerCreditPayment } from '../../lib/backendApi'
import './payment.css'
import type { Payment } from './DebtDetail'

type PaymentScreenProps = {
  payment: Payment
  onBack: () => void
  onVerify: () => void
}

const qrCells = [
  [0, 0], [1, 0], [2, 0], [4, 0], [6, 0], [7, 0], [8, 0], [10, 0], [12, 0], [13, 0], [14, 0], [16, 0], [18, 0], [19, 0], [20, 0],
  [0, 1], [2, 1], [4, 1], [5, 1], [6, 1], [8, 1], [10, 1], [11, 1], [14, 1], [16, 1], [18, 1], [20, 1],
  [0, 2], [1, 2], [2, 2], [4, 2], [8, 2], [10, 2], [12, 2], [14, 2], [16, 2], [18, 2], [19, 2], [20, 2],
  [4, 3], [5, 3], [7, 3], [9, 3], [10, 3], [12, 3], [15, 3], [17, 3],
  [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [6, 4], [8, 4], [10, 4], [11, 4], [12, 4], [14, 4], [16, 4], [17, 4], [18, 4], [19, 4], [20, 4],
  [0, 5], [4, 5], [6, 5], [7, 5], [8, 5], [10, 5], [14, 5], [16, 5], [20, 5],
  [0, 6], [2, 6], [4, 6], [6, 6], [10, 6], [12, 6], [14, 6], [16, 6], [18, 6], [20, 6],
  [0, 7], [2, 7], [4, 7], [5, 7], [6, 7], [8, 7], [9, 7], [10, 7], [12, 7], [14, 7], [16, 7], [18, 7], [20, 7],
  [0, 8], [2, 8], [3, 8], [6, 8], [8, 8], [12, 8], [13, 8], [14, 8], [16, 8], [18, 8], [20, 8],
  [2, 9], [4, 9], [5, 9], [6, 9], [8, 9], [10, 9], [11, 9], [13, 9], [15, 9], [16, 9], [18, 9],
  [0, 10], [1, 10], [2, 10], [4, 10], [6, 10], [8, 10], [10, 10], [12, 10], [14, 10], [16, 10], [18, 10], [19, 10], [20, 10],
  [0, 11], [4, 11], [5, 11], [6, 11], [8, 11], [9, 11], [10, 11], [12, 11], [14, 11], [15, 11], [16, 11], [20, 11],
  [0, 12], [2, 12], [3, 12], [4, 12], [6, 12], [8, 12], [10, 12], [12, 12], [13, 12], [16, 12], [18, 12], [20, 12],
  [0, 13], [6, 13], [7, 13], [8, 13], [10, 13], [11, 13], [14, 13], [16, 13], [18, 13], [20, 13],
  [0, 14], [1, 14], [2, 14], [4, 14], [5, 14], [6, 14], [8, 14], [10, 14], [12, 14], [14, 14], [16, 14], [17, 14], [18, 14], [20, 14],
  [4, 15], [8, 15], [10, 15], [12, 15], [13, 15], [16, 15], [18, 15],
  [0, 16], [1, 16], [2, 16], [4, 16], [6, 16], [7, 16], [8, 16], [10, 16], [11, 16], [12, 16], [14, 16], [16, 16], [18, 16], [19, 16], [20, 16],
  [0, 17], [2, 17], [4, 17], [8, 17], [10, 17], [14, 17], [16, 17], [20, 17],
  [0, 18], [1, 18], [2, 18], [4, 18], [6, 18], [8, 18], [10, 18], [12, 18], [14, 18], [16, 18], [18, 18], [19, 18], [20, 18],
  [0, 19], [4, 19], [6, 19], [7, 19], [8, 19], [10, 19], [11, 19], [14, 19], [16, 19], [20, 19],
  [0, 20], [1, 20], [2, 20], [4, 20], [8, 20], [10, 20], [12, 20], [14, 20], [16, 20], [18, 20], [19, 20], [20, 20],
]

function StaticQr() {
  const cell = 8
  const size = 21 * cell

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="QR de pago">
      <rect width={size} height={size} rx="18" fill="#ffffff" />
      {qrCells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} rx="1.2" fill="#163926" />
      ))}
    </svg>
  )
}

export function PaymentScreen({ payment, onBack, onVerify }: PaymentScreenProps) {
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [justification, setJustification] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
      <section className="payment-screen__shell">
        <header className="payment-screen__header card-surface">
          <button className="payment-screen__back" onClick={onBack} aria-label="Volver">←</button>
          <div>
            <p className="payment-screen__eyebrow">Mercantil AlivIA</p>
            <h1>Pago: {payment.title}</h1>
          </div>
        </header>

        <section className="payment-screen__body card-surface">
          <div className="payment-screen__content-grid">
            <div className="payment-screen__qr-block">
              <p className="payment-screen__instruction">Escanea este QR para pagar en tu banco o agente autorizado.</p>

              <div className="payment-screen__qr" aria-hidden="true">
                <StaticQr />
              </div>

              <p className="payment-screen__qr-note">QR estatico de demostracion para el flujo de pago.</p>
            </div>

            <div className="payment-screen__info-block">
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
            </div>
          </div>
        </section>
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
              <p className="payment-modal__eyebrow">Verificacion de pago</p>
              <h2 id="payment-modal-title">
                {payment.requiresJustification
                  ? 'Tu pago requiere una justificacion'
                  : 'Confirmar verificacion del pago'}
              </h2>
              <p id="payment-modal-description">
                {payment.requiresJustification
                  ? 'La deuda tiene mora, por lo que necesitamos una breve justificacion antes de continuar.'
                  : 'Confirma para registrar la verificacion del pago y continuar con el proceso.'}
              </p>
            </div>

            {payment.requiresJustification && (
              <label className="payment-modal__field">
                <span className="payment-modal__label">Justificacion</span>
                <textarea
                  className="payment-modal__input payment-modal__input--textarea"
                  placeholder="Escribe una breve justificacion"
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
