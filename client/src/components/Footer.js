import React from 'react';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { useContext } from 'react';
import './Footer.css';
import packageJson from '../../package.json';

export default function Footer() {
  const { isDarkMode } = useContext(DarkModeContext);
  const currentYear = new Date().getFullYear();
  const VERSION = packageJson.version;

  return (
    <footer className={`footer ${isDarkMode ? 'dark' : ''}`}>
      <div className="disclaimer-section">
        <p className="disclaimer-text">
          💚 <strong>100% Open Source • Completely Free • Zero Ads • No Tracking (Ever)</strong>
        </p>
        <p className="disclaimer-subtext">
          noct's Back on Track is freely available, open source software with no advertisements or data tracking. Your recovery journey is yours alone.
        </p>
      </div>

      <div className="footer-content">
        <div className="footer-section">
          <a 
            href="https://github.com/nocatix/nocts-back-on-track" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-project-name"
          >
            noct's Back on Track <span className="version-badge">v{VERSION}</span>
          </a>
          <p>Your personal addiction recovery companion</p>
        </div>
        
        <div className="footer-section">
          <Link to="/privacy" className="footer-link">🔒 Privacy Policy</Link>
        </div>

        <div className="footer-section copyright">
          <p>&copy; {currentYear} proudly made in 🇨🇦 by <strong>noct</strong></p>
          <p className="tagline">Recovery is possible. You've got this. 💪</p>
        </div>
      </div>
    </footer>
  );
}
