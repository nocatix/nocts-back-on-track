import React, { useState, useEffect, useContext } from 'react';
import './AchievementNotification.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function AchievementNotification() {
  const { token } = useContext(AuthContext);
  const [achievements, setAchievements] = useState([]);
  const [visible, setVisible] = useState([]);

  const dismissAchievement = async (id) => {
    try {
      await axios.put(`/api/achievements/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVisible(prev => prev.filter(v => v !== id));
      setAchievements(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      console.error('Failed to mark achievement as read:', error);
    }
  };

  useEffect(() => {
    const showNotification = (achievement) => {
      const id = achievement._id;
      setVisible(prev => [...prev, id]);
      setTimeout(() => {
        dismissAchievement(id);
      }, 5000);
    };

    const fetchUnreadAchievements = async () => {
      try {
        const response = await axios.get('/api/achievements/unread', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newAchievements = response.data.filter(
          ach => !achievements.some(a => a._id === ach._id)
        );
        
        if (newAchievements.length > 0) {
          setAchievements(prev => [...newAchievements, ...prev]);
          newAchievements.forEach(ach => {
            showNotification(ach);
          });
        }
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      }
    };

    fetchUnreadAchievements();
    const interval = setInterval(fetchUnreadAchievements, 5000);
    return () => clearInterval(interval);
  }, [token, achievements, dismissAchievement]);

  return (
    <div className="achievement-container">
      {visible.map(id => {
        const achievement = achievements.find(a => a._id === id);
        if (!achievement) return null;

        return (
          <div key={id} className="achievement-notification">
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-content">
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
            </div>
            <button
              className="achievement-close"
              onClick={() => dismissAchievement(id)}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
