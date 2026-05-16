import { useState } from 'react'
import { AuthScreen } from './features/auth'
import { DashboardScreen } from './features/dashboard'

type Screen = 'auth' | 'dashboard'

function App() {
  const [screen, setScreen] = useState<Screen>('auth')

  return (
    screen === 'auth' ? (
      <AuthScreen onSubmit={() => setScreen('dashboard')} />
    ) : (
      <DashboardScreen onLogout={() => setScreen('auth')} />
    )
  )
}

export default App
