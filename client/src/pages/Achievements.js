import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Achievements.css';

const Achievements = () => {
  const { token } = useAuth();
  const { t } = useTranslation('tracking');
  const [achievements, setAchievements] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [trophyProgress, setTrophyProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate fetches in development mode (React StrictMode)
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const fetchAchievementsAndTrophies = async () => {
      try {
        const API_BASE_URL = 'http://localhost:5000';
        
        // Check and award new trophies
        await fetch(`${API_BASE_URL}/api/trophies/check`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Fetch trophy progress
        const progressResponse = await fetch(`${API_BASE_URL}/api/trophies/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (progressResponse.ok) {
          try {
            const progressData = await progressResponse.json();
            setTrophyProgress(progressData);
          } catch (parseError) {
            console.warn('Failed to parse trophy progress response:', parseError);
          }
        }

        // Fetch achievements
        const achievementsResponse = await fetch(`${API_BASE_URL}/api/achievements`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Achievements response status:', achievementsResponse.status);
        console.log('Achievements response headers:', achievementsResponse.headers);
        const achievementsText = await achievementsResponse.text();
        console.log('Achievements response body:', achievementsText);
        
        if (!achievementsResponse.ok) {
          throw new Error('Failed to fetch achievements');
        }
        
        try {
          const achievementsData = JSON.parse(achievementsText);
          setAchievements(achievementsData);
        } catch (parseError) {
          console.error('Failed to parse achievements response:', parseError);
          console.error('Response headers:', achievementsResponse.headers);
          throw new Error('Invalid response format from achievements endpoint');
        }

        // Fetch trophies
        const trophiesResponse = await fetch(`${API_BASE_URL}/api/trophies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!trophiesResponse.ok) {
          throw new Error('Failed to fetch trophies');
        }

        try {
          const trophiesData = await trophiesResponse.json();
          setTrophies(trophiesData);
        } catch (parseError) {
          console.error('Failed to parse trophies response:', parseError);
          console.error('Response headers:', trophiesResponse.headers);
          throw new Error('Invalid response format from trophies endpoint');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching achievements data:', err);
        if (err instanceof SyntaxError) {
          setError('Failed to parse server response. Please try again.');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    if (token) {
      fetchAchievementsAndTrophies();
    }
  }, [token]);

  // Refetch achievements every 5 seconds to stay in sync with backend
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const API_BASE_URL = 'http://localhost:5000';
        
        // Fetch achievements
        const achievementsResponse = await fetch(`${API_BASE_URL}/api/achievements`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setAchievements(achievementsData);
        }

        // Fetch trophies
        const trophiesResponse = await fetch(`${API_BASE_URL}/api/trophies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (trophiesResponse.ok) {
          const trophiesData = await trophiesResponse.json();
          setTrophies(trophiesData);
        }

        // Fetch trophy progress
        const progressResponse = await fetch(`${API_BASE_URL}/api/trophies/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setTrophyProgress(progressData);
        }
      } catch (err) {
        console.error('Error refetching achievements:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return <div className="achievements-loading">{t('achievements.loading')}</div>;
  }

  if (error) {
    return <div className="achievements-error">{t('achievements.error')}{error}</div>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="achievements-page">
      <h1>{t('achievements.pageTitle')}</h1>
      <p className="achievements-description">
        {t('achievements.description')}
      </p>
      
      {/* Trophy Progress Section */}
      {trophyProgress && (
        <div className="trophy-progress-section">
          <h2>{t('achievements.trophyProgress')}</h2>
          
          <div className="trophy-progress-container">
            {trophyProgress.currentTrophy && (
              <div className="current-trophy">
                <h3>{t('achievements.currentTrophy')}</h3>
                <div className="trophy-display">
                  <span className="trophy-icon-large">{trophyProgress.currentTrophy.name.split(' ')[0]}</span>
                  <div className="trophy-info">
                    <h4>{trophyProgress.currentTrophy.name}</h4>
                    <p>{trophyProgress.currentTrophy.description}</p>
                  </div>
                </div>
              </div>
            )}
            
            {trophyProgress.nextTrophy && (
              <>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-container">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${trophyProgress.progress}%` }}
                    />
                    <span className="progress-text">
                      {t('achievements.progressText', { progress: Math.round(trophyProgress.progress), trophyName: trophyProgress.nextTrophy.name })}
                      {trophyProgress.timeRemainingFormatted && (
                        <span className="time-remaining"> (~{trophyProgress.timeRemainingFormatted})</span>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="next-trophy greyed-out">
                  <h3>{t('achievements.nextTrophy')}</h3>
                  <div className="trophy-display">
                    <span className="trophy-icon-large">{trophyProgress.nextTrophy.name.split(' ')[0]}</span>
                    <div className="trophy-info">
                      <h4>{trophyProgress.nextTrophy.name}</h4>
                      <p>{trophyProgress.nextTrophy.description}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {!trophyProgress.nextTrophy && (
              <p className="ultimate-milestone">{trophyProgress.progressDescription}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Trophies Section */}
      {trophies.length > 0 && (
        <div className="trophies-section">
          <h2>🏆 Trophies</h2>
         
          {/* Daily Trophies */}
          {trophies.filter(t => t.type === 'daily').length > 0 && (
            <div className="trophy-category">
              <h3>{t('achievements.trophyCategories.daily')}</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'daily').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      {t('achievements.earnedOn', { date: formatDate(trophy.createdAt) })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Weekly Trophies */}
          {trophies.filter(t => t.type === 'weekly').length > 0 && (
            <div className="trophy-category">
              <h3>{t('achievements.trophyCategories.weekly')}</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'weekly').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      {t('achievements.earnedOn', { date: formatDate(trophy.createdAt) })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Monthly Trophies */}
          {trophies.filter(t => t.type === 'monthly').length > 0 && (
            <div className="trophy-category">
              <h3>{t('achievements.trophyCategories.monthly')}</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'monthly').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      {t('achievements.earnedOn', { date: formatDate(trophy.createdAt) })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Yearly Trophies */}
          {trophies.filter(t => t.type === 'yearly').length > 0 && (
            <div className="trophy-category">
              <h3>{t('achievements.trophyCategories.yearly')}</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'yearly').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      {t('achievements.earnedOn', { date: formatDate(trophy.createdAt) })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Achievements Section */}
      <div className="achievements-section">
        <h2>{t('achievements.achievementsTitle')}</h2>
        
        {achievements.length === 0 ? (
          <div className="achievements-empty">
            <p>{t('achievements.noAchievements')}</p>
          </div>
        ) : (
          <div className="achievements-list">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="achievement-card">
                <div className="achievement-header">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <h3 className="achievement-title">{achievement.name}</h3>
                </div>
                <p className="achievement-description">{achievement.description}</p>
                <div className="achievement-details">
                  <span className="achievement-date">
                    {t('achievements.unlockedOn', { date: formatDate(achievement.createdAt) })}
                  </span>
                  {achievement.addictionId && (
                    <span className="achievement-addiction">
                      {t('achievements.for', { addiction: achievement.addictionId.name })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;