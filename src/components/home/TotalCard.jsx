import './TotalCard.css'

export default function TotalCard({ total, txCount, avg, currency, comparisonPct, comparisonLabel }) {
  const sym = currency?.symbol || '₹'
  const showComparison = comparisonPct !== null && comparisonPct !== undefined && isFinite(comparisonPct)

  return (
    <div className="total-card">
      <div className="total-label-row">
        <div className="total-label">Total spent</div>
        {showComparison && (
          <div className={`comparison-badge ${comparisonPct > 0 ? 'up' : comparisonPct < 0 ? 'down' : 'flat'}`}>
            {comparisonPct > 0 ? '↑' : comparisonPct < 0 ? '↓' : '–'} {Math.abs(comparisonPct)}% {comparisonLabel}
          </div>
        )}
      </div>
      <div className="total-amt">
        <sup>{sym}</sup>{Math.round(total).toLocaleString()}
      </div>
      <div className="total-chips">
        <div className="chip">
          <div className="chipdot" style={{ background: '#F5A623' }} />
          <span>{txCount} expenses</span>
        </div>
        <div className="chip">
          <div className="chipdot" style={{ background: '#3AAE8A' }} />
          <span>{sym}{Math.round(avg).toLocaleString()} avg</span>
        </div>
      </div>
    </div>
  )
}