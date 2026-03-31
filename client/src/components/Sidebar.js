import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Sidebar.css';

export default function Sidebar() {
  const { token, user } = useContext(AuthContext);
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
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>Back on Track</h2>
        <p>Welcome, {user?.fullName}</p>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          🏠 Dashboard
        </Link>
        
        <Link
          to="/add-addiction"
          className={`nav-link ${isActive('/add-addiction') ? 'active' : ''}`}
        >
          + Add Addiction
        </Link>
        
        <Link
          to="/diary"
          className={`nav-link ${isActive('/diary') ? 'active' : ''}`}
        >
          📔 Diary
        </Link>
        
        <Link
          to="/meditation"
          className={`nav-link ${isActive('/meditation') ? 'active' : ''}`}
        >
          🧘 Meditation
        </Link>
        
        <Link
          to="/craving-game"
          className={`nav-link ${isActive('/craving-game') ? 'active' : ''}`}
        >
          🎮 Craving Game
        </Link>
        
        <Link
          to="/achievements"
          className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
        >
          🏆 Achievements
        </Link>
        
        <Link
          to="/profile"
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
        >
          👤 Profile
        </Link>
      </nav>
      
      <div className="sidebar-section">
        <h3>Your Addictions</h3>
        <Link to="/add-addiction" className="add-new-addiction-link">+ Add New Addiction</Link>
        {loading ? (
          <p>Loading addictions...</p>
        ) : addictions.length === 0 ? (
          <p>No addictions tracked yet.</p>
        ) : (
          <ul className="addictions-list">
            {addictions.map(addiction => (
              <li key={addiction._id}>
                <Link
                  to={`/addiction/${addiction._id}`}
                  className={`addiction-link ${isActive(`/addiction/${addiction._id}`) ? 'active' : ''}`}
                >
                  {addiction.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}