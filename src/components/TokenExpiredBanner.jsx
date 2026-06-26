import './TokenExpiredBanner.css'

export default function TokenExpiredBanner({ onRefresh }) {
  return (
    <div className="token-modal-overlay">
      <div className="token-modal">
        <div className="token-modal-icon">⚠️</div>
        <div className="token-modal-title">Session expired</div>
        <div className="token-modal-sub">
          Your Google connection timed out. Reconnect now so your expenses save properly — anything you add right now won't be saved until you do.
        </div>
        <button className="token-modal-btn" onClick={onRefresh}>
          Reconnect now →
        </button>
      </div>
    </div>
  )
}