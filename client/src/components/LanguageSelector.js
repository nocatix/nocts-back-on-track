import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, isChangingLanguage } = useLanguage();
  const { t } = useTranslation('profile');

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English', nativeName: 'English' },
    { code: 'en-simple', flag: '🇬🇧', name: 'Simple English', nativeName: 'Simple English' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch', nativeName: 'Deutsch' },
    { code: 'es', flag: '🇪🇸', name: 'Español', nativeName: 'Español' },
    { code: 'fr', flag: '🇫🇷', name: 'Français', nativeName: 'Français' },
    { code: 'it', flag: '🇮🇹', name: 'Italiano', nativeName: 'Italiano' },
    { code: 'pt', flag: '🇵🇹', name: 'Português', nativeName: 'Português' },
    { code: 'ko', flag: '🇰🇷', name: '한국어', nativeName: '한국어' },
    { code: 'ru', flag: '🇷🇺', name: 'Русский', nativeName: 'Русский' },
    { code: 'zh', flag: '🇨🇳', name: '中文', nativeName: '中文' },
    { code: 'ja', flag: '🇯🇵', name: '日本語', nativeName: '日本語' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية', nativeName: 'العربية', dir: 'rtl' }
  ];

  return (
    <div className={`language-selector ${className}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <h2>{t('language')}</h2>
      <p className="language-selector-note">
        🚧 Translations are still a work in progress. Only English is fully supported at the moment. You can help out!
      </p>
      <div className="language-buttons language-button-group">
        {languages.map(lang => (
          <button
            key={lang.code}
            className={`language-button ${currentLanguage === lang.code ? 'active' : ''}`}
            dir={lang.dir}
            onClick={() => changeLanguage(lang.code)}
            disabled={isChangingLanguage}
            title={lang.nativeName}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
