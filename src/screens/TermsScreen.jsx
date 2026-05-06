import './LegalScreen.css'

export default function TermsScreen({ onBack }) {
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
          <h1 className="legal-title">Terms of Service</h1>
          <div className="legal-date">Last updated: May 2025</div>
        </div>

        <div className="legal-body">
          <div className="legal-highlight">
            <strong>The short version:</strong> Use Spentt honestly, don't abuse it, and understand it's provided as-is. Your data is yours.
          </div>

          <h2>1. Acceptance of terms</h2>
          <p>By accessing or using Spentt at spentt.live, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>

          <h2>2. Description of service</h2>
          <p>Spentt is a personal expense tracking web application. It allows users to log, categorise, and review their personal expenses. Expense data is stored in the user's own Google Drive.</p>

          <h2>3. User accounts</h2>
          <p>Spentt uses Google Sign-In for authentication. By signing in, you represent that you have a valid Google account and agree to Google's terms of service. You are responsible for maintaining the security of your Google account.</p>

          <h2>4. Acceptable use</h2>
          <p>You agree to use Spentt only for lawful purposes and in accordance with these terms. You agree not to:</p>
          <ul>
            <li>Use the service for any illegal or unauthorised purpose</li>
            <li>Attempt to reverse engineer, hack, or compromise the service</li>
            <li>Use the service to store sensitive financial credentials</li>
            <li>Interfere with or disrupt the service</li>
          </ul>

          <h2>5. Your data</h2>
          <p>Your expense data is stored in your own Google Drive and belongs entirely to you. You can export, delete, or move your data at any time. We do not claim any ownership over your data.</p>

          <h2>6. Disclaimer of warranties</h2>
          <p>Spentt is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or completely secure. Use the service at your own risk.</p>

          <h2>7. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, Spentt and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>

          <h2>8. Service availability</h2>
          <p>We reserve the right to modify, suspend, or discontinue the service at any time without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the service.</p>

          <h2>9. Changes to terms</h2>
          <p>We reserve the right to update these terms at any time. We will update the date at the top of this page when changes are made. Continued use of the service after changes constitutes acceptance of the new terms.</p>

          <h2>10. Governing law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

          <h2>11. Contact</h2>
          <p>If you have any questions about these terms, please contact us at <a href="mailto:spentt.live@gmail.com">spentt.live@gmail.com</a></p>
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