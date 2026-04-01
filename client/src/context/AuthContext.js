import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/axiosConfig';
import { setCookie, getCookie, deleteCookie } from '../utils/cookieHelper';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || getCookie('loginInfo')?.token || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Save login info to cookie (expires in 30 days)
      setCookie('loginInfo', { token }, 30);
    } else {
      localStorage.removeItem('token');
      deleteCookie('loginInfo');
    }
  }, [token]);

  // Fetch user data when token exists but user is not loaded
  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const response = await apiClient.get('/api/auth/me');
          setUser(response.data.user);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          // If token is invalid, clear it
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token, user]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    deleteCookie('loginInfo');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
