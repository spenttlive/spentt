import { useEffect } from 'react'
import './LoginScreen.css'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginScreen({ onLogin }) {
  useEffect(() => {
    if (!window.google) return
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          const base64 = response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
          const json = decodeURIComponent(
            atob(base64).split('').map((c) =>
              '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
          )
          const profile = JSON.parse(json)
          onLogin({
            name: profile.given_name || profile.name,
            email: profile.email,
            picture: profile.picture,
          })
        }
      },
    })
    window.google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      {
        theme: 'outline',
        size: 'large',
        width: 280,
        text: 'continue_with',
        shape: 'pill',
      }
    )
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

        <div id="google-btn" className="google-btn-wrap" />

        <div className="login-note">
          By continuing you agree to our terms. Your data lives in your Google Drive.
        </div>
      </div>
    </div>
  )
}