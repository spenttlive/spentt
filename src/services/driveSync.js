const FILE_NAME = 'spentt-expenses.json'
const FOLDER = 'appDataFolder'

// Find the expenses file in Drive
async function findFile(token) {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${FILE_NAME}'&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return data.files?.[0] || null
}

// Read expenses from Drive
export async function readFromDrive(token) {
  const file = await findFile(token)
  if (!file) return null

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    const err = new Error(`Drive read failed: ${res.status}`)
    err.status = res.status
    throw err
  }
  const data = await res.json()
  return data
}

// Write expenses to Drive
export async function writeToDrive(token, expenses) {
  const file = await findFile(token)
  const content = JSON.stringify({ expenses, updatedAt: new Date().toISOString() })
  const blob = new Blob([content], { type: 'application/json' })

  if (file) {
    // Update existing file
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: blob,
      }
    )
    if (!res.ok) {
      const err = new Error(`Drive write failed: ${res.status}`)
      err.status = res.status
      throw err
    }
  } else {
    // Create new file
    const metadata = {
      name: FILE_NAME,
      parents: [FOLDER],
    }
    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
    form.append('file', blob)

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    )
    if (!res.ok) {
      const err = new Error(`Drive create failed: ${res.status}`)
      err.status = res.status
      throw err
    }
  }
}