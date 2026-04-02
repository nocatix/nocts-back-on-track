import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load dark mode preference on app start
  useEffect(() => {
    loadDarkModePreference();
  }, []);

  const loadDarkModePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('darkMode');
      if (saved !== null) {
        // Use saved preference if available
        setIsDarkMode(JSON.parse(saved));
      } else {
        // Otherwise, use system preference
        const systemScheme = Appearance.getColorScheme();
        setIsDarkMode(systemScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading dark mode preference:', error);
      // Fallback to system preference on error
      const systemScheme = Appearance.getColorScheme();
      setIsDarkMode(systemScheme === 'dark');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('darkMode', JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, loading }}>
      {children}
    </DarkModeContext.Provider>
  );
}
