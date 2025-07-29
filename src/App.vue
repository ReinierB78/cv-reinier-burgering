<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

// Initialize theme globally
const { initializeTheme } = useTheme()

onMounted(() => {
  // Force theme initialization at app level
  initializeTheme()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <RouterView />
  </div>
</template>

<style scoped></style>
