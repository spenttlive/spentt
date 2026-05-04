import { useState } from 'react'
import './SettingsScreen.css'

const CURRENCIES = ['₹ INR', '$ USD', '€ EUR', '£ GBP']

function SettingsRow({ icon, iconBg, label, value, danger, toggle, onToggle, onClick }) {
  return (
    <div className={`settings-row ${danger ? 'danger' : ''}`} onClick={onClick}>
      <div className="settings-row-left">
        <div className="settings-icon" style={{ background: iconBg }}>{icon}</div>
        <div className="settings-label" style={danger ? { color: 'var(--accent)' } : {}}>{label}</div>
      </div>
      {toggle !== undefined ? (
        <div
          className={`toggle ${toggle ? 'on' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggle() }}
        />
      ) : value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="settings-value">{value}</span>
          <span className="settings-arrow">›</span>
        </div>
      ) : (
        <span className="settings-arrow">›</span>
      )}
    </div>
  )
}

export default function SettingsScreen({ user, goTo, showToast, dark, toggleDark }) {
  const [currIdx, setCurrIdx] = useState(0)
  const [reminder, setReminder] = useState(true)

  return (
    <div className="screen settings-screen">
      <div className="topbar">
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Preferences</div>
          <div style={{ fontFamily: 'var(--fh)', fontSize: 26, fontWeight: 700 }}>Settings</div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-group">
          <SettingsRow
            icon="👤" iconBg="#FFF0E8" label="Profile" value={user.name}
            onClick={() => goTo('profile')}
          />
          <SettingsRow
            icon="📧" iconBg="#EAF2FF" label="Google account" value="Connected"
            onClick={() => showToast(`Connected: ${user.email}`)}
          />
        </div>

        <div className="settings-group">
          <SettingsRow
            icon="💱" iconBg="#EDFAF4" label="Currency"
            value={CURRENCIES[currIdx]}
            onClick={() => {
              const next = (currIdx + 1) % CURRENCIES.length
              setCurrIdx(next)
              showToast('Currency: ' + CURRENCIES[next])
            }}
          />
          <SettingsRow
            icon="🔔" iconBg="#F5EEFF" label="Weekly reminder"
            toggle={reminder}
            onToggle={() => {
              setReminder(!reminder)
              showToast(!reminder ? 'Sunday reminders on' : 'Sunday reminders off')
            }}
          />
          <SettingsRow
            icon="🌙" iconBg="#1A1713" label="Dark mode"
            toggle={dark}
            onToggle={toggleDark}
          />
        </div>

        <div className="settings-group">
          <SettingsRow
            icon="📤" iconBg="#EDFAF4" label="Export data"
            onClick={() => showToast('CSV export coming soon')}
          />
          <SettingsRow
            icon="🔒" iconBg="#EAF2FF" label="Privacy" value="Your Drive"
            onClick={() => showToast('Your data lives only in your Google Drive')}
          />
        </div>

        <div className="settings-group">
          <SettingsRow
            icon="🚪" iconBg="#FFE8E8" label="Sign out" danger
            onClick={() => showToast('Sign out coming with Google OAuth')}
          />
        </div>
      </div>
    </div>
  )
}