import { useState } from 'react'
import Logo from '../components/home/Logo'
import Greeting from '../components/home/Greeting'
import TotalCard from '../components/home/TotalCard'
import CardStack from '../components/home/CardStack'
import ExpenseItem from '../components/home/ExpenseItem'
import ReceiptTeaser from '../components/home/ReceiptTeaser'
import PWABanner from '../components/home/PWABanner'
import { dateKey, today } from '../utils/dateHelpers'
import PersonalityTeaser from '../components/home/PersonalityTeaser'
import StreakBanner from '../components/home/StreakBanner'
import MonthlyRecap from '../components/home/MonthlyRecap'
import SkeletonLoader from '../components/home/SkeletonLoader'
import './HomeScreen.css'

const PERIODS = [
  { id: 'today',   label: 'Today'     },
  { id: 'week',    label: 'This week' },
  { id: 'month',   label: 'This month'},
]

export default function HomeScreen({ user, expenses, addExpense, totalSpent, avgPerTx, cardData, goTo, showToast, pwa, onExpenseTap, onCardTap, currency, loaded }) {
  const [period, setPeriod] = useState('today')

  const now = new Date()
  const t = today()
  const dow = now.getDay()

  const filtered = expenses.filter((e) => {
    const d = new Date(e.ts)
    d.setHours(0, 0, 0, 0)
    if (period === 'today') return dateKey(d) === dateKey(t)
    if (period === 'week') {
      const ws = new Date(t); ws.setDate(t.getDate() - dow)
      const we = new Date(ws); we.setDate(ws.getDate() + 6)
      return d >= ws && d <= we
    }
    if (period === 'month') return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
    return true
  })

  const periodTotal = filtered.reduce((s, e) => s + e.amount, 0)
  const topCat = cardData[0]?.cat || '—'

  // Comparison to previous period
  let comparisonPct = null
  let comparisonLabel = ''

  if (period === 'today') {
  const yesterday = new Date(t)
  yesterday.setDate(t.getDate() - 1)
  const yesterdayTotal = expenses
    .filter((e) => dateKey(new Date(e.ts)) === dateKey(yesterday))
    .reduce((s, e) => s + e.amount, 0)
  if (yesterdayTotal > 0) {
    comparisonPct = Math.round(((periodTotal - yesterdayTotal) / yesterdayTotal) * 100)
    comparisonLabel = 'vs yesterday'
  }
  } else if (period === 'week') {
  const thisWeekStart = new Date(t)
  thisWeekStart.setDate(t.getDate() - dow)
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(thisWeekStart)
  lastWeekEnd.setMilliseconds(-1)
  const lastWeekTotal = expenses
    .filter((e) => {
      const d = new Date(e.ts)
      return d >= lastWeekStart && d <= lastWeekEnd
    })
    .reduce((s, e) => s + e.amount, 0)
  if (lastWeekTotal > 0) {
    comparisonPct = Math.round(((periodTotal - lastWeekTotal) / lastWeekTotal) * 100)
    comparisonLabel = 'vs last week'
  }
  } else if (period === 'month') {
  const lastMonth = t.getMonth() === 0 ? 11 : t.getMonth() - 1
  const lastMonthYear = t.getMonth() === 0 ? t.getFullYear() - 1 : t.getFullYear()
  const lastMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.ts)
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })
    .reduce((s, e) => s + e.amount, 0)
  if (lastMonthTotal > 0) {
    comparisonPct = Math.round(((periodTotal - lastMonthTotal) / lastMonthTotal) * 100)
    comparisonLabel = 'vs last month'
  }
  }
  // This week's data for receipt teaser
  const weekStart = new Date(t)
  weekStart.setDate(t.getDate() - dow)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const weekExpenses = expenses.filter((e) => {
  const d = new Date(e.ts)
  d.setHours(0, 0, 0, 0)
  return d >= weekStart && d <= weekEnd
  })
  const weekTotal = weekExpenses.reduce((s, e) => s + e.amount, 0)
  const weekCatTotals = weekExpenses.reduce((acc, e) => {
  acc[e.cat] = (acc[e.cat] || 0) + e.amount
  return acc
  }, {})
  const weekTopCat = Object.entries(weekCatTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  const monthNow = new Date()
  const monthExpenses = expenses.filter((e) => {
  const d = new Date(e.ts)
  return d.getMonth() === monthNow.getMonth() && d.getFullYear() === monthNow.getFullYear()
  })
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const monthCatTotals = monthExpenses.reduce((acc, e) => {
  acc[e.cat] = (acc[e.cat] || 0) + e.amount
  return acc
  }, {})
  const monthCardData = Object.entries(monthCatTotals)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, amt], i) => ({
    cat, amt,
    pct: Math.round((amt / monthTotal) * 100),
    rank: i,
    items: monthExpenses.filter((e) => e.cat === cat),
  }))

  if (!loaded && expenses.length === 0) {
  return (
    <div className="screen home-screen">
      <SkeletonLoader />
    </div>
  )
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-left">
          <Logo />
          <Greeting user={user} expenses={expenses} />
        </div>
        <div className="avatar" onClick={() => goTo('profile')}>
        {user?.picture ? (
        <img
        src={user.picture}
        alt={user?.name || 'User'}
        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        onError={(e) => { e.target.style.display = 'none' }}
        />
        ) : (
        user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'
        )}
        </div>
      </div>

      {/* Period pills */}
      <StreakBanner expenses={expenses} />
      <MonthlyRecap expenses={expenses} showToast={showToast} currency={currency} />

      
      <div className="period-pills-row">
        {PERIODS.map((p) => (
          <div
            key={p.id}
            className={`period-pill ${period === p.id ? 'active' : ''}`}
            onClick={() => setPeriod(p.id)}
          >
            {period === p.id && <div className="live-dot" />}
            {p.label}
          </div>
        ))}
      </div>

      <TotalCard
      total={periodTotal}
      txCount={filtered.length}
      avg={filtered.length ? Math.round(periodTotal / filtered.length) : 0}
      currency={currency}
      comparisonPct={comparisonPct}
      comparisonLabel={comparisonLabel}
      />

      <PWABanner show={pwa.showBanner} onInstall={pwa.install} onDismiss={pwa.dismiss} />

      <div className="sec-hd">
        <div className="sec-title">Where it went</div>
        <div className="sec-link" onClick={() => goTo('history')}>See all</div>
      </div>

      <div className="stack-label">Categories with most expense this month</div>
      <CardStack cardData={monthCardData} showToast={showToast} onCardTap={onCardTap} currency={currency} />

      <div className="recent-wrap">
        <div className="sec-hd" style={{ padding: '0 4px', marginBottom: 10 }}>
          <div className="sec-title">Recent</div>
          <div className="sec-link" onClick={() => goTo('history')}>See all</div>
        </div>
        {filtered.slice(0, 5).map((e) => (
          <ExpenseItem key={e.id} expense={e} onTap={onExpenseTap} currency={currency}/>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">Nothing logged {period === 'today' ? 'today' : period === 'week' ? 'this week' : 'this month'} yet.</div>
        )}
      </div>

      <PersonalityTeaser expenses={expenses} showToast={showToast} />

      <ReceiptTeaser
        total={weekTotal}
        topCat={weekTopCat}
        onOpen={() => goTo('receipt')}
        currency={currency}
      />
    </div>
  )
}