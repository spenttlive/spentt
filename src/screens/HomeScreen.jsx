import { useState } from 'react'
import Logo from '../components/home/Logo'
import Greeting from '../components/home/Greeting'
import TotalCard from '../components/home/TotalCard'
import CardStack from '../components/home/CardStack'
import ExpenseItem from '../components/home/ExpenseItem'
import ReceiptTeaser from '../components/home/ReceiptTeaser'
import PWABanner from '../components/home/PWABanner'
import { dateKey, today } from '../utils/dateHelpers'
import './HomeScreen.css'

const PERIODS = [
  { id: 'today',   label: 'Today'     },
  { id: 'week',    label: 'This week' },
  { id: 'month',   label: 'This month'},
]

export default function HomeScreen({ user, expenses, addExpense, totalSpent, avgPerTx, cardData, goTo, showToast, pwa, onExpenseTap, onCardTap }) {
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

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-left">
          <Logo />
          <Greeting user={user} expenses={expenses} />
        </div>
        <div className="avatar" onClick={() => goTo('profile')}>
          {user?.name?.[0] || user?.email?.[0] || 'U'}
        </div>
      </div>

      {/* Period pills */}
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

      <TotalCard total={periodTotal} txCount={filtered.length} avg={filtered.length ? Math.round(periodTotal / filtered.length) : 0} />

      <PWABanner show={pwa.showBanner} onInstall={pwa.install} onDismiss={pwa.dismiss} />

      <div className="sec-hd">
        <div className="sec-title">Where it went</div>
        <div className="sec-link" onClick={() => goTo('history')}>See all</div>
      </div>

      <CardStack cardData={cardData} showToast={showToast} onCardTap={onCardTap} />

      <div className="recent-wrap">
        <div className="sec-hd" style={{ padding: '0 4px', marginBottom: 10 }}>
          <div className="sec-title">Recent</div>
          <div className="sec-link" onClick={() => goTo('history')}>See all</div>
        </div>
        {filtered.slice(0, 5).map((e) => (
          <ExpenseItem key={e.id} expense={e} onTap={onExpenseTap} />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">Nothing logged {period === 'today' ? 'today' : period === 'week' ? 'this week' : 'this month'} yet.</div>
        )}
      </div>

      <ReceiptTeaser
        total={totalSpent}
        topCat={topCat}
        onOpen={() => goTo('receipt')}
      />
    </div>
  )
}