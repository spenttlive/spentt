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
  expenses.forEach((e) => { catMap[e.cat] = (catMap[e.cat] || 0) + e.amount })
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1])
  const topCat = sorted[0]?.[0] || ''
  const topAmt = sorted[0]?.[1] || 0
  const topPct = Math.round((topAmt / total) * 100)

  // Category totals
  const food = (catMap['Food & Dining'] || 0)
  const groceries = (catMap['Groceries'] || 0)
  const coffee = (catMap['Coffee'] || 0)
  const alcohol = (catMap['Alcohol'] || 0)
  const cigarettes = (catMap['Cigarettes'] || 0)
  const shopping = (catMap['Shopping'] || 0)
  const clothing = (catMap['Clothing'] || 0)
  const transport = (catMap['Petrol'] || 0) + (catMap['Cab & Auto'] || 0) + (catMap['Public Transport'] || 0)
  const petrol = (catMap['Petrol'] || 0)
  const subscriptions = (catMap['Subscriptions'] || 0)
  const education = (catMap['Education'] || 0)
  const books = (catMap['Books'] || 0)
  const investments = (catMap['Investments'] || 0)
  const gym = (catMap['Gym & Fitness'] || 0)
  const medical = (catMap['Medical'] || 0) + (catMap['Pharmacy'] || 0)
  const entertainment = (catMap['Movies & OTT'] || 0) + (catMap['Gaming'] || 0) + (catMap['Sports & Events'] || 0)
  const rent = (catMap['Rent'] || 0)
  const utilities = (catMap['Electricity'] || 0) + (catMap['Water & Gas'] || 0) + (catMap['Phone & Internet'] || 0)
  const gifts = (catMap['Gifts'] || 0)
  const travel = (catMap['Flight & Train'] || 0)
  const grooming = (catMap['Grooming'] || 0)
  const snacks = (catMap['Sweets & Snacks'] || 0)
  const gaming = (catMap['Gaming'] || 0)
  const donations = (catMap['Donations'] || 0)

  // Percentage helpers
  const pct = (amt) => Math.round((amt / total) * 100)
  const txCount = expenses.length

  // ── 28 PERSONALITY RULES — first match wins ──

  // 1. Pure investor
  if (pct(investments) >= 40) return {
    personality: 'The Wealth Architect',
    line1: `${pct(investments)}% went straight to investments.`,
    line2: 'Your future self is writing you a thank you note.',
  }

  // 2. Heavy education spender
  if (pct(education + books) >= 30) return {
    personality: 'The Perpetual Student',
    line1: `${pct(education + books)}% spent on learning.`,
    line2: 'Knowledge is the only asset that compounds tax-free.',
  }

  // 3. Coffee costs more than groceries
  if (coffee > groceries && groceries > 0) return {
    personality: 'Comfortable Contradictionist',
    line1: 'Coffee cost more than groceries this week.',
    line2: 'Your kitchen runs on vibes. And caffeine.',
  }

  // 4. Massive shopping week
  if (pct(shopping + clothing) >= 40) return {
    personality: 'The Impulse Engine',
    line1: `${pct(shopping + clothing)}% went to shopping and clothing.`,
    line2: 'Your wardrobe is thriving. Your wallet, less so.',
  }

  // 5. Food delivery addict
  if (pct(food) >= 35 && food > groceries * 2) return {
    personality: 'The Delivery Devotee',
    line1: `Food delivery dominated at ${pct(food)}% of your week.`,
    line2: 'Your kitchen is a storage room. Admit it.',
  }

  // 6. Foodie — groceries + dining both high
  if (pct(food + groceries) >= 45) return {
    personality: 'The Committed Foodie',
    line1: `${pct(food + groceries)}% of your money went to food.`,
    line2: 'You eat well. No one can take that from you.',
  }

  // 7. Transport heavy
  if (pct(transport) >= 35) return {
    personality: 'The Road Warrior',
    line1: `${pct(transport)}% spent on getting around.`,
    line2: 'You\'re either very social or very lost.',
  }

  // 8. Petrol specifically
  if (pct(petrol) >= 25) return {
    personality: 'The Petrolhead',
    line1: `Petrol alone took ${pct(petrol)}% of your budget.`,
    line2: 'Your car is running. Your wallet is limping.',
  }

  // 9. Vice spender — alcohol + cigarettes
  if (pct(alcohol + cigarettes) >= 25) return {
    personality: 'The Social Investor',
    line1: `${pct(alcohol + cigarettes)}% on alcohol and cigarettes.`,
    line2: 'Life is short. Just maybe not this short.',
  }

  // 10. Alcohol only
  if (pct(alcohol) >= 20) return {
    personality: 'The Generous Host',
    line1: `Alcohol was your biggest category at ${pct(alcohol)}%.`,
    line2: 'Everyone loves you on Friday. Ask them why on Monday.',
  }

  // 11. Subscription hoarder
  if (pct(subscriptions) >= 20) return {
    personality: 'The Subscription Hoarder',
    line1: `${pct(subscriptions)}% on subscriptions.`,
    line2: 'You\'re paying for things you haven\'t opened in months.',
  }

  // 12. Entertainment lover
  if (pct(entertainment) >= 25) return {
    personality: 'The Experience Collector',
    line1: `${pct(entertainment)}% on entertainment this week.`,
    line2: 'Work hard, play harder. Heavy emphasis on the latter.',
  }

  // 13. Gym + health conscious
  if (pct(gym + medical) >= 20 && gym > 0) return {
    personality: 'The Wellness Investor',
    line1: `${pct(gym + medical)}% went to health and fitness.`,
    line2: 'Your body is your most expensive subscription.',
  }

  // 14. Medical heavy week
  if (pct(medical) >= 25) return {
    personality: 'The Recovery Fund',
    line1: `${pct(medical)}% on medical expenses this week.`,
    line2: 'Health first. Everything else is secondary.',
  }

  // 15. Gifts giver
  if (pct(gifts) >= 20) return {
    personality: 'The Generous One',
    line1: `${pct(gifts)}% spent on gifts for others.`,
    line2: 'You give more than you keep. Rare and admirable.',
  }

  // 16. Travel week
  if (pct(travel) >= 30) return {
    personality: 'The Wanderer',
    line1: `${pct(travel)}% on travel this week.`,
    line2: 'Memories don\'t depreciate. (Your bank balance does.)',
  }

  // 17. Grooming obsessed
  if (pct(grooming) >= 15) return {
    personality: 'The High Maintenance',
    line1: `${pct(grooming)}% on grooming and personal care.`,
    line2: 'Looking good isn\'t cheap. You know this well.',
  }

  // 18. Snack attacker
  if (pct(snacks) >= 15) return {
    personality: 'The Snack Economist',
    line1: `${pct(snacks)}% on sweets and snacks.`,
    line2: 'A moment on the lips, forever in the transaction history.',
  }

  // 19. Gamer
  if (pct(gaming) >= 20) return {
    personality: 'The Digital Resident',
    line1: `${pct(gaming)}% on gaming this week.`,
    line2: 'You live in two worlds. One has better graphics.',
  }

  // 20. Donation driven
  if (pct(donations) >= 15) return {
    personality: 'The Philanthropist',
    line1: `${pct(donations)}% went to donations this week.`,
    line2: 'You spend money like someone who understands what it\'s for.',
  }

  // 21. Rent dominates
  if (pct(rent) >= 50) return {
    personality: 'The Rent Hostage',
    line1: `Rent swallowed ${pct(rent)}% of this week\'s spending.`,
    line2: 'You\'re not renting an apartment. You\'re renting a lifestyle.',
  }

  // 22. Utilities heavy
  if (pct(utilities) >= 25) return {
    personality: 'The Bill Payer',
    line1: `${pct(utilities)}% on bills and utilities.`,
    line2: 'The least glamorous category. The most necessary one.',
  }

  // 23. Very few transactions but high spend
  if (txCount <= 2 && total > 0) return {
    personality: 'The Big Shot',
    line1: `Only ${txCount} transaction${txCount === 1 ? '' : 's'} but significant spend.`,
    line2: 'You don\'t spend often. But when you do, you mean it.',
  }

  // 24. Minimalist — very few transactions, low total
  if (txCount <= 3) return {
    personality: 'The Minimalist',
    line1: `Only ${txCount} transactions logged this week.`,
    line2: 'Either deeply disciplined or suspiciously forgetful.',
  }

  // 25. One category dominates everything
  if (topPct >= 60) return {
    personality: 'The One-Track Spender',
    line1: `${topCat} alone took ${topPct}% of your budget.`,
    line2: 'Focused. Or tunnel-visioned. Hard to tell which.',
  }

  // 26. Very spread out spending
  if (sorted.length >= 8 && topPct < 20) return {
    personality: 'The Diversified Portfolio',
    line1: `${sorted.length} categories, no single one above ${topPct}%.`,
    line2: 'You spread risk like a seasoned investor. Of life.',
  }

  // 27. High transaction count
  if (txCount >= 20) return {
    personality: 'The Meticulous Logger',
    line1: `${txCount} transactions logged this week.`,
    line2: 'Either very thorough or spending too much. Possibly both.',
  }

  // 28. Balanced fallback
  return {
    personality: 'The Balanced One',
    line1: `₹${total.toLocaleString()} spread across ${sorted.length} categories.`,
    line2: 'No single vice dominates. Suspicious, but admirable.',
  }
}

export function getCurrentPersonality(expenses) {
  const weekExp = getWeekExpenses(expenses)
  if (weekExp.length === 0) return null
  return generateVerdict(weekExp)
}