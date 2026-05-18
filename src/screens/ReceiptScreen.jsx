import { useState } from 'react'
import { getCat } from '../data/categories'
import {
  getWeekExpenses, getLastWeekExpenses,
  getCategoryBreakdown, generateVerdict,
  fmtWeekRange, fmtLastWeekRange, getWeekRange
} from '../utils/receipt'
import './ReceiptScreen.css'

export default function ReceiptScreen({ expenses, goTo, currency }) {
  const sym = currency?.symbol || '₹'
  const [selectedWeek, setSelectedWeek] = useState('current')

  const weekExp = getWeekExpenses(expenses)
  const lastWeekExp = getLastWeekExpenses(expenses)

  // Auto switch to last week if current week is empty
  const activeExp = selectedWeek === 'current'
    ? (weekExp.length > 0 ? weekExp : lastWeekExp)
    : lastWeekExp

  const isShowingLastWeek = selectedWeek === 'last' ||
    (selectedWeek === 'current' && weekExp.length === 0)

  const breakdown = getCategoryBreakdown(activeExp)
  const verdict = generateVerdict(activeExp)
  const total = activeExp.reduce((s, e) => s + e.amount, 0)
  const { start, end } = getWeekRange()
  const dateRange = isShowingLastWeek ? fmtLastWeekRange() : fmtWeekRange(start, end)

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

      {/* Week selector */}
      <div className="week-selector">
        <div
          className={`week-tab ${selectedWeek === 'current' ? 'active' : ''}`}
          onClick={() => setSelectedWeek('current')}
        >
          This week
          {weekExp.length === 0 && <span className="week-tab-empty"> · empty</span>}
        </div>
        <div
          className={`week-tab ${selectedWeek === 'last' ? 'active' : ''}`}
          onClick={() => setSelectedWeek('last')}
        >
          Last week
          {lastWeekExp.length > 0 && selectedWeek !== 'last' && (
            <span className="week-tab-dot" />
          )}
        </div>
      </div>

      {/* Auto-switched notice */}
      {selectedWeek === 'current' && weekExp.length === 0 && lastWeekExp.length > 0 && (
        <div className="week-notice">
          Nothing logged this week yet — showing last week's receipt.
        </div>
      )}

      <div className="rec-card">
        <div className="rec-head">
          <div className="rec-brand">
            <span className="rec-brand-name">spentt</span>
            <span className="rec-brand-dot" />
          </div>
          <div className="rec-tagline">know where it went</div>
          <div className="rec-meta">
            <span>{dateRange}</span>
            <span>{activeExp.length} TRANSACTIONS</span>
          </div>
        </div>

        <div className="rec-dashed" />

        {breakdown.length === 0 ? (
          <div className="rec-empty">
            {isShowingLastWeek
              ? 'No expenses logged last week either.'
              : 'No expenses logged this week yet.'}
          </div>
        ) : (
          <div className="rec-body">
            <div className="rec-section-label">By category</div>
            {breakdown.map(({ cat, amt, pct, color, emoji }) => (
              <div key={cat} className="rec-row">
                <div className="rec-row-top">
                  <span className="rec-cat">{emoji} {cat}</span>
                  <span className="rec-amt">{sym}{amt.toLocaleString()}</span>
                </div>
                <div className="rec-bar-wrap">
                  <div className="rec-bar" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rec-solid" />
        <div className="rec-total-row">
          <span className="rec-total-label">Total</span>
          <span className="rec-total-amt">{sym}{total.toLocaleString()}</span>
        </div>
        <div className="rec-dashed" />

        <div className="rec-verdict">
          <div className="rec-verdict-label">Verdict</div>
          <div className="rec-verdict-name">{verdict.personality}</div>
          <div className="rec-verdict-sub">{verdict.line1}<br />{verdict.line2}</div>
        </div>

        <div className="rec-bc">
          <div className="bc-bars">
            {ws.map((w, i) => (
              <span key={i} style={{ width: w, height: hs[i], background: 'var(--text)', display: 'block', borderRadius: 1 }} />
            ))}
          </div>
          <div className="bc-num">
            {breakdown.slice(0, 4).map((b) => b.amt).join(' · ')}
          </div>
        </div>
      </div>

      <button className="share-btn" onClick={() => goTo('share')}>
        Share this receipt ↗
      </button>
    </div>
  )
}