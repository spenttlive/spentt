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
import LandingScreen from './screens/LandingScreen'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const { user, accessToken, driveAccess, loading, login, logout } = useAuth()
  const [showLanding, setShowLanding] = useState(true)
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

  const handleCardTap = (cat) => {
    setCategoryFilter(cat)
    goTo('history')
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
    if (showLanding) {
      return <LandingScreen onGetStarted={() => setShowLanding(false)} />
    }
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
  // Show warning if Drive access was not granted
if (!driveAccess && user) {
  console.log('Showing Drive warning — driveAccess:', driveAccess, 'user:', user)
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#FDF8F3', padding: 32, textAlign: 'center', gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <div style={{ fontFamily: 'Gabarito, sans-serif', fontSize: 22, fontWeight: 700, color: '#1C1409' }}>
        Drive access needed
      </div>
      <div style={{ fontSize: 15, color: '#6B5B45', lineHeight: 1.6, maxWidth: 300 }}>
        Spentt stores your expenses in your own Google Drive. Without access, your data can't be saved.
      </div>
      <button
        onClick={login}
        style={{
          marginTop: 8, padding: '14px 32px', background: '#E8623A', border: 'none',
          borderRadius: 99, fontFamily: 'Gabarito, sans-serif', fontSize: 15,
          fontWeight: 600, color: '#fff', cursor: 'pointer',
        }}
      >
        Grant Drive access →
      </button>
      <div
        onClick={logout}
        style={{ fontSize: 13, color: '#A8937A', cursor: 'pointer', marginTop: 8 }}
      >
        Sign out
      </div>
    </div>
  )
}

  const ctx = {
    goTo, showToast,
    user: { ...user, dailyAvg: 895 },
    pwa, dark, toggleDark,
    onExpenseTap: handleExpenseTap,
    onCardTap: handleCardTap,
    categoryFilter,
    setCategoryFilter,
    logout,
    ...expensesState,
  }

  return (
    <div className="desktop-layout">
      {/* Desktop left panel — hidden on mobile */}
      <div className="desktop-left-panel">
        <div className="dlp-brand">
          spentt<span className="dlp-brand-dot" />
        </div>
        <h1 className="dlp-headline">
          Know where<br />it went.
        </h1>
        <p className="dlp-sub">
          The honest expense tracker that tells you exactly where your money went — with a smile.
        </p>
        <div className="dlp-perks">
          <div className="dlp-perk">✓ Free forever</div>
          <div className="dlp-perk">✓ No bank linking</div>
          <div className="dlp-perk">✓ Your data in your Google Drive</div>
          <div className="dlp-perk">✓ Installs on your phone as an app</div>
        </div>
        <div className="dlp-hint">
          📱 Best on mobile — open <strong>spentt.live</strong> on your phone
        </div>
      </div>

      {/* App */}
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
    </div>
  )
}