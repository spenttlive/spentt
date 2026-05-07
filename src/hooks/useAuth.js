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
    loadGoogleScript().then(() => {
      // If user was previously logged in, try silent token refresh
      const savedUser = localStorage.getItem('spentt-user')
      const hadDriveAccess = localStorage.getItem('spentt-had-drive-access')

      if (savedUser && hadDriveAccess) {
        // Silently request new access token
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.appdata openid email profile',
          prompt: '', // Empty string = no prompt if previously authorized
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              const grantedScopes = tokenResponse.scope || ''
              const hasDrive = grantedScopes.includes('drive.appdata') || grantedScopes.includes('drive')
              if (hasDrive) {
                setAccessToken(tokenResponse.access_token)
                setDriveAccess(true)
                localStorage.setItem('spentt-access-token', tokenResponse.access_token)
              }
            }
            setLoading(false)
          },
        })
        tokenClient.requestAccessToken({ prompt: '' })
      } else {
        setLoading(false)
      }
    })
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

          // Always fetch user info
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

            // Track user
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

          // Check Drive access
          if (!hasDriveAccess) {
            setDriveAccess(false)
            localStorage.removeItem('spentt-access-token')
            localStorage.removeItem('spentt-had-drive-access')
            return
          }

          setAccessToken(token)
          setDriveAccess(true)
          localStorage.setItem('spentt-access-token', token)
          // Remember that this user previously granted Drive access
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
    setUser(null)
    setAccessToken(null)
    setDriveAccess(false)
  }

  return { user, accessToken, driveAccess, loading, login, logout }
}