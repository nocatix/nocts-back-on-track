import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DarkModeContext } from '../context/DarkModeContext';
import Logo from './Logo';
import './Header.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`header ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-content">
        <div className="logo-section">
          <Logo size={40} />
          <h1 className="logo-text">noct's Back on Track</h1>
        </div>
        <div className="user-section">
          <button
            onClick={toggleDarkMode}
            className="btn btn-dark-mode"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="btn btn-logout">
            ➜]
          </button>
        </div>
      </div>
    </header>
  );
}
