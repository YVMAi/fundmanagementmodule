
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import hiTranslations from './locales/hi.json';
import frTranslations from './locales/fr.json';

export const supportedLanguages = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'हिंदी', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
];

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  hi: { translation: hiTranslations },
  fr: { translation: frTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Update document direction and lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  const language = supportedLanguages.find(lang => lang.code === lng);
  if (language) {
    document.documentElement.dir = language.dir;
    document.documentElement.lang = lng;
  }
});

export default i18n;
