import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';
import './Header.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <Logo size={40} />
          <h1 className="logo-text">noct's Back on Track</h1>
        </div>
        <div className="user-section">
          <button onClick={handleLogout} className="btn btn-logout">
            ➜]
          </button>
        </div>
      </div>
    </header>
  );
}
