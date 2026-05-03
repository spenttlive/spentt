import { useNavigate } from 'react-router-dom'
import { useGreeting } from '../hooks/useGreeting'
import { usePWA } from '../hooks/usePWA'
import CardStack from '../components/cards/CardStack'
import QuickAdd from '../components/QuickAdd'
import ExpenseItem from '../components/ExpenseItem'
import styles from './Home.module.css'

const USER = { name: 'Kush' }

export default function Home({ expenses, total, avg, catsSorted, onAdd }) {
  const navigate  = useNavigate()
  const greeting  = useGreeting(USER.name, expenses)
  const { showBanner, install, dismiss } = usePWA()

  return (
    <div className={styles.wrap}>

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.logoWrap}>
            <div className={styles.logoText}>spentt</div>
            <div className={styles.logoDot} />
          </div>
          <div className={styles.greeting}>
            <span className={styles.greetMain}>{greeting.main} </span>
            {greeting.name && <span className={styles.greetName}>{greeting.name} </span>}
            <span className={styles.greetCtx}>{greeting.context}</span>
          </div>
        </div>
        <div className={styles.avatar} onClick={() => navigate('/profile')}>
          {USER.name[0]}
        </div>
      </div>

      {/* PWA BANNER */}
      {showBanner && (
        <div className={styles.pwaBanner}>
          <div className={styles.pwaIcon}>
            s<div className={styles.pwaIconDot} />
          </div>
          <div className={styles.pwaText}>
            <div className={styles.pwaTitle}>Add Spentt to home screen</div>
            <div className={styles.pwaSub}>Log expenses faster, always one tap away</div>
          </div>
          <button className={styles.pwaBtn} onClick={install}>Add</button>
          <div className={styles.pwaClose} onClick={dismiss}>✕</div>
        </div>
      )}

      {/* PERIOD PILL */}
      <div className={styles.periodRow}>
        <div className={styles.periodPill}>
          <div className={styles.liveDot} />
          This week ▾
        </div>
      </div>

      {/* TOTAL CARD */}
      <div className={styles.totalCard}>
        <div className={styles.totalLabel}>Total spent</div>
        <div className={styles.totalAmt}>
          <sup>₹</sup>{total.toLocaleString()}
        </div>
        <div className={styles.chips}>
          <div className={styles.chip}>
            <div className={styles.chipDot} style={{ background: '#F5A623' }} />
            {expenses.length} expenses
          </div>
          <div className={styles.chip}>
            <div className={styles.chipDot} style={{ background: '#3AAE8A' }} />
            ₹{avg.toLocaleString()} avg
          </div>
        </div>
      </div>

      {/* CARD STACK */}
      <div className={styles.secHd}>
        <div className={styles.secTitle}>Where it went</div>
        <div className={styles.secLink} onClick={() => navigate('/history')}>See all</div>
      </div>
      <CardStack catsSorted={catsSorted} total={total} />

      {/* QUICK ADD */}
      <div className={styles.qaWrap}>
        <QuickAdd onAdd={onAdd} />
      </div>

      {/* RECENT */}
      <div className={styles.recentWrap}>
        <div className={styles.secHd} style={{ padding: '0 4px', marginBottom: 10 }}>
          <div className={styles.secTitle}>Recent</div>
          <div className={styles.secLink} onClick={() => navigate('/history')}>See all</div>
        </div>
        {expenses.slice(0, 5).map(e => (
          <ExpenseItem key={e.id} expense={e} />
        ))}
      </div>

      {/* RECEIPT TEASER */}
      <div className={styles.teaser} onClick={() => navigate('/receipt')}>
        <div className={styles.teaserLabel}>Weekly summary</div>
        <div className={styles.teaserTitle}>Your receipt is ready</div>
        <div className={styles.teaserStats}>
          <div className={styles.teaserStat}>
            <strong>₹{total.toLocaleString()}</strong>
            spent
          </div>
          <div className={styles.teaserStat}>
            <strong>{catsSorted[0]?.cat ?? '—'}</strong>
            top category
          </div>
        </div>
        <button className={styles.teaserBtn}>View →</button>
      </div>

    </div>
  )
}
