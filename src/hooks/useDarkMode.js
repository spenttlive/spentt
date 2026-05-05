import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('spentt-theme') === 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.setAttribute('data-theme', 'dark')
      localStorage.setItem('spentt-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
      localStorage.setItem('spentt-theme', 'light')
    }
  }, [dark])

  const toggle = () => setDark((d) => !d)

  return { dark, toggle }
}