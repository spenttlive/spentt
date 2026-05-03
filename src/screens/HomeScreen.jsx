import Logo from '../components/home/Logo'
import Greeting from '../components/home/Greeting'
import TotalCard from '../components/home/TotalCard'
import CardStack from '../components/home/CardStack'
import QuickAdd from '../components/home/QuickAdd'
import ExpenseItem from '../components/home/ExpenseItem'
import ReceiptTeaser from '../components/home/ReceiptTeaser'
import PWABanner from '../components/home/PWABanner'
import './HomeScreen.css'

export default function HomeScreen({ user, expenses, addExpense, totalSpent, avgPerTx, cardData, goTo, showToast, pwa }) {
  const topCat = cardData[0]?.cat || '—'

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-left">
          <Logo />
          <Greeting user={user} expenses={expenses} />
        </div>
        <div className="avatar" onClick={() => goTo('profile')}>
          {user.name[0]}
        </div>
      </div>

      <div className="period-row">
        <div className="period-pill">
          <div className="live-dot" />
          This week ▾
        </div>
      </div>

      <TotalCard total={totalSpent} txCount={expenses.length} avg={avgPerTx} />

      <PWABanner show={pwa.showBanner} onInstall={pwa.install} onDismiss={pwa.dismiss} />

      <div className="sec-hd">
        <div className="sec-title">Where it went</div>
        <div className="sec-link" onClick={() => goTo('history')}>See all</div>
      </div>

      <CardStack cardData={cardData} showToast={showToast} />

      <div className="qa-wrap">
        <QuickAdd onAdd={addExpense} showToast={showToast} />
      </div>

      <div className="recent-wrap">
        <div className="sec-hd" style={{ padding: '0 4px', marginBottom: 10 }}>
          <div className="sec-title">Recent</div>
          <div className="sec-link" onClick={() => goTo('history')}>See all</div>
        </div>
        {expenses.slice(0, 5).map((e, i) => (
          <ExpenseItem key={e.id} expense={e} style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
      </div>

      <ReceiptTeaser
        total={totalSpent}
        topCat={topCat}
        onOpen={() => goTo('receipt')}
      />
    </div>
  )
}
