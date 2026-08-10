import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Rate limiter — max 10 attempts per IP per minute
const rateLimitMap = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxRequests = 10

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  const entry = rateLimitMap.get(ip)

  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (entry.count >= maxRequests) return true

  entry.count++
  return false
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(ip)
  }
}, 5 * 60 * 1000)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.spentt.live')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  const { password } = req.body

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('last_seen', { ascending: false })

    if (error) throw error

    return res.status(200).json({ users: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}