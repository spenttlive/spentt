import './ReceiptTeaser.css'

export default function ReceiptTeaser({ total, topCat, onOpen }) {
  return (
    <div className="rec-teaser" onClick={onOpen}>
      <div className="rec-teaser-label">Weekly summary</div>
      <div className="rec-teaser-title">Your receipt is ready</div>
      <div className="rec-teaser-stats">
        <div className="rec-stat">
          <strong>₹{total.toLocaleString()}</strong>spent
        </div>
        <div className="rec-stat">
          <strong>{topCat}</strong>top category
        </div>
      </div>
      <button className="rec-open-btn">View →</button>
    </div>
  )
}
