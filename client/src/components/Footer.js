import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="disclaimer-section">
        <p className="disclaimer-text">
          💚 <strong>100% Open Source • Completely Free • Zero Ads • No Tracking (Ever)</strong>
        </p>
        <p className="disclaimer-subtext">
          Back on Track is freely available, open source software with no advertisements or data tracking. Your recovery journey is yours alone.
        </p>
      </div>

      <div className="footer-content">
        <div className="footer-section">
          <h4>Back on Track</h4>
          <p>Your personal addiction recovery companion</p>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <Link to="/privacy" className="footer-link">🔒 Privacy Policy</Link>
        </div>

        <div className="footer-section copyright">
          <p>&copy; {currentYear} Made by <strong>noct</strong></p>
          <p className="tagline">Recovery is possible. You've got this. 💪</p>
        </div>
      </div>
    </footer>
  );
}
