import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/axiosConfig';
import { AuthContext } from './AuthContext';

export const AddictionsContext = createContext();

export function AddictionsProvider({ children }) {
  const [addictions, setAddictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Fetch addictions when token changes
  useEffect(() => {
    const fetchAddictions = async () => {
      if (!token) {
        setAddictions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get('/api/addictions');
        setAddictions(response.data);
      } catch (err) {
        console.error('Error fetching addictions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddictions();
  }, [token]);

  // Add a new addiction to the context
  const addAddiction = (newAddiction) => {
    setAddictions(prev => [...prev, newAddiction]);
  };

  // Update an existing addiction
  const updateAddiction = (updatedAddiction) => {
    setAddictions(prev =>
      prev.map(addiction =>
        addiction._id === updatedAddiction._id ? updatedAddiction : addiction
      )
    );
  };

  // Remove an addiction
  const removeAddiction = (addictionId) => {
    setAddictions(prev => prev.filter(addiction => addiction._id !== addictionId));
  };

  // Refetch all addictions
  const refetchAddictions = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await apiClient.get('/api/addictions');
      setAddictions(response.data);
    } catch (err) {
      console.error('Error refetching addictions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddictionsContext.Provider
      value={{
        addictions,
        loading,
        addAddiction,
        updateAddiction,
        removeAddiction,
        refetchAddictions
      }}
    >
      {children}
    </AddictionsContext.Provider>
  );
}

export function useAddictions() {
  const context = useContext(AddictionsContext);
  if (!context) {
    throw new Error('useAddictions must be used within AddictionsProvider');
  }
  return context;
}
