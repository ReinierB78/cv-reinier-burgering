import type { LocaleCode } from '@/i18n'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Enhanced i18n composable with additional utilities
 */
export function useTranslation() {
  const { t, locale, availableLocales } = useI18n()

  // Current language info
  const currentLocale = computed(() => locale.value as LocaleCode)
  const isEnglish = computed(() => currentLocale.value === 'en')
  const isDutch = computed(() => currentLocale.value === 'nl')

  // Translation helpers
  const translate = (key: string, params?: Record<string, unknown>) => {
    return params ? t(key, params) : t(key)
  }

  const translateArray = (keyPrefix: string): string[] => {
    const arrayData = t(keyPrefix)
    return Array.isArray(arrayData) ? arrayData : []
  }

  // Language switching
  const switchToLanguage = (newLocale: LocaleCode) => {
    locale.value = newLocale
    localStorage.setItem('preferred-language', newLocale)
  }

  const toggleLanguage = () => {
    const newLocale = currentLocale.value === 'nl' ? 'en' : 'nl'
    switchToLanguage(newLocale)
  }

  // Formatted text helpers
  const formatPeriod = (period: string) => {
    // You could add locale-specific period formatting here
    return period
  }

  return {
    // Vue i18n basics
    t,
    locale,
    availableLocales,

    // Enhanced utilities
    currentLocale,
    isEnglish,
    isDutch,
    translate,
    translateArray,
    switchToLanguage,
    toggleLanguage,
    formatPeriod,
  }
}
