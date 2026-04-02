import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(null); // 'standalone' | 'connected'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [modeConfigured, setModeConfigured] = useState(false);

  // Initialize mode from storage on app start
  useEffect(() => {
    bootstrapMode();
  }, []);

  const bootstrapMode = async () => {
    try {
      console.log('[ModeContext] Starting bootstrap');
      
      // Get stored mode
      const storedMode = await AsyncStorage.getItem('appMode');
      const storedServerUrl = await AsyncStorage.getItem('serverUrl');
      
      console.log('[ModeContext] Stored mode:', storedMode);
      
      if (storedMode) {
        setMode(storedMode);
        
        if (storedMode === 'connected' && storedServerUrl) {
          setServerUrl(storedServerUrl);
        }
      }
      
      // Mark mode configuration as complete - either we have a stored mode or user needs to select
      setModeConfigured(true);
      console.log('[ModeContext] Bootstrap complete');
    } catch (err) {
      console.error('[ModeContext] Error during bootstrap:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectMode = async (selectedMode) => {
    try {
      console.log('[ModeContext] Selecting mode:', selectedMode);
      
      if (!['standalone', 'connected'].includes(selectedMode)) {
        throw new Error('Invalid mode');
      }
      
      await AsyncStorage.setItem('appMode', selectedMode);
      setMode(selectedMode);
      setModeConfigured(true);
      
      // Clear server URL if switching to standalone
      if (selectedMode === 'standalone') {
        await AsyncStorage.removeItem('serverUrl');
        setServerUrl(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('[ModeContext] Error selecting mode:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateServerUrl = async (url) => {
    try {
      console.log('[ModeContext] Updating server URL');
      
      if (mode !== 'connected') {
        throw new Error('Cannot set server URL in standalone mode');
      }
      
      await AsyncStorage.setItem('serverUrl', url);
      setServerUrl(url);
      setError(null);
    } catch (err) {
      console.error('[ModeContext] Error updating server URL:', err);
      setError(err.message);
      throw err;
    }
  };

  const isServerConfigured = () => {
    return mode === 'standalone' || (mode === 'connected' && !!serverUrl);
  };

  const switchMode = async (newMode) => {
    try {
      console.log('[ModeContext] Switching mode to:', newMode);
      
      // Clear auth state when switching modes
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      
      await selectMode(newMode);
      setError(null);
    } catch (err) {
      console.error('[ModeContext] Error switching mode:', err);
      setError(err.message);
      throw err;
    }
  };

  const clearModeData = async () => {
    try {
      console.log('[ModeContext] Clearing mode data');
      await AsyncStorage.removeItem('appMode');
      await AsyncStorage.removeItem('serverUrl');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      
      setMode(null);
      setServerUrl(null);
      setModeConfigured(false);
      setError(null);
    } catch (err) {
      console.error('[ModeContext] Error clearing mode data:', err);
      setError(err.message);
      throw err;
    }
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        serverUrl,
        loading,
        error,
        modeConfigured,
        selectMode,
        updateServerUrl,
        isServerConfigured,
        switchMode,
        clearModeData,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = React.useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
