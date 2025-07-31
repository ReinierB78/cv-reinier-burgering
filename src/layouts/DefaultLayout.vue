<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Mobile header - only show when profile is NOT open -->
    <header
      v-if="!isSidebarOpen"
      class="md:hidden bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40"
    >
      <div class="flex items-center justify-between p-4">
        <!-- Logo/Title -->
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">CV Reinier</h1>

        <!-- Mobile controls -->
        <div class="flex items-center space-x-2">
          <!-- Language Switcher -->
          <!-- <LanguageSwitcher /> -->

          <!-- Theme Switcher -->
          <ThemeSwitcher />

          <!-- Profile Button -->
          <button
            @click="toggleSidebar"
            class="relative p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
            style="font-size: 16px; min-height: 44px; min-width: 44px"
            :aria-expanded="isSidebarOpen"
            aria-label="Open profiel"
          >
            <UserCircleIcon class="h-7 w-7" />
            <!-- Online indicator -->
            <div
              class="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm animate-pulse"
            ></div>
          </button>
        </div>
      </div>
    </header>

    <!-- Desktop Controls (top-right) -->
    <div class="hidden md:flex fixed top-4 right-4 z-50 space-x-3">
      <!-- <LanguageSwitcher /> -->
      <ThemeSwitcher />
    </div>

    <!-- Source Code Link -->
    <SourceCodeLink />

    <!-- Main Container -->
    <div class="flex max-w-7xl mx-auto">
      <!-- Desktop Sidebar -->
      <aside
        class="hidden md:block md:w-1/4 bg-white dark:bg-gray-800 shadow-lg p-6 sticky top-0 h-screen overflow-y-auto transition-colors duration-300"
      >
        <slot name="sidebar" />
      </aside>

      <!-- Mobile Sidebar - Fullscreen overlay bovenop alles -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-250 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isSidebarOpen"
          class="md:hidden fixed inset-0 bg-white dark:bg-gray-800 z-50 flex flex-col"
        >
          <!-- Header met sluiten knop -->
          <div
            class="flex-shrink-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
          >
            <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Profiel Reinier</h1>

            <div class="flex items-center space-x-2">
              <!-- Language Switcher -->
              <!-- <LanguageSwitcher /> -->

              <!-- Theme Switcher -->
              <ThemeSwitcher />

              <!-- Sluiten knop -->
              <button
                @click="closeSidebar"
                class="p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                style="font-size: 16px; min-height: 44px; min-width: 44px"
                aria-label="Profiel sluiten"
              >
                <XMarkIcon class="h-7 w-7" />
              </button>
            </div>
          </div>

          <!-- Profiel content -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-6 pb-32">
              <slot name="sidebar" />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Main Content Area -->
      <main class="flex-1 min-h-screen flex flex-col">
        <!-- Content -->
        <div class="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <slot name="main" />
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="md:hidden">
          <slot name="bottom-nav" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SourceCodeLink from '@/components/SourceCodeLink.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { useSidebar } from '@/composables/useSidebar'
import { UserCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Use the global sidebar state
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar()
</script>
