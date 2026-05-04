import { useState } from 'react'
import ExpenseItem from '../components/home/ExpenseItem'
import { dateKey, today, fmtDateShort, fmtMonthYear, getDaysInMonth, getFirstDayOfMonth } from '../utils/dateHelpers'
import './HistoryScreen.css'

const VIEWS = ['daily', 'weekly', 'monthly']
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

export default function HistoryScreen({ expenses, goTo, onExpenseTap }) {
  const [view, setView] = useState('daily')
  const [selectedDay, setSelectedDay] = useState(today())
  const [calDate, setCalDate] = useState(new Date())

  const t = today()

  // Filter expenses based on view and selected day
  let filtered = []
  let label = ''

  if (view === 'daily') {
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

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  // Group by date
  const groups = {}
  filtered
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .forEach((e) => {
      const k = dateKey(e.ts)
      if (!groups[k]) groups[k] = []
      groups[k].push(e)
    })

  return (
    <div className="screen hist-screen">
      <div className="topbar" style={{ padding: '52px 24px 16px' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Transactions</div>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 700 }}>History</div>
        </div>
      </div>

      <div className="view-toggle">
        {VIEWS.map((v) => (
          <div
            key={v}
            className={`vt-btn ${view === v ? 'active' : ''}`}
            onClick={() => setView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </div>
        ))}
      </div>

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

      <div className="hist-summary">
        <div className="hist-summary-label">{label}</div>
        <div className="hist-summary-amt">
          {filtered.length ? `₹${total.toLocaleString()}` : 'Nothing logged'}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="hist-empty">No expenses for this period.</div>
      ) : (
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
                  ₹{dayTotal.toLocaleString()}
                </span>
              </div>
              <div className="hist-list-wrap">
                {items.map((e) => (
                  <ExpenseItem key={e.id} expense={e} onTap={onExpenseTap} />
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}