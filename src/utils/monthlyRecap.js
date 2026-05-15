import { getCat } from '../data/categories'
import { generateVerdict } from './receipt'

export function getLastMonthExpenses(expenses) {
  const now = new Date()
  return expenses.filter((e) => {
    const d = new Date(e.ts)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
}

export function getLastMonthName() {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function buildMonthlyRecap(expenses) {
  const lastMonthExp = getLastMonthExpenses(expenses)
  if (lastMonthExp.length === 0) return null

  const total = lastMonthExp.reduce((s, e) => s + e.amount, 0)

  // Category breakdown
  const catMap = {}
  lastMonthExp.forEach((e) => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount })
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1])
  const topCat = sorted[0]?.[0] || ''
  const topAmt = sorted[0]?.[1] || 0

  // Week breakdown — find best and worst week
  const weekMap = {}
  lastMonthExp.forEach((e) => {
    const d = new Date(e.ts)
    const weekNum = Math.floor(d.getDate() / 7)
    weekMap[weekNum] = (weekMap[weekNum] || 0) + e.amount
  })
  const weekEntries = Object.entries(weekMap).sort((a, b) => b[1] - a[1])
  const worstWeek = weekEntries[0]?.[1] || 0
  const bestWeek = weekEntries[weekEntries.length - 1]?.[1] || 0

  // Daily average
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0
  ).getDate()
  const dailyAvg = Math.round(total / daysInMonth)

  // Unique days logged
  const daysLogged = new Set(
    lastMonthExp.map((e) => new Date(e.ts).toLocaleDateString('en-CA'))
  ).size

  // Verdict
  const verdict = generateVerdict(lastMonthExp)

  return {
    total,
    txCount: lastMonthExp.length,
    topCat,
    topAmt,
    topPct: Math.round((topAmt / total) * 100),
    dailyAvg,
    daysLogged,
    worstWeek,
    bestWeek,
    verdict,
    breakdown: sorted.slice(0, 4),
    monthName: getLastMonthName(),
  }
}