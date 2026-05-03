import { useState } from 'react'
import { dateKey, today, fmtMonthYear } from '../../utils/dateHelpers'
import styles from './MiniCalendar.module.css'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function MiniCalendar({ expenses, selectedDay, onSelectDay }) {
  const [calDate, setCalDate] = useState(today())
  const spendDays = new Set(expenses.map(e => dateKey(e.ts)))

  const y = calDate.getFullYear()
  const m = calDate.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const daysInPrev  = new Date(y, m, 0).getDate()
  const todayKey    = dateKey(today())
  const selectedKey = dateKey(selectedDay)

  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, thisMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, thisMonth: true, date: new Date(y, m, d) })
  }
  const remaining = Math.ceil((firstDay + daysInMonth) / 7) * 7 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, thisMonth: false })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.month}>{fmtMonthYear(calDate)}</div>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={() => setCalDate(new Date(y, m - 1, 1))}>‹</button>
          <button className={styles.navBtn} onClick={() => setCalDate(new Date(y, m + 1, 1))}>›</button>
        </div>
      </div>

      <div className={styles.dayLabels}>
        {DAY_LABELS.map(l => <div key={l} className={styles.dayLbl}>{l}</div>)}
      </div>

      <div className={styles.grid}>
        {cells.map((cell, i) => {
          if (!cell.thisMonth) {
            return <div key={i} className={`${styles.cell} ${styles.other}`}><div className={styles.num}>{cell.day}</div></div>
          }
          const key    = dateKey(cell.date)
          const isToday  = key === todayKey
          const isSel    = key === selectedKey
          const hasSpend = spendDays.has(key)
          return (
            <div
              key={i}
              className={`${styles.cell} ${isToday ? styles.today : ''} ${isSel ? styles.selected : ''} ${hasSpend ? styles.hasSpend : ''}`}
              onClick={() => onSelectDay(cell.date)}
            >
              <div className={styles.num}>{cell.day}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
