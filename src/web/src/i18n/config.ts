/**
 * Human Tasks:
 * 1. Verify that all required translations are present in language JSON files
 * 2. Ensure fallback language configuration aligns with business requirements
 * 3. Test RTL support for potential future language additions
 * 4. Validate translation keys match across all language files
 */

// i18next v21.6.16
import i18next from 'i18next';
// react-i18next v11.18.6
import { initReactI18next } from 'react-i18next';

// Import translation resources
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

// Import supported languages constant
import { SUPPORTED_LANGUAGES } from '../lib/constants';

/**
 * Requirement: Multi-language Support (1.3 Scope/In-Scope Elements/Implementation Boundaries)
 * Initialize the i18n system with supported languages and translation resources
 */
export const initializeI18n = (): void => {
  i18next
    .use(initReactI18next)
    .init({
      // Configure supported languages and resources
      resources: {
        en: {
          translation: en
        },
        es: {
          translation: es
        },
        fr: {
          translation: fr
        }
      },
      
      // Set default language
      lng: 'en',
      
      // Fallback language if translation is missing
      fallbackLng: 'en',
      
      // Supported languages from constants
      supportedLngs: SUPPORTED_LANGUAGES,
      
      // Requirement: Dynamic Content Translation (8.1 User Interface Design/Design Specifications/i18n)
      interpolation: {
        // Escape values to prevent XSS
        escapeValue: true,
        // Format options for numbers, dates, etc.
        format: (value, format) => {
          if (format === 'uppercase') return value.toUpperCase();
          if (format === 'lowercase') return value.toLowerCase();
          return value;
        }
      },
      
      // Development features
      debug: process.env.NODE_ENV === 'development',
      
      // Performance options
      load: 'languageOnly', // Skip region-specific variants
      
      // React-specific options
      react: {
        useSuspense: true,
        bindI18n: 'languageChanged loaded',
        bindI18nStore: 'added removed',
        transEmptyNodeValue: '',
      },
      
      // Detection options
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        caches: ['localStorage', 'cookie'],
      },
      
      // Namespace configuration
      defaultNS: 'translation',
      ns: ['translation'],
      
      // Ensure consistent key access
      keySeparator: '.',
      nsSeparator: ':',
      
      // Pluralization rules
      pluralSeparator: '_',
      contextSeparator: '_',
      
      // Return key if translation is missing
      returnNull: false,
      returnEmptyString: false,
      returnObjects: false,
      
      // Join array values
      joinArrays: ' ',
      
      // Override options for specific languages
      overloadTranslationOptionHandler: (args) => {
        return {
          defaultValue: args[1] || '',
          count: args[2],
          context: args[3]
        };
      }
    });
};