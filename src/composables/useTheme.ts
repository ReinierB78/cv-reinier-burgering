import { computed, onMounted, ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

// Module-level reactive state (shared across all components)
const theme = ref<Theme>('system')
const isDark = ref(false)
let isInitialized = false

// Composable for theme management with system preference detection
export function useTheme() {
  // Check system preference
  const getSystemPreference = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Update document class based on current theme
  const updateTheme = () => {
    const html = document.documentElement

    if (theme.value === 'system') {
      isDark.value = getSystemPreference()
    } else {
      isDark.value = theme.value === 'dark'
    }

    // Apply or remove dark class on html element
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // Store preference in localStorage (except for system)
    if (theme.value !== 'system') {
      localStorage.setItem('theme', theme.value)
    } else {
      localStorage.removeItem('theme')
    }
  }

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    if (isInitialized) return

    const stored = localStorage.getItem('theme') as Theme | null

    if (stored && ['light', 'dark'].includes(stored)) {
      theme.value = stored
    } else {
      theme.value = 'system'
    }

    updateTheme()
    isInitialized = true
  }

  // Set specific theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    // Force immediate update (watcher might not trigger immediately)
    updateTheme()
  }

  // Toggle between light and dark (excludes system)
  const toggleTheme = () => {
    if (theme.value === 'system') {
      // If currently system, switch to opposite of current system preference
      setTheme(getSystemPreference() ? 'light' : 'dark')
    } else {
      // Toggle between light and dark
      setTheme(theme.value === 'light' ? 'dark' : 'light')
    }
  }

  // Listen for system theme changes
  const setupSystemListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme.value === 'system') {
        updateTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // Computed properties for UI
  const currentTheme = computed(() => theme.value)
  const isSystemTheme = computed(() => theme.value === 'system')
  const effectiveTheme = computed(() => {
    if (theme.value === 'system') {
      return getSystemPreference() ? 'dark' : 'light'
    }
    return theme.value
  })

  // Watch theme changes - this must be before onMounted
  watch(theme, () => {
    updateTheme()
  })

  // Initialize on mount
  onMounted(() => {
    initializeTheme()
    const cleanup = setupSystemListener()

    // Cleanup on unmount
    return cleanup
  })

  return {
    theme: currentTheme,
    isDark: computed(() => isDark.value),
    isSystemTheme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    initializeTheme,
  }
}
