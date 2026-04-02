import React, { createContext, useContext, useState, useEffect } from 'react';
import addictionService from '../api/addictionService';
import { AuthContext } from './AuthContext';

export const AddictionContext = createContext();

export function AddictionProvider({ children }) {
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  // Fetch addictions only after database is initialized
  useEffect(() => {
    if (authContext && !authContext.loading) {
      fetchAddictions();
    }
  }, [authContext?.loading]);

  const fetchAddictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await addictionService.getAddictions();
      setAddictions(data || []);
    } catch (err) {
      // Only show error if it's not a "User not found" scenario
      if (err.message !== 'User not found') {
        setError(err.message || 'Failed to fetch addictions');
        console.error('Error loading addictions:', err);
      }
      setAddictions([]);
    } finally {
      setLoading(false);
    }
  };

  const addAddiction = async (addictionData) => {
    try {
      const newAddiction = await addictionService.createAddiction(addictionData);
      setAddictions([...addictions, newAddiction]);
      return newAddiction;
    } catch (err) {
      setError(err.message || 'Failed to add addiction');
      throw err;
    }
  };

  const updateAddiction = async (id, updates) => {
    try {
      const updated = await addictionService.updateAddiction(id, updates);
      setAddictions(addictions.map(a => a._id === id ? updated : a));
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update addiction');
      throw err;
    }
  };

  const deleteAddiction = async (id) => {
    try {
      await addictionService.deleteAddiction(id);
      setAddictions(addictions.filter(a => a._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete addiction');
      throw err;
    }
  };

  const value = {
    addictions,
    loading,
    error,
    fetchAddictions,
    addAddiction,
    updateAddiction,
    deleteAddiction,
  };

  return (
    <AddictionContext.Provider value={value}>
      {children}
    </AddictionContext.Provider>
  );
}

export const useAddiction = () => {
  const context = useContext(AddictionContext);
  if (!context) {
    throw new Error('useAddiction must be used within an AddictionProvider');
  }
  return context;
};
