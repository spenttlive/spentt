import { useEffect } from 'react'
import './LoginScreen.css'

export default function LoginScreen({ onLogin }) {
  useEffect(() => {
    if (!window.google) return
    // Render button handled by onLogin from useAuth
  }, [])

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-text">spentt</span>
          <span className="login-logo-dot" />
        </div>
        <div className="login-tagline">Know where it went.</div>

        <div className="login-illustration">💸</div>

        <div className="login-pitch">
          <div className="login-pitch-title">Your money. Your data.</div>
          <div className="login-pitch-sub">
            Expenses stored in your own Google Drive.{'\n'}
            We never see your data. Ever.
          </div>
        </div>

        <div className="login-perks">
          <div className="login-perk">✓ Free forever</div>
          <div className="login-perk">✓ No bank linking</div>
          <div className="login-perk">✓ Privacy first</div>
        </div>

        <button className="google-login-btn" onClick={onLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            width="20"
            height="20"
          />
          Continue with Google
        </button>

        <div className="login-note">
          By continuing you agree to our terms. Your data lives in your Google Drive.
        </div>
      </div>
    </div>
  )
}