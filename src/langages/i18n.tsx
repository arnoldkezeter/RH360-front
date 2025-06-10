import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en.json';
import frTranslations from './fr.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    lng: localStorage.getItem('lang') ?? 'fr', // Langue par défaut
    fallbackLng: 'en', // Langue de secours
  });

export default i18next;
