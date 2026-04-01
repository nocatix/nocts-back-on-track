import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './Achievements.css';

const Achievements = () => {
  const { token } = useAuth();
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

  if (loading) {
    return <div className="achievements-loading">Loading achievements...</div>;
  }

  if (error) {
    return <div className="achievements-error">Error: {error}</div>;
  }

  const getProgressPercentage = (milestoneDays) => {
    const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
    const currentIndex = milestones.indexOf(milestoneDays);
    
    if (currentIndex === -1) return 0;
    
    // For the first milestone, return 100% since it's already achieved
    if (currentIndex === 0) return 100;
    
    // For other milestones, calculate progress based on the previous milestone
    return Math.min(100, Math.round((milestoneDays / milestones[milestones.length - 1]) * 100));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="achievements-page">
      <h1>Achievements & Trophies</h1>
      <p className="achievements-description">
        Your milestones, achievements, and trophies on your journey to sobriety
      </p>
      
      {/* Trophy Progress Section */}
      {trophyProgress && (
        <div className="trophy-progress-section">
          <h2>🎯 Trophy Progress</h2>
          
          {trophyProgress.currentTrophy ? (
            <div className="trophy-progress-container">
              <div className="current-trophy">
                <h3>Current Trophy</h3>
                <div className="trophy-display">
                  <span className="trophy-icon-large">{trophyProgress.currentTrophy.name.split(' ')[0]}</span>
                  <div className="trophy-info">
                    <h4>{trophyProgress.currentTrophy.name}</h4>
                    <p>{trophyProgress.currentTrophy.description}</p>
                  </div>
                </div>
              </div>
              
              {trophyProgress.nextTrophy && (
                <>
                  <div className="progress-bar-wrapper">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${trophyProgress.progress}%` }}
                      />
                    </div>
                    <span className="progress-percentage">{Math.round(trophyProgress.progress)}%</span>
                  </div>
                  
                  <div className="next-trophy">
                    <h3>Next Trophy</h3>
                    <div className="trophy-display">
                      <span className="trophy-icon-large">{trophyProgress.nextTrophy.name.split(' ')[0]}</span>
                      <div className="trophy-info">
                        <h4>{trophyProgress.nextTrophy.name}</h4>
                        <p>{trophyProgress.nextTrophy.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="progress-description">{trophyProgress.progressDescription}</p>
                </>
              )}
              
              {!trophyProgress.nextTrophy && (
                <p className="ultimate-milestone">{trophyProgress.progressDescription}</p>
              )}
            </div>
          ) : (
            <div className="no-trophy-progress">
              <p>{trophyProgress.progressDescription}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Trophies Section */}
      {trophies.length > 0 && (
        <div className="trophies-section">
          <h2>🏆 Trophies</h2>
          
          {/* Daily Trophies */}
          {trophies.filter(t => t.type === 'daily').length > 0 && (
            <div className="trophy-category">
              <h3>⭐ Daily Trophies</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'daily').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      Earned on: {formatDate(trophy.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Weekly Trophies */}
          {trophies.filter(t => t.type === 'weekly').length > 0 && (
            <div className="trophy-category">
              <h3>🎖️ Weekly Trophies</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'weekly').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      Earned on: {formatDate(trophy.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Monthly Trophies */}
          {trophies.filter(t => t.type === 'monthly').length > 0 && (
            <div className="trophy-category">
              <h3>🏅 Monthly Trophies</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'monthly').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      Earned on: {formatDate(trophy.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Yearly Trophies */}
          {trophies.filter(t => t.type === 'yearly').length > 0 && (
            <div className="trophy-category">
              <h3>🏆 Yearly Trophies</h3>
              <div className="trophies-list">
                {trophies.filter(t => t.type === 'yearly').map((trophy) => (
                  <div key={trophy._id} className="trophy-card">
                    <div className="trophy-icon">{trophy.icon}</div>
                    <h4 className="trophy-title">{trophy.name}</h4>
                    <p className="trophy-description">{trophy.description}</p>
                    <span className="trophy-date">
                      Earned on: {formatDate(trophy.createdAt)}
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
        <h2>⭐ Achievements</h2>
        
        {achievements.length === 0 ? (
          <div className="achievements-empty">
            <p>No achievements yet. Keep going and you'll unlock milestones!</p>
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
                    Unlocked on: {formatDate(achievement.createdAt)}
                  </span>
                  {achievement.addictionId && (
                    <span className="achievement-addiction">
                      For: {achievement.addictionId.name}
                    </span>
                  )}
                </div>
                
                {/* Progress bar for milestone achievements */}
                {achievement.milestoneDays && (
                  <div className="achievement-progress">
                    <div className="progress-label">
                      Progress to next milestone
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${getProgressPercentage(achievement.milestoneDays)}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {achievement.milestoneDays} days
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;