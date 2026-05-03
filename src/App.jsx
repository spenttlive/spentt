import { useState } from 'react'
import { useExpenses } from './hooks/useExpenses'
import { usePWA } from './hooks/usePWA'
import HomeScreen from './screens/HomeScreen'
import HistoryScreen from './screens/HistoryScreen'
import ReceiptScreen from './screens/ReceiptScreen'
import ShareScreen from './screens/ShareScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProfileScreen from './screens/ProfileScreen'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import './App.css'

export const USER = { name: 'Kush', email: 'kush@gmail.com', dailyAvg: 895 }

export default function App() {
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState(null)
  const expensesState = useExpenses()
  const pwa = usePWA()

  const goTo = (s) => setScreen(s)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const ctx = { goTo, showToast, user: USER, pwa, ...expensesState }

  return (
    <div className="app-shell">
      {screen === 'home'     && <HomeScreen    {...ctx} />}
      {screen === 'history'  && <HistoryScreen  {...ctx} />}
      {screen === 'receipt'  && <ReceiptScreen  {...ctx} />}
      {screen === 'share'    && <ShareScreen    {...ctx} />}
      {screen === 'settings' && <SettingsScreen {...ctx} />}
      {screen === 'profile'  && <ProfileScreen  {...ctx} />}

      <BottomNav current={screen} goTo={goTo} />
      <Toast message={toast} />
    </div>
  )
}
