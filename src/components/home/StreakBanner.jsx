import { calculateStreak, getStreakMessage } from '../../utils/streak'
import './StreakBanner.css'

export default function StreakBanner({ expenses }) {
  const streak = calculateStreak(expenses)
  const message = getStreakMessage(streak)

  if (!message) return null

  return (
    <div className="streak-banner">
      <div className="streak-emoji">{message.emoji}</div>
      <div className="streak-text">
        <div className="streak-label">Logging streak</div>
        <div className="streak-message">{message.text}</div>
      </div>
      <div className="streak-count">{streak}</div>
    </div>
  )
}