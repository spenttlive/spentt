import { getCat } from '../data/categories'

// Calculate current week date range
export function getWeekRange() {
  const now = new Date()
  const dow = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - dow)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

// Format date range label
export function fmtWeekRange(start, end) {
  const opts = { day: 'numeric', month: 'short' }
  return `${start.toLocaleDateString('en-IN', opts).toUpperCase()} – ${end.toLocaleDateString('en-IN', opts).toUpperCase()}`
}

// Filter expenses for current week
export function getWeekExpenses(expenses) {
  const { start, end } = getWeekRange()
  return expenses.filter((e) => {
    const d = new Date(e.ts)
    return d >= start && d <= end
  })
}

// Build category breakdown sorted by amount
export function getCategoryBreakdown(expenses) {
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  if (total === 0) return []
  const catMap = {}
  expenses.forEach((e) => {
    catMap[e.cat] = (catMap[e.cat] || 0) + e.amount
  })
  return Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => ({
      cat,
      amt,
      pct: Math.round((amt / total) * 100),
      ...getCat(cat),
    }))
}

// Generate spending personality + verdict
export function generateVerdict(expenses) {
  if (expenses.length === 0) {
    return {
      personality: 'The Ghost',
      line1: 'No expenses logged this week.',
      line2: 'Either you spent nothing or forgot to track.',
    }
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const catMap = {}
  expenses.forEach((e) => {
    catMap[e.cat] = (catMap[e.cat] || 0) + e.amount
  })
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1])
  const topCat = sorted[0]?.[0] || ''
  const topAmt = sorted[0]?.[1] || 0
  const topPct = Math.round((topAmt / total) * 100)

  const foodTotal = (catMap['Food & Dining'] || 0) + (catMap['Coffee'] || 0) + (catMap['Groceries'] || 0) + (catMap['Sweets & Snacks'] || 0)
  const foodPct = Math.round((foodTotal / total) * 100)
  const shoppingTotal = (catMap['Shopping'] || 0) + (catMap['Clothing'] || 0)
  const shoppingPct = Math.round((shoppingTotal / total) * 100)
  const viceTotal = (catMap['Alcohol'] || 0) + (catMap['Cigarettes'] || 0)
  const vicePct = Math.round((viceTotal / total) * 100)
  const growthTotal = (catMap['Education'] || 0) + (catMap['Books'] || 0) + (catMap['Investments'] || 0)
  const growthPct = Math.round((growthTotal / total) * 100)
  const coffeeAmt = catMap['Coffee'] || 0
  const groceriesAmt = catMap['Groceries'] || 0

  // Personality rules — first match wins
  if (growthPct >= 30) return {
    personality: 'The Investor',
    line1: `${growthPct}% went to growth. Rare and commendable.`,
    line2: 'Your future self will appreciate this week.',
  }

  if (shoppingPct >= 35) return {
    personality: 'The Impulse Engine',
    line1: `Shopping ate ${shoppingPct}% of your week.`,
    line2: 'Your wardrobe is thriving. Your wallet, less so.',
  }

  if (foodPct >= 40) return {
    personality: 'The Foodie',
    line1: `${foodPct}% of your money went to food.`,
    line2: 'You eat well. No one can take that from you.',
  }

  if (coffeeAmt > groceriesAmt && groceriesAmt > 0) return {
    personality: 'Comfortable Contradictionist',
    line1: `Coffee cost more than groceries this week.`,
    line2: 'Your kitchen runs on vibes. And caffeine.',
  }

  if (vicePct >= 20) return {
    personality: 'The Social Investor',
    line1: `${vicePct}% on alcohol and cigarettes.`,
    line2: 'Life is short. Just maybe not this short.',
  }

  if (topPct >= 40) return {
    personality: 'The One-Track Spender',
    line1: `${topCat} alone took ${topPct}% of your budget.`,
    line2: 'Focused spending. Or tunnel vision. Hard to tell.',
  }

  if (expenses.length <= 3) return {
    personality: 'The Minimalist',
    line1: `Only ${expenses.length} transactions this week.`,
    line2: 'Either very disciplined or very forgetful.',
  }

  return {
    personality: 'The Balanced One',
    line1: `₹${total.toLocaleString()} spread across ${sorted.length} categories.`,
    line2: 'No single vice dominates. Suspicious.',
  }
}