import { useState } from 'react'
import './renegotiate.css'

type RenegotiateScreenProps = {
  onSubmit?: () => void
}

const debtOptions = ['Deuda 1', 'Deuda 2', 'Deuda 3']

const requestOptions = ['Reprogramación', 'Período de prórroga', 'Período de gracia']

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.25A9.75 9.75 0 0 0 4.07 17.74L3.25 21.5l3.86-.8A9.75 9.75 0 1 0 12 2.25Zm0 17.75c-1.2 0-2.39-.29-3.45-.83l-.25-.12-2.3.48.49-2.24-.13-.24A7.5 7.5 0 1 1 12 20Zm4.28-5.63c-.23-.12-1.35-.67-1.56-.75-.21-.08-.36-.12-.51.12s-.59.75-.72.9-.27.17-.5.06a6.03 6.03 0 0 1-1.77-1.09 6.61 6.61 0 0 1-1.23-1.53c-.13-.23-.01-.36.1-.48.1-.1.23-.27.34-.4.12-.13.16-.22.24-.36.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.36-.38-.5-.39h-.42c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.9s.81 2.21.92 2.36c.11.15 1.62 2.48 3.93 3.48.55.24.98.39 1.32.5.55.17 1.05.15 1.45.09.44-.07 1.35-.55 1.54-1.08.19-.53.19-.99.13-1.08-.06-.1-.21-.15-.45-.27Z" />
    </svg>
  )
}

export function RenegotiateScreen({ onSubmit }: RenegotiateScreenProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <main className="renegotiate-screen">
      <section className="renegotiate-shell card-surface">
        <header className="renegotiate-header">
          <p className="renegotiate-header__eyebrow">Escudo Financiero</p>
          <h1>Renegociar</h1>
          <p className="renegotiate-header__subtitle">
            Completa la solicitud para revisar una alternativa de pago.
          </p>
        </header>

        <form
          className="renegotiate-form"
          onSubmit={(event) => {
            event.preventDefault()
            setShowConfirmation(true)
            onSubmit?.()
          }}
        >
          <label className="renegotiate-field">
            <span className="renegotiate-field__label">Deuda</span>
            <select className="renegotiate-field__control" defaultValue={debtOptions[0]}>
              {debtOptions.map((debt) => (
                <option key={debt} value={debt}>
                  {debt}
                </option>
              ))}
            </select>
          </label>

          <label className="renegotiate-field">
            <span className="renegotiate-field__label">Solicitud de</span>
            <select className="renegotiate-field__control" defaultValue={requestOptions[0]}>
              {requestOptions.map((request) => (
                <option key={request} value={request}>
                  {request}
                </option>
              ))}
            </select>
          </label>

          <label className="renegotiate-field">
            <span className="renegotiate-field__label">Motivo</span>
            <textarea
              className="renegotiate-field__control renegotiate-field__control--textarea"
              placeholder="Describe brevemente el motivo de la solicitud"
              rows={4}
            />
          </label>

          <button className="renegotiate-submit" type="submit">
            Enviar
          </button>
        </form>
      </section>

      {showConfirmation && (
        <div className="renegotiate-modal__backdrop" role="presentation">
          <section
            className="renegotiate-modal card-surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby="renegotiate-modal-title"
            aria-describedby="renegotiate-modal-description"
          >
            <div className="renegotiate-modal__icon" aria-hidden="true">
              <WhatsAppIcon />
            </div>

            <div className="renegotiate-modal__content">
              <p className="renegotiate-modal__eyebrow">Solicitud enviada</p>
              <h2 id="renegotiate-modal-title">Nos pondremos en contacto contigo por WhatsApp</h2>
              <p id="renegotiate-modal-description">
                Recibimos tu solicitud de renegociación. Un asesor la revisará y te escribirá al
                número registrado para continuar con el proceso.
              </p>
            </div>

            <button
              className="renegotiate-modal__button"
              type="button"
              onClick={() => setShowConfirmation(false)}
            >
              Entendido
            </button>
          </section>
        </div>
      )}
    </main>
  )
}
