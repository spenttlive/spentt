import './LandingScreen.css'

const FEATURES = [
  { emoji: '⚡', title: 'Log in 5 seconds', desc: 'Description, amount, category, date. Four taps. Done.' },
  { emoji: '🃏', title: 'Spending card stack', desc: 'Your categories as swipeable cards. See where money went at a glance.' },
  { emoji: '🧾', title: 'Weekly receipt', desc: 'Every week a beautiful summary with your spending personality.' },
  { emoji: '🔒', title: 'Your data, your Drive', desc: 'Expenses live in your Google Drive. We never see them.' },
  { emoji: '📅', title: 'Log any date', desc: 'Forgot yesterday? Add it anytime. Calendar keeps it organised.' },
  { emoji: '⬆️', title: 'Share your receipt', desc: 'One tap generates a card to share. The watermark just says spentt.' },
]

export default function LandingScreen({ onGetStarted }) {
  return (
    <div className="landing">

      {/* NAV */}
      <nav className="landing-nav">
        <div className="landing-logo">
          spentt<span className="landing-logo-dot" />
        </div>
        <button className="landing-nav-cta" onClick={onGetStarted}>
          Get started →
        </button>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
  <div>
    <div className="landing-hero-eyebrow">
      <span className="landing-eyebrow-dot" />
      Free · No bank linking · Your data only
    </div>
    <h1 className="landing-h1">
      Already<br />
      <span className="landing-h1-accent">Spentt?</span>
    </h1>
    <p className="landing-sub">
      The honest expense tracker that tells you exactly where your money went — with a smile.
    </p>
    <button className="landing-cta-btn" onClick={onGetStarted}>
      Start tracking free →
    </button>
    <div className="landing-cta-note">No credit card. No bank account. Takes 30 seconds.</div>
  </div>

  {/* Phone preview — shows on desktop as second column */}
  <div className="landing-hero-phone">
    <div className="landing-phone">
      <div className="lp-topbar">
        <div>
          <div className="lp-logo">spentt<span className="lp-dot" /></div>
          <div className="lp-greeting">Fresh week, <strong>Kushal</strong>. What's the first spend?</div>
        </div>
        <div className="lp-avatar">K</div>
      </div>
      <div className="lp-total-card">
        <div className="lp-total-label">Total spent</div>
        <div className="lp-total-amt"><sup>₹</sup>12,534</div>
        <div className="lp-chips">
          <span className="lp-chip"><span style={{background:'#F5A623'}} className="lp-chip-dot"/>14 expenses</span>
          <span className="lp-chip"><span style={{background:'#3AAE8A'}} className="lp-chip-dot"/>₹895 avg</span>
        </div>
      </div>
      <div className="lp-card" style={{background:'#F5EEFF',borderColor:'#9B6EE820'}}>
        <div>
          <div className="lp-card-badge" style={{color:'#9B6EE8'}}>Top spend · 26%</div>
          <div className="lp-card-cat" style={{color:'#9B6EE8'}}>👟 Shopping</div>
          <div className="lp-card-sub" style={{color:'#9B6EE899'}}>1 transaction</div>
        </div>
        <div>
          <div className="lp-card-amt" style={{color:'#9B6EE8'}}>₹3,200</div>
          <div className="lp-card-pct" style={{color:'#9B6EE899'}}>of total</div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* APP PREVIEW */}
      <section className="landing-preview">
        <div className="landing-phone">
          <div className="lp-topbar">
            <div>
              <div className="lp-logo">spentt<span className="lp-dot" /></div>
              <div className="lp-greeting">Fresh week, <strong>Kushal</strong>. What's the first spend?</div>
            </div>
            <div className="lp-avatar">K</div>
          </div>
          <div className="lp-total-card">
            <div className="lp-total-label">Total spent</div>
            <div className="lp-total-amt"><sup>₹</sup>12,534</div>
            <div className="lp-chips">
              <span className="lp-chip"><span style={{background:'#F5A623'}} className="lp-chip-dot"/>14 expenses</span>
              <span className="lp-chip"><span style={{background:'#3AAE8A'}} className="lp-chip-dot"/>₹895 avg</span>
            </div>
          </div>
          <div className="lp-card" style={{background:'#F5EEFF',borderColor:'#9B6EE820'}}>
            <div>
              <div className="lp-card-badge" style={{color:'#9B6EE8'}}>Top spend · 26%</div>
              <div className="lp-card-cat" style={{color:'#9B6EE8'}}>👟 Shopping</div>
              <div className="lp-card-sub" style={{color:'#9B6EE899'}}>1 transaction</div>
            </div>
            <div>
              <div className="lp-card-amt" style={{color:'#9B6EE8'}}>₹3,200</div>
              <div className="lp-card-pct" style={{color:'#9B6EE899'}}>of total</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section">
        <div className="landing-section-eyebrow">How it works</div>
        <h2 className="landing-section-title">Three steps.<br />That's it.</h2>
        <div className="landing-steps">
          <div className="landing-step">
            <div className="landing-step-num">1</div>
            <div className="landing-step-icon">🔑</div>
            <div className="landing-step-title">Sign in with Google</div>
            <div className="landing-step-desc">One tap. Your data goes straight to your own Google Drive — not our servers.</div>
          </div>
          <div className="landing-step">
            <div className="landing-step-num">2</div>
            <div className="landing-step-icon">⚡</div>
            <div className="landing-step-title">Log in 5 seconds</div>
            <div className="landing-step-desc">What, how much, which category, which date. Four inputs. Done.</div>
          </div>
          <div className="landing-step">
            <div className="landing-step-num">3</div>
            <div className="landing-step-icon">🧾</div>
            <div className="landing-step-title">Get your weekly receipt</div>
            <div className="landing-step-desc">Every Sunday, Spentt generates a beautiful summary with an honest verdict on your spending.</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section landing-features-section">
        <div className="landing-section-eyebrow">Features</div>
        <h2 className="landing-section-title">Built to feel good,<br />not overwhelming.</h2>
        <div className="landing-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-feature">
              <div className="landing-feature-emoji">{f.emoji}</div>
              <div className="landing-feature-title">{f.title}</div>
              <div className="landing-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRIVACY */}
      <section className="landing-privacy">
        <div className="landing-privacy-inner">
          <div className="landing-section-eyebrow" style={{color:'var(--accent2)'}}>Privacy first</div>
          <h2 className="landing-section-title" style={{color:'#fff'}}>Your data never<br />touches our servers.</h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:16,lineHeight:1.6,marginBottom:32}}>
            Most apps store your financial data on their servers. Spentt doesn't have servers for your data. It lives in your Google Drive — only you can access it.
          </p>
          <div className="landing-privacy-cards">
            <div className="landing-privacy-card">
              <div className="landing-privacy-icon">🔑</div>
              <div className="landing-privacy-title">Google Drive storage</div>
              <div className="landing-privacy-desc">Your expenses live in a file in your own Google Drive. We can't see it even if we wanted to.</div>
            </div>
            <div className="landing-privacy-card">
              <div className="landing-privacy-icon">🚫</div>
              <div className="landing-privacy-title">No bank linking</div>
              <div className="landing-privacy-desc">We never ask for your bank credentials or account numbers. Ever.</div>
            </div>
            <div className="landing-privacy-card">
              <div className="landing-privacy-icon">📤</div>
              <div className="landing-privacy-title">Export anytime</div>
              <div className="landing-privacy-desc">Download your data as CSV at any time. Delete your account and everything's gone.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-final-cta">
        <h2 className="landing-final-title">Know where<br />it went.</h2>
        <p className="landing-final-sub">Free to use. Takes 30 seconds to start.</p>
        <button className="landing-final-btn" onClick={onGetStarted}>
          Get started with Google →
        </button>
        <div className="landing-final-note">Your data stays in your Google Drive. Always.</div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-logo">spentt<span className="landing-logo-dot" /></div>
        <div className="landing-footer-links">
            <span onClick={() => onGetStarted('privacy')} className="landing-footer-link">Privacy</span>
            <span onClick={() => onGetStarted('terms')} className="landing-footer-link">Terms</span>
            <span className="landing-footer-note">© 2026 Spentt</span>
        </div>
      </footer>

    </div>
  )
}