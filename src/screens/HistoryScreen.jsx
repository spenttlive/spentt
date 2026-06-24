import { useState, useEffect } from 'react'
import ExpenseItem from '../components/home/ExpenseItem'
import { dateKey, today, fmtDateShort, fmtMonthYear, getDaysInMonth, getFirstDayOfMonth } from '../utils/dateHelpers'
import './HistoryScreen.css'

const VIEWS = ['daily', 'weekly', 'monthly', 'category']
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function MiniCalendar({ expenses, selected, calDate, onSelectDay, onShiftMonth }) {
  const y = calDate.getFullYear()
  const m = calDate.getMonth()
  const firstDay = getFirstDayOfMonth(y, m)
  const daysInMonth = getDaysInMonth(y, m)
  const prevMonthDays = getDaysInMonth(y, m - 1)
  const t = today()
  const spendDays = new Set(expenses.map((e) => dateKey(e.ts)))
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, thisMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(y, m, d)
    cells.push({
      day: d, thisMonth: true, date: dt,
      key: dateKey(dt),
      isToday: dateKey(dt) === dateKey(t),
      isSelected: dateKey(dt) === dateKey(selected),
      hasSpend: spendDays.has(dateKey(dt)),
    })
  }
  for (let d = 1; d <= totalCells - (firstDay + daysInMonth); d++) {
    cells.push({ day: d, thisMonth: false })
  }

  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <div className="cal-month">{fmtMonthYear(calDate)}</div>
        <div className="cal-nav">
          <div className="cal-nav-btn" onClick={() => onShiftMonth(-1)}>‹</div>
          <div className="cal-nav-btn" onClick={() => onShiftMonth(1)}>›</div>
        </div>
      </div>
      <div className="cal-days-header">
        {DAY_LABELS.map((d) => <div key={d} className="cal-day-lbl">{d}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`cal-cell
              ${!cell.thisMonth ? 'other-month' : ''}
              ${cell.isToday ? 'is-today' : ''}
              ${cell.isSelected ? 'is-selected' : ''}
              ${cell.hasSpend ? 'has-spend' : ''}
            `}
            onClick={() => cell.thisMonth && cell.date && onSelectDay(cell.date)}
          >
            <div className="cal-num">{cell.day}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HistoryScreen({ expenses, goTo, onExpenseTap, categoryFilter, setCategoryFilter, currency }) {
  const [view, setView] = useState(categoryFilter ? 'category' : 'daily')
  const [selectedDay, setSelectedDay] = useState(today())
  const [calDate, setCalDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Switch to category view when filter is set
  useEffect(() => {
    if (categoryFilter) setView('category')
  }, [categoryFilter])

  const t = today()

  let filtered = []
  let label = ''

  if (view === 'category' && categoryFilter) {
    filtered = expenses.filter((e) => e.cat === categoryFilter)
    filtered.sort((a, b) => new Date(b.ts) - new Date(a.ts))
    label = categoryFilter
  } else if (view === 'daily') {
    const key = dateKey(selectedDay)
    filtered = expenses.filter((e) => dateKey(e.ts) === key)
    const diff = Math.round((t - selectedDay) / 86400000)
    label = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : fmtDateShort(selectedDay)
  } else if (view === 'weekly') {
    const dow = selectedDay.getDay()
    const ws = new Date(selectedDay)
    ws.setDate(selectedDay.getDate() - dow)
    ws.setHours(0, 0, 0, 0)
    const we = new Date(ws)
    we.setDate(ws.getDate() + 6)
    we.setHours(23, 59, 59, 999)
    filtered = expenses.filter((e) => {
      const d = new Date(e.ts)
      return d >= ws && d <= we
    })
    label = `${fmtDateShort(ws)} – ${fmtDateShort(we)}`
  } else {
    filtered = expenses.filter((e) => {
      const d = new Date(e.ts)
      return d.getMonth() === selectedDay.getMonth() &&
             d.getFullYear() === selectedDay.getFullYear()
    })
    label = fmtMonthYear(selectedDay)
  }

  // Apply search query on top of date/category filtering
  if (searchQuery.trim()) {
  const q = searchQuery.trim().toLowerCase()
  filtered = filtered.filter((e) =>
    e.desc.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q)
  )
  }
  const total = filtered.reduce((s, e) => s + e.amount, 0)

  // Group by date for non-category views
  const groups = {}
  if (view !== 'category') {
    filtered
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .forEach((e) => {
        const k = dateKey(e.ts)
        if (!groups[k]) groups[k] = []
        groups[k].push(e)
      })
  }

  const handleViewChange = (v) => {
    setView(v)
    if (v !== 'category') setCategoryFilter(null)
  }

  return (
    <div className="screen hist-screen">
      <div className="topbar" style={{ padding: '52px 24px 16px' }}>
  <div>
    <div style={{ fontSize: 12, color: 'var(--text3)' }}>Transactions</div>
    <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 700 }}>History</div>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div
      style={{ fontSize: 18, cursor: 'pointer' }}
      onClick={() => setShowSearch(!showSearch)}
    >
      {showSearch ? '✕' : '🔍'}
    </div>
    {view === 'category' && (
      <div
        style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, cursor: 'pointer' }}
        onClick={() => { setCategoryFilter(null); setView('daily') }}
      >
        Clear ✕
      </div>
    )}
  </div>
</div>

{showSearch && (
  <div className="hist-search-bar">
    <input
      type="text"
      className="hist-search-input"
      placeholder="Search by description or category..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      autoFocus
    />
    {searchQuery && (
      <span className="hist-search-clear" onClick={() => setSearchQuery('')}>✕</span>
    )}
  </div>
)}

      {/* View toggle — show all 3 date views + category if active */}
      <div className="view-toggle">
        {['daily', 'weekly', 'monthly'].map((v) => (
          <div
            key={v}
            className={`vt-btn ${view === v ? 'active' : ''}`}
            onClick={() => handleViewChange(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </div>
        ))}
        {categoryFilter && (
          <div className="vt-btn active" style={{ background: 'var(--accent)', color: '#fff' }}>
            {categoryFilter}
          </div>
        )}
      </div>

      {/* Hide calendar in category view */}
      {view !== 'category' && (
        <MiniCalendar
          expenses={expenses}
          selected={selectedDay}
          calDate={calDate}
          onSelectDay={(date) => {
            const d = new Date(date)
            d.setHours(0, 0, 0, 0)
            setSelectedDay(d)
          }}
          onShiftMonth={(dir) =>
            setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1))
          }
        />
      )}

      <div className="hist-summary">
        <div className="hist-summary-label">{label}</div>
        <div className="hist-summary-amt">
          {filtered.length ? `${currency?.symbol || '₹'}${total.toLocaleString()}` : 'Nothing logged'}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="hist-empty">
        {searchQuery ? `No results for "${searchQuery}"` : 'No expenses found.'}
        </div>
      ) : view === 'category' ? (
        // Category view — flat list
        <div className="hist-list-wrap">
          {filtered.map((e) => (
            <ExpenseItem key={e.id} expense={e} showDate onTap={onExpenseTap} currency={currency} />
          ))}
        </div>
      ) : (
        // Date grouped view
        Object.entries(groups).map(([key, items]) => {
          const d = new Date(key + 'T12:00:00')
          const tKey = dateKey(t)
          const yKey = dateKey(new Date(t.getTime() - 86400000))
          const dayLabel = key === tKey ? 'Today' : key === yKey ? 'Yesterday' : fmtDateShort(d)
          const dayTotal = items.reduce((s, e) => s + e.amount, 0)
          return (
            <div key={key}>
              <div className="group-header">
                <span>{dayLabel}</span>
                <span style={{ fontFamily: 'var(--fh)', fontSize: 13, fontWeight: 600 }}>
                  {currency?.symbol || '₹'}{dayTotal.toLocaleString()}
                </span>
              </div>
              <div className="hist-list-wrap">
                {items.map((e) => (
                  <ExpenseItem key={e.id} expense={e} onTap={onExpenseTap} currency={currency} />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}