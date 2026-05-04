import { today, daysAgo, dateKey, fmtDateShort } from '../../utils/dateHelpers'
import './Sheet.css'
import './DateSheet.css'

const PRESETS = [
  { label: 'Today',      days: 0 },
  { label: 'Yesterday',  days: 1 },
  { label: '2 days ago', days: 2 },
  { label: '3 days ago', days: 3 },
]

export default function DateSheet({ open, selected, label, onSelect, onClose }) {
  const handlePreset = (preset) => {
    onSelect(daysAgo(preset.days), preset.label)
  }

  const handleCustom = (val) => {
    if (!val) return
    const d = new Date(val + 'T00:00:00')
    const diff = Math.round((today() - d) / 86400000)
    const lbl = diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : fmtDateShort(d)
    onSelect(d, lbl)
  }

  return (
    <>
      <div className={`sheet-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`bottom-sheet ${open ? 'open' : ''}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div className="sheet-title">Pick a date</div>
          <div className="sheet-close" onClick={onClose}>✕</div>
        </div>
        <div className="date-sheet-inner">
          <div className="date-presets">
            {PRESETS.map((p) => (
              <div
                key={p.label}
                className={`date-preset ${label === p.label ? 'active' : ''}`}
                onClick={() => handlePreset(p)}
              >
                {p.label}
              </div>
            ))}
          </div>
          <div className="date-input-label">Or pick a specific date</div>
          <input
            className="date-input"
            type="date"
            max={new Date().toLocaleDateString('en-CA')}
            defaultValue={dateKey(selected)}
            onChange={(e) => handleCustom(e.target.value)}
          />
          <button className="date-confirm" onClick={onClose}>Confirm</button>
        </div>
      </div>
    </>
  )
}
