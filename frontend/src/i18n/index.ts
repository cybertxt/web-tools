import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enTools from './locales/en/tools.json';
import enErrors from './locales/en/errors.json';

import zhCNCommon from './locales/zh-CN/common.json';
import zhCNTools from './locales/zh-CN/tools.json';
import zhCNErrors from './locales/zh-CN/errors.json';

// Define resources
const resources = {
  en: {
    common: enCommon,
    tools: enTools,
    errors: enErrors,
  },
  'zh-CN': {
    common: zhCNCommon,
    tools: zhCNTools,
    errors: zhCNErrors,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'tools', 'errors'],
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n; 