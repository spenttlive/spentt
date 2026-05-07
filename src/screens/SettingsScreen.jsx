import { useState } from 'react'
import './SettingsScreen.css'
import { exportToCsv } from '../utils/exportCsv'

const CURRENCIES = ['₹ INR', '$ USD', '€ EUR', '£ GBP']

function SettingsRow({ icon, iconBg, label, value, danger, toggle, onToggle, onClick, children }) {
  return (
    <div className={`settings-row ${danger ? 'danger' : ''}`} onClick={onClick}>
      <div className="settings-row-left">
        <div className="settings-icon" style={{ background: iconBg }}>{icon}</div>
        <div className="settings-label" style={danger ? { color: 'var(--accent)' } : {}}>{label}</div>
      </div>
      {toggle !== undefined ? (
        <div className={`toggle ${toggle ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); onToggle() }} />
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

export default function SettingsScreen({ user, goTo, showToast, dark, toggleDark, logout, expenses }) {
  const [currIdx, setCurrIdx] = useState(0)
  const [reminder, setReminder] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

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
          <SettingsRow icon="👤" iconBg="#FFF0E8" label="Profile" value={user.name} onClick={() => goTo('profile')} />
          <SettingsRow icon="📧" iconBg="#EAF2FF" label="Google account" value="Connected" onClick={() => showToast(`Connected: ${user.email}`)} />
        </div>

        <div className="settings-group">
          <SettingsRow
            icon="💱" iconBg="#EDFAF4" label="Currency"
            value={CURRENCIES[currIdx]}
            onClick={() => { const next = (currIdx + 1) % CURRENCIES.length; setCurrIdx(next); showToast('Currency: ' + CURRENCIES[next]) }}
          />
          <SettingsRow icon="🔔" iconBg="#F5EEFF" label="Weekly reminder" toggle={reminder} onToggle={() => { setReminder(!reminder); showToast(!reminder ? 'Sunday reminders on' : 'Sunday reminders off') }} />
          <SettingsRow icon="🌙" iconBg="#F4F4F4" label="Dark mode" toggle={darkMode} onToggle={() => { setDarkMode(!darkMode); showToast('Dark mode coming soon') }} />
        </div>

        <div className="settings-group">
          <SettingsRow
            icon="📤" iconBg="#EDFAF4" label="Export data"
            onClick={() => {
              if (expenses.length === 0) {
                showToast('No expenses to export')
                return
              }
              exportToCsv(expenses)
              showToast('CSV downloaded!')
            }}
          />
          <SettingsRow
            icon="🔒" iconBg="#EAF2FF" label="Privacy policy"
            onClick={() => goTo('privacy')}
          />
          <SettingsRow
            icon="📄" iconBg="#F5EEFF" label="Terms of service"
            onClick={() => goTo('terms')}
          />
          <SettingsRow
            icon="❓" iconBg="#EAF2FF" label="FAQ"
            onClick={() => goTo('faq')}
          />          
        </div>

        {user.email === 'spentt.live@gmail.com' && (
          <div className="settings-group">
          <SettingsRow
          icon="👑" iconBg="#FFF6E0" label="Admin dashboard"
          onClick={() => goTo('admin')}
          />  
          </div>
        )}

        <div className="settings-group">
          <SettingsRow
            icon="🚪" iconBg="#FFE8E8" label="Sign out" danger
            onClick={() => { logout(); }}
          />
        </div>
      </div>
    </div>
  )
}
