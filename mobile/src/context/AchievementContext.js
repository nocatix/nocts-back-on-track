import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import achievementService from '../api/achievementService';
import { AuthContext } from './AuthContext';

export const AchievementContext = createContext();

export function AchievementProvider({ children }) {
  const [achievements, setAchievements] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  const loadAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await achievementService.getAchievements();
      setAchievements(data || []);
    } catch (err) {
      if (err.message !== 'User not found') {
        console.error('Error loading achievements:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrophies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await achievementService.getTrophies();
      setTrophies(data || []);
    } catch (err) {
      if (err.message !== 'User not found') {
        console.error('Error loading trophies:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAchievements = useCallback(async () => {
    try {
      setError(null);
      const newAchievements = await achievementService.checkAchievements();
      await loadAchievements();
      await loadTrophies();
      return newAchievements;
    } catch (err) {
      console.error('Error checking achievements:', err);
      setError(err.message);
    }
  }, [loadAchievements, loadTrophies]);

  const initializeAchievements = useCallback(async () => {
    try {
      setError(null);
      await achievementService.initializeAchievements();
      await loadAchievements();
    } catch (err) {
      console.error('Error initializing achievements:', err);
      setError(err.message);
    }
  }, [loadAchievements]);

  useEffect(() => {
    if (authContext && !authContext.loading) {
      loadAchievements();
      loadTrophies();
    }
  }, [authContext?.loading, loadAchievements, loadTrophies]);

  return (
    <AchievementContext.Provider value={{ 
      achievements, 
      trophies,
      loading, 
      error, 
      checkAchievements, 
      initializeAchievements,
      loadAchievements,
      loadTrophies 
    }}>
      {children}
    </AchievementContext.Provider>
  );
}

export const useAchievement = () => {
  const context = React.useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievement must be used within AchievementProvider');
  }
  return context;
};
