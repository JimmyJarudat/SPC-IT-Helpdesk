// src/i18n.js
'use client'; 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/common.json';
import thTranslation from './locales/th/common.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
     resources: {
      en: {
        translation: enTranslation,
      },
      th: {
        translation: thTranslation,
      },
    },
  });

export default i18n;