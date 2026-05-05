import { useState, useEffect } from 'react'
import { loadGoogleScript, signOut } from '../auth/googleAuth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('spentt-user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGoogleScript().then(() => {
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
            const userData = {
              name: profile.given_name || profile.name,
              email: profile.email,
              picture: profile.picture,
            }
            setUser(userData)
            localStorage.setItem('spentt-user', JSON.stringify(userData))
          }
        },
        auto_select: true,
      })
      setLoading(false)
    })
  }, [])

  const logout = () => {
    signOut()
    setUser(null)
  }

  return { user, loading, logout }
}