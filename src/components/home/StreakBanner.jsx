import { useState, useEffect } from 'react'
import './StreakBanner.css'

export default function StreakBanner({ expenses, currency }) {
  const sym = currency?.symbol || '₹'
  const [index, setIndex] = useState(0)

  const now = new Date()

  // Month expenses
  const monthExp = expenses.filter((e) => {
    const d = new Date(e.ts)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  // Most expensive single expense this month
  const mostExpensive = monthExp.sort((a, b) => b.amount - a.amount)[0]

  // Most recurring spend this month (most frequent description)
  const descMap = {}
  monthExp.forEach((e) => { descMap[e.desc] = (descMap[e.desc] || 0) + 1 })
  const topRecurring = Object.entries(descMap).sort((a, b) => b[1] - a[1])[0]

  // Top category this month
  const catMap = {}
  monthExp.forEach((e) => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount })
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]

  // Most spending day of week (all time)
  const dayMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  expenses.forEach((e) => { dayMap[new Date(e.ts).getDay()]++ })
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const topDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]

  const facts = [
    mostExpensive && {
      emoji: '💸',
      text: `Biggest this month — ${sym}${Math.round(mostExpensive.amount).toLocaleString()} on ${mostExpensive.desc}`,
    },
    topRecurring && topRecurring[1] > 1 && {
      emoji: '🔁',
      text: `Most repeated — ${topRecurring[0]} (${topRecurring[1]}x)`,
    },
    topCat && {
      emoji: '🏆',
      text: `Top category this month — ${topCat[0]}`,
    },
    expenses.length > 0 && {
      emoji: '📝',
      text: `${expenses.length} expenses logged in total`,
    },
    topDay && {
      emoji: '📆',
      text: `Most active day — ${dayNames[topDay[0]]}s`,
    },
  ].filter(Boolean)

  useEffect(() => {
    if (facts.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [facts.length])

  if (facts.length === 0) return null

  const fact = facts[index % facts.length]

  return (
    <div className="streak-banner">
      <span className="streak-fact-emoji">{fact.emoji}</span>
      <span className="streak-fact-text">{fact.text}</span>
      <div className="streak-dots">
        {facts.map((_, i) => (
          <div
            key={i}
            className={`streak-dot ${i === index % facts.length ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}