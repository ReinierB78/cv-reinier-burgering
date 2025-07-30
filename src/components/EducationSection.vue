<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
      {{ title }}
    </h2>

    <div class="space-y-4">
      <!-- Education List -->
      <div
        v-for="(edu, index) in educationList"
        :key="index"
        class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors hover:shadow-sm"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
          {{ edu.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 transition-colors">
          {{ edu.institution }} • {{ edu.period }}
        </p>
        <p
          v-if="edu.description"
          class="text-sm text-gray-700 dark:text-gray-300 mt-2 transition-colors"
        >
          {{ edu.description }}
        </p>
      </div>

      <!-- Development Timeline Component -->
      <DevelopmentTimeline
        v-if="developmentMoments && developmentMoments.length > 0"
        :development-moments="developmentMoments"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Education } from '@/types'
import DevelopmentTimeline from './DevelopmentTimeline.vue'

interface Props {
  title?: string
  educationList: Education[]
  developmentMoments?: Education[]
}

withDefaults(defineProps<Props>(), {
  title: 'Bijdrage & Ontwikkeling',
})
</script>
