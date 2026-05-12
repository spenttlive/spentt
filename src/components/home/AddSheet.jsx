import { useState } from 'react'
import { ALL_CATS } from '../../data/categories'
import { today, daysAgo, dateKey, fmtDateShort } from '../../utils/dateHelpers'
import CategorySheet from '../sheets/CategorySheet'
import DateSheet from '../sheets/DateSheet'
import '../sheets/Sheet.css'
import './AddSheet.css'

export default function AddSheet({ open, onClose, onAdd, showToast }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedCat, setSelectedCat] = useState(ALL_CATS[0])
  const [selectedDate, setSelectedDate] = useState(today())
  const [selectedDateLabel, setSelectedDateLabel] = useState('Today')
  const [showCatSheet, setShowCatSheet] = useState(false)
  const [showDateSheet, setShowDateSheet] = useState(false)
  const [recurring, setRecurring] = useState(false)

  const handleAdd = () => {
    if (!desc.trim()) { showToast('Enter what you spent on'); return }
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) { showToast('Enter a valid amount'); return }
    const ts = new Date(selectedDate)
    ts.setHours(new Date().getHours(), new Date().getMinutes())
    onAdd({ desc: desc.trim(), amount: amt, cat: selectedCat.name, ts, recurring })
    setDesc('')
    setAmount('')
    setSelectedDate(today())
    setSelectedDateLabel('Today')
    setRecurring(false)
  }

  if (!open && !showCatSheet && !showDateSheet) return null

  return (
    <>
      <div className={`sheet-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`bottom-sheet add-sheet ${open ? 'open' : ''}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title">Add expense</div>
          <div className="sheet-close" onClick={onClose}>✕</div>
        </div>

        <div className="add-sheet-body">
          <input
            className="add-input-desc"
            placeholder="What did you spend on?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            autoFocus={open}
          />
          <input
            className="add-input-amt"
            placeholder="₹ 0"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
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

          <button className="add-submit-btn" onClick={handleAdd}>
            + Add expense
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