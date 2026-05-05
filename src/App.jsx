import { useState } from 'react'
import { useExpenses } from './hooks/useExpenses'
import { usePWA } from './hooks/usePWA'
import { useDarkMode } from './hooks/useDarkMode'
import { useAuth } from './hooks/useAuth'
import HomeScreen from './screens/HomeScreen'
import HistoryScreen from './screens/HistoryScreen'
import ReceiptScreen from './screens/ReceiptScreen'
import ShareScreen from './screens/ShareScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProfileScreen from './screens/ProfileScreen'
import LoginScreen from './screens/LoginScreen'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import AddSheet from './components/home/AddSheet'
import EditSheet from './components/home/EditSheet'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const { user, accessToken, loading, login, logout } = useAuth()
  const expensesState = useExpenses(accessToken)
  const pwa = usePWA()
  const { dark, toggle: toggleDark } = useDarkMode()

  const goTo = (s) => { setScreen(s); window.scrollTo(0, 0) }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const handleAddPress = () => {
    goTo('home')
    setShowAddSheet(true)
  }

  const handleExpenseTap = (expense) => {
    setEditingExpense(expense)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#FDF8F3',
      }}>
        <div style={{ fontFamily: 'Gabarito, sans-serif', fontSize: 24, fontWeight: 700, color: '#A8937A', display: 'flex', alignItems: 'center', gap: 3 }}>
          spentt<span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8623A', display: 'inline-block', marginBottom: 2 }} />
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={login} />
  }

  // Show loading while expenses load from Drive
  if (!expensesState.loaded) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#FDF8F3', gap: 12,
      }}>
        <div style={{ fontFamily: 'Gabarito, sans-serif', fontSize: 24, fontWeight: 700, color: '#A8937A', display: 'flex', alignItems: 'center', gap: 3 }}>
          spentt<span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8623A', display: 'inline-block', marginBottom: 2 }} />
        </div>
        <div style={{ fontSize: 13, color: '#A8937A' }}>Loading your expenses…</div>
      </div>
    )
  }

  const ctx = {
    goTo, showToast,
    user: { ...user, dailyAvg: 895 },
    pwa, dark, toggleDark,
    onExpenseTap: handleExpenseTap,
    logout,
    ...expensesState,
  }

  return (
    <div className="app-shell">
      {screen === 'home'     && <HomeScreen     {...ctx} />}
      {screen === 'history'  && <HistoryScreen  {...ctx} />}
      {screen === 'receipt'  && <ReceiptScreen  {...ctx} />}
      {screen === 'share'    && <ShareScreen    {...ctx} />}
      {screen === 'settings' && <SettingsScreen {...ctx} />}
      {screen === 'profile'  && <ProfileScreen  {...ctx} />}

      <BottomNav current={screen} goTo={goTo} onAddPress={handleAddPress} />

      <AddSheet
        open={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onAdd={(data) => {
          expensesState.addExpense(data)
          setShowAddSheet(false)
          showToast('Added ✓')
        }}
        showToast={showToast}
      />

      <EditSheet
        open={!!editingExpense}
        expense={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={expensesState.editExpense}
        onDelete={expensesState.deleteExpense}
        showToast={showToast}
      />

      <Toast message={toast} />
    </div>
  )
}