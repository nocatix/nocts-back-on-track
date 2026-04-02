import React from 'react';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <div className="privacy-content">
        <div className="open-source-banner">
          <h2>💚 Open Source • Free • No Ads • No Tracking</h2>
          <p>
            Back on Track is completely free, open source software. We will <strong>NEVER</strong> display ads, 
            collect tracking data, or monetize your information. This is a commitment, not a promise.
          </p>
        </div>

        <h1>🔒 Privacy Policy</h1>
        <p className="last-updated">Last Updated: March 31, 2026</p>

        <section>
          <h2>What We Collect</h2>
          <p>
            Back on Track collects the following information to help you track your addiction recovery journey:
          </p>
          <ul>
            <li><strong>Account Information:</strong> Your full name, username, and encrypted password</li>
            <li><strong>Addiction Data:</strong> The addictions you're tracking, start dates, daily frequency, and money spent</li>
            <li><strong>Diary Entries:</strong> Any personal reflections and notes you write in your daily diary</li>
            <li><strong>Achievement Data:</strong> Milestones you reach and when you reach them</li>
            <li><strong>Session Data:</strong> Login times and basic usage patterns (not tracked individually)</li>
          </ul>
        </section>

        <section>
          <h2>Where Your Data is Stored</h2>
          <p>
            Your data is stored in a MongoDB database that is hosted locally or on your own server infrastructure. 
            All data remains under your control and is not sent to external servers or cloud providers by default.
          </p>
          <p>
            When deployed using Docker Compose (as recommended), the MongoDB database runs in a Docker container 
            on your own machine or private server.
          </p>
        </section>

        <section>
          <h2>How Your Data is Protected</h2>
          <ul>
            <li><strong>Password Encryption:</strong> All passwords are encrypted using bcryptjs with 10 salt rounds</li>
            <li><strong>Authentication:</strong> JSON Web Tokens (JWT) are used for session security</li>
            <li><strong>HTTPS Ready:</strong> The application supports HTTPS when deployed in production</li>
            <li><strong>Database Security:</strong> MongoDB can be configured with authentication and network isolation</li>
            <li><strong>No Third Parties:</strong> Your data is never shared with advertisers or third parties</li>
          </ul>
        </section>

        <section>
          <h2>What We Don't Do</h2>
          <ul>
            <li>❌ We do not track your location</li>
            <li>❌ We do not collect analytics or metrics about your behavior</li>
            <li>❌ We do not share your data with any external services</li>
            <li>❌ We do not display ads or sell your information</li>
            <li>❌ We do not use cookies for tracking (only for basic session management)</li>
            <li>❌ We do not access your personal files or contacts</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have full control over your data:</p>
          <ul>
            <li><strong>Access:</strong> You can view all your personal data at any time through the application</li>
            <li><strong>Modification:</strong> You can edit or delete any of your addiction records, diary entries, or account information</li>
            <li><strong>Export:</strong> Since you control the database, you can export all your data at any time</li>
            <li><strong>Deletion:</strong> You can delete your entire account and all associated data</li>
          </ul>
        </section>

        <section>
          <h2>Deployment Scenarios</h2>
          
          <h3>Local Deployment (Recommended for Privacy)</h3>
          <p>
            When you run Back on Track on your own machine using Docker Compose, all data stays completely on your device. 
            No data leaves your computer unless you explicitly configure it to do so.
          </p>
          <p><strong>Setup Command:</strong> <code>docker compose up -d</code></p>

          <h3>Private Server Deployment</h3>
          <p>
            If deployed on a private server you own or control, your data is protected by your server's security policies.
            Choose a server in a jurisdiction you trust.
          </p>

          <h3>What to Avoid</h3>
          <p>
            Do not deploy Back on Track on public servers without proper security configuration (SSL/TLS, firewalls, authentication).
          </p>
        </section>

        <section>
          <h2>Technical Details</h2>
          <p>
            <strong>Frontend:</strong> React application that runs entirely in your browser. No tracking cookies are enabled.
          </p>
          <p>
            <strong>Backend:</strong> Node.js Express server that processes your requests and stores data in MongoDB.
          </p>
          <p>
            <strong>Database:</strong> MongoDB with optional authentication. You can configure encryption at rest based on your deployment.
          </p>
          <p>
            <strong>Open Source:</strong> The complete source code is available for inspection. You can audit the codebase to verify our privacy claims.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy as the application evolves. You will be notified of significant changes. 
            The latest version is always available in the application.
          </p>
        </section>

        <section className="contact-section">
          <h2>Questions?</h2>
          <p>
            If you have questions about your privacy or how your data is handled, you can review the open source 
            code on our repository or contact us through the application.
          </p>
          <p>
            Remember: Your recovery journey is personal and private. We've built Back on Track to respect that.
          </p>
        </section>

        <section className="commitment">
          <h3>Our Commitment to You</h3>
          <p>
            Recovery is hard enough without worrying about your privacy. We commit to:
          </p>
          <ul>
            <li>✅ Keeping your data private and secure</li>
            <li>✅ Never selling or sharing your information</li>
            <li>✅ Making it easy for you to control your data</li>
            <li>✅ Being transparent about how we handle information</li>
            <li>✅ Supporting your recovery journey unconditionally</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
