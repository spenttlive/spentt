export function buildGreeting(name, expenses, dailyAvg = 895) {
  const now = new Date()
  const hour = now.getHours()
  const dow = now.getDay()
  const dom = now.getDate()
  const month = now.getMonth()
  const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate()

  const todayStr = new Date().toLocaleDateString('en-CA')
  const todayExp = expenses.filter(
  (e) => new Date(e.ts).toLocaleDateString('en-CA') === todayStr
  )
  const todayTotal = todayExp.reduce((s, e) => s + e.amount, 0)

  const todayDate = new Date(); todayDate.setHours(0,0,0,0)
  const weekStart = new Date(todayDate); weekStart.setDate(todayDate.getDate() - dow)
  const lastWeekStart = new Date(weekStart); lastWeekStart.setDate(weekStart.getDate() - 7)
  const lastWeekEnd = new Date(weekStart); lastWeekEnd.setDate(weekStart.getDate() - 1)

  const weekExp = expenses.filter((e) => { const d = new Date(e.ts); d.setHours(0,0,0,0); return d >= weekStart && d <= todayDate })
  const lastWeekExp = expenses.filter((e) => { const d = new Date(e.ts); d.setHours(0,0,0,0); return d >= lastWeekStart && d <= lastWeekEnd })
  const lastWeekTotal = lastWeekExp.reduce((s, e) => s + e.amount, 0)

  let streak = 0
  for (let i = 0; i < 366; i++) {
  const d = new Date(todayDate)
  d.setDate(d.getDate() - i)
  const k = d.toLocaleDateString('en-CA')
  if (expenses.some((e) => new Date(e.ts).toLocaleDateString('en-CA') === k)) streak++
  else break
  }

  // Priority rules
  if (dow === 0) return { bold: 'Receipt day', rest: `${name}. Your week is ready to review.` }
  if (dow === 1 && hour < 12) return { bold: 'Fresh week', rest: `${name}. What's the first spend?` }
  if (dow === 5 && hour >= 15) {
    const weekTotal = weekExp.reduce((s, e) => s + e.amount, 0)
    const trend = weekTotal > lastWeekTotal ? 'up' : 'down'
    return { bold: `It's Friday`, rest: `${name}. Spending is ${trend} vs last week.` }
  }
  if (dom === 1) return { bold: 'New month', rest: `${name}. Fresh slate. Make it count.` }
  if (dom >= daysInMonth - 2) {
    const left = daysInMonth - dom
    return { bold: `${left} day${left !== 1 ? 's' : ''} left`, rest: `in the month, ${name}. Spend wisely.` }
  }
  if (dom >= 1 && dom <= 5) return { bold: 'Payday week', rest: `${name}. The danger zone. You've got this.` }
  if (streak >= 5) return { bold: `${streak} days straight`, rest: `${name}. Don't break it now.` }
  if (todayTotal > dailyAvg * 1.3 && todayTotal > 0) return { bold: `₹${todayTotal.toLocaleString()} today`, rest: `${name}. Already above your daily avg.` }
  if (todayExp.length === 0 && hour >= 14) return { bold: 'Nothing logged today', rest: `${name}. Suspiciously clean.` }
  if (lastWeekTotal > 0) {
    const weekTotal2 = weekExp.reduce((s, e) => s + e.amount, 0)
    const diff = Math.round(((weekTotal2 - lastWeekTotal) / lastWeekTotal) * 100)
    if (diff > 20) return { bold: `${diff}% higher`, rest: `than last week, ${name}.` }
    if (diff < -20) return { bold: `${Math.abs(diff)}% less`, rest: `than last week, ${name}. Restrained.` }
  }

  const greet = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night'
  if (todayTotal > 0) return { bold: greet, rest: `${name}. ₹${todayTotal.toLocaleString()} logged today.` }
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  return { bold: greet, rest: `${name}. Happy ${days[dow]}.` }
}
