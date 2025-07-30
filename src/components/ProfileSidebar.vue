<template>
  <div class="h-full">
    <!-- Profile Photo -->
    <div class="text-center mb-6">
      <div class="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img :src="profileData.photo" :alt="profileData.name" class="w-full h-full object-cover" />
      </div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ profileData.name }}</h1>
      <p class="text-gray-600 dark:text-gray-400">{{ profileData.title }}</p>
    </div>

    <!-- Contact Details -->
    <div class="mb-6">
      <h2
        class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3"
      >
        Contact
      </h2>
      <div class="space-y-2">
        <div v-for="(value, key) in profileData.details" :key="key" class="text-sm">
          <span class="text-gray-600 dark:text-gray-400">{{ String(key) }}:</span>
          <span class="text-gray-900 dark:text-gray-100 ml-1">{{ value }}</span>
        </div>
      </div>
    </div>

    <!-- About Me -->
    <div>
      <h2
        class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3"
      >
        Over mij
      </h2>
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ getDisplayAbout() }}
      </p>
    </div>

    <!-- Tag Cloud -->
    <div class="mt-4">
      <span
        v-for="tag in tagCloud"
        :key="tag"
        class="text-sm mr-1 mb-1 inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20 dark:ring-green-400/30"
      >
        <small>{{ tag }}</small>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileData } from '@/types'

interface Props {
  profileData: ProfileData
  tagCloud: string[]
}

const props = defineProps<Props>()

// Helper functions
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
}

function formatContactKey(key: string): string {
  // Convert camelCase or snake_case to readable format
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
}

function getTagColor(index: number): string {
  const colors = ['green', 'blue', 'purple', 'indigo', 'pink', 'yellow', 'red', 'gray']
  return colors[index % colors.length]
}

function getContactIcon(key: string): string {
  const iconMap: Record<string, string> = {
    email: '📧',
    phone: '📞',
    linkedin: '💼',
    github: '🔗',
    website: '🌐',
    location: '📍',
    birthday: '🎂',
    address: '🏠',
  }
  return iconMap[key.toLowerCase()] || '📋'
}

function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Computed properties for enhanced display
function getDisplayAbout(): string {
  return props.profileData.about
}

// Expose useful functions
defineExpose({
  getInitials,
  formatContactKey,
  getTagColor,
  getContactIcon,
  truncateText,
})
</script>
