import { useState, useEffect } from 'react'
import { loadGoogleScript } from '../auth/googleAuth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spentt-user')
    return saved ? JSON.parse(saved) : null
  })
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('spentt-access-token') || null
  })
  const [driveAccess, setDriveAccess] = useState(() => {
    return !!localStorage.getItem('spentt-access-token')
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGoogleScript().then(() => setLoading(false))
  }, [])

  const login = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.appdata openid email profile',
      callback: async (tokenResponse) => {
        if (tokenResponse.access_token) {
          const token = tokenResponse.access_token
          const grantedScopes = tokenResponse.scope || ''
          const hasDriveAccess =
            grantedScopes.includes('drive.appdata') ||
            grantedScopes.includes('drive')

          // Always fetch and set user info first
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` },
            })
            const profile = await res.json()
            const userData = {
              name: profile.given_name || profile.name || profile.email?.split('@')[0],
              email: profile.email,
              picture: profile.picture,
            }
            setUser(userData)
            localStorage.setItem('spentt-user', JSON.stringify(userData))
            // Track user in Supabase
            fetch('/api/track-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                expense_count: 0,
                secret: import.meta.env.VITE_API_SECRET,
                }),
            }).catch(console.error)
          } catch (e) {
            console.error('Failed to fetch user info', e)
          }

          // Then check Drive access
          if (!hasDriveAccess) {
            setDriveAccess(false)
            localStorage.removeItem('spentt-access-token')
            return
          }

          setAccessToken(token)
          setDriveAccess(true)
          localStorage.setItem('spentt-access-token', token)
        }
      },
    })
    tokenClient.requestAccessToken()
  }

  const logout = () => {
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken)
    }
    localStorage.removeItem('spentt-user')
    localStorage.removeItem('spentt-access-token')
    setUser(null)
    setAccessToken(null)
    setDriveAccess(false)
  }

  return { user, accessToken, driveAccess, loading, login, logout }
}