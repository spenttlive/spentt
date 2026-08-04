import { useState } from 'react'
import './SettingsScreen.css'
import { exportToCsv } from '../utils/exportCsv'

function SettingsRow({ icon, iconBg, label, value, danger, toggle, onToggle, onClick }) {
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

export default function SettingsScreen({ user, goTo, showToast, dark, toggleDark, logout, expenses, currency, setCurrency, CURRENCIES }) {
  const [reminder, setReminder] = useState(true)
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false)

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
          <SettingsRow icon="👤" iconBg="#FFF0E8" label="Profile" value={user?.name} onClick={() => goTo('profile')} />
          <SettingsRow icon="📧" iconBg="#EAF2FF" label="Google account" value="Connected" onClick={() => showToast(`Connected: ${user?.email}`)} />
        </div>

        <div className="settings-group">
          <SettingsRow
            icon="💱" iconBg="#EDFAF4" label="Currency"
            value={currency.label}
            onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
          />
          {showCurrencyPicker && (
            <div className="currency-picker">
              {CURRENCIES.map((c) => (
                <div
                  key={c.code}
                  className={`currency-option ${currency.code === c.code ? 'active' : ''}`}
                  onClick={() => { setCurrency(c.code); setShowCurrencyPicker(false); showToast(`Currency: ${c.label}`) }}
                >
                  <span className="currency-symbol">{c.symbol}</span>
                  <span className="currency-label">{c.label}</span>
                  {currency.code === c.code && <span className="currency-check">✓</span>}
                </div>
              ))}
            </div>
          )}
          <SettingsRow
            icon="🔔" iconBg="#F5EEFF" label="Weekly reminder"
            toggle={reminder}
            onToggle={() => { setReminder(!reminder); showToast(!reminder ? 'Sunday reminders on' : 'Sunday reminders off') }}
          />
          <SettingsRow
            icon="🌙" iconBg="#F4F4F4" label="Dark mode"
            toggle={dark}
            onToggle={toggleDark}
          />
        </div>

        <div className="settings-group">
          <SettingsRow
            icon="📤" iconBg="#EDFAF4" label="Export data"
            onClick={() => {
              if (expenses.length === 0) { showToast('No expenses to export'); return }
              exportToCsv(expenses)
              showToast('CSV downloaded!')
            }}
          />
          <SettingsRow icon="🔒" iconBg="#EAF2FF" label="Privacy policy" onClick={() => window.open('/privacy.html', '_blank')} />
          <SettingsRow icon="📄" iconBg="#F5EEFF" label="Terms of service" onClick={() => window.open('/terms.html', '_blank')} />
          <SettingsRow icon="❓" iconBg="#EAF2FF" label="FAQ & Help" onClick={() => window.open('/faq.html', '_blank')} />
        </div>

        {user?.email === 'spentt.live@gmail.com' && (
          <div className="settings-group">
            <SettingsRow icon="👑" iconBg="#FFF6E0" label="Admin dashboard" onClick={() => goTo('admin')} />
          </div>
        )}

        <div className="settings-group">
          <SettingsRow icon="🚪" iconBg="#FFE8E8" label="Sign out" danger onClick={() => { logout() }} />
        </div>
      </div>
    </div>
  )
}