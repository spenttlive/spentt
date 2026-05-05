import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { getWeekExpenses, getCategoryBreakdown, generateVerdict, fmtWeekRange, getWeekRange } from '../utils/receipt'
import './ShareScreen.css'

export default function ShareScreen({ expenses, goTo, showToast }) {
  const weekExp = getWeekExpenses(expenses)
  const breakdown = getCategoryBreakdown(weekExp)
  const verdict = generateVerdict(weekExp)
  const total = weekExp.reduce((s, e) => s + e.amount, 0)
  const { start, end } = getWeekRange()
  const dateRange = fmtWeekRange(start, end)
  const cardRef = useRef(null)
  const [generating, setGenerating] = useState(false)

  const handleShare = async () => {
    if (!cardRef.current) return
    setGenerating(true)
    showToast('Generating image…')
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#1C1409',
        logging: false,
      })
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'spentt-receipt.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Spentt receipt',
          })
        } else {
          // Fallback — download the image
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'spentt-receipt.png'
          a.click()
          URL.revokeObjectURL(url)
          showToast('Image downloaded!')
        }
      }, 'image/png')
    } catch (err) {
      showToast('Could not generate image')
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="screen share-screen">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="back-btn" onClick={() => goTo('receipt')}>←</span>
          <span style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700 }}>Share</span>
        </div>
      </div>

      <div className="share-wrap">
        {/* This is the card that gets captured as image */}
        <div className="share-card" ref={cardRef} id="share-card-el">
          <div className="sc-inner">
            <div className="sc-brand-row">
              <span className="sc-brand-name">spentt</span>
              <span className="sc-brand-dot" />
            </div>
            <div className="sc-tagline">know where it went</div>
            <div className="sc-period">{dateRange}</div>
            <div className="sc-total">
              <sup>₹</sup>{total.toLocaleString()}
            </div>
            <div className="sc-tx">{weekExp.length} transactions</div>
            <div className="sc-cats">
              {breakdown.slice(0, 5).map(({ cat, amt, pct, color, emoji }) => (
                <div key={cat} className="sc-cat-row">
                  <div className="sc-cat-name"><span>{emoji}</span>{cat}</div>
                  <div className="sc-cat-bar-wrap">
                    <div className="sc-cat-bar" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="sc-cat-amt">₹{amt.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <hr className="sc-divider" />
            <div className="sc-verdict-label">This week's personality</div>
            <div className="sc-verdict-name">{verdict.personality}</div>
            <div className="sc-verdict-sub">{verdict.line1}<br />{verdict.line2}</div>
          </div>
          <div className="sc-footer">
            <div className="sc-footer-left">
              <span className="sc-footer-name">spentt</span>
              <span className="sc-footer-dot" />
            </div>
            <span className="sc-footer-url">spentt.live</span>
          </div>
        </div>

        <button
          className="sc-action-btn"
          onClick={handleShare}
          disabled={generating}
        >
          {generating ? 'Generating…' : 'Share receipt ↗'}
        </button>
        <button className="sc-cancel-btn" onClick={() => goTo('receipt')}>
          Cancel
        </button>
      </div>
    </div>
  )
}