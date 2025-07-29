<template>
  <div class="relative">
    <!-- Theme Toggle Button -->
    <button
      @click="toggleOpen"
      class="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      aria-label="Theme selector"
    >
      <!-- Current Theme Icon -->
      <component :is="currentIcon" class="h-5 w-5" aria-hidden="true" />
      <span class="text-sm font-medium hidden sm:block">{{ currentLabel }}</span>
      <ChevronDownIcon
        class="h-4 w-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1">
          <button
            v-for="option in themeOptions"
            :key="option.value"
            @click="selectTheme(option.value)"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="{
              'bg-gray-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400':
                theme === option.value,
            }"
            role="menuitem"
          >
            <component :is="option.icon" class="h-4 w-4 mr-3" aria-hidden="true" />
            <span>{{ option.label }}</span>
            <CheckIcon
              v-if="theme === option.value"
              class="h-4 w-4 ml-auto text-indigo-600 dark:text-indigo-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Overlay for mobile -->
    <div
      v-if="isOpen"
      @click="closeMenu"
      class="fixed inset-0 z-40 sm:hidden"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTheme } from '../composables/useTheme'

// Theme management
const { theme, effectiveTheme, setTheme } = useTheme()

// Dropdown state
const isOpen = ref(false)

// Theme options for dropdown
const themeOptions = [
  {
    value: 'light' as const,
    label: 'Light',
    icon: SunIcon,
  },
  {
    value: 'dark' as const,
    label: 'Dark',
    icon: MoonIcon,
  },
  {
    value: 'system' as const,
    label: 'System',
    icon: ComputerDesktopIcon,
  },
]

// Computed properties for current theme display
const currentIcon = computed(() => {
  if (theme.value === 'system') {
    return ComputerDesktopIcon
  }
  return effectiveTheme.value === 'dark' ? MoonIcon : SunIcon
})

const currentLabel = computed(() => {
  const option = themeOptions.find(opt => opt.value === theme.value)
  return option ? option.label : 'Theme'
})

// Methods
const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const selectTheme = (newTheme: 'light' | 'dark' | 'system') => {
  setTheme(newTheme)
  closeMenu()
}

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element
  if (!target.closest('[aria-haspopup="true"]') && !target.closest('[role="menu"]')) {
    closeMenu()
  }
}

// Close menu on escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>
