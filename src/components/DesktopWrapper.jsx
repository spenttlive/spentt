import './DesktopWrapper.css'

export default function DesktopWrapper({ children }) {
  return (
    <div className="desktop-outer">
      {/* Left side — marketing */}
      <div className="desktop-left">
        <div className="desktop-brand">
          spentt<span className="desktop-brand-dot" />
        </div>
        <h1 className="desktop-headline">
          Know where<br />it went.
        </h1>
        <p className="desktop-sub">
          The honest expense tracker that tells you exactly where your money went — with a smile.
        </p>
        <div className="desktop-perks">
          <div className="desktop-perk">✓ Free forever</div>
          <div className="desktop-perk">✓ No bank linking</div>
          <div className="desktop-perk">✓ Your data in your Google Drive</div>
          <div className="desktop-perk">✓ Installs on your phone as an app</div>
        </div>
        <div className="desktop-phone-hint">
          📱 Best experienced on mobile — open <strong>spentt.live</strong> on your phone
        </div>
      </div>

      {/* Right side — phone frame with app */}
      <div className="desktop-right">
        <div className="desktop-phone-frame">
          <div className="desktop-phone-notch" />
          <div className="desktop-phone-screen">
            {children}
          </div>
          <div className="desktop-phone-home" />
        </div>
      </div>
    </div>
  )
}