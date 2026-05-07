import { useState, useEffect, useCallback, useRef } from 'react'
import { SAMPLE_EXPENSES } from '../data/sampleExpenses'
import { readFromDrive, writeToDrive } from '../services/driveSync'

export function useExpenses(accessToken, userEmail) {
  const [expenses, setExpenses] = useState([])
  const [syncing, setSyncing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef(null)

  // Load from Drive on mount
  useEffect(() => {
    if (!accessToken) {
    setLoaded(true)
    return
    }
    setSyncing(true)
    readFromDrive(accessToken)
    .then((data) => {
    if (data?.expenses && data.expenses.length > 0) {
    const parsed = data.expenses.map((e) => ({
      ...e,
      ts: new Date(e.ts),
    }))
    setExpenses(parsed)

    // Sync count using the email passed directly — not from localStorage
    if (userEmail) {
    fetch('/api/track-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      expense_count: data.expenses.length,
      secret: import.meta.env.VITE_API_SECRET,
    }),
    }).catch(console.error)
    }
    } else {
    setExpenses([])
    }
    })
      .catch(() => {
        setExpenses([])
      })
      .finally(() => {
        setSyncing(false)
        setLoaded(true)
      })
  }, [accessToken])

  // Save to Drive with debounce
  const saveToCloud = useCallback((newExpenses) => {
  if (!accessToken) return
  if (saveTimer.current) clearTimeout(saveTimer.current)
  saveTimer.current = setTimeout(() => {
    writeToDrive(accessToken, newExpenses).catch(console.error)
    // Track expense count
    if (userEmail) {
    fetch('/api/track-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      expense_count: newExpenses.length,
      secret: import.meta.env.VITE_API_SECRET,
    }),
    }).catch(console.error)
    }
  }, 1000)
  }, [accessToken, userEmail])

  const addExpense = useCallback((data) => {
    const newExp = { id: Date.now(), ...data, ts: data.ts || new Date() }
    setExpenses((prev) => {
      const updated = [newExp, ...prev]
      saveToCloud(updated)
      return updated
    })
    return newExp
  }, [saveToCloud])

  const editExpense = useCallback((id, updates) => {
    setExpenses((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      saveToCloud(updated)
      return updated
    })
  }, [saveToCloud])

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      saveToCloud(updated)
      return updated
    })
  }, [saveToCloud])

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const avgPerTx = expenses.length ? Math.round(totalSpent / expenses.length) : 0

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.cat] = (acc[e.cat] || 0) + e.amount
    return acc
  }, {})

  const cardData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt], i) => ({
      cat, amt,
      pct: Math.round((amt / totalSpent) * 100),
      rank: i,
      items: expenses.filter((e) => e.cat === cat),
    }))

  return {
    expenses, addExpense, editExpense, deleteExpense,
    totalSpent, avgPerTx, cardData,
    syncing, loaded,
  }
}