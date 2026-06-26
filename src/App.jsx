import { useExpenses } from './hooks/useExpenses'
import { usePWA } from './hooks/usePWA'
import { useDarkMode } from './hooks/useDarkMode'
import { useAuth } from './hooks/useAuth'
import { useCurrency } from './hooks/useCurrency'
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
import PrivacyScreen from './screens/PrivacyScreen'
import TermsScreen from './screens/TermsScreen'
import AdminScreen from './screens/AdminScreen'
import FAQScreen from './screens/FAQScreen'
import TokenExpiredBanner from './components/TokenExpiredBanner'
import React, { useState } from 'react'
import './App.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#FDF8F3', gap: 16, padding: 24, textAlign: 'center'
        }}>
          <div style={{ fontSize: 48 }}>😕</div>
          <div style={{ fontFamily: 'Gabarito, sans-serif', fontSize: 20, fontWeight: 700, color: '#1C1409' }}>
            Something went wrong
          </div>
          <div style={{ fontSize: 14, color: '#6B5B45' }}>
            Please refresh the page
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px', background: '#E8623A', border: 'none',
              borderRadius: 99, fontFamily: 'Gabarito, sans-serif',
              fontSize: 15, fontWeight: 600, color: '#fff', cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState(null)
  const { user, accessToken, driveAccess, tokenExpired, loading, login, logout } = useAuth()
  const { currency, setCurrency, CURRENCIES } = useCurrency()
  const [showLanding, setShowLanding] = useState(() => {
  // If user is already stored, skip landing page
  return !localStorage.getItem('spentt-user')
  })
  const expensesState = useExpenses(accessToken, user?.email)
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
  if (showLanding === 'privacy') return <PrivacyScreen onBack={() => setShowLanding(true)} />
  if (showLanding === 'terms') return <TermsScreen onBack={() => setShowLanding(true)} />
  if (showLanding === true) return <LandingScreen onGetStarted={(page) => {
    if (page === 'privacy') setShowLanding('privacy')
    else if (page === 'terms') setShowLanding('terms')
    else setShowLanding(false)
  }} />
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
  // Show warning if Drive access was not granted (first time)
if (!driveAccess && user && !tokenExpired) {
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
      <div onClick={logout} style={{ fontSize: 13, color: '#A8937A', cursor: 'pointer', marginTop: 8 }}>
        Sign out
      </div>
    </div>
  )
}

  const safeAddExpense = (data) => {
  if (tokenExpired) {
    showToast('Reconnect first — session expired')
    return
  }
  return expensesState.addExpense(data)
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
    tokenExpired,
    login,
    currency,
    setCurrency,
    CURRENCIES,
    ...expensesState,
    addExpense: safeAddExpense,
  }

  return (
    <ErrorBoundary>
    <div className="desktop-layout">

      {/* App */}
      <div className="app-shell">
        {tokenExpired && (
        <TokenExpiredBanner onRefresh={login} />
        )}
        {screen === 'home'     && <HomeScreen     {...ctx} />}
        {screen === 'history'  && <HistoryScreen  {...ctx} />}
        {screen === 'receipt'  && <ReceiptScreen  {...ctx} />}
        {screen === 'share'    && <ShareScreen    {...ctx} />}
        {screen === 'settings' && <SettingsScreen {...ctx} />}
        {screen === 'profile'  && <ProfileScreen  {...ctx} />}
        {screen === 'privacy'  && <PrivacyScreen  onBack={() => goTo('settings')} />}
        {screen === 'terms'    && <TermsScreen    onBack={() => goTo('settings')} />}
        {screen === 'admin' && <AdminScreen onBack={() => goTo('settings')} />}
        {screen === 'faq' && <FAQScreen onBack={() => goTo('settings')} />}  

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
    </ErrorBoundary>
  )
}