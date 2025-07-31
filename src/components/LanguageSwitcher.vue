<template>
  <div class="relative" data-language-switcher>
    <button
      @click="toggleDropdown"
      type="button"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span class="text-lg">{{ currentLocale.flag }}</span>
      <span class="hidden sm:block">{{ currentLocale.name }}</span>
      <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1" role="none">
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="changeLanguage(locale.code)"
            type="button"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors"
            :class="{
              'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300':
                currentLocaleCode === locale.code,
            }"
            role="menuitem"
          >
            <span class="text-lg mr-3">{{ locale.flag }}</span>
            <span>{{ locale.name }}</span>
            <CheckIcon
              v-if="currentLocaleCode === locale.code"
              class="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400"
            />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop for mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 sm:hidden"
      @click="closeDropdown"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { availableLocales, type LocaleCode } from '@/i18n'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
const { locale } = useI18n()

// State
const isOpen = ref(false)

// Computed
const currentLocaleCode = computed(() => locale.value as LocaleCode)
const currentLocale = computed(
  () => availableLocales.find(l => l.code === currentLocaleCode.value) || availableLocales[0]
)

// Methods
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function changeLanguage(localeCode: LocaleCode) {
  locale.value = localeCode
  // Store preference in localStorage
  localStorage.setItem('preferred-language', localeCode)
  closeDropdown()
}

// Handle click outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('[data-language-switcher]')) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  // Load saved language preference
  const savedLanguage = localStorage.getItem('preferred-language') as LocaleCode
  if (savedLanguage && availableLocales.some(l => l.code === savedLanguage)) {
    locale.value = savedLanguage
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
