import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import trophyService from '../api/trophyService';
import { AuthContext } from './AuthContext';

export const TrophyContext = createContext();

export function TrophyProvider({ children }) {
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  const loadTrophies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trophyService.getTrophies();
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

  useEffect(() => {
    if (authContext && !authContext.loading) {
      loadTrophies();
    }
  }, [authContext?.loading, loadTrophies]);

  return (
    <TrophyContext.Provider value={{ 
      trophies, 
      loading, 
      error, 
      loadTrophies 
    }}>
      {children}
    </TrophyContext.Provider>
  );
}

export const useTrophy = () => {
  const context = React.useContext(TrophyContext);
  if (!context) {
    throw new Error('useTrophy must be used within TrophyProvider');
  }
  return context;
};
