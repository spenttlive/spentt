import { useState, useEffect } from 'react'
import { calculateStreak } from '../../utils/streak'
import './StreakBanner.css'

export default function StreakBanner({ expenses, currency }) {
  const sym = currency?.symbol || '₹'
  const [index, setIndex] = useState(0)

  // Build ticker facts
  const now = new Date()
  const dow = now.getDay()

  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dow)
  weekStart.setHours(0, 0, 0, 0)

  const weekExp = expenses.filter((e) => new Date(e.ts) >= weekStart)
  const weekTotal = weekExp.reduce((s, e) => s + e.amount, 0)

  const monthExp = expenses.filter((e) => {
    const d = new Date(e.ts)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const monthTotal = monthExp.reduce((s, e) => s + e.amount, 0)

  // Top category this month
  const catMap = {}
  monthExp.forEach((e) => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount })
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]

  // Most active day
  const dayMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  expenses.forEach((e) => { dayMap[new Date(e.ts).getDay()]++ })
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const topDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]

  const streak = calculateStreak(expenses)

  const facts = [
    weekTotal > 0 && {
      emoji: '📅',
      label: 'This week',
      value: `${sym}${Math.round(weekTotal).toLocaleString()}`,
    },
    monthTotal > 0 && {
      emoji: '🗓',
      label: 'This month',
      value: `${sym}${Math.round(monthTotal).toLocaleString()}`,
    },
    topCat && {
      emoji: '🏆',
      label: 'Top category',
      value: topCat[0],
    },
    expenses.length > 0 && {
      emoji: '📝',
      label: 'Total logged',
      value: `${expenses.length} expenses`,
    },
    topDay && {
      emoji: '📆',
      label: 'Most active day',
      value: dayNames[topDay[0]],
    },
    streak > 0 && {
      emoji: streak >= 30 ? '🔥🔥🔥' : streak >= 7 ? '🔥🔥' : '🔥',
      label: 'Logging streak',
      value: `${streak} days`,
    },
  ].filter(Boolean)

  useEffect(() => {
    if (facts.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [facts.length])

  if (facts.length === 0) return null

  const fact = facts[index]

  return (
    <div className="streak-banner">
      <div className="streak-emoji">{fact.emoji}</div>
      <div className="streak-text">
        <div className="streak-label">{fact.label}</div>
        <div className="streak-message">{fact.value}</div>
      </div>
      <div className="streak-dots">
        {facts.map((_, i) => (
          <div
            key={i}
            className={`streak-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}