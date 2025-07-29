<template>
  <div>
    <!-- Navigation -->
    <TabNavigation :tabs="tabs" :active-tab="activeTab" :on-tab-change="onTabChange" />

    <!-- Tab Content -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { Tab } from '@/types'
import TabNavigation from './TabNavigation.vue'

interface Props {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const props = defineProps<Props>()

// Helper functions
function getActiveTabName(): string {
  const activeTabObj = props.tabs.find(tab => tab.id === props.activeTab)
  return activeTabObj ? activeTabObj.name : 'Unknown Tab'
}

function getActiveTabIcon(): string | Component {
  const activeTabObj = props.tabs.find(tab => tab.id === props.activeTab)
  return activeTabObj ? activeTabObj.icon : '📄'
}

function getTabCount(): number {
  return props.tabs.length
}

function isValidTab(tabId: string): boolean {
  return props.tabs.some(tab => tab.id === tabId)
}

function getNextTabId(): string | null {
  const currentIndex = props.tabs.findIndex(tab => tab.id === props.activeTab)
  if (currentIndex < props.tabs.length - 1) {
    return props.tabs[currentIndex + 1].id
  }
  return null
}

function getPrevTabId(): string | null {
  const currentIndex = props.tabs.findIndex(tab => tab.id === props.activeTab)
  if (currentIndex > 0) {
    return props.tabs[currentIndex - 1].id
  }
  return null
}

// Expose useful functions
defineExpose({
  getActiveTabName,
  getActiveTabIcon,
  getTabCount,
  isValidTab,
  getNextTabId,
  getPrevTabId,
})
</script>
