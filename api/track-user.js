import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const API_SECRET = process.env.API_SECRET

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name, picture, expense_count, secret } = req.body

  if (!secret || secret !== API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    // Build update object — only include expense_count if explicitly provided
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