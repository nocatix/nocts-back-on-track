import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      console.log('[Auth] Starting bootstrap');
      const currentUser = await authService.getCurrentUser();
      console.log('[Auth] Bootstrap complete. User:', currentUser ? 'exists' : 'null');
      if (currentUser) {
        setUser(currentUser);
        setUserToken('authenticated');
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
