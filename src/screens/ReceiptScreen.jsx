import { getCat } from '../data/categories'
import './ReceiptScreen.css'

export default function ReceiptScreen({ expenses, totalSpent, goTo }) {
  const catMap = {}
  expenses.forEach((e) => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount })
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1])

  const ws = [2,1,3,1,2,3,1,2,1,3,2,1,2,3,1,2,1,3,2,1,3,2,1,2,3,1,2,3,1,2]
  const hs = [26,18,28,16,22,28,20,26,16,28,22,18,28,14,22,26,18,16,28,22,26,16,20,28,14,22,24,16,20,28]

  return (
    <div className="screen receipt-screen">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="back-btn" onClick={() => goTo('home')}>←</span>
          <span style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700 }}>Weekly Receipt</span>
        </div>
        <span className="share-icon" onClick={() => goTo('share')}>⬆</span>
      </div>

      <div className="rec-card">
        <div className="rec-head">
          <div className="rec-brand">
            <span className="rec-brand-name">spentt</span>
            <span className="rec-brand-dot" />
          </div>
          <div className="rec-tagline">know where it went</div>
          <div className="rec-meta">
            <span>22 APR – 01 MAY</span>
            <span>{expenses.length} TRANSACTIONS</span>
          </div>
        </div>

        <div className="rec-dashed" />
        <div className="rec-body">
          <div className="rec-section-label">By category</div>
          {sorted.map(([cat, amt]) => {
            const c = getCat(cat)
            const pct = Math.round((amt / totalSpent) * 100)
            return (
              <div key={cat} className="rec-row">
                <div className="rec-row-top">
                  <span className="rec-cat">{c.emoji} {cat}</span>
                  <span className="rec-amt">₹{amt.toLocaleString()}</span>
                </div>
                <div className="rec-bar-wrap">
                  <div className="rec-bar" style={{ width: `${pct}%`, background: c.color }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="rec-solid" />
        <div className="rec-total-row">
          <span className="rec-total-label">Total</span>
          <span className="rec-total-amt">₹{totalSpent.toLocaleString()}</span>
        </div>
        <div className="rec-dashed" />

        <div className="rec-verdict">
          <div className="rec-verdict-label">Verdict</div>
          <div className="rec-verdict-name">Comfortable Contradictionist</div>
          <div className="rec-verdict-sub">Coffee costs more than groceries.<br />Your feet live better than your kitchen.</div>
        </div>

        <div className="rec-bc">
          <div className="bc-bars">
            {ws.map((w, i) => (
              <span key={i} style={{ width: w, height: hs[i], background: 'var(--text)', display: 'block', borderRadius: 1 }} />
            ))}
          </div>
          <div className="bc-num">{sorted.slice(0, 4).map(([, a]) => a).join(' · ')}</div>
        </div>
      </div>

      <button className="share-btn" onClick={() => goTo('share')}>Share this receipt ↗</button>
    </div>
  )
}
