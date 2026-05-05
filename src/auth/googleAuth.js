const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function loadGoogleScript() {
  return new Promise((resolve) => {
    if (document.getElementById('google-gsi')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = 'google-gsi'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    document.body.appendChild(script)
  })
}

export function initGoogleAuth() {
  return new Promise((resolve) => {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: resolve,
      auto_select: true,
    })
  })
}

export function signInWithGoogle() {
  return new Promise((resolve, reject) => {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          const user = parseJwt(response.credential)
          resolve({
            name: user.given_name || user.name,
            email: user.email,
            picture: user.picture,
            token: response.credential,
          })
        } else {
          reject(new Error('No credential'))
        }
      },
    })
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to button click
        const btn = document.getElementById('google-signin-btn')
        if (btn) btn.click()
      }
    })
  })
}

export function signOut() {
  window.google.accounts.id.disableAutoSelect()
  localStorage.removeItem('spentt-user')
}

function parseJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64).split('').map((c) =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  )
  return JSON.parse(json)
}