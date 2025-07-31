<template>
  <!-- Desktop Tab Navigation - Hidden on mobile -->
  <div class="mb-8 hidden md:block">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          @keydown="handleKeyboardNavigation"
          :class="[
            activeTab === tab.id
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600',
            'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-t-md',
          ]"
          :aria-current="activeTab === tab.id ? 'page' : undefined"
          :tabindex="activeTab === tab.id ? 0 : -1"
          role="tab"
        >
          <!-- Icon -->
          <component
            :is="tab.icon"
            class="h-5 w-5"
            :class="{
              'text-indigo-500 dark:text-indigo-400': activeTab === tab.id,
              'text-gray-400 dark:text-gray-500': activeTab !== tab.id,
            }"
          />

          <!-- Label -->
          <span>{{ tab.name }}</span>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tab } from '@/types'

interface Props {
  tabs: Tab[]
  activeTab: string | null
  onTabChange: (tabId: string) => void
}

const props = defineProps<Props>()

function handleTabChange(tabId: string) {
  // Call the callback function to inform parent component
  props.onTabChange(tabId)
}

// Helper functions for keyboard navigation and utility
function getTabIndex(tabId: string | null): number {
  if (!tabId) return -1
  return props.tabs.findIndex(tab => tab.id === tabId)
}

function getNextTab(): Tab | null {
  const currentIndex = getTabIndex(props.activeTab)
  if (currentIndex >= 0 && currentIndex < props.tabs.length - 1) {
    return props.tabs[currentIndex + 1]
  }
  return null
}

function getPrevTab(): Tab | null {
  const currentIndex = getTabIndex(props.activeTab)
  if (currentIndex > 0) {
    return props.tabs[currentIndex - 1]
  }
  return null
}

function isFirstTab(): boolean {
  const index = getTabIndex(props.activeTab)
  return index === 0
}

function isLastTab(): boolean {
  const index = getTabIndex(props.activeTab)
  return index === props.tabs.length - 1
}

function handleKeyboardNavigation(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    const prevTab = getPrevTab()
    if (prevTab) {
      handleTabChange(prevTab.id)
    }
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    const nextTab = getNextTab()
    if (nextTab) {
      handleTabChange(nextTab.id)
    }
  }
}

// Expose utility functions for testing and parent access
defineExpose({
  getNextTab,
  getPrevTab,
  isFirstTab,
  isLastTab,
  handleKeyboardNavigation,
})
</script>
