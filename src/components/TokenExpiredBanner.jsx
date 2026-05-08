import './TokenExpiredBanner.css'

export default function TokenExpiredBanner({ onRefresh }) {
  return (
    <div className="token-banner">
      <div className="token-banner-text">
        <div className="token-banner-title">Session expired</div>
        <div className="token-banner-sub">Tap to reconnect and sync your expenses</div>
      </div>
      <button className="token-banner-btn" onClick={onRefresh}>
        Refresh →
      </button>
    </div>
  )
}