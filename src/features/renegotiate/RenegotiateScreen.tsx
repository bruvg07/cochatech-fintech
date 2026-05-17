import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { fetchDashboardInitial, requestCreditExtension, type DashboardCredit } from '../../lib/backendApi'
import './renegotiate.css'

type RenegotiateScreenProps = {
  onSubmit?: () => void
}

function formatCurrency(value: number) {
  return value.toLocaleString('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 0,
  })
}

function getCreditLabel(credit: DashboardCredit) {
  const normalized = credit.tipo_credito.toLowerCase()

  if (normalized.includes('vivi')) {
    return 'Crédito de vivienda'
  }

  if (normalized.includes('micro')) {
    return 'Crédito microempresa'
  }

  return 'Crédito de consumo'
}

function estimateExtensionQuota(credit: DashboardCredit, newPlazo: number) {
  if (newPlazo <= 0) {
    return 0
  }

  const ratio = credit.plazo_meses / newPlazo
  return Math.round(credit.cuota_mensual * ratio)
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.25A9.75 9.75 0 0 0 4.07 17.74L3.25 21.5l3.86-.8A9.75 9.75 0 1 0 12 2.25Zm0 17.75c-1.2 0-2.39-.29-3.45-.83l-.25-.12-2.3.48.49-2.24-.13-.24A7.5 7.5 0 1 1 12 20Zm4.28-5.63c-.23-.12-1.35-.67-1.56-.75-.21-.08-.36-.12-.51.12s-.59.75-.72.9-.27.17-.5.06a6.03 6.03 0 0 1-1.77-1.09 6.61 6.61 0 0 1-1.23-1.53c-.13-.23-.01-.36.1-.48.1-.1.23-.27.34-.4.12-.13.16-.22.24-.36.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.36-.38-.5-.39h-.42c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.9s.81 2.21.92 2.36c.11.15 1.62 2.48 3.93 3.48.55.24.98.39 1.32.5.55.17 1.05.15 1.45.09.44-.07 1.35-.55 1.54-1.08.19-.53.19-.99.13-1.08-.06-.1-.21-.15-.45-.27Z" />
    </svg>
  )
}

export function RenegotiateScreen({ onSubmit }: RenegotiateScreenProps) {
  const location = useLocation()
  const { id: routeCreditId } = useParams()
  const [credits, setCredits] = useState<DashboardCredit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCreditId, setSelectedCreditId] = useState('')
  const [newPlazo, setNewPlazo] = useState(36)
  const [motivo, setMotivo] = useState('')
  const [requestType, setRequestType] = useState('AMPLIACION_DE_PLAZO')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function loadCredits() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchDashboardInitial()
        if (!alive) {
          return
        }

        const activeCredits = response.creditos.filter((credit) => credit.estado.toUpperCase() !== 'CANCELADO')
        setCredits(activeCredits)
  const requestedCreditId = (location.state as { creditId?: string } | null)?.creditId ?? routeCreditId ?? ''
  setSelectedCreditId((current) => current || requestedCreditId || activeCredits[0]?.id || '')
      } catch (loadError) {
        if (!alive) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la información de créditos.')
      } finally {
        if (alive) {
          setIsLoading(false)
        }
      }
    }

    loadCredits()

    return () => {
      alive = false
    }
  }, [location.state, routeCreditId])

  const selectedCredit = useMemo(() => credits.find((credit) => credit.id === selectedCreditId) ?? null, [credits, selectedCreditId])
  const estimatedQuota = selectedCredit ? estimateExtensionQuota(selectedCredit, newPlazo) : 0
  const extraMonths = selectedCredit ? Math.max(newPlazo - selectedCredit.plazo_meses, 0) : 0

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedCredit) {
      setSubmitError('Selecciona un crédito para continuar.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const typeLabel = requestType === 'AMPLIACION_DE_PLAZO'
        ? 'Ampliación de plazo'
        : requestType === 'PERIODO_PRORROGA'
          ? 'Período de prórroga'
          : 'Período de gracia'

      const composedMotivo = `${typeLabel} - ${motivo.trim()}`

      await requestCreditExtension(selectedCredit.id, {
        new_plazo_meses: newPlazo,
        motivo: composedMotivo,
      })

      setShowConfirmation(true)
      onSubmit?.()
    } catch (requestError) {
      setSubmitError(requestError instanceof Error ? requestError.message : 'No se pudo registrar la solicitud.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="renegotiate-screen">
        <section className="renegotiate-shell card-surface">
          <header className="renegotiate-header">
            <p className="renegotiate-header__eyebrow">Mercantil AlivIA</p>
            <h1>Ampliación de plazo</h1>
            <p className="renegotiate-header__subtitle">Cargando tus créditos...</p>
          </header>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="renegotiate-screen">
        <section className="renegotiate-shell card-surface">
          <header className="renegotiate-header">
            <p className="renegotiate-header__eyebrow">Mercantil AlivIA</p>
            <h1>Ampliación de plazo</h1>
            <p className="renegotiate-header__subtitle">No pudimos cargar la información.</p>
          </header>

          <div className="renegotiate-error">
            {error}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="renegotiate-screen">
      <section className="renegotiate-shell card-surface">
        <header className="renegotiate-header">
          <p className="renegotiate-header__eyebrow">Mercantil AlivIA</p>
          <h1>Ampliación de plazo</h1>
          <p className="renegotiate-header__subtitle">
            Solicita más meses para tu crédito y revisa el nuevo valor estimado de la cuota.
          </p>
        </header>

        <form
          className="renegotiate-form"
          onSubmit={handleSubmit}
        >
          <label className="renegotiate-field">
            <span className="renegotiate-field__label">Crédito</span>
            <select
              className="renegotiate-field__control"
              value={selectedCreditId}
              onChange={(event) => setSelectedCreditId(event.target.value)}
            >
              {credits.map((credit) => (
                <option key={credit.id} value={credit.id}>
                  {getCreditLabel(credit)} · {formatCurrency(credit.saldo_pendiente)}
                </option>
              ))}
            </select>
          </label>

          <label className="renegotiate-field">
            <span className="renegotiate-field__label">Nuevo plazo (meses)</span>
            <input
              className="renegotiate-field__control"
              type="number"
              min={1}
              max={360}
              value={newPlazo}
              onChange={(event) => setNewPlazo(Number(event.target.value))}
              aria-label="Nuevo plazo en meses"
            />
            <p className="renegotiate-field__hint">Introduce el número total de meses deseado; el sistema calculará la cuota estimada automáticamente.</p>
          </label>

          <label className="renegotiate-field">
            <span className="renegotiate-field__label">Solicitud de</span>
            <select
              className="renegotiate-field__control"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              aria-label="Tipo de solicitud"
            >
              <option value="AMPLIACION_DE_PLAZO">Ampliación de plazo</option>
              <option value="PERIODO_PRORROGA">Período de prórroga</option>
              <option value="PERIODO_GRACIA">Período de gracia</option>
            </select>
            <p className="renegotiate-field__hint">Selecciona el tipo de solicitud; se incluirá junto al motivo.</p>
          </label>

          <label className="renegotiate-field">
            <span className="renegotiate-field__label">Motivo</span>
            <textarea
              className="renegotiate-field__control renegotiate-field__control--textarea"
              placeholder="Describe brevemente el motivo de la solicitud"
              rows={4}
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
            />
          </label>

          {selectedCredit && (
            <section className="renegotiate-preview card-surface">
              <div className="renegotiate-preview__item">
                <span className="renegotiate-preview__label">Cuota actual</span>
                <strong>{formatCurrency(selectedCredit.cuota_mensual)}</strong>
              </div>
              <div className="renegotiate-preview__item">
                <span className="renegotiate-preview__label">Cuota estimada</span>
                <strong>{formatCurrency(estimatedQuota)}</strong>
              </div>
              <div className="renegotiate-preview__item">
                <span className="renegotiate-preview__label">Meses adicionales</span>
                <strong>{extraMonths}</strong>
              </div>
            </section>
          )}

          {submitError && <p className="renegotiate-error">{submitError}</p>}

          <button className="renegotiate-submit" type="submit" disabled={isSubmitting || !selectedCreditId}>
            {isSubmitting ? 'Enviando...' : 'Solicitar ampliación'}
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
              <h2 id="renegotiate-modal-title">Tu ampliación de plazo quedó registrada</h2>
              <p id="renegotiate-modal-description">
                Un asesor revisará la solicitud y te contactará por WhatsApp para continuar con el proceso.
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
