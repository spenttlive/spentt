import { useGreeting } from '../../hooks/useGreeting'
import './Greeting.css'

export default function Greeting({ user, expenses }) {
  const greeting = useGreeting(user.name, expenses)

  return (
    <div className="greeting-line">
      <span className="greeting-bold">{greeting.bold}</span>
      {', '}
      <span className="greeting-rest">{greeting.rest}</span>
    </div>
  )
}
