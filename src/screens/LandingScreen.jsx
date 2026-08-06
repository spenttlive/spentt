import './LandingScreen.css'
import { useEffect } from 'react'

export default function LandingScreen({ onGetStarted }) {
  useEffect(() => {
  const slides = ['lpd-s1', 'lpd-s2', 'lpd-s3', 'lpd-s4']
  const labels = ['Home screen', 'Log in 5 seconds', 'Sunday receipt', 'Streaks & personality']
  const dots = ['lpd-d0', 'lpd-d1', 'lpd-d2', 'lpd-d3']
  let current = 0
  let timer

  const goTo = (n) => {
    const prevEl = document.getElementById(slides[current])
    if (prevEl) {
      prevEl.classList.remove('lpd-active')
      prevEl.classList.add('lpd-exit')
      setTimeout(() => prevEl?.classList.remove('lpd-exit'), 500)
    }
    current = n
    const nextEl = document.getElementById(slides[current])
    if (nextEl) nextEl.classList.add('lpd-active')
    dots.forEach((d, i) => {
      const el = document.getElementById(d)
      if (el) {
        el.classList.toggle('lpd-dot-active', i === current)
        el.classList.toggle('lpd-dot', i !== current || true)
      }
    })
    const labelEl = document.getElementById('lpd-label')
    if (labelEl) labelEl.textContent = labels[current]
  }

  timer = setInterval(() => {
    goTo((current + 1) % slides.length)
  }, 2800)

  dots.forEach((d, i) => {
    const el = document.getElementById(d)
    if (el) {
      el.addEventListener('click', () => {
        clearInterval(timer)
        goTo(i)
        timer = setInterval(() => goTo((current + 1) % slides.length), 2800)
      })
    }
  })

  return () => clearInterval(timer)
}, [])
  return (
    <div className="landing">

      {/* Nav */}
      <nav className="landing-nav">
  <div className="landing-logo">
    spentt<span className="landing-logo-dot" />
  </div>
  <div className="landing-nav-links">
    <a href="/tools/" className="landing-nav-link">Tools</a>
    <a href="/blog/" className="landing-nav-link">Blog</a>
  </div>
  <button className="landing-nav-cta" onClick={() => onGetStarted()}>
    Start free →
  </button>
</nav>

      {/* Hero */}
      <section className="landing-hero">
  <div className="landing-hero-inner">

    {/* Left — text */}
    <div className="landing-hero-text">
      <div className="landing-eyebrow">Free · No bank linking · Data in your drive</div>
      <h1 className="landing-h1">
        5 second habit<br />
        to know where your<br />
        <span className="landing-h1-accent">money goes.</span>
      </h1>
      <p className="landing-hero-sub">
        Spentt builds the habit of conscious spending — log what you spend in 5 seconds, get a weekly receipt every Sunday, and finally know where your money actually goes.
      </p>
      <button className="landing-cta-btn" onClick={() => onGetStarted()}>
        Build the habit — it's free →
      </button>
      <div className="landing-cta-note">
        No credit card. No bank account. Takes 30 seconds to set up.
      </div>
    </div>
    
          {/* Right — phone demo */}
          <div className="landing-hero-phone">
          <div className="landing-phone-demo">
  <div className="lpd-phone">
    <div className="lpd-notch"></div>
    <div className="lpd-screen" id="lpd-screen">

      {/* Screen 1 — Home */}
      <div className="lpd-slide lpd-active" id="lpd-s1">
        <div className="lpd-topbar">
          <div>
            <div className="lpd-greeting-sub">Good morning</div>
            <div className="lpd-greeting">Kushal 👋</div>
          </div>
          <div className="lpd-avatar">K</div>
        </div>
        <div className="lpd-card">
          <div className="lpd-card-label">Total spent</div>
          <div className="lpd-card-amt">₹12,534</div>
          <div className="lpd-chips">
            <span className="lpd-chip">14 expenses</span>
            <span className="lpd-chip">₹895 avg</span>
          </div>
        </div>
        <div className="lpd-spendcard">
          <div className="lpd-sc-badge">Top spend · 26%</div>
          <div className="lpd-sc-row">
            <div className="lpd-sc-cat">👟 Shopping</div>
            <div className="lpd-sc-amt">₹3,200</div>
          </div>
        </div>
        <div className="lpd-items">
          {[
            { icon: '☕', bg: '#EDFAF4', name: 'Blue Tokai', cat: 'Coffee', amt: '₹320' },
            { icon: '🛒', bg: '#FFF3EB', name: 'Groceries', cat: 'Groceries', amt: '₹1,240' },
            { icon: '🚗', bg: '#F0F7FF', name: 'Ola cab', cat: 'Transport', amt: '₹180' },
          ].map((item) => (
            <div key={item.name} className="lpd-item">
              <div className="lpd-item-icon" style={{ background: item.bg }}>{item.icon}</div>
              <div className="lpd-item-info">
                <div className="lpd-item-name">{item.name}</div>
                <div className="lpd-item-cat">{item.cat}</div>
              </div>
              <div className="lpd-item-amt">{item.amt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen 2 — Add expense */}
      <div className="lpd-slide" id="lpd-s2">
        <div className="lpd-topbar2">
          <span className="lpd-back">←</span>
          <span className="lpd-title2">Add expense</span>
        </div>
        <div className="lpd-field">
          <div className="lpd-field-label">Description</div>
          <div className="lpd-field-val">Dinner at Punjab Grill</div>
        </div>
        <div className="lpd-amt-big">
          <div className="lpd-amt-val">₹1,450</div>
        </div>
        <div className="lpd-field">
          <div className="lpd-field-label">Date</div>
          <div className="lpd-field-val">Today</div>
        </div>
        <div className="lpd-cat-pills">
          {['☕ Coffee', '🍔 Dining', '🛒 Groceries', '🚗 Transport'].map((c) => (
            <div key={c} className={`lpd-pill ${c.includes('Dining') ? 'lpd-pill-active' : ''}`}>{c}</div>
          ))}
        </div>
        <div className="lpd-save-btn">Save expense ✓</div>
      </div>

      {/* Screen 3 — Receipt */}
      <div className="lpd-slide" id="lpd-s3">
        <div className="lpd-topbar">
          <div className="lpd-greeting">Weekly Receipt</div>
          <div style={{ fontSize: 10, color: '#E8623A' }}>⬆ Share</div>
        </div>
        <div className="lpd-receipt">
          <div className="lpd-rec-brand">spentt<span className="lpd-rec-dot" /></div>
          <div className="lpd-rec-tag">know where it went</div>
          <div className="lpd-rec-dash" />
          {[
            ['☕ Coffee', '₹2,400'],
            ['🛒 Groceries', '₹1,800'],
            ['🚗 Transport', '₹1,200'],
            ['🍔 Dining', '₹3,200'],
          ].map(([cat, amt]) => (
            <div key={cat} className="lpd-rec-row">
              <span>{cat}</span><span>{amt}</span>
            </div>
          ))}
          <div className="lpd-rec-solid" />
          <div className="lpd-rec-total">
            <span>Total</span><span>₹8,600</span>
          </div>
          <div className="lpd-rec-dash" />
          <div className="lpd-rec-verdict">
            <div className="lpd-rec-vl">This week's personality</div>
            <div className="lpd-rec-vn">Comfortable Contradictionist</div>
            <div className="lpd-rec-vs">Coffee costs more than groceries.</div>
          </div>
        </div>
      </div>

      {/* Screen 4 — Streak */}
      <div className="lpd-slide" id="lpd-s4">
        <div className="lpd-topbar">
          <div className="lpd-greeting">🔥 7 day streak, Kushal!</div>
        </div>
        <div className="lpd-streak">
          <div style={{ fontSize: 20 }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div className="lpd-streak-label">Logging streak</div>
            <div className="lpd-streak-msg">7 days straight. One full week!</div>
          </div>
          <div className="lpd-streak-num">7</div>
        </div>
        <div className="lpd-personality">
          <div style={{ flex: 1 }}>
            <div className="lpd-streak-label">This week's personality</div>
            <div className="lpd-streak-msg">Comfortable Contradictionist</div>
            <div style={{ fontSize: 9, color: '#A8937A', marginTop: 2 }}>Coffee costs more than groceries.</div>
          </div>
          <div className="lpd-share-btn">⬆ Share</div>
        </div>
      </div>

    </div>
  </div>

  {/* Dots */}
  <div className="lpd-dots">
    {[0,1,2,3].map((i) => (
      <div key={i} className={`lpd-dot ${i === 0 ? 'lpd-dot-active' : ''}`} id={`lpd-d${i}`} />
    ))}
  </div>
  <div className="lpd-label" id="lpd-label">Home screen</div>
</div>
</div>
        </div>
      </section>

      {/* Problem */}
      <section className="landing-problem">
        <div className="landing-problem-inner">
          <div className="landing-section-eyebrow">The problem</div>
          <h2 className="landing-h2">UPI made spending invisible.</h2>
          <p className="landing-section-sub">
            When money was physical, you felt it leave. Every note handed over was a conscious decision. UPI changed that — tap, pay, done. No friction, no awareness, no memory of where it went.
          </p>
          <div className="landing-stat-row">
            <div className="landing-stat">
              <div className="landing-stat-num">73%</div>
              <div className="landing-stat-label">of people have no idea where their money goes each month</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-num">18</div>
              <div className="landing-stat-label">days before most people abandon a new finance app</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-num">3×</div>
              <div className="landing-stat-label">more spending awareness with manual logging vs auto-import</div>
            </div>
          </div>
        </div>
      </section>

      {/* Habit loop */}
      <section className="landing-habit">
        <div className="landing-habit-inner">
          <div className="landing-section-eyebrow">How Spentt works</div>
          <h2 className="landing-h2">A habit loop that actually sticks.</h2>
          <p className="landing-section-sub">
            Most finance apps are too complex to use daily. Spentt is designed around one simple loop — repeated every day until it becomes automatic.
          </p>
          <div className="landing-loop">
            <div className="landing-loop-step">
              <div className="landing-loop-icon">⚡</div>
              <div className="landing-loop-title">You spend</div>
              <div className="landing-loop-desc">Chai, cab, groceries, anything. The moment you pay, you log it.</div>
            </div>
            <div className="landing-loop-arrow">→</div>
            <div className="landing-loop-step">
              <div className="landing-loop-icon">✏️</div>
              <div className="landing-loop-title">5-second log</div>
              <div className="landing-loop-desc">Description, amount, category. Four taps. Done before you put your phone away.</div>
            </div>
            <div className="landing-loop-arrow">→</div>
            <div className="landing-loop-step">
              <div className="landing-loop-icon">🧾</div>
              <div className="landing-loop-title">Sunday receipt</div>
              <div className="landing-loop-desc">Every week a receipt drops. Your spending personality is revealed.</div>
            </div>
            <div className="landing-loop-arrow">→</div>
            <div className="landing-loop-step">
              <div className="landing-loop-icon">🧠</div>
              <div className="landing-loop-title">Awareness</div>
              <div className="landing-loop-desc">You see patterns. You make different decisions. The habit compounds.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="landing-features-inner">
          <div className="landing-section-eyebrow">Built for the habit</div>
          <h2 className="landing-h2">Everything designed to keep you logging.</h2>

          <div className="landing-feature-grid">
            <div className="landing-feature-card landing-feature-card--large">
              <div className="lfc-icon">⚡</div>
              <div className="lfc-title">Log in 5 seconds</div>
              <div className="lfc-desc">The fastest expense logging flow ever built. Description, amount, category, date. Four taps. No friction means no excuses.</div>
              <div className="lfc-tag">Habit trigger</div>
            </div>

            <div className="landing-feature-card landing-feature-card--large">
              <div className="lfc-icon">🧾</div>
              <div className="lfc-title">Weekly receipt, every Sunday</div>
              <div className="lfc-desc">A beautiful receipt-style summary of your week. Recent enough to remember. Frequent enough to change behaviour. Not a pie chart — a receipt.</div>
              <div className="lfc-tag">Weekly reward</div>
            </div>

            <div className="landing-feature-card">
              <div className="lfc-icon">🎭</div>
              <div className="lfc-title">Spending personality</div>
              <div className="lfc-desc">28 personalities based on your actual habits. "Comfortable Contradictionist" sticks in your head. A pie chart doesn't.</div>
            </div>

            <div className="landing-feature-card">
              <div className="lfc-icon">🔒</div>
              <div className="lfc-title">Your Drive, your data</div>
              <div className="lfc-desc">Expenses live in your Google Drive. We literally cannot see them. No server storage, no data selling, ever.</div>
            </div>

            <div className="landing-feature-card">
              <div className="lfc-icon">🔥</div>
              <div class="lfc-title">Spending streaks</div>
              <div className="lfc-desc">Log every day to build your streak. The habit stays alive as long as your streak does.</div>
            </div>

            <div className="landing-feature-card">
              <div className="lfc-icon">📱</div>
              <div className="lfc-title">Installs on your phone</div>
              <div className="lfc-desc">Add to home screen in Safari or Chrome. No App Store. Works like a native app.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Receipt preview */}
      <section className="landing-receipt-preview">
        <div className="landing-receipt-inner">
          <div className="landing-section-eyebrow">The weekly receipt</div>
          <h2 className="landing-h2">A verdict on your week. Every Sunday.</h2>
          <p className="landing-section-sub">
            Not a dashboard. Not a graph. A receipt — the format you've been reading since childhood. Simple, fast, honest.
          </p>
          <div className="landing-receipt-card">
            <div className="lrc-head">
              <div className="lrc-brand">spentt<span className="lrc-brand-dot" /></div>
              <div className="lrc-tagline">know where it went</div>
              <div className="lrc-date">Mon 6 – Sun 12 Jan · 14 TRANSACTIONS</div>
            </div>
            <div className="lrc-dashed" />
            <div className="lrc-rows">
              <div className="lrc-row">
                <span>☕ Coffee</span>
                <span>₹2,400</span>
              </div>
              <div className="lrc-row">
                <span>🛒 Groceries</span>
                <span>₹1,800</span>
              </div>
              <div className="lrc-row">
                <span>🚗 Transport</span>
                <span>₹1,200</span>
              </div>
              <div className="lrc-row">
                <span>🍔 Food & Dining</span>
                <span>₹3,200</span>
              </div>
              <div className="lrc-row">
                <span>🛍 Shopping</span>
                <span>₹4,100</span>
              </div>
            </div>
            <div className="lrc-solid" />
            <div className="lrc-total">
              <span>Total</span>
              <span>₹12,700</span>
            </div>
            <div className="lrc-dashed" />
            <div className="lrc-verdict">
              <div className="lrc-verdict-label">This week's personality</div>
              <div className="lrc-verdict-name">Comfortable Contradictionist</div>
              <div className="lrc-verdict-sub">Coffee costs more than groceries.<br />Your kitchen runs on vibes.</div>
            </div>
          </div>
          <button className="landing-cta-btn" onClick={() => onGetStarted()}>
            Get your first receipt →
          </button>
        </div>
      </section>

      {/* Privacy */}
      <section className="landing-privacy">
        <div className="landing-privacy-inner">
          <div className="landing-privacy-icon">🔒</div>
          <h2 className="landing-h2 landing-h2--light">Your data never touches our servers.</h2>
          <p className="landing-privacy-sub">
            Every expense you log goes directly to a private file in your own Google Drive. Spentt cannot see it, access it, or sell it — even if we wanted to. You own your financial data completely.
          </p>
          <div className="landing-privacy-points">
            <div className="lpp">✓ No bank account linking</div>
            <div className="lpp">✓ No financial credentials</div>
            <div className="lpp">✓ No data on our servers</div>
            <div className="lpp">✓ Delete anytime from your Drive</div>
          </div>
          <a href="/privacy.html" className="landing-privacy-link">Read our privacy policy →</a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta">
        <div className="landing-final-inner">
          <h2 className="landing-h2">The habit starts today.</h2>
          <p className="landing-section-sub">
            Log your first expense in the next 5 minutes. Get your first Sunday receipt this week. In 90 days, you'll know your money better than you ever have.
          </p>
          <button className="landing-cta-btn landing-cta-btn--large" onClick={() => onGetStarted()}>
            Start tracking free →
          </button>
          <div className="landing-cta-note">Free forever · No credit card · Works on any phone</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
  <div className="landing-logo">spentt<span className="landing-logo-dot" /></div>
  <div className="landing-footer-links">
    <a href="/tools/" className="landing-footer-link">Tools</a>
    <a href="/blog/" className="landing-footer-link">Blog</a>
    <a href="/faq.html" className="landing-footer-link">FAQ</a>
    <a href="/about.html" className="landing-footer-link">About</a>
    <a href="/privacy.html" className="landing-footer-link">Privacy</a>
    <a href="/terms.html" className="landing-footer-link">Terms</a>
    <span className="landing-footer-note">© 2026 Spentt</span>
  </div>
        <a href="https://www.foundrlist.com/product/spentt?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener">
        <img src="https://www.foundrlist.com/api/badge/spentt" alt="Featured on FoundrList" width="150" height="48" />
        </a>
        <a href="https://www.tinystartups.com/startup/spentt" target="_blank" rel="noopener noreferrer">
        <img src="https://www.tinystartups.com/api/badge/featured/spentt" alt="Featured on Tiny Startups" />
        </a>
        <a href="https://vibeking.fun/product/3617" target="_blank" rel="noopener">
        <img src="https://vibeking.fun/badge/3617.svg?theme=light" alt="Featured on VibeKing" width="250" height="60"/>
        </a>
      </footer>
    </div>
  )
}