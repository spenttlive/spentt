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
import AddSheet from './components/home/AddSheet'
import EditSheet from './components/home/EditSheet'
import './App.css'

export const USER = { name: 'Kush', email: 'kush@gmail.com', dailyAvg: 895 }

export default function App() {
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const expensesState = useExpenses()
  const pwa = usePWA()

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

  const ctx = {
    goTo, showToast, user: USER, pwa,
    onExpenseTap: handleExpenseTap,
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