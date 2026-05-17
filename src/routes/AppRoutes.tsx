import { Navigate, Route, Routes, useNavigate, useLocation, useParams } from 'react-router-dom'
import { AuthScreen } from '../features/auth'
import { DashboardScreen, CreditAnalysisAdmin, AdminRequestsUsersScreen, AdminUserDetailScreen } from '../features/dashboard'
import { DebtsScreen } from '../features/debts'
import DebtDetail from '../features/debts/DebtDetail'
import PaymentScreen from '../features/debts/PaymentScreen'
import { RenegotiateScreen } from '../features/renegotiate/RenegotiateScreen'
import { BottomNav } from '../components/BottomNav'
import type { Debt, Payment } from '../features/debts'
import { useEffect, useState } from 'react'
import { clearSession, fetchCreditDetail, getStoredSession, storeSession, type CreditDetailResponse, type LoginResponse } from '../lib/backendApi'

function DebtsRoute() {
  const navigate = useNavigate()
  const handleSelect = (debt: Debt) => {
    navigate(`/debt/${debt.id}`, { state: { debt } })
  }
  return (
    <>
      <DebtsScreen onDebtSelect={handleSelect} />
      <BottomNav activeTab="debts" onTabChange={(t) => navigate(t === 'home' ? '/dashboard' : t === 'debts' ? '/debts' : '/ampliaciones')} />
    </>
  )
}

function DashboardRoute() {
  const navigate = useNavigate()
  return (
    <>
      <DashboardScreen onLogout={() => { clearSession(); navigate('/auth') }} />
      <BottomNav activeTab="home" onTabChange={(t) => navigate(t === 'home' ? '/dashboard' : t === 'debts' ? '/debts' : '/ampliaciones')} />
    </>
  )
}

function DebtDetailRoute() {
  const creditId = useParams().id
  const navigate = useNavigate()
  const [detail, setDetail] = useState<CreditDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function loadCreditDetail() {
      if (!creditId) {
        setError('Crédito no encontrado.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchCreditDetail(creditId)
        if (alive) {
          setDetail(response)
        }
      } catch (loadError) {
        if (!alive) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el crédito.')
      } finally {
        if (alive) {
          setIsLoading(false)
        }
      }
    }

    loadCreditDetail()

    return () => {
      alive = false
    }
  }, [creditId])


  if (isLoading) {
    return (
      <main className="debt-detail">
        <section className="debt-detail__body">
          <article className="installment-card card-surface">
            <div className="installment-card__head">
              <h3>Cargando crédito...</h3>
            </div>
          </article>
        </section>
      </main>
    )
  }

  if (error || !detail) {
    return (
      <main className="debt-detail">
        <section className="debt-detail__body">
          <article className="installment-card card-surface">
            <div className="installment-card__head">
              <h3>No se pudo abrir el crédito</h3>
            </div>
            <div className="installment-card__row">
              <span className="label">Error</span>
              <span>{error ?? 'Intenta volver a la lista de créditos.'}</span>
            </div>
            <div className="installment-card__cta-row">
              <button className="btn-pay" type="button" onClick={() => navigate('/debts')}>
                Volver a créditos
              </button>
            </div>
          </article>
        </section>
      </main>
    )
  }

  const handlePay = (p: Payment) => navigate(`/payment/${p.id}`, { state: { payment: p } })

  const handleRequestExtension = () => navigate('/ampliaciones', { state: { creditId: detail.credito.id } })

  return <DebtDetail detail={detail} onBack={() => navigate('/debts')} onPay={handlePay} onRequestExtension={handleRequestExtension} />
}

function PaymentRoute() {
  const location = useLocation()
  const payment = (location.state as any)?.payment as Payment | undefined
  const navigate = useNavigate()

  if (!payment) return <Navigate to="/debts" replace />

  const handleBack = () => navigate(-1)
  const handleVerify = () => navigate(`/debt/${payment.debtId}`)

  return <PaymentScreen payment={payment} onBack={handleBack} onVerify={handleVerify} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route
        path="/auth"
        element={
          <AuthWrapper />
        }
      />
      <Route path="/dashboard" element={<DashboardRoute />} />
      <Route path="/debts" element={<DebtsRoute />} />
      <Route path="/debt/:id" element={<DebtDetailRoute />} />
      <Route path="/payment/:id" element={<PaymentRoute />} />
      <Route path="/ampliaciones" element={<RenegotiateScreen />} />
      <Route path="/ampliaciones/:id" element={<RenegotiateScreen />} />
      <Route path="/renegotiate" element={<Navigate to="/ampliaciones" replace />} />
      <Route path="/admin/dashboard" element={<CreditAnalysisAdmin />} />
      <Route path="/admin/requests-users" element={<AdminRequestsUsersScreen />} />
      <Route path="/admin/requests-users/:ci" element={<AdminUserDetailScreen />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default AppRoutes

function AuthWrapper() {
  const navigate = useNavigate()
  const session = getStoredSession()

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  const handleAuthenticated = (loginResponse: LoginResponse) => {
    storeSession({ token: loginResponse.token, cliente: loginResponse.cliente })
    navigate('/dashboard')
  }

  return <AuthScreen onAuthenticated={handleAuthenticated} />
}
