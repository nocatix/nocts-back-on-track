import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import weightService from '../api/weightService';
import { AuthContext } from './AuthContext';

export const WeightContext = createContext();

export function WeightProvider({ children }) {
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  const loadWeights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weightService.getWeights();
      setWeights(data || []);
    } catch (err) {
      if (err.message !== 'User not found') {
        console.error('Error loading weights:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addWeight = useCallback(async (weightData) => {
    try {
      setError(null);
      const newWeight = await weightService.createWeight(weightData);
      setWeights([newWeight, ...weights]);
      return newWeight;
    } catch (err) {
      console.error('Error adding weight:', err);
      setError(err.message);
      throw err;
    }
  }, [weights]);

  const updateWeight = useCallback(async (id, updates) => {
    try {
      setError(null);
      const updated = await weightService.updateWeight(id, updates);
      setWeights(weights.map(w => w.id === id ? updated : w));
      return updated;
    } catch (err) {
      console.error('Error updating weight:', err);
      setError(err.message);
      throw err;
    }
  }, [weights]);

  const deleteWeight = useCallback(async (id) => {
    try {
      setError(null);
      await weightService.deleteWeight(id);
      setWeights(weights.filter(w => w.id !== id));
    } catch (err) {
      console.error('Error deleting weight:', err);
      setError(err.message);
      throw err;
    }
  }, [weights]);

  useEffect(() => {
    if (authContext && !authContext.loading) {
      loadWeights();
    }
  }, [authContext?.loading, loadWeights]);

  return (
    <WeightContext.Provider value={{ 
      weights, 
      loading, 
      error, 
      addWeight, 
      updateWeight, 
      deleteWeight,
      loadWeights 
    }}>
      {children}
    </WeightContext.Provider>
  );
}

export const useWeight = () => {
  const context = React.useContext(WeightContext);
  if (!context) {
    throw new Error('useWeight must be used within WeightProvider');
  }
  return context;
};
