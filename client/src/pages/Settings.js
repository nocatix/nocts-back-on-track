import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DarkModeContext } from '../context/DarkModeContext';
import LanguageSelector from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { t } = useTranslation(['common', 'messages']);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    setSaveMessage(t('messages:updated'));
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setSaveMessage(t('messages:updated'));
    setTimeout(() => setSaveMessage(''), 2000);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Personalize your recovery experience</p>
      </div>

      {saveMessage && (
        <div className="save-notification">
          <span>✓</span> {saveMessage}
        </div>
      )}

      {/* Display Preferences */}
      <section className="settings-section">
        <h2 className="section-title">Display Preferences</h2>

        <div className="settings-item">
          <div className="settings-label">
            <label>Dark Mode</label>
            <p>Easier on your eyes during evening use</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={handleDarkModeToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-item">
          <div className="settings-label">
            <label>Language</label>
            <p>Choose your preferred language</p>
          </div>
          <div className="language-selector-wrapper">
            <LanguageSelector />
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="settings-section">
        <h2 className="section-title">Notifications</h2>

        <div className="settings-item">
          <div className="settings-label">
            <label>Enable Notifications</label>
            <p>Browser notifications for daily reminders</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleNotificationsToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="settings-section">
        <h2 className="section-title">Data & Privacy</h2>

        <div className="settings-info-box">
          <h3>Your Privacy Matters</h3>
          <ul>
            <li>✓ Your data is encrypted and secure</li>
            <li>✓ Never shared with third parties</li>
            <li>✓ You can export your data anytime</li>
            <li>✓ Local autosave keeps you safe</li>
          </ul>
        </div>

        <div className="settings-actions">
          <button className="action-button export-data-btn">
            📥 Export My Data
          </button>
          <button className="action-button download-backup-btn">
            💾 Download Backup
          </button>
        </div>
      </section>

      {/* About Settings */}
      <section className="settings-section about-section">
        <h2 className="section-title">About</h2>

        <div className="about-content">
          <div className="app-info">
            <h3>Back On Track</h3>
            <p>Your Personal Recovery Companion</p>
            <ul className="app-features">
              <li>📊 Track your addiction recovery progress</li>
              <li>📝 Daily diary and mood tracking</li>
              <li>🎮 Interactive craving management game</li>
              <li>💡 Educational resources and guides</li>
              <li>🏆 Achievements and milestones</li>
  <li>🌍 Global support and community focus</li>
            </ul>
          </div>

          <div className="about-section-footer">
            <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="/help" className="footer-link">Help & Support</a>
            <span className="divider">•</span>
            <span className="version">v1.0.0</span>
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="settings-section account-section">
        <h2 className="section-title">Account</h2>
        <p className="account-text">
          Logged in as <strong>{user?.email || 'User'}</strong>
        </p>

        <div className="account-actions">
          <a href="/profile" className="manage-account-link">
            → Manage Account Settings
          </a>
          <p className="account-settings-hint">
            Password changes, data deletion, and more
          </p>
        </div>
      </section>
    </div>
  );
};

export default Settings;
