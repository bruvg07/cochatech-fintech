import { useEffect, useState, type ReactElement } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AuthScreen, LandingScreen } from '../features/auth'
import { AdminRequestsUsersScreen, AdminUserDetailScreen, CreditAnalysisAdmin, DashboardScreen } from '../features/dashboard'
import { BottomNav } from '../components/BottomNav'
import DebtDetail from '../features/debts/DebtDetail'
import { DebtsScreen } from '../features/debts'
import PaymentScreen from '../features/debts/PaymentScreen'
import type { Debt, Payment } from '../features/debts'
import { RenegotiateScreen } from '../features/renegotiate/RenegotiateScreen'
import {
  clearSession,
  fetchCreditDetail,
  getStoredSession,
  storeSession,
  type CreditDetailResponse,
  type LoginResponse,
  type StoredSession,
} from '../lib/backendApi'

function getHomeRoute(session: StoredSession | null) {
  if (!session) {
    return '/'
  }

  return session.role === 'admin' ? '/admin/dashboard' : '/dashboard'
}

function DebtsRoute() {
  const navigate = useNavigate()

  const handleSelect = (debt: Debt) => {
    navigate(`/debt/${debt.id}`, { state: { debt } })
  }

  return (
    <>
      <DebtsScreen onDebtSelect={handleSelect} />
      <BottomNav activeTab="debts" onTabChange={(tab) => navigate(tab === 'home' ? '/dashboard' : tab === 'debts' ? '/debts' : '/ampliaciones')} />
    </>
  )
}

function DashboardRoute() {
  const navigate = useNavigate()

  return (
    <>
      <DashboardScreen onLogout={() => { clearSession(); navigate('/auth') }} />
      <BottomNav activeTab="home" onTabChange={(tab) => navigate(tab === 'home' ? '/dashboard' : tab === 'debts' ? '/debts' : '/ampliaciones')} />
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
        setError('Credito no encontrado.')
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

        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el credito.')
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
              <h3>Cargando credito...</h3>
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
              <h3>No se pudo abrir el credito</h3>
            </div>
            <div className="installment-card__row">
              <span className="label">Error</span>
              <span>{error ?? 'Intenta volver a la lista de creditos.'}</span>
            </div>
            <div className="installment-card__cta-row">
              <button className="btn-pay" type="button" onClick={() => navigate('/debts')}>
                Volver a creditos
              </button>
            </div>
          </article>
        </section>
      </main>
    )
  }

  const handlePay = (payment: Payment) => navigate(`/payment/${payment.id}`, { state: { payment } })
  const handleRequestExtension = () => navigate('/ampliaciones', { state: { creditId: detail.credito.id } })

  return <DebtDetail detail={detail} onBack={() => navigate('/debts')} onPay={handlePay} onRequestExtension={handleRequestExtension} />
}

function PaymentRoute() {
  const location = useLocation()
  const payment = (location.state as { payment?: Payment } | null)?.payment
  const navigate = useNavigate()

  if (!payment) {
    return <Navigate to="/debts" replace />
  }

  return <PaymentScreen payment={payment} onBack={() => navigate(-1)} onVerify={() => navigate(`/debt/${payment.debtId}`)} />
}

function RoleProtectedRoute({ allowedRole, children }: { allowedRole: 'user' | 'admin'; children: ReactElement }) {
  const session = getStoredSession()

  if (!session) {
    return <Navigate to="/auth" replace />
  }

  if (session.role !== allowedRole) {
    return <Navigate to={getHomeRoute(session)} replace />
  }

  return children
}

function AuthWrapper() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = getStoredSession()
  const role = ((location.state as { role?: 'user' | 'admin' } | null)?.role ?? 'user')

  if (session) {
    return <Navigate to={getHomeRoute(session)} replace />
  }

  const handleAuthenticated = (loginResponse: LoginResponse, selectedRole: 'user' | 'admin') => {
    storeSession({ token: loginResponse.token, cliente: loginResponse.cliente, role: selectedRole })
    navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true })
  }

  return <AuthScreen role={role} onAuthenticated={handleAuthenticated} />
}

function RootRedirect() {
  const session = getStoredSession()
  return session ? <Navigate to={getHomeRoute(session)} replace /> : <LandingScreen />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/auth" element={<AuthWrapper />} />

      <Route path="/dashboard" element={<RoleProtectedRoute allowedRole="user"><DashboardRoute /></RoleProtectedRoute>} />
      <Route path="/debts" element={<RoleProtectedRoute allowedRole="user"><DebtsRoute /></RoleProtectedRoute>} />
      <Route path="/debt/:id" element={<RoleProtectedRoute allowedRole="user"><DebtDetailRoute /></RoleProtectedRoute>} />
      <Route path="/payment/:id" element={<RoleProtectedRoute allowedRole="user"><PaymentRoute /></RoleProtectedRoute>} />
      <Route path="/ampliaciones" element={<RoleProtectedRoute allowedRole="user"><RenegotiateScreen /></RoleProtectedRoute>} />
      <Route path="/ampliaciones/:id" element={<RoleProtectedRoute allowedRole="user"><RenegotiateScreen /></RoleProtectedRoute>} />
      <Route path="/renegotiate" element={<Navigate to="/ampliaciones" replace />} />

      <Route path="/admin/dashboard" element={<RoleProtectedRoute allowedRole="admin"><CreditAnalysisAdmin /></RoleProtectedRoute>} />
      <Route path="/admin/requests-users" element={<RoleProtectedRoute allowedRole="admin"><AdminRequestsUsersScreen /></RoleProtectedRoute>} />
      <Route path="/admin/requests-users/:ci" element={<RoleProtectedRoute allowedRole="admin"><AdminUserDetailScreen /></RoleProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
