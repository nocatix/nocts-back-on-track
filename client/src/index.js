import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n/config'; // Initialize i18n
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AddictionsProvider } from './context/AddictionsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <AuthProvider>
        <AddictionsProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </AddictionsProvider>
      </AuthProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
