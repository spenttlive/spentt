import { useState, useEffect } from 'react'
import { buildGreeting } from '../utils/greeting'

export function useGreeting(name, expenses) {
  const [greeting, setGreeting] = useState(() => buildGreeting(name, expenses))

  useEffect(() => {
    setGreeting(buildGreeting(name, expenses))
    const interval = setInterval(() => {
      setGreeting(buildGreeting(name, expenses))
    }, 60000)
    return () => clearInterval(interval)
  }, [name, expenses])

  return greeting
}
