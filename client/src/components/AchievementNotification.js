import React, { useState, useEffect, useContext, useCallback } from 'react';
import './AchievementNotification.css';
import apiClient from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

export default function AchievementNotification() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState([]);

  const dismissNotification = useCallback(async (id, type) => {
    try {
      const endpoint = type === 'achievement' ? `/api/achievements/${id}/read` : `/api/trophies/${id}/read`;
      await apiClient.put(endpoint, {});
      setVisible(prev => prev.filter(v => v !== id));
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error(`Failed to mark ${type} as read:`, error);
    }
  }, []);

  useEffect(() => {
    const showNotification = (notification) => {
      const id = notification._id;
      setVisible(prev => [...prev, id]);
      setTimeout(() => {
        dismissNotification(id, notification.type === 'achievement' ? 'achievement' : 'trophy');
      }, 5000);
    };

    const fetchUnreadNotifications = async () => {
      try {
        // Fetch both achievements and trophies in parallel
        const [achievementsRes, trophiesRes] = await Promise.all([
          apiClient.get('/api/achievements/unread').catch(() => ({ data: [] })),
          apiClient.get('/api/trophies/unread').catch(() => ({ data: [] }))
        ]);

        const achievements = (achievementsRes.data || []).map(a => ({ ...a, type: 'achievement' }));
        const trophies = (trophiesRes.data || []).map(t => ({ ...t, type: 'trophy' }));
        const allNotifications = [...achievements, ...trophies];

        setNotifications(prevNotifications => {
          const newNotifications = allNotifications.filter(
            notif => !prevNotifications.some(p => p._id === notif._id)
          );
          
          if (newNotifications.length > 0) {
            newNotifications.forEach(notif => {
              showNotification(notif);
            });
          }
          return [...newNotifications, ...prevNotifications];
        });
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    if (token) {
      fetchUnreadNotifications();
      const interval = setInterval(fetchUnreadNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [token, dismissNotification]);

  return (
    <div className="achievement-container">
      {visible.map(id => {
        const notification = notifications.find(n => n._id === id);
        if (!notification) return null;

        const icon = notification.type === 'achievement' ? notification.icon : '🏆';
        const title = notification.type === 'achievement' ? 'Achievement Unlocked!' : 'Trophy Earned!';

        return (
          <div key={id} className={`achievement-notification ${notification.type}`}>
            <div className="achievement-header">
              <div className="achievement-icon">{icon}</div>
              <div className="achievement-type">{title}</div>
            </div>
            <div className="achievement-content">
              <h4>{notification.name}</h4>
              <p>{notification.description}</p>
            </div>
            <button
              className="achievement-close"
              onClick={() => dismissNotification(id, notification.type === 'achievement' ? 'achievement' : 'trophy')}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
