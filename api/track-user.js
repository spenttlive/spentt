import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const API_SECRET = process.env.API_SECRET

// In-memory rate limiter — max 20 requests per IP per minute
const rateLimitMap = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxRequests = 20

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

  const { email, name, picture, expense_count, secret } = req.body

  if (!secret || secret !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const updateData = {
      email,
      name,
      picture,
      last_seen: new Date().toISOString(),
    }

    if (expense_count !== undefined && expense_count !== null) {
      updateData.expense_count = expense_count
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(updateData, { onConflict: 'email' })
      .select()

    if (error) throw error

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Track user error:', err)
    return res.status(500).json({ error: err.message })
  }
}