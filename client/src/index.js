import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n/config'; // Initialize i18n
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
