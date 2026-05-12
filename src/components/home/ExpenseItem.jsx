import { getCat } from '../../data/categories'
import { fmtDateShort, fmtTime } from '../../utils/dateHelpers'
import './ExpenseItem.css'

export default function ExpenseItem({ expense, showDate = false, onTap }) {
  const c = getCat(expense.cat)
  return (
    <div className="exp-item" onClick={() => onTap?.(expense)}>
      <div className="exp-icon" style={{ background: c.bg }}>{c.emoji}</div>
      <div className="exp-info">
        <div className="exp-desc">{expense.desc}</div>
        <div className="exp-cat">
          {expense.recurring && <span className="exp-recurring">🔁 </span>}
          {expense.cat}{showDate ? ` · ${fmtDateShort(expense.ts)}` : ''}
        </div>
      </div>
      <div className="exp-right">
        <div className="exp-amt">₹{expense.amount.toLocaleString()}</div>
        <div className="exp-time">{fmtTime(expense.ts)}</div>
      </div>
      <div className="exp-edit-hint">›</div>
    </div>
  )
}