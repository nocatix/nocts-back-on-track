import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import memoryService from '../api/memoryService';
import { AuthContext } from './AuthContext';

export const MemoryContext = createContext();

export function MemoryProvider({ children }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  const loadMemories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await memoryService.getMemories();
      setMemories(data || []);
    } catch (err) {
      if (err.message !== 'User not found' && err.message !== 'Database not initialized') {
        console.error('Error loading memories:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addMemory = useCallback(async (memoryData) => {
    try {
      setError(null);
      const newMemory = await memoryService.createMemory(memoryData);
      setMemories([newMemory, ...memories]);
      return newMemory;
    } catch (err) {
      console.error('Error adding memory:', err);
      setError(err.message);
      throw err;
    }
  }, [memories]);

  const updateMemory = useCallback(async (id, updates) => {
    try {
      setError(null);
      const updated = await memoryService.updateMemory(id, updates);
      setMemories(memories.map(m => m.id === id ? updated : m));
      return updated;
    } catch (err) {
      console.error('Error updating memory:', err);
      setError(err.message);
      throw err;
    }
  }, [memories]);

  const deleteMemory = useCallback(async (id) => {
    try {
      setError(null);
      await memoryService.deleteMemory(id);
      setMemories(memories.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting memory:', err);
      setError(err.message);
      throw err;
    }
  }, [memories]);

  useEffect(() => {
    if (authContext && !authContext.loading) {
      loadMemories();
    }
  }, [authContext, loadMemories]);

  return (
    <MemoryContext.Provider value={{ 
      memories, 
      loading, 
      error, 
      addMemory, 
      updateMemory, 
      deleteMemory,
      loadMemories 
    }}>
      {children}
    </MemoryContext.Provider>
  );
}

export const useMemory = () => {
  const context = React.useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within MemoryProvider');
  }
  return context;
};
