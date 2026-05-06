import { useState, useEffect } from 'react'
import './AdminScreen.css'

export default function AdminScreen({ onBack }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [adminPassword, setAdminPassword] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Wrong password')
      setUsers(data.users)
      setAdminPassword(password)
      setAuthed(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUsers(data.users)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const totalExpenses = users.reduce((s, u) => s + (u.expense_count || 0), 0)
  const today = new Date().toLocaleDateString('en-CA')
  const todayUsers = users.filter((u) => u.last_seen?.slice(0, 10) === today).length

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-logo">
            spentt<span className="admin-logo-dot" /> admin
          </div>
          <input
            className="admin-input"
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {error && <div className="admin-error">{error}</div>}
          <button className="admin-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Checking...' : 'Enter →'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-screen">
      <div className="admin-nav">
        <div className="admin-logo">spentt<span className="admin-logo-dot" /> admin</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="admin-back" onClick={refresh}>↻ Refresh</div>
          <div className="admin-back" onClick={onBack}>← Back</div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-val">{users.length}</div>
            <div className="admin-stat-label">Total users</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-val">{todayUsers}</div>
            <div className="admin-stat-label">Active today</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-val">{totalExpenses}</div>
            <div className="admin-stat-label">Total expenses</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-val">
              {users.length ? Math.round(totalExpenses / users.length) : 0}
            </div>
            <div className="admin-stat-label">Avg per user</div>
          </div>
        </div>

        <div className="admin-section-title">All users</div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-table">
            <div className="admin-table-header">
              <span>User</span>
              <span>Expenses</span>
              <span>Last seen</span>
              <span>Joined</span>
            </div>
            {users.map((u) => (
              <div key={u.id} className="admin-table-row">
                <div className="admin-user">
                  {u.picture && (
                    <img src={u.picture} className="admin-avatar" alt="" />
                  )}
                  <div>
                    <div className="admin-user-name">{u.name || '—'}</div>
                    <div className="admin-user-email">{u.email}</div>
                  </div>
                </div>
                <div className="admin-count">{u.expense_count || 0}</div>
                <div className="admin-date">
                  {u.last_seen
                    ? new Date(u.last_seen).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short',
                      })
                    : '—'}
                </div>
                <div className="admin-date">
                  {u.first_seen
                    ? new Date(u.first_seen).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short',
                      })
                    : '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}