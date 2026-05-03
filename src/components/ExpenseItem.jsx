import { getCat } from '../data/categories'
import { fmtTime, fmtDateShort } from '../utils/dateHelpers'
import styles from './ExpenseItem.module.css'

export default function ExpenseItem({ expense, showDate = false }) {
  const cat = getCat(expense.cat)
  const timeLabel = showDate ? fmtDateShort(expense.ts) : fmtTime(expense.ts)

  return (
    <div className={styles.item}>
      <div className={styles.icon} style={{ background: cat.bg }}>
        {cat.emoji}
      </div>
      <div className={styles.info}>
        <div className={styles.desc}>{expense.desc}</div>
        <div className={styles.cat}>{expense.cat}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.amt}>₹{expense.amount.toLocaleString()}</div>
        <div className={styles.time}>{timeLabel}</div>
      </div>
    </div>
  )
}
