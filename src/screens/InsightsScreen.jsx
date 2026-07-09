import { useState } from 'react'
import { getCat } from '../data/categories'
import './InsightsScreen.css'

function getMonthExpenses(expenses, monthOffset = 0) {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
  return expenses.filter((e) => {
    const d = new Date(e.ts)
    return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear()
  })
}

function getMonthName(offset = 0) {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth() - offset, 1)
  return target.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function buildCategoryData(expenses) {
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const catMap = {}
  expenses.forEach((e) => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount })
  return { total, catMap }
}

export default function InsightsScreen({ expenses, goTo, currency }) {
  const sym = currency?.symbol || '₹'
  const [tab, setTab] = useState(0) // 0 = this month, 1 = last month, 2 = 2 months ago

  const thisMonth = getMonthExpenses(expenses, 0)
  const lastMonth = getMonthExpenses(expenses, 1)
  const twoMonths = getMonthExpenses(expenses, 2)

  const current = tab === 0 ? thisMonth : tab === 1 ? lastMonth : twoMonths
  const compare = tab === 0 ? lastMonth : tab === 1 ? twoMonths : getMonthExpenses(expenses, 3)

  const { total: currentTotal, catMap: currentCats } = buildCategoryData(current)
  const { catMap: compareCats } = buildCategoryData(compare)

  const sortedCats = Object.entries(currentCats)
    .sort((a, b) => b[1] - a[1])

  const compareTotal = compare.reduce((s, e) => s + e.amount, 0)
  const totalChangePct = compareTotal > 0
    ? Math.round(((currentTotal - compareTotal) / compareTotal) * 100)
    : null

  const compareMonthName = tab === 0 ? getMonthName(1) : tab === 1 ? getMonthName(2) : getMonthName(3)
  const currentMonthName = getMonthName(tab)

  return (
    <div className="screen insights-screen">
      <div className="topbar" style={{ padding: '52px 24px 16px' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Spending</div>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 700 }}>Insights</div>
        </div>
      </div>

      {/* Month tabs */}
      <div className="insights-tabs">
        {[getMonthName(0), getMonthName(1), getMonthName(2)].map((m, i) => (
          <div
            key={i}
            className={`insights-tab ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
          >
            {m.split(' ')[0]}
          </div>
        ))}
      </div>

      {/* Total card */}
      <div className="insights-total-card">
        <div className="insights-total-left">
          <div className="insights-total-label">Total spent</div>
          <div className="insights-total-val">{sym}{Math.round(currentTotal).toLocaleString()}</div>
          <div className="insights-total-month">{currentMonthName}</div>
        </div>
        {totalChangePct !== null && (
          <div className={`insights-change-badge ${totalChangePct > 0 ? 'up' : 'down'}`}>
            {totalChangePct > 0 ? '↑' : '↓'} {Math.abs(totalChangePct)}%
            <div className="insights-change-label">vs {compareMonthName.split(' ')[0]}</div>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {sortedCats.length === 0 ? (
        <div className="insights-empty">No expenses logged for {currentMonthName}.</div>
      ) : (
        <div className="insights-cats">
          {sortedCats.map(([cat, amt]) => {
            const c = getCat(cat)
            const pct = currentTotal > 0 ? Math.round((amt / currentTotal) * 100) : 0
            const prevAmt = compareCats[cat] || 0
            const changePct = prevAmt > 0
              ? Math.round(((amt - prevAmt) / prevAmt) * 100)
              : null
            const isNew = prevAmt === 0

            return (
              <div key={cat} className="insights-cat-card">
                <div className="insights-cat-top">
                  <div className="insights-cat-left">
                    <div className="insights-cat-icon" style={{ background: c.bg }}>
                      {c.emoji}
                    </div>
                    <div className="insights-cat-name">{cat}</div>
                  </div>
                  <div className="insights-cat-right">
                    <div className="insights-cat-amt">{sym}{Math.round(amt).toLocaleString()}</div>
                    {isNew ? (
                      <div className="insights-cat-change new">new</div>
                    ) : changePct !== null ? (
                      <div className={`insights-cat-change ${changePct > 0 ? 'up' : 'down'}`}>
                        {changePct > 0 ? '↑' : '↓'} {Math.abs(changePct)}%
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="insights-bar-wrap">
                  <div
                    className="insights-bar"
                    style={{ width: `${pct}%`, background: c.color }}
                  />
                </div>
                <div className="insights-bar-meta">
                  <span>{pct}% of total</span>
                  {prevAmt > 0 && (
                    <span>{compareMonthName.split(' ')[0]}: {sym}{Math.round(prevAmt).toLocaleString()}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom actions */}
      <div className="insights-actions">
        <div className="insights-action-label">View your receipts</div>
        <button className="insights-action-btn" onClick={() => goTo('receipt')}>
          🧾 Weekly receipt →
        </button>
        <button className="insights-action-btn insights-action-btn--secondary" onClick={() => goTo('share')}>
          ⬆ Share weekly receipt
        </button>
      </div>

    </div>
  )
}