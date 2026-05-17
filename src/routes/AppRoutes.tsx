import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { AuthScreen } from '../features/auth'
import { DashboardScreen, CreditAnalysisAdmin } from '../features/dashboard'
import { DebtsScreen } from '../features/debts'
import DebtDetail from '../features/debts/DebtDetail'
import PaymentScreen from '../features/debts/PaymentScreen'
import { RenegotiateScreen } from '../features/renegotiate/RenegotiateScreen'
import { BottomNav } from '../components/BottomNav'
import type { Debt, Payment } from '../features/debts'
import { useMemo } from 'react'

// Local static debts used for demo routes; in a real app this comes from API / store
const staticDebts: Debt[] = [
  {
    id: '1',
    tipo: 'CONSUMO',
    saldoPendiente: 3500,
    cuotaMensual: 350,
    diasMora: 0,
    estado: 'VIGENTE',
    proximaFecha: '2025-06-15',
  },
  {
    id: '2',
    tipo: 'VIVIENDA',
    saldoPendiente: 4200,
    cuotaMensual: 500,
    diasMora: 5,
    estado: 'VIGENTE',
    proximaFecha: '2025-06-20',
  },
  {
    id: '3',
    tipo: 'MICROEMPRESA',
    saldoPendiente: 2300,
    cuotaMensual: 400,
    diasMora: 0,
    estado: 'VIGENTE',
    proximaFecha: '2025-06-10',
  },
]

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
      <DashboardScreen />
      <BottomNav activeTab="home" onTabChange={(t) => navigate(t === 'home' ? '/dashboard' : t === 'debts' ? '/debts' : '/renegotiate')} />
    </>
  )
}

function DebtDetailRoute() {
  const location = useLocation()
  const stateDebt = (location.state as any)?.debt as Debt | undefined
  const debt = useMemo(() => stateDebt ?? staticDebts.find((d) => d.id === (location.pathname.split('/').pop() ?? '')), [location])
  const navigate = useNavigate()

  if (!debt) return <p>Deuda no encontrada</p>

  const handlePay = (p: Payment) => navigate(`/payment/${p.id}`, { state: { payment: p } })

  return <DebtDetail debt={debt} onBack={() => navigate(-1)} onPay={handlePay} />
}

function PaymentRoute() {
  const location = useLocation()
  const payment = (location.state as any)?.payment as Payment | undefined
  const navigate = useNavigate()

  if (!payment) return <p>Pago no encontrado</p>

  return <PaymentScreen payment={payment} onBack={() => navigate(-1)} onVerify={(id) => navigate(-1)} />
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
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}

export default AppRoutes

function AuthWrapper() {
  const navigate = useNavigate()
  return <AuthScreen onSubmit={() => navigate('/dashboard')} />
}
