<template>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50"
  >
    <div class="flex justify-around items-center py-2 px-4 max-w-7xl mx-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="onTabChange(tab.id)"
        class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors duration-200 min-w-0 flex-1 touch-manipulation"
        style="font-size: 16px; min-height: 44px"
        :class="{
          'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20': activeTab === tab.id,
          'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700':
            activeTab !== tab.id,
        }"
        :aria-current="activeTab === tab.id ? 'page' : undefined"
      >
        <!-- Icon -->
        <component
          :is="tab.icon"
          class="h-5 w-5 flex-shrink-0"
          :class="{
            'text-blue-600 dark:text-blue-400': activeTab === tab.id,
            'text-gray-500 dark:text-gray-400': activeTab !== tab.id,
          }"
        />

        <!-- Label -->
        <span class="text-sm font-medium truncate max-w-full" style="font-size: 16px">
          {{ tab.name }}
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Tab } from '@/types'

interface Props {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

defineProps<Props>()
</script>
