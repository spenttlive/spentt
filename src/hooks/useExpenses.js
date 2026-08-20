import { useState, useEffect, useCallback, useRef } from 'react'
import { readFromDrive, writeToDrive } from '../services/driveSync'

export function useExpenses(accessToken, userEmail) {
  const [syncing, setSyncing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const saveTimer = useRef(null)

  const [expenses, setExpenses] = useState(() => {
    try {
      const cached = localStorage.getItem('spentt-expenses-cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        return parsed.map((e) => ({ ...e, ts: new Date(e.ts) }))
      }
    } catch (e) {}
    return []
  })

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

          // One-time cleanup — remove all auto-generated recurring copies
          const cleaned = parsed.filter((e) => !e.recurringSourceId)

          setExpenses(cleaned)
          try {
            localStorage.setItem('spentt-expenses-cache', JSON.stringify(cleaned))
          } catch (e) {}

          // If we removed recurring copies, save the cleaned data back to Drive
          if (cleaned.length !== parsed.length) {
            writeToDrive(accessToken, cleaned).catch(console.error)
          }

          if (userEmail) {
            fetch('/api/track-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: userEmail,
                expense_count: cleaned.length,
                secret: import.meta.env.VITE_API_SECRET,
              }),
            }).catch(console.error)
          }
        } else {
          setExpenses([])
        }
      })
      .catch((err) => {
        console.error('Drive read failed:', err)
        if (err?.status === 401) {
          localStorage.removeItem('spentt-access-token')
          localStorage.removeItem('spentt-had-drive-access')
        }
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
      writeToDrive(accessToken, newExpenses).catch((err) => {
        console.error('Drive write failed:', err)
        if (err?.status === 401 || err?.message?.includes('401')) {
          localStorage.removeItem('spentt-access-token')
          localStorage.removeItem('spentt-had-drive-access')
        }
      })
      try {
        localStorage.setItem('spentt-expenses-cache', JSON.stringify(newExpenses))
      } catch (e) {}
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
    const newExp = {
      id: Date.now(),
      ...data,
      ts: data.ts || new Date(),
    }
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