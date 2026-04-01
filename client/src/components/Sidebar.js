import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getCookie, setCookie } from '../utils/cookieHelper';
import apiClient from '../api/axiosConfig';
import './Sidebar.css';

export default function Sidebar() {
  const { token, user } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(() => {
    const savedCollapsed = getCookie('sidebarCollapsed');
    return savedCollapsed !== null ? savedCollapsed : false;
  });
  const [expandedCategories, setExpandedCategories] = useState({
    tracking: true,
    selfCare: true,
    support: true,
    info: false,
    addictions: true
  });
  const location = useLocation();

  useEffect(() => {
    const fetchAddictions = async () => {
      if (!token) return;
      
      try {
        const response = await apiClient.get('/api/addictions');
        setAddictions(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchAddictions();
  }, [token]);

  useEffect(() => {
    // Save sidebar collapsed state to cookie
    setCookie('sidebarCollapsed', collapsed, 365);
  }, [collapsed]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const NavCategory = ({ name, category, icon, children }) => (
    <div className="nav-category">
      <button
        className={`category-header ${expandedCategories[category] ? 'expanded' : ''}`}
        onClick={() => toggleCategory(category)}
      >
        <span className="category-icon">{icon}</span>
        {!collapsed && (
          <>
            <span className="category-name">{name}</span>
            <span className="category-toggle">{expandedCategories[category] ? '▼' : '▶'}</span>
          </>
        )}
      </button>
      {!collapsed && expandedCategories[category] && (
        <div className="category-items">
          {children}
        </div>
      )}
    </div>
  );

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
          to="/profile"
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          title="Profile"
        >
          <span className="emoji">👤</span>
          <span className="text">Profile</span>
        </Link>

        <NavCategory name="Tracking" category="tracking" icon="📊">
          <Link
            to="/diary"
            className={`nav-link ${isActive('/diary') ? 'active' : ''}`}
            title="Diary"
          >
            <span className="emoji">📔</span>
            <span className="text">Diary</span>
          </Link>
          
          <Link
            to="/mood"
            className={`nav-link ${isActive('/mood') ? 'active' : ''}`}
            title="Mood Tracker"
          >
            <span className="emoji">🎭</span>
            <span className="text">Mood</span>
          </Link>
          
          <Link
            to="/weight"
            className={`nav-link ${isActive('/weight') ? 'active' : ''}`}
            title="Weight Tracker"
          >
            <span className="emoji">⚖️</span>
            <span className="text">Weight</span>
          </Link>
          
          <Link
            to="/memories"
            className={`nav-link ${isActive('/memories') ? 'active' : ''}`}
            title="Memories"
          >
            <span className="emoji">💭</span>
            <span className="text">Memories</span>
          </Link>

          <Link
            to="/achievements"
            className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
            title="Achievements"
          >
            <span className="emoji">🏆</span>
            <span className="text">Achievements</span>
          </Link>
        </NavCategory>

        <NavCategory name="Self-Care" category="selfCare" icon="🌟">
          <Link
            to="/meditation"
            className={`nav-link ${isActive('/meditation') ? 'active' : ''}`}
            title="Meditation"
          >
            <span className="emoji">🧘</span>
            <span className="text">Meditation</span>
          </Link>
          
          <Link
            to="/hobbies"
            className={`nav-link ${isActive('/hobbies') ? 'active' : ''}`}
            title="Hobbies"
          >
            <span className="emoji">🎯</span>
            <span className="text">Hobbies</span>
          </Link>
          
          <Link
            to="/craving-game"
            className={`nav-link ${isActive('/craving-game') ? 'active' : ''}`}
            title="Craving Game"
          >
            <span className="emoji">🎮</span>
            <span className="text">Craving Game</span>
          </Link>
        </NavCategory>

        <NavCategory name="Support & Planning" category="support" icon="💪">
          <Link
            to="/crisis"
            className={`nav-link ${isActive('/crisis') ? 'active' : ''}`}
            title="Crisis Support"
          >
            <span className="emoji">🆘</span>
            <span className="text">Crisis Support</span>
          </Link>
          
          <Link
            to="/preparation-plan"
            className={`nav-link ${isActive('/preparation-plan') ? 'active' : ''}`}
            title="Preparation Plan"
          >
            <span className="emoji">📋</span>
            <span className="text">Make a Plan</span>
          </Link>
          
          <Link
            to="/withdrawal-symptoms"
            className={`nav-link ${isActive('/withdrawal-symptoms') ? 'active' : ''}`}
            title="Withdrawal Symptoms"
          >
            <span className="emoji">🌡️</span>
            <span className="text">Withdrawal Symptoms</span>
          </Link>
        </NavCategory>

        <NavCategory name="Resources" category="info" icon="ℹ️">
          <Link
            to="/how-to-succeed"
            className={`nav-link ${isActive('/how-to-succeed') ? 'active' : ''}`}
            title="How to Succeed"
          >
            <span className="emoji">🎯</span>
            <span className="text">How to Succeed</span>
          </Link>
          
          <Link
            to="/why-use-this"
            className={`nav-link ${isActive('/why-use-this') ? 'active' : ''}`}
            title="Why Use This"
          >
            <span className="emoji">❓</span>
            <span className="text">Why Use This</span>
          </Link>
        </NavCategory>
      </nav>
      
      <div className="sidebar-section">
        {!collapsed && (
          <div className="addictions-section">
            <button
              className={`category-header ${expandedCategories.addictions ? 'expanded' : ''}`}
              onClick={() => toggleCategory('addictions')}
            >
              <span className="category-icon">🚫</span>
              <span className="category-name">Tracked Addictions</span>
              <span className="category-toggle">{expandedCategories.addictions ? '▼' : '▶'}</span>
            </button>
            {expandedCategories.addictions && (
              <div className="category-items">
                {loading ? (
                  <p className="loading-text">Loading...</p>
                ) : addictions.length === 0 ? (
                  <p className="empty-text">No addictions yet</p>
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
              </div>
            )}
            <Link to="/add-addiction" className="add-new-addiction-link" title="Add Addiction">+</Link>
          </div>
        )}
      </div>
    </div>
  );
}