import { useState, useEffect } from 'react'
import { loadGoogleScript } from '../auth/googleAuth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata'

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spentt-user')
    return saved ? JSON.parse(saved) : null
  })
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('spentt-access-token') || null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGoogleScript().then(() => {
      setLoading(false)
    })
  }, [])

  const login = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse) => {
        if (tokenResponse.access_token) {
          const token = tokenResponse.access_token
          setAccessToken(token)
          localStorage.setItem('spentt-access-token', token)

          // Fetch user profile
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` },
          })
          const profile = await res.json()
          const userData = {
            name: profile.given_name || profile.name,
            email: profile.email,
            picture: profile.picture,
          }
          setUser(userData)
          localStorage.setItem('spentt-user', JSON.stringify(userData))
        }
      },
    })
    client.requestAccessToken()
  }

  const logout = () => {
    if (accessToken) {
      window.google.accounts.oauth2.revoke(accessToken)
    }
    localStorage.removeItem('spentt-user')
    localStorage.removeItem('spentt-access-token')
    setUser(null)
    setAccessToken(null)
  }

  return { user, accessToken, loading, login, logout }
}