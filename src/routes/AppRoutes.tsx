import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { AuthScreen } from '../features/auth'
import { DashboardScreen, CreditAnalysisAdmin, AdminRequestsUsersScreen, AdminUserDetailScreen } from '../features/dashboard'
import { DebtsScreen } from '../features/debts'
import DebtDetail from '../features/debts/DebtDetail'
import PaymentScreen from '../features/debts/PaymentScreen'
import { RenegotiateScreen } from '../features/renegotiate/RenegotiateScreen'
import { BottomNav } from '../components/BottomNav'
import type { Debt, Payment } from '../features/debts'
import { useMemo } from 'react'
import { clearSession, getStoredSession, storeSession, type LoginResponse } from '../lib/backendApi'

function DebtsRoute() {
  const navigate = useNavigate()
  const handleSelect = (debt: Debt) => {
    navigate(`/debt/${debt.id}`, { state: { debt } })
  }
  return (
    <>
      <DebtsScreen onDebtSelect={handleSelect} />
      <BottomNav activeTab="debts" onTabChange={(t) => navigate(t === 'home' ? '/dashboard' : t === 'debts' ? '/debts' : '/renegotiate')} />
    </>
  )
}

function DashboardRoute() {
  const navigate = useNavigate()
  return (
    <>
      <DashboardScreen onLogout={() => { clearSession(); navigate('/auth') }} />
      <BottomNav activeTab="home" onTabChange={(t) => navigate(t === 'home' ? '/dashboard' : t === 'debts' ? '/debts' : '/renegotiate')} />
    </>
  )
}

function DebtDetailRoute() {
  const location = useLocation()
  const stateDebt = (location.state as any)?.debt as Debt | undefined
  const navigate = useNavigate()

  const debt = useMemo(() => stateDebt, [stateDebt])

  if (!debt) return <Navigate to="/debts" replace />

  const handlePay = (p: Payment) => navigate(`/payment/${p.id}`, { state: { payment: p } })

  return <DebtDetail debt={debt} onBack={() => navigate(-1)} onPay={handlePay} />
}

function PaymentRoute() {
  const location = useLocation()
  const payment = (location.state as any)?.payment as Payment | undefined
  const navigate = useNavigate()

  if (!payment) return <Navigate to="/debts" replace />

  const handleBack = () => navigate(-1)
  const handleVerify = () => navigate(-1)

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
      <Route path="/renegotiate" element={<>
        <RenegotiateScreen />
      </>} />
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
