import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DarkModeContext } from '../context/DarkModeContext';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getCookie, setCookie } from '../utils/cookieHelper';
import { useAddictions } from '../context/AddictionsContext';
import './Sidebar.css';

export default function Sidebar() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { addictions, loading } = useAddictions();
  const [collapsed, setCollapsed] = useState(() => {
    const savedCollapsed = getCookie('sidebarCollapsed');
    return savedCollapsed !== null ? savedCollapsed : false;
  });
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const savedCategories = getCookie('sidebarCategories');
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch (err) {
        // If parsing fails, return defaults
      }
    }
    return {
      addictions: true,
      tracking: true,
      selfCare: true,
      planning: true,
      resources: false
    };
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Save sidebar collapsed state to cookie
    setCookie('sidebarCollapsed', collapsed, 365);
  }, [collapsed]);

  useEffect(() => {
    // Save expanded categories state to cookie
    setCookie('sidebarCategories', JSON.stringify(expandedCategories), 365);
  }, [expandedCategories]);

  useEffect(() => {
    // Close dropdown when navigation happens
    setOpenDropdown(null);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleCategory = (category) => {
    if (collapsed) {
      // When collapsed, toggle the dropdown instead
      setOpenDropdown(openDropdown === category ? null : category);
    } else {
      // When expanded, toggle normally
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    }
  };

  const NavCategory = ({ name, category, icon, children }) => {
    return (
      <div className="nav-category">
        <button
          className={`category-header ${expandedCategories[category] ? 'expanded' : ''}`}
          onClick={() => toggleCategory(category)}
          title={collapsed ? name : undefined}
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
  };

  if (!token) return null;

  return (
    <>
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
          <span className="text">{t('navigation.mainMenu')}</span>
        </Link>
        
        <Link
          to="/profile"
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          title="Profile"
        >
          <span className="emoji">👤</span>
          <span className="text">{t('header.profile')}</span>
        </Link>

        {/* My Addictions - Moved to top */}
        {!collapsed && (
          <div className="addictions-section">
            <div className="addictions-header">
              <button
                className={`category-header ${expandedCategories.addictions ? 'expanded' : ''}`}
                onClick={() => toggleCategory('addictions')}
              >
                <span className="category-icon">🗝️</span>
                <span className="category-name">{t('navigation.myAddictions') || 'My Addictions'}</span>
                <span className="category-toggle">{expandedCategories.addictions ? '▼' : '▶'}</span>
              </button>
              <Link to="/add-addiction" className="add-addiction-btn" title="Add new addiction">
                +
              </Link>
            </div>
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
          </div>
        )}

        {/* Progress Tracking */}
        <NavCategory name={t('navigation.progressTracking') || 'Progress Tracking'} category="tracking" icon="📊">
          <Link
            to="/diary"
            className={`nav-link ${isActive('/diary') ? 'active' : ''}`}
            title="Diary"
          >
            <span className="emoji">📔</span>
            <span className="text">{t('navigation.diary')}</span>
          </Link>
          
          <Link
            to="/mood"
            className={`nav-link ${isActive('/mood') ? 'active' : ''}`}
            title="Mood Tracker"
          >
            <span className="emoji">🎭</span>
            <span className="text">{t('navigation.mood')}</span>
          </Link>
          
          <Link
            to="/weight"
            className={`nav-link ${isActive('/weight') ? 'active' : ''}`}
            title="Weight Tracker"
          >
            <span className="emoji">⚖️</span>
            <span className="text">{t('navigation.weight')}</span>
          </Link>
          
          <Link
            to="/memories"
            className={`nav-link ${isActive('/memories') ? 'active' : ''}`}
            title="Memories"
          >
            <span className="emoji">💭</span>
            <span className="text">{t('navigation.memories')}</span>
          </Link>
        </NavCategory>

        {/* Achievements */}
        <Link
          to="/achievements"
          className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
          title="Achievements"
        >
          <span className="emoji">🏆</span>
          <span className="text">{t('navigation.achievements')}</span>
        </Link>

        {/* Self-Care & Support */}
        <NavCategory name={t('navigation.selfCareSupport') || 'Self-Care & Support'} category="selfCare" icon="💪">
          <Link
            to="/meditation"
            className={`nav-link ${isActive('/meditation') ? 'active' : ''}`}
            title="Meditation"
          >
            <span className="emoji">🧘</span>
            <span className="text">{t('navigation.meditation')}</span>
          </Link>
          
          <Link
            to="/mindfulness"
            className={`nav-link ${isActive('/mindfulness') ? 'active' : ''}`}
            title="Mindfulness"
          >
            <span className="emoji">🧠</span>
            <span className="text">{t('navigation.mindfulness')}</span>
          </Link>
          
          <Link
            to="/exercise"
            className={`nav-link ${isActive('/exercise') ? 'active' : ''}`}
            title="Exercise"
          >
            <span className="emoji">💪</span>
            <span className="text">{t('navigation.exercise')}</span>
          </Link>
          
          <Link
            to="/therapy"
            className={`nav-link ${isActive('/therapy') ? 'active' : ''}`}
            title="Therapy"
          >
            <span className="emoji">💊</span>
            <span className="text">{t('navigation.therapy')}</span>
          </Link>
          
          <Link
            to="/hobbies"
            className={`nav-link ${isActive('/hobbies') ? 'active' : ''}`}
            title="Hobbies"
          >
            <span className="emoji">🎯</span>
            <span className="text">{t('navigation.hobbies')}</span>
          </Link>
          
          <Link
            to="/craving-game"
            className={`nav-link ${isActive('/craving-game') ? 'active' : ''}`}
            title="Craving Game"
          >
            <span className="emoji">🎮</span>
            <span className="text">{t('navigation.cravingGame')}</span>
          </Link>

          <Link
            to="/crisis"
            className={`nav-link ${isActive('/crisis') ? 'active' : ''}`}
            title="Crisis Support"
          >
            <span className="emoji">🆘</span>
            <span className="text">{t('navigation.crisis')}</span>
          </Link>
        </NavCategory>

        {/* Planning & Preparation */}
        <NavCategory name={t('navigation.planning') || 'Planning & Preparation'} category="planning" icon="📋">
          <Link
            to="/preparation-plan"
            className={`nav-link ${isActive('/preparation-plan') ? 'active' : ''}`}
            title="Preparation Plan"
          >
            <span className="emoji">📋</span>
            <span className="text">{t('navigation.preparationPlan')}</span>
          </Link>
          
          <Link
            to="/withdrawal-symptoms"
            className={`nav-link ${isActive('/withdrawal-symptoms') ? 'active' : ''}`}
            title="Withdrawal Symptoms"
          >
            <span className="emoji">🌡️</span>
            <span className="text">{t('navigation.withdrawalSymptoms')}</span>
          </Link>
        </NavCategory>

        {/* Learning & Resources */}
        <NavCategory name={t('navigation.resources') || 'Learning & Resources'} category="resources" icon="📚">
          <Link
            to="/self-assessment"
            className={`nav-link ${isActive('/self-assessment') ? 'active' : ''}`}
            title="Self-Assessment Quiz"
          >
            <span className="emoji">❓</span>
            <span className="text">{t('navigation.selfAssessment')}</span>
          </Link>

          <Link
            to="/how-to-succeed"
            className={`nav-link ${isActive('/how-to-succeed') ? 'active' : ''}`}
            title="How to Succeed"
          >
            <span className="emoji">✨</span>
            <span className="text">{t('navigation.howToSucceed')}</span>
          </Link>
          
          <Link
            to="/why-use-this"
            className={`nav-link ${isActive('/why-use-this') ? 'active' : ''}`}
            title="Why Use This"
          >
            <span className="emoji">🌟</span>
            <span className="text">{t('navigation.whyUseThis') || 'Why Use This'}</span>
          </Link>
          
          <Link
            to="/functioning-user"
            className={`nav-link ${isActive('/functioning-user') ? 'active' : ''}`}
            title="Functioning User Reality"
          >
            <span className="emoji">⚠️</span>
            <span className="text">{t('navigation.functioningUser') || 'Functioning User Reality'}</span>
          </Link>
        </NavCategory>
      </nav>
    </div>

      {/* Category Dropdowns for collapsed sidebar - OUTSIDE sidebar to escape overflow-x: hidden */}
      {collapsed && (
        <>
          {openDropdown === 'addictions' && (
            <div className="category-dropdown">
              <h3 className="dropdown-title">{t('navigation.myAddictions') || 'My Addictions'}</h3>
              <div className="dropdown-items">
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
                        className={`addiction-link nav-link ${isActive(`/addiction/${addiction._id}`) ? 'active' : ''}`}
                      >
                        {addiction.name}
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {openDropdown === 'tracking' && (
            <div className="category-dropdown">
              <h3 className="dropdown-title">{t('navigation.progressTracking') || 'Progress Tracking'}</h3>
              <div className="dropdown-items">
                <Link to="/diary" className={`nav-link ${isActive('/diary') ? 'active' : ''}`}><span className="emoji">📔</span> {t('navigation.diary')}</Link>
                <Link to="/mood" className={`nav-link ${isActive('/mood') ? 'active' : ''}`}><span className="emoji">🎭</span> {t('navigation.mood')}</Link>
                <Link to="/weight" className={`nav-link ${isActive('/weight') ? 'active' : ''}`}><span className="emoji">⚖️</span> {t('navigation.weight')}</Link>
                <Link to="/memories" className={`nav-link ${isActive('/memories') ? 'active' : ''}`}><span className="emoji">💭</span> {t('navigation.memories')}</Link>
              </div>
            </div>
          )}

          {openDropdown === 'selfCare' && (
            <div className="category-dropdown">
              <h3 className="dropdown-title">{t('navigation.selfCareSupport') || 'Self-Care & Support'}</h3>
              <div className="dropdown-items">
                <Link to="/meditation" className={`nav-link ${isActive('/meditation') ? 'active' : ''}`}><span className="emoji">🧘</span> {t('navigation.meditation')}</Link>
                <Link to="/mindfulness" className={`nav-link ${isActive('/mindfulness') ? 'active' : ''}`}><span className="emoji">🧠</span> {t('navigation.mindfulness')}</Link>
                <Link to="/exercise" className={`nav-link ${isActive('/exercise') ? 'active' : ''}`}><span className="emoji">💪</span> {t('navigation.exercise')}</Link>
                <Link to="/therapy" className={`nav-link ${isActive('/therapy') ? 'active' : ''}`}><span className="emoji">💊</span> {t('navigation.therapy')}</Link>
                <Link to="/hobbies" className={`nav-link ${isActive('/hobbies') ? 'active' : ''}`}><span className="emoji">🎯</span> {t('navigation.hobbies')}</Link>
                <Link to="/craving-game" className={`nav-link ${isActive('/craving-game') ? 'active' : ''}`}><span className="emoji">🎮</span> {t('navigation.cravingGame')}</Link>
                <Link to="/crisis" className={`nav-link ${isActive('/crisis') ? 'active' : ''}`}><span className="emoji">🆘</span> {t('navigation.crisis')}</Link>
              </div>
            </div>
          )}

          {openDropdown === 'planning' && (
            <div className="category-dropdown">
              <h3 className="dropdown-title">{t('navigation.planning') || 'Planning & Preparation'}</h3>
              <div className="dropdown-items">
                <Link to="/preparation-plan" className={`nav-link ${isActive('/preparation-plan') ? 'active' : ''}`}><span className="emoji">📋</span> {t('navigation.preparationPlan')}</Link>
                <Link to="/withdrawal-symptoms" className={`nav-link ${isActive('/withdrawal-symptoms') ? 'active' : ''}`}><span className="emoji">🌡️</span> {t('navigation.withdrawalSymptoms')}</Link>
              </div>
            </div>
          )}

          {openDropdown === 'resources' && (
            <div className="category-dropdown">
              <h3 className="dropdown-title">{t('navigation.resources') || 'Learning & Resources'}</h3>
              <div className="dropdown-items">
                <Link to="/self-assessment" className={`nav-link ${isActive('/self-assessment') ? 'active' : ''}`}><span className="emoji">❓</span> {t('navigation.selfAssessment')}</Link>
                <Link to="/how-to-succeed" className={`nav-link ${isActive('/how-to-succeed') ? 'active' : ''}`}><span className="emoji">✨</span> {t('navigation.howToSucceed')}</Link>
                <Link to="/why-use-this" className={`nav-link ${isActive('/why-use-this') ? 'active' : ''}`}><span className="emoji">🌟</span> {t('navigation.whyUseThis') || 'Why Use This'}</Link>
                <Link to="/functioning-user" className={`nav-link ${isActive('/functioning-user') ? 'active' : ''}`}><span className="emoji">⚠️</span> {t('navigation.functioningUser') || 'Functioning User Reality'}</Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}