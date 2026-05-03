import { getCat } from '../data/categories'
import './ShareScreen.css'

export default function ShareScreen({ expenses, totalSpent, goTo, showToast }) {
  const catMap = {}
  expenses.forEach((e) => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount })
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="screen share-screen">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="back-btn" onClick={() => goTo('receipt')}>←</span>
          <span style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700 }}>Share</span>
        </div>
      </div>

      <div className="share-wrap">
        <div className="share-card">
          <div className="sc-inner">
            <div className="sc-brand-row">
              <span className="sc-brand-name">spentt</span>
              <span className="sc-brand-dot" />
            </div>
            <div className="sc-tagline">know where it went</div>
            <div className="sc-period">22 Apr – 01 May 2025</div>
            <div className="sc-total">
              <sup>₹</sup>{totalSpent.toLocaleString()}
            </div>
            <div className="sc-tx">{expenses.length} transactions</div>
            <div className="sc-cats">
              {sorted.map(([cat, amt]) => {
                const c = getCat(cat)
                const pct = Math.round((amt / totalSpent) * 100)
                return (
                  <div key={cat} className="sc-cat-row">
                    <div className="sc-cat-name"><span>{c.emoji}</span>{cat}</div>
                    <div className="sc-cat-bar-wrap">
                      <div className="sc-cat-bar" style={{ width: `${pct}%`, background: c.color }} />
                    </div>
                    <span className="sc-cat-amt">₹{amt.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
            <hr className="sc-divider" />
            <div className="sc-verdict-label">This week's personality</div>
            <div className="sc-verdict-name">Comfortable Contradictionist</div>
            <div className="sc-verdict-sub">Coffee costs more than groceries.<br />Your feet live better than your kitchen.</div>
          </div>
          <div className="sc-footer">
            <div className="sc-footer-left">
              <span className="sc-footer-name">spentt</span>
              <span className="sc-footer-dot" />
            </div>
            <span className="sc-footer-url">spentt.app</span>
          </div>
        </div>

        <button className="sc-action-btn" onClick={() => showToast('Card saved to camera roll!')}>
          Save as image
        </button>
        <button className="sc-cancel-btn" onClick={() => goTo('receipt')}>
          Cancel
        </button>
      </div>
    </div>
  )
}
