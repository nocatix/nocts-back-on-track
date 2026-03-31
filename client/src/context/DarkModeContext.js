import React, { createContext, useState, useEffect } from 'react';
import { setCookie, getCookie } from '../utils/cookieHelper';

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check cookie first (highest priority)
    const savedCookie = getCookie('darkMode');
    if (savedCookie !== null) {
      return savedCookie;
    }
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    // Save to cookie (expires in 1 year)
    setCookie('darkMode', isDarkMode, 365);
    
    // Update document class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
