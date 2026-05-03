import { useState, useCallback } from 'react'
import { SAMPLE_EXPENSES } from '../data/sampleExpenses'

export function useExpenses() {
  const [expenses, setExpenses] = useState(SAMPLE_EXPENSES)

  const addExpense = useCallback(({ desc, amount, cat, ts }) => {
    const newExp = {
      id: Date.now(),
      desc,
      amount,
      cat,
      ts: ts || new Date(),
    }
    setExpenses((prev) => [newExp, ...prev])
    return newExp
  }, [])

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const avgPerTx = expenses.length ? Math.round(totalSpent / expenses.length) : 0

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.cat] = (acc[e.cat] || 0) + e.amount
    return acc
  }, {})

  const cardData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt], i) => ({
      cat,
      amt,
      pct: Math.round((amt / totalSpent) * 100),
      rank: i,
      items: expenses.filter((e) => e.cat === cat),
    }))

  return { expenses, addExpense, deleteExpense, totalSpent, avgPerTx, cardData }
}
