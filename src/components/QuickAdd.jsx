import { useState } from 'react'
import { ALL_CATS } from '../data/categories'
import { useToast } from './Toast'
import BottomSheet from './sheets/BottomSheet'
import CategorySheet from './sheets/CategorySheet'
import DateSheet from './sheets/DateSheet'
import styles from './QuickAdd.module.css'

export default function QuickAdd({ onAdd }) {
  const showToast = useToast()
  const [desc, setDesc]   = useState('')
  const [amount, setAmount] = useState('')
  const [cat, setCat]     = useState(ALL_CATS[0])
  const [date, setDate]   = useState({ date: new Date(), label: 'Today' })
  const [catOpen, setCatOpen]   = useState(false)
  const [dateOpen, setDateOpen] = useState(false)

  const handleAdd = () => {
    if (!desc.trim()) { showToast('Enter what you spent on'); return }
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) { showToast('Enter a valid amount'); return }

    onAdd({ desc: desc.trim(), amount: amt, cat: cat.name, date: date.date })
    setDesc('')
    setAmount('')
    setDate({ date: new Date(), label: 'Today' })
    showToast(`${cat.emoji} Added ✓`)
  }

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.inputRow}>
          <input
            className={styles.inputDesc}
            placeholder="What did you spend on?"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && document.getElementById('amt-input').focus()}
          />
          <input
            id="amt-input"
            className={styles.inputAmt}
            placeholder="₹ 0"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>

        <div className={styles.metaRow}>
          <div className={styles.metaTrigger} onClick={() => setCatOpen(true)}>
            <span className={styles.metaIcon}>{cat.emoji}</span>
            <div className={styles.metaContent}>
              <div className={styles.metaLabel}>Category</div>
              <div className={styles.metaVal}>{cat.name}</div>
            </div>
          </div>
          <div className={styles.metaTrigger} onClick={() => setDateOpen(true)}>
            <span className={styles.metaIcon}>📅</span>
            <div className={styles.metaContent}>
              <div className={styles.metaLabel}>Date</div>
              <div className={styles.metaVal}>{date.label}</div>
            </div>
          </div>
        </div>

        <button className={styles.addBtn} onClick={handleAdd}>
          + Add expense
        </button>
      </div>

      <BottomSheet open={catOpen} onClose={() => setCatOpen(false)} title="Pick a category">
        <CategorySheet
          selected={cat}
          onSelect={setCat}
          onClose={() => setCatOpen(false)}
        />
      </BottomSheet>

      <BottomSheet open={dateOpen} onClose={() => setDateOpen(false)} title="Pick a date">
        <DateSheet
          selected={date.date}
          onSelect={setDate}
          onClose={() => setDateOpen(false)}
        />
      </BottomSheet>
    </>
  )
}
