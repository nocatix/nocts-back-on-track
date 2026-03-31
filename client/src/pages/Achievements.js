import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Achievements.css';

const Achievements = () => {
  const { user, token } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }
        
        const data = await response.json();
        setAchievements(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchAchievements();
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
    const previousMilestone = milestones[currentIndex - 1];
    return Math.min(100, Math.round((milestoneDays / milestones[milestones.length - 1]) * 100));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="achievements-page">
      <h1>Achievements</h1>
      <p className="achievements-description">
        Your milestones and achievements on your journey to sobriety
      </p>
      
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
  );
};

export default Achievements;