import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../assets/locales/en.json'
import ko from '../assets/locales/ko.json';

const LANG_CODES = ['ko', 'en'];

const LANGUAGE_DETECTOR: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    AsyncStorage.getItem('user-language', (err, language) => {
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from AsyncStorage ', err);
        } else {
          console.log('No language is set, choosing Korean as fallback');
        }
        const findBestAvailableLanguage =
          getLocales()[0].languageCode || 'en';
        callback(findBestAvailableLanguage);
        return;
      }
      callback(language);
    });
  },
  init: () => {},
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem('user-language', language);
  }
};

i18n
  // .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
    },
    fallbackLng: 'ko',
    compatibilityJSON: 'v4',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    }
  } as const);

export default i18n;
