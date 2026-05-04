export function dateKey(d) {
  const date = new Date(d)
  return date.toLocaleDateString('en-CA')
}

export function today() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function daysAgo(n) {
  const d = today()
  d.setDate(d.getDate() - n)
  return d
}

export function fmtDateShort(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function fmtTime(d) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export function fmtMonthYear(d) {
  return new Date(d).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function isSameDay(a, b) {
  return dateKey(a) === dateKey(b)
}
