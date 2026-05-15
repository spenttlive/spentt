import { useState } from 'react'
import html2canvas from 'html2canvas'
import { buildMonthlyRecap } from '../../utils/monthlyRecap'
import { getCat } from '../../data/categories'
import './MonthlyRecap.css'

export default function MonthlyRecap({ expenses, showToast, currency }) {
  const sym = currency?.symbol || '₹'
  const [sharing, setSharing] = useState(false)
  const recap = buildMonthlyRecap(expenses)

  // Only show on 1st-7th of month or if user has data
  const now = new Date()
  const dayOfMonth = now.getDate()
  if (!recap) return null

  const handleShare = async () => {
    setSharing(true)
    showToast('Generating recap…')
    try {
      const card = document.getElementById('monthly-recap-card')
      const canvas = await html2canvas(card, {
        scale: 3,
        backgroundColor: '#1C1409',
        logging: false,
        useCORS: true,
      })
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'spentt-monthly-recap.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `My ${recap.monthName} recap` })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'spentt-monthly-recap.png'
          a.click()
          URL.revokeObjectURL(url)
          showToast('Recap downloaded!')
        }
      }, 'image/png')
    } catch (err) {
      showToast('Could not generate recap')
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="monthly-recap-wrap">
      <div className="monthly-recap-label">
        <span className="monthly-recap-emoji">🗓</span>
        {recap.monthName} recap is ready
      </div>

      {/* Shareable card */}
      <div className="monthly-recap-card" id="monthly-recap-card">
        <div className="mr-header">
          <div className="mr-brand-row">
            <span className="mr-brand">spentt</span>
            <span className="mr-dot" />
          </div>
          <div className="mr-month">{recap.monthName}</div>
          <div className="mr-tagline">monthly recap</div>
        </div>

        <div className="mr-total-section">
          <div className="mr-total-label">Total spent</div>
          <div className="mr-total">{sym}{recap.total.toLocaleString()}</div>
          <div className="mr-chips">
            <span className="mr-chip">{recap.txCount} expenses</span>
            <span className="mr-chip">{sym}{recap.dailyAvg.toLocaleString()}/day avg</span>
            <span className="mr-chip">{recap.daysLogged} days logged</span>
          </div>
        </div>

        <div className="mr-divider" />

        <div className="mr-categories">
          <div className="mr-section-label">Top categories</div>
          {recap.breakdown.map(([cat, amt]) => {
            const c = getCat(cat)
            const pct = Math.round((amt / recap.total) * 100)
            return (
              <div key={cat} className="mr-cat-row">
                <div className="mr-cat-left">
                  <span className="mr-cat-emoji">{c.emoji}</span>
                  <span className="mr-cat-name">{cat}</span>
                </div>
                <div className="mr-cat-bar-wrap">
                  <div className="mr-cat-bar" style={{ width: `${pct}%`, background: c.color }} />
                </div>
                <span className="mr-cat-amt">{sym}{amt.toLocaleString()}</span>
              </div>
            )
          })}
        </div>

        <div className="mr-divider" />

        <div className="mr-verdict">
          <div className="mr-section-label">Month's personality</div>
          <div className="mr-verdict-name">{recap.verdict.personality}</div>
          <div className="mr-verdict-sub">{recap.verdict.line1}</div>
        </div>

        <div className="mr-footer">
          <div className="mr-footer-brand">
            <span>spentt</span>
            <span className="mr-footer-dot" />
          </div>
          <span className="mr-footer-url">spentt.live</span>
        </div>
      </div>

      <button
        className="mr-share-btn"
        onClick={handleShare}
        disabled={sharing}
      >
        {sharing ? 'Generating…' : '⬆ Share your recap'}
      </button>
    </div>
  )
}