import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    ns: ['common', 'auth', 'profile', 'addictions', 'tracking', 'diary', 'hobbies', 'resources', 'messages'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: true
    }
  });

export default i18n;
