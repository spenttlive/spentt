import { useState, useEffect } from 'react'
import { ALL_CATS, getCat } from '../../data/categories'
import { today, dateKey, fmtDateShort } from '../../utils/dateHelpers'
import CategorySheet from '../sheets/CategorySheet'
import DateSheet from '../sheets/DateSheet'
import '../sheets/Sheet.css'
import './EditSheet.css'

export default function EditSheet({ open, expense, onClose, onSave, onDelete, showToast }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedCat, setSelectedCat] = useState(ALL_CATS[0])
  const [selectedDate, setSelectedDate] = useState(today())
  const [selectedDateLabel, setSelectedDateLabel] = useState('Today')
  const [showCatSheet, setShowCatSheet] = useState(false)
  const [showDateSheet, setShowDateSheet] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [recurring, setRecurring] = useState(false)

  // Prefill when expense changes
  useEffect(() => {
    if (expense) {
      setDesc(expense.desc)
      setAmount(String(expense.amount))
      setSelectedCat(getCat(expense.cat))
      setSelectedDate(new Date(expense.ts))
      const diff = Math.round((today() - new Date(new Date(expense.ts).setHours(0,0,0,0))) / 86400000)
      setSelectedDateLabel(diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : fmtDateShort(expense.ts))
      setConfirmDelete(false)
      setRecurring(expense.recurring || false)
    }
  }, [expense])

  const handleSave = () => {
    if (!desc.trim()) { showToast('Enter a description'); return }
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) { showToast('Enter a valid amount'); return }
    const ts = new Date(selectedDate)
    ts.setHours(new Date(expense.ts).getHours(), new Date(expense.ts).getMinutes())
    onSave(expense.id, { desc: desc.trim(), amount: amt, cat: selectedCat.name, ts, recurring })
    showToast('Updated ✓')
    onClose()
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(expense.id)
    showToast('Deleted')
    onClose()
  }

  if (!expense) return null

  return (
    <>
      <div className={`sheet-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`bottom-sheet edit-sheet ${open ? 'open' : ''}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title">Edit expense</div>
          <div className="sheet-close" onClick={onClose}>✕</div>
        </div>

        <div className="edit-sheet-body">
          <input
            className="add-input-desc"
            placeholder="What did you spend on?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            className="add-input-amt"
            placeholder="₹ 0"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="add-meta-row">
            <div className="meta-trigger" onClick={() => setShowCatSheet(true)}>
              <div className="meta-trigger-icon">{selectedCat.emoji}</div>
              <div className="meta-trigger-content">
                <div className="meta-trigger-label">Category</div>
                <div className="meta-trigger-val">{selectedCat.name}</div>
              </div>
            </div>
            <div className="meta-trigger" onClick={() => setShowDateSheet(true)}>
              <div className="meta-trigger-icon">📅</div>
              <div className="meta-trigger-content">
                <div className="meta-trigger-label">Date</div>
                <div className="meta-trigger-val">{selectedDateLabel}</div>
              </div>
            </div>
          </div>

          <div className="recurring-row" onClick={() => setRecurring(!recurring)}>
            <div className="recurring-left">
            <div className="recurring-icon">🔁</div>
            <div className="recurring-text">
            <div className="recurring-label">Recurring expense</div>
            <div className="recurring-sub">Repeats monthly on the same date</div>
            </div>
            </div>
            <div className={`toggle ${recurring ? 'on' : ''}`} />
          </div>

          <button className="add-submit-btn" onClick={handleSave}>
            Save changes
          </button>

          <button
            className={`delete-btn ${confirmDelete ? 'confirm' : ''}`}
            onClick={handleDelete}
          >
            {confirmDelete ? '⚠️ Tap again to confirm delete' : '🗑 Delete expense'}
          </button>
        </div>
      </div>

      <CategorySheet
        open={showCatSheet}
        selected={selectedCat}
        onSelect={(cat) => { setSelectedCat(cat); setShowCatSheet(false) }}
        onClose={() => setShowCatSheet(false)}
      />
      <DateSheet
        open={showDateSheet}
        selected={selectedDate}
        label={selectedDateLabel}
        onSelect={(date, label) => { setSelectedDate(date); setSelectedDateLabel(label) }}
        onClose={() => setShowDateSheet(false)}
      />
    </>
  )
}