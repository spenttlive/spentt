import { fmtDateShort, fmtTime } from './dateHelpers'

export function exportToCsv(expenses) {
  const headers = ['Date', 'Time', 'Description', 'Category', 'Amount (₹)']

  const rows = expenses
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .map((e) => [
      fmtDateShort(e.ts),
      fmtTime(e.ts),
      `"${e.desc.replace(/"/g, '""')}"`,
      e.cat,
      e.amount,
    ])

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `spentt-expenses-${new Date().toLocaleDateString('en-CA')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}