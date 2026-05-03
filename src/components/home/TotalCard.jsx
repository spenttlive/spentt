import './TotalCard.css'

export default function TotalCard({ total, txCount, avg }) {
  return (
    <div className="total-card">
      <div className="total-label">Total spent</div>
      <div className="total-amt">
        <sup>₹</sup>{total.toLocaleString()}
      </div>
      <div className="total-chips">
        <div className="chip">
          <div className="chipdot" style={{ background: '#F5A623' }} />
          <span>{txCount} expenses</span>
        </div>
        <div className="chip">
          <div className="chipdot" style={{ background: '#3AAE8A' }} />
          <span>₹{avg.toLocaleString()} avg</span>
        </div>
        <div className="chip">
          <div className="chipdot" style={{ background: '#E85480' }} />
          <span>10 days</span>
        </div>
      </div>
    </div>
  )
}
