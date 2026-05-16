import { useState } from 'react'
import { AuthScreen } from './features/auth'
import { DashboardScreen } from './features/dashboard'
import { DebtsScreen, DebtDetail, PaymentScreen } from './features/debts'
import type { Debt, Payment } from './features/debts'
import { BottomNav } from './components/BottomNav'

type Screen = 'auth' | 'dashboard' | 'debts' | 'debtDetail' | 'payment'

function App() {
  const [screen, setScreen] = useState<Screen>('auth')
  const [activeTab, setActiveTab] = useState<'home' | 'debts'>('home')
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const handleTabChange = (tab: 'home' | 'debts') => {
    setActiveTab(tab)
    if (tab === 'home') setScreen('dashboard')
    else setScreen('debts')
  }

  const openDebt = (debt: Debt) => {
    setSelectedDebt(debt)
    setScreen('debtDetail')
  }

  const openPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setScreen('payment')
  }

  return (
    <>
      {screen === 'auth' && (
        <AuthScreen
          onSubmit={() => {
            setScreen('dashboard')
            setActiveTab('home')
          }}
        />
      )}

      {screen === 'dashboard' && (
        <>
          <DashboardScreen />
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}

      {screen === 'debts' && (
        <>
          <DebtsScreen onDebtSelect={openDebt} />
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}

      {screen === 'debtDetail' && selectedDebt && (
        <DebtDetail
          debt={selectedDebt}
          onBack={() => setScreen('debts')}
          onPay={(p) => openPayment(p)}
        />
      )}

      {screen === 'payment' && selectedPayment && (
        <PaymentScreen
          payment={selectedPayment}
          onBack={() => setScreen('debtDetail')}
          onVerify={(id) => {
            // Placeholder: here you'd call the backend to verify the payment
            console.log('Verifying payment', id)
            // For now, navigate back to debt detail after verification
            setScreen('debtDetail')
          }}
        />
      )}
    </>
  )
}

export default App
