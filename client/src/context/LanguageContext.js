import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/axiosConfig';
import { useAuth } from './AuthContext';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const { user, setUser } = useAuth();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Get stored language or default to 'en'
        let storedLanguage = localStorage.getItem('language') || 'en';
        
        // If user exists, use their language preference
        if (user && user.language) {
          storedLanguage = user.language;
        }
        
        // Change to the stored/user language
        await i18n.changeLanguage(storedLanguage);
        localStorage.setItem('language', storedLanguage);
      } catch (error) {
        console.error('Error initializing language:', error);
        await i18n.changeLanguage('en');
      }
    };

    initializeLanguage();
  }, [i18n, user]);

  const changeLanguage = async (languageCode) => {
    if (isChangingLanguage) return;
    
    setIsChangingLanguage(true);
    try {
      // Change language in i18n
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('language', languageCode);

      // If user is authenticated, save to backend
      if (user) {
        try {
          const response = await apiClient.put('/api/auth/language', { language: languageCode });
          if (response.data.language) {
            setUser({ ...user, language: languageCode });
          }
        } catch (error) {
          console.error('Error saving language preference:', error);
          // Still keep the local change even if server save fails
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
      // Revert language change on error
      await i18n.changeLanguage(localStorage.getItem('language') || 'en');
    } finally {
      setIsChangingLanguage(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage: i18n.language, changeLanguage, isChangingLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
