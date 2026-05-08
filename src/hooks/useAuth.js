import { useState, useEffect } from 'react'
import { loadGoogleScript } from '../auth/googleAuth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spentt-user')
    return saved ? JSON.parse(saved) : null
  })

  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('spentt-access-token')
    if (!token) return null
    const expiry = localStorage.getItem('spentt-token-expiry')
    if (!expiry) return token
    if (Date.now() >= parseInt(expiry)) {
      localStorage.removeItem('spentt-access-token')
      return null
    }
    return token
  })

  const [driveAccess, setDriveAccess] = useState(() => {
    const token = localStorage.getItem('spentt-access-token')
    if (!token) return false
    const expiry = localStorage.getItem('spentt-token-expiry')
    if (!expiry) return true
    return Date.now() < parseInt(expiry)
  })

  const [tokenExpired, setTokenExpired] = useState(() => {
    const hadAccess = localStorage.getItem('spentt-had-drive-access')
    const token = localStorage.getItem('spentt-access-token')
    const expiry = localStorage.getItem('spentt-token-expiry')
    if (!hadAccess) return false
    if (!token) return true
    if (!expiry) return false
    return Date.now() >= parseInt(expiry)
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const safetyTimer = setTimeout(() => setLoading(false), 3000)
    loadGoogleScript()
      .then(() => { clearTimeout(safetyTimer); setLoading(false) })
      .catch(() => { clearTimeout(safetyTimer); setLoading(false) })
    return () => clearTimeout(safetyTimer)
  }, [])

  // Check token expiry every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem('spentt-token-expiry')
      if (expiry && Date.now() >= parseInt(expiry)) {
        setAccessToken(null)
        setDriveAccess(false)
        setTokenExpired(true)
        localStorage.removeItem('spentt-access-token')
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const login = () => {
    setTokenExpired(false)
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

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` },
            })
            const profile = await res.json()
            const existingUser = localStorage.getItem('spentt-user')
            const existingData = existingUser ? JSON.parse(existingUser) : null
            const userData = {
              name: profile.given_name || profile.name || profile.email?.split('@')[0],
              email: profile.email,
              picture: profile.picture,
              first_seen: existingData?.first_seen || new Date().toISOString(),
            }
            setUser(userData)
            localStorage.setItem('spentt-user', JSON.stringify(userData))

            fetch('/api/track-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                secret: import.meta.env.VITE_API_SECRET,
              }),
            }).catch(console.error)
          } catch (e) {
            console.error('Failed to fetch user info', e)
          }

          if (!hasDriveAccess) {
            setDriveAccess(false)
            localStorage.removeItem('spentt-access-token')
            localStorage.removeItem('spentt-had-drive-access')
            localStorage.removeItem('spentt-token-expiry')
            return
          }

          const expiry = Date.now() + 55 * 60 * 1000
          setAccessToken(token)
          setDriveAccess(true)
          setTokenExpired(false)
          localStorage.setItem('spentt-access-token', token)
          localStorage.setItem('spentt-token-expiry', expiry.toString())
          localStorage.setItem('spentt-had-drive-access', 'true')
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
    localStorage.removeItem('spentt-had-drive-access')
    localStorage.removeItem('spentt-token-expiry')
    setUser(null)
    setAccessToken(null)
    setDriveAccess(false)
    setTokenExpired(false)
  }

  return { user, accessToken, driveAccess, tokenExpired, loading, login, logout }
}