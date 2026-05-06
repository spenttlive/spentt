import './LegalScreen.css'

export default function PrivacyScreen({ onBack }) {
  return (
    <div className="legal-screen">
      <div className="legal-nav">
        <div className="legal-logo">spentt<span className="legal-logo-dot" /></div>
        {onBack && (
          <div className="legal-back" onClick={onBack}>← Back</div>
        )}
      </div>

      <div className="legal-content">
        <div className="legal-header">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-date">Last updated: May 2025</div>
        </div>

        <div className="legal-body">
          <div className="legal-highlight">
            <strong>The short version:</strong> Your expenses live in your own Google Drive. We never see them, store them, or sell them. Ever.
          </div>

          <h2>1. Who we are</h2>
          <p>Spentt is a personal expense tracking application available at spentt.live. We are committed to protecting your privacy and being transparent about how your data works.</p>

          <h2>2. What data we collect</h2>
          <p>When you sign in with Google, we receive:</p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your Google profile picture</li>
          </ul>
          <p>This information is used only to personalise your experience (show your name in greetings) and is stored locally in your browser.</p>

          <h2>3. Where your expenses are stored</h2>
          <p>All your expense data is stored in a file called <code>spentt-expenses.json</code> in your own Google Drive, in a private app-specific folder that only Spentt can access. We do not have access to any other files in your Google Drive.</p>
          <p>We do not store your expense data on our servers. We do not have a database of your financial information. Your data belongs to you.</p>

          <h2>4. What we do NOT collect</h2>
          <ul>
            <li>Bank account details</li>
            <li>Credit card information</li>
            <li>Payment credentials of any kind</li>
            <li>Your location</li>
            <li>Your browsing history</li>
            <li>Any data beyond what Google provides during sign-in</li>
          </ul>

          <h2>5. How we use Google APIs</h2>
          <p>Spentt uses the following Google API scopes:</p>
          <ul>
            <li><code>drive.appdata</code> — to read and write your expense file in a private app folder in your Google Drive</li>
            <li><code>profile</code> and <code>email</code> — to display your name and email in the app</li>
          </ul>
          <p>Our use of Google APIs complies with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>

          <h2>6. Data sharing</h2>
          <p>We do not share, sell, rent, or trade your personal information with any third parties. Your data is yours.</p>

          <h2>7. Data retention</h2>
          <p>Since your data lives in your Google Drive, you control it entirely. You can delete the <code>spentt-expenses.json</code> file from your Google Drive at any time to remove all your expense data. You can also revoke Spentt's access to your Google Drive through your Google Account settings.</p>

          <h2>8. Cookies and local storage</h2>
          <p>Spentt uses browser local storage to remember your login session and preferences (such as dark mode). No tracking cookies are used. We do not use any third-party analytics or advertising tools.</p>

          <h2>9. Children's privacy</h2>
          <p>Spentt is not directed at children under the age of 13. We do not knowingly collect information from children.</p>

          <h2>10. Changes to this policy</h2>
          <p>If we make significant changes to this privacy policy, we will update the date at the top of this page. Continued use of Spentt after changes constitutes acceptance of the new policy.</p>

          <h2>11. Contact</h2>
          <p>If you have any questions about this privacy policy or how your data is handled, please contact us at <a href="mailto:spentt.live@gmail.com">spentt.live@gmail.com</a></p>
        </div>
      </div>

      <footer className="legal-footer">
        <div className="legal-logo">spentt<span className="legal-logo-dot" /></div>
        <div className="legal-footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </footer>
    </div>
  )
}