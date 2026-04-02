import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from './languages/en.json';
import es from './languages/es.json';
import fr from './languages/fr.json';
import de from './languages/de.json';
import pt from './languages/pt.json';
import it from './languages/it.json';
import ja from './languages/ja.json';
import ko from './languages/ko.json';
import zh from './languages/zh.json';
import ru from './languages/ru.json';
import ar from './languages/ar.json';
import en_simple from './languages/en-simple.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
  it: { translation: it },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zh },
  ru: { translation: ru },
  ar: { translation: ar },
  'en-simple': { translation: en_simple },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Load language preference from storage
export const initializeLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (savedLanguage && resources[savedLanguage]) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Error loading language preference:', error);
  }
};

// Save language preference
export const setLanguage = async (languageCode) => {
  try {
    await AsyncStorage.setItem('selectedLanguage', languageCode);
    await i18n.changeLanguage(languageCode);
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
};

// Get available languages
export const getAvailableLanguages = () => {
  return [
    { code: 'en', englishName: 'English', nativeName: 'English' },
    { code: 'en-simple', englishName: 'English (Simple)', nativeName: 'English (Simple)' },
    { code: 'es', englishName: 'Spanish', nativeName: 'Español' },
    { code: 'fr', englishName: 'French', nativeName: 'Français' },
    { code: 'de', englishName: 'German', nativeName: 'Deutsch' },
    { code: 'pt', englishName: 'Portuguese', nativeName: 'Português' },
    { code: 'it', englishName: 'Italian', nativeName: 'Italiano' },
    { code: 'ja', englishName: 'Japanese', nativeName: '日本語' },
    { code: 'ko', englishName: 'Korean', nativeName: '한국어' },
    { code: 'zh', englishName: 'Chinese', nativeName: '中文' },
    { code: 'ru', englishName: 'Russian', nativeName: 'Русский' },
    { code: 'ar', englishName: 'Arabic', nativeName: 'العربية' },
  ];
};

export default i18n;
