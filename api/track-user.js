const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
)

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, name, picture, expense_count } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email required' })
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          email,
          name,
          picture,
          expense_count: expense_count || 0,
          last_seen: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select()

    if (error) throw error

    return res.status(200).json({ success: true, data })
  } catch (err) {
    console.error('Track user error:', err)
    return res.status(500).json({ error: err.message })
  }
}