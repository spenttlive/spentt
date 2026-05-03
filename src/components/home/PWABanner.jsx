import './PWABanner.css'

export default function PWABanner({ show, onInstall, onDismiss }) {
  if (!show) return null
  return (
    <div className="pwa-banner">
      <div className="pwa-icon">
        s<div className="pwa-icon-dot" />
      </div>
      <div className="pwa-text">
        <div className="pwa-title">Add Spentt to home screen</div>
        <div className="pwa-sub">Log expenses faster, always one tap away</div>
      </div>
      <button className="pwa-btn" onClick={onInstall}>Add</button>
      <div className="pwa-dismiss" onClick={onDismiss}>✕</div>
    </div>
  )
}
