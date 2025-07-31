import { createI18n } from 'vue-i18n'

// Import translation files
import en from './locales/en.json'
import nl from './locales/nl.json'

// Type definition for better TypeScript support
export type MessageSchema = typeof nl

const i18n = createI18n<[MessageSchema], 'nl' | 'en'>({
  legacy: false, // Use Composition API mode
  locale: 'nl', // Default language
  fallbackLocale: 'en',
  messages: {
    nl,
    en,
  },
  // Enable strict mode for better development experience
  silentTranslationWarn: false,
  silentFallbackWarn: false,
})

export default i18n

// Helper function to get available locales
export const availableLocales = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
] as const

export type LocaleCode = (typeof availableLocales)[number]['code']
