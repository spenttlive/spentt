import { getWeekExpenses, getCategoryBreakdown, generateVerdict, fmtWeekRange, getWeekRange } from '../utils/receipt'
import './ShareScreen.css'

export default function ShareScreen({ expenses, goTo, showToast }) {
  const weekExp = getWeekExpenses(expenses)
  const breakdown = getCategoryBreakdown(weekExp)
  const verdict = generateVerdict(weekExp)
  const total = weekExp.reduce((s, e) => s + e.amount, 0)
  const { start, end } = getWeekRange()
  const dateRange = fmtWeekRange(start, end)

  return (
    <div className="screen share-screen">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="back-btn" onClick={() => goTo('receipt')}>←</span>
          <span style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700 }}>Share</span>
        </div>
      </div>

      <div className="share-wrap">
        <div className="share-card" id="share-card-el">
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

        <button className="sc-action-btn" onClick={() => showToast('Screenshot this card to share!')}>
          Share receipt ↗
        </button>
        <button className="sc-cancel-btn" onClick={() => goTo('receipt')}>
          Cancel
        </button>
      </div>
    </div>
  )
}