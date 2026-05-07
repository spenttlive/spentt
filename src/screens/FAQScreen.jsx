import './LegalScreen.css'
import './FAQScreen.css'

const FAQS = [
  {
    category: 'General',
    items: [
      {
        q: 'What is Spentt?',
        a: 'Spentt is a free personal expense tracker. Log what you spend, see where your money goes, and get a weekly receipt every Sunday with your spending personality.',
      },
      {
        q: 'Is Spentt really free?',
        a: 'Yes — completely free. No hidden charges, no premium plan (yet), no credit card required.',
      },
      {
        q: 'Do I need to link my bank account?',
        a: 'No. You never link your bank account. You log expenses manually — which takes about 5 seconds per entry.',
      },
      {
        q: 'Which currencies does Spentt support?',
        a: 'Spentt works with any currency. You can change your currency symbol in Settings.',
      },
      {
        q: 'Can I use Spentt on my phone?',
        a: 'Yes — open spentt.live in Safari (iPhone) or Chrome (Android), tap Share → Add to Home Screen. It installs like a native app with no App Store needed.',
      },
    ],
  },
  {
    category: 'Privacy & Data',
    items: [
      {
        q: 'Where is my data stored?',
        a: 'Your expenses are stored in a private file in your own Google Drive. We never see your financial data — it never touches our servers.',
      },
      {
        q: 'Can Spentt see my other Google Drive files?',
        a: 'No. Spentt only has access to its own private app folder in your Google Drive. It cannot see, read, or modify any of your other files.',
      },
      {
        q: 'How do I delete my data?',
        a: 'Go to Google Drive → find the Spentt app folder → delete spentt-expenses.json. You can also revoke access at myaccount.google.com/permissions.',
      },
      {
        q: 'Does Spentt sell my data?',
        a: 'Never. We do not sell, share, or trade your personal information with anyone.',
      },
      {
        q: 'What data does Spentt store on its servers?',
        a: 'Only your name, email, and total expense count — to help us understand how many people use the app. Your actual expense details are never stored on our servers.',
      },
    ],
  },
  {
    category: 'Using the app',
    items: [
      {
        q: 'How do I add an expense?',
        a: 'Tap the + button at the bottom. Enter what you spent, the amount, pick a category and date. Takes about 5 seconds.',
      },
      {
        q: 'Can I log expenses for past dates?',
        a: 'Yes — when adding an expense, tap the Date field and pick any past date. Useful for when you forget to log something.',
      },
      {
        q: 'How do I edit or delete an expense?',
        a: 'Tap any expense in the list to open the edit sheet. Change what you need and tap Save, or tap Delete to remove it.',
      },
      {
        q: 'What is the weekly receipt?',
        a: 'Every week Spentt generates a beautiful summary of your spending — broken down by category, with a total, and a spending personality verdict based on your habits.',
      },
      {
        q: 'What is a spending personality?',
        a: 'Based on how you spend, Spentt gives you a label like "Comfortable Contradictionist" or "The Foodie". It\'s meant to be honest, occasionally witty, and make you think.',
      },
      {
        q: 'How do I share my receipt?',
        a: 'Go to Receipt → tap Share. Spentt generates a beautiful card image you can send to WhatsApp, save to your camera roll, or post anywhere.',
      },
      {
        q: 'How do I export my data?',
        a: 'Go to Settings → Export data. Spentt downloads a CSV file with all your expenses — date, time, description, category, and amount.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'Why does Spentt need Google Drive access?',
        a: 'Spentt stores your expenses in your own Google Drive instead of our servers. This gives you full control and privacy over your financial data.',
      },
      {
        q: 'My expenses disappeared after refresh — what happened?',
        a: 'This usually means Drive access was not granted during login. Sign out and sign in again, making sure to grant Drive access when Google asks.',
      },
      {
        q: 'Does Spentt work offline?',
        a: 'Partially. You can view already-loaded expenses offline, but adding new ones requires an internet connection to save to your Google Drive.',
      },
      {
        q: 'Why does the app ask for Google Drive permission?',
        a: 'To store your expenses securely in your own Google Drive. Without this permission, your data cannot be saved between sessions.',
      },
      {
        q: 'My access token expired — what do I do?',
        a: 'Google access tokens expire after 1 hour. The app automatically refreshes them in the background. If you see issues, simply sign out and sign back in.',
      },
    ],
  },
]

export default function FAQScreen({ onBack }) {
  return (
    <div className="legal-screen">
      <div className="legal-nav">
        <div className="legal-logo">spentt<span className="legal-logo-dot" /></div>
        {onBack && <div className="legal-back" onClick={onBack}>← Back</div>}
      </div>

      <div className="legal-content">
        <div className="legal-header">
          <div className="legal-eyebrow">Help</div>
          <h1 className="legal-title">Frequently Asked Questions</h1>
          <div className="legal-date">Everything you need to know about Spentt</div>
        </div>

        {FAQS.map((section) => (
          <div key={section.category} className="faq-section">
            <div className="faq-category">{section.category}</div>
            {section.items.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        ))}

        <div className="faq-contact">
          <div className="faq-contact-title">Still have questions?</div>
          <div className="faq-contact-sub">We're happy to help.</div>
          <a href="mailto:hello@spentt.live" className="faq-contact-btn">
            hello@spentt.live
          </a>
        </div>
      </div>

      <footer className="legal-footer">
        <div className="legal-logo">spentt<span className="legal-logo-dot" /></div>
        <div className="legal-footer-links">
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
        </div>
      </footer>
    </div>
  )
}

function FAQItem({ q, a }) {
  return (
    <div className="faq-item">
      <div className="faq-q">{q}</div>
      <div className="faq-a">{a}</div>
    </div>
  )
}