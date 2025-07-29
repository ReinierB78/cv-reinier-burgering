<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex max-w-7xl mx-auto transition-colors duration-300"
  >
    <!-- Top-right Theme Switcher -->
    <div class="fixed top-4 right-4 z-50">
      <ThemeSwitcher />
    </div>

    <!-- Left Sidebar (25%) - Sticky -->
    <aside
      class="md:w-1/4 bg-white dark:bg-gray-800 shadow-lg p-6 sticky top-0 h-screen overflow-y-auto transition-colors duration-300"
    >
      <slot name="sidebar" />
    </aside>

    <!-- Right Main Content Area (75%) - Scrollable -->
    <main class="md:w-3/4 p-6 overflow-y-auto">
      <slot name="main" />
    </main>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

// Default layout component voor de applicatie
// Biedt een 25/75 layout met sidebar en main content area
</script>
