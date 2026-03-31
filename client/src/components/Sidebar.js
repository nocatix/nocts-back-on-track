import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Sidebar.css';

export default function Sidebar() {
  const { token, user } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchAddictions = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get('/api/addictions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddictions(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchAddictions();
  }, [token]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!token) return null;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isDarkMode ? 'dark' : ''}`}>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          ≡
        </button>
      
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          title="Dashboard"
        >
          <span className="emoji">🏠</span>
          <span className="text">Dashboard</span>
        </Link>
        
        <Link
          to="/diary"
          className={`nav-link ${isActive('/diary') ? 'active' : ''}`}
          title="Diary"
        >
          <span className="emoji">📔</span>
          <span className="text">Diary</span>
        </Link>
        
        <Link
          to="/meditation"
          className={`nav-link ${isActive('/meditation') ? 'active' : ''}`}
          title="Meditation"
        >
          <span className="emoji">🧘</span>
          <span className="text">Meditation</span>
        </Link>
        
        <Link
          to="/craving-game"
          className={`nav-link ${isActive('/craving-game') ? 'active' : ''}`}
          title="Craving Game"
        >
          <span className="emoji">🎮</span>
          <span className="text">Craving Game</span>
        </Link>
        
        <Link
          to="/achievements"
          className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
          title="Achievements"
        >
          <span className="emoji">🏆</span>
          <span className="text">Achievements</span>
        </Link>
        
        <Link
          to="/profile"
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          title="Profile"
        >
          <span className="emoji">👤</span>
          <span className="text">Profile</span>
        </Link>
      </nav>
      
      <div className="sidebar-section">
        {!collapsed && (
          <>
            {loading ? (
              <p>Loading addictions...</p>
            ) : addictions.length === 0 ? (
              <p>No addictions tracked yet.</p>
            ) : (
              <ul className="addictions-list">
                {addictions.map(addiction => (
                    <Link
                      key={addiction._id}
                      to={`/addiction/${addiction._id}`}
                      className={`addiction-link ${isActive(`/addiction/${addiction._id}`) ? 'active' : ''}`}
                    >
                      {addiction.name}
                    </Link>
                ))}
              </ul>
            )}
          </>
        )}
        <Link to="/add-addiction" className="add-new-addiction-link" title="Add Addiction">+</Link>
      </div>
    </div>
  );
}