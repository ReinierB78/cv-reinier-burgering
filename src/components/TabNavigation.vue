<template>
  <div class="mb-8">
    <div>
      <div class="grid grid-cols-1 sm:hidden">
        <!-- Mobile select dropdown -->
        <select
          aria-label="Select a tab"
          class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          @change="handleTabChange(($event.target as HTMLSelectElement).value)"
          :value="activeTab"
        >
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ typeof tab.icon === 'string' ? tab.icon + ' ' : '' }}{{ tab.name }}
          </option>
        </select>
        <ChevronDownIcon
          class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
          aria-hidden="true"
        />
      </div>
      <div class="hidden sm:block">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="handleTabChange(tab.id)"
              :class="[
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium flex items-center space-x-2 bg-transparent',
              ]"
              :aria-current="activeTab === tab.id ? 'page' : undefined"
            >
              <!-- Icon (Heroicon component or emoji string) -->
              <component
                v-if="typeof tab.icon !== 'string'"
                :is="tab.icon"
                class="h-5 w-5"
                aria-hidden="true"
              />
              <span v-else>{{ tab.icon }}</span>

              <!-- Tab name -->
              <span>{{ tab.name }}</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tab } from '@/types'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

interface Props {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const props = defineProps<Props>()

function handleTabChange(tabId: string) {
  // Roep de callback functie aan om de parent te informeren
  props.onTabChange(tabId)
}

// Helper functions
function getTabIndex(tabId: string): number {
  return props.tabs.findIndex(tab => tab.id === tabId)
}

function getNextTab(): Tab | null {
  const currentIndex = getTabIndex(props.activeTab)
  if (currentIndex < props.tabs.length - 1) {
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
  return getTabIndex(props.activeTab) === 0
}

function isLastTab(): boolean {
  return getTabIndex(props.activeTab) === props.tabs.length - 1
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

// Expose useful functions
defineExpose({
  getNextTab,
  getPrevTab,
  isFirstTab,
  isLastTab,
  handleKeyboardNavigation,
})
</script>
