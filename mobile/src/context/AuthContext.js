import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../api/authService';
import { initializeDatabase } from '../db/database';
import { achievementService } from '../api/achievementService';
import { useMode } from './ModeContext';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mode, modeConfigured } = useMode();

  // Check if user is already logged in on app start
  useEffect(() => {
    if (modeConfigured) {
      bootstrapAsync();
    }
  }, [modeConfigured, mode]);

  const bootstrapAsync = async () => {
    try {
      console.log('[Auth] Starting bootstrap. Mode:', mode);
      
      // Initialize the database first
      try {
        await initializeDatabase();
        console.log('[Auth] Database initialized successfully');
      } catch (dbError) {
        console.error('[Auth] Error initializing database:', dbError);
      }
      
      const currentUser = await authService.getCurrentUser();
      console.log('[Auth] Bootstrap complete. User:', currentUser ? 'exists' : 'null');
      if (currentUser) {
        setUser(currentUser);
        setUserToken('authenticated');
      } else if (mode === 'standalone') {
        // In standalone mode, auto-authenticate with a local guest user
        console.log('[Auth] Standalone mode detected - auto-authenticating guest user');
        try {
          const result = await authService.login('guest', 'guest');
          setUser(result.user);
          setUserToken('authenticated');
        } catch (guestError) {
          // If can't login as guest, try to register
          console.log('[Auth] Auto-login failed, attempting auto-register');
          try {
            const result = await authService.register('guest', 'Guest User', 'guest');
            setUser(result.user);
            setUserToken('authenticated');
          } catch (registerError) {
            console.error('[Auth] Error creating guest user:', registerError);
          }
        }
      }
    } catch (err) {
      console.error('[Auth] Error during bootstrap:', err);
    } finally {
      console.log('[Auth] Bootstrap finished, setting loading to false');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      setUserToken('authenticated');
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, nameOnPhone) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(email, password, nameOnPhone);
      setUser(result.user);
      setUserToken('authenticated');
      
      // Initialize achievements for new user
      try {
        await achievementService.initializeAchievements();
        console.log('[Auth] Achievements initialized for new user');
      } catch (achievementError) {
        console.error('[Auth] Error initializing achievements:', achievementError);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setUserToken(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        login,
        register,
        logout,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
