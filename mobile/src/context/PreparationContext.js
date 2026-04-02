import React, { createContext, useState, useCallback } from 'react';
import preparationService from '../api/preparationService';

export const PreparationContext = createContext();

export function PreparationProvider({ children }) {
  const [preparationPlan, setPreparationPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPreparationPlan = useCallback(async (addictionId = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await preparationService.getPreparationPlan(addictionId);
      setPreparationPlan(data);
      return data;
    } catch (err) {
      console.error('Error loading preparation plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPreparationPlan = useCallback(async (addictionId, responses) => {
    try {
      setError(null);
      const newPlan = await preparationService.createPreparationPlan(addictionId, responses);
      setPreparationPlan(newPlan);
      return newPlan;
    } catch (err) {
      console.error('Error creating preparation plan:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const updatePreparationPlan = useCallback(async (id, updates) => {
    try {
      setError(null);
      const updated = await preparationService.updatePreparationPlan(id, updates);
      setPreparationPlan(updated);
      return updated;
    } catch (err) {
      console.error('Error updating preparation plan:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const updatePreparationField = useCallback(async (id, fieldId, value) => {
    try {
      setError(null);
      const updated = await preparationService.updatePreparationField(id, fieldId, value);
      setPreparationPlan(updated);
      return updated;
    } catch (err) {
      console.error('Error updating preparation field:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  return (
    <PreparationContext.Provider value={{
      preparationPlan,
      loading,
      error,
      loadPreparationPlan,
      createPreparationPlan,
      updatePreparationPlan,
      updatePreparationField
    }}>
      {children}
    </PreparationContext.Provider>
  );
}

export const usePreparation = () => {
  const context = React.useContext(PreparationContext);
  if (!context) {
    throw new Error('usePreparation must be used within PreparationProvider');
  }
  return context;
};
