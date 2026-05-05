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
  const expensesState = useExpenses()
  const pwa = usePWA()
  const { dark, toggle: toggleDark } = useDarkMode()
  const { user, loading, logout } = useAuth()

  const goTo = (s) => { setScreen(s); window.scrollTo(0, 0) }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const handleLogin = (userData) => {
    localStorage.setItem('spentt-user', JSON.stringify(userData))
    window.location.reload()
  }

  const handleAddPress = () => {
    goTo('home')
    setShowAddSheet(true)
  }

  const handleExpenseTap = (expense) => {
    setEditingExpense(expense)
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)'
      }}>
        <div style={{ fontFamily: 'var(--fh)', fontSize: 24, fontWeight: 700, color: 'var(--text3)' }}>
          spentt<span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#E8623A', marginLeft: 2, marginBottom: 2 }} />
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const ctx = {
    goTo, showToast,
    user: { ...user, dailyAvg: 895 },
    pwa, dark, toggleDark,
    onExpenseTap: handleExpenseTap,
    logout,
    ...expensesState
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