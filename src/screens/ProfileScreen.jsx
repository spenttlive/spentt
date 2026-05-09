import './ProfileScreen.css'

export default function ProfileScreen({ user, expenses, totalSpent, goTo, showToast }) {
  return (
    <div className="screen profile-screen">
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="back-btn" onClick={() => goTo('settings')}>←</span>
          <span style={{ fontFamily: 'var(--fh)', fontSize: 20, fontWeight: 700 }}>Profile</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }} onClick={() => showToast('Saved')}>Save</span>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar-lg" style={{ padding: 0, overflow: 'hidden' }}>
        {user?.picture ? (
        <img
        src={user.picture}
        alt={user?.name || 'User'}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { e.target.style.display = 'none' }}
        />
        ) : (
        user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'
        )}
        </div>
        <div className="profile-name">{user?.name || user?.email?.split('@')[0] || 'User'}</div>
        <div className="profile-email">{user.email}</div>
      </div>

      <div className="profile-stats">
        <div className="p-stat">
          <div className="p-stat-val">₹{totalSpent.toLocaleString()}</div>
          <div className="p-stat-label">This week</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-val">{expenses.length}</div>
          <div className="p-stat-label">Expenses</div>
        </div>
        <div className="p-stat">
          <div className="p-stat-val">10</div>
          <div className="p-stat-label">Days active</div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-group">
          <div className="settings-row" onClick={() => showToast('Name edit coming soon')}>
            <div className="settings-row-left">
              <div className="settings-icon" style={{ background: '#FFF0E8' }}>✏️</div>
              <div className="settings-label">Display name</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="settings-value">{user.name}</span>
              <span style={{ color: 'var(--text3)' }}>›</span>
            </div>
          </div>
          <div className="settings-row" onClick={() => showToast('🎭 Comfortable Contradictionist')}>
            <div className="settings-row-left">
              <div className="settings-icon" style={{ background: '#F5EEFF' }}>🎭</div>
              <div className="settings-label">Spending personality</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="settings-value" style={{ fontSize: 11 }}>Contradictionist</span>
              <span style={{ color: 'var(--text3)' }}>›</span>
            </div>
          </div>
        </div>
        <div className="settings-group">
          <div className="settings-row">
            <div className="settings-row-left">
            <div className="settings-icon" style={{ background: '#EDFAF4' }}>📅</div>
            <div className="settings-label">Member since</div>
            </div>
            <span className="settings-value">
            {user?.first_seen
             ? new Date(user.first_seen).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
             : new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
