import { dateKey } from './dateHelpers'

export function calculateStreak(expenses) {
  if (!expenses || expenses.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all unique days with expenses
  const daysWithExpenses = new Set(expenses.map((e) => dateKey(e.ts)))

  let streak = 0
  let current = new Date(today)

// Check yesterday first — today is still "in progress"
// If today has expenses, count from today
// If today has no expenses yet, count from yesterday (streak still alive)
const todayKey = dateKey(today)
const hasTodayExpense = daysWithExpenses.has(todayKey)

if (!hasTodayExpense) {
  // Start from yesterday — today hasn't ended yet
  current.setDate(current.getDate() - 1)
}

while (true) {
  const key = dateKey(current)
  if (daysWithExpenses.has(key)) {
    streak++
    current.setDate(current.getDate() - 1)
  } else {
    break
  }
}

  return streak
}

export function getStreakMessage(streak) {
  if (streak === 0) return null
  if (streak === 1) return { emoji: '✨', text: '1 day streak. Keep going.' }
  if (streak === 2) return { emoji: '⚡', text: '2 days in a row.' }
  if (streak === 3) return { emoji: '🔥', text: '3 day streak!' }
  if (streak <= 6) return { emoji: '🔥', text: `${streak} day streak. Don't stop now.` }
  if (streak === 7) return { emoji: '🔥', text: '7 days straight. One full week!' }
  if (streak <= 13) return { emoji: '🔥🔥', text: `${streak} days straight. Impressive.` }
  if (streak === 14) return { emoji: '🔥🔥', text: '2 weeks straight. Seriously impressive.' }
  if (streak <= 29) return { emoji: '🔥🔥', text: `${streak} day streak. You're on fire.` }
  if (streak === 30) return { emoji: '🔥🔥🔥', text: '30 days! A full month. Legendary.' }
  return { emoji: '🔥🔥🔥', text: `${streak} days. Absolute legend.` }
}