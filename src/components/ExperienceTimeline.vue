<template>
  <div class="space-y-4">
    <div
      v-for="(job, index) in workExperience"
      :key="index"
      :class="[
        'border-l-4 pl-4 rounded-r-lg transition-all duration-300 cursor-pointer',
        // Border colors
        index % 2 === 0 ? 'border-blue-500' : 'border-green-500',
        // Background states
        expandedJobs.has(index)
          ? 'bg-gray-50 dark:bg-gray-800 shadow-sm'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700',
      ]"
    >
      <!-- Clickable header -->
      <div @click="toggleJobExpansion(index)" class="py-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">
              {{ job.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 transition-colors">
              {{ job.company }} • {{ formatPeriodDisplay(job.period) }}
            </p>
          </div>
          <div class="ml-4">
            <svg
              :class="[
                'w-5 h-5 text-gray-500 dark:text-gray-400 transition-all duration-200',
                expandedJobs.has(index) ? 'rotate-180' : '',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Expandable content -->
      <div
        v-if="expandedJobs.has(index)"
        class="overflow-hidden transition-all duration-300 ease-in-out pb-4"
      >
        <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
          <p class="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors">
            {{ job.description }}
          </p>
          <div v-if="job.tags" class="flex flex-wrap gap-1">
            <span
              v-for="tag in job.tags"
              :key="tag"
              :class="[
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors',
                index % 2 === 0
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-blue-600/20 dark:ring-blue-400/30'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-green-600/20 dark:ring-green-400/30',
              ]"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkExperience } from '@/types'
import { ref } from 'vue'

interface Props {
  workExperience: WorkExperience[]
}

const props = defineProps<Props>()

const expandedJobs = ref<Set<number>>(new Set())

function toggleJobExpansion(index: number) {
  if (expandedJobs.value.has(index)) {
    expandedJobs.value.delete(index)
  } else {
    expandedJobs.value.add(index)
  }
}

// Helper functions
function getJobYears(period: string): number {
  // Extract years from period string (e.g., "2022 - 2024" -> 2)
  const match = period.match(/(\d{4})\s*-\s*(\d{4}|heden|present)/i)
  if (match) {
    const startYear = parseInt(match[1])
    const endYear =
      match[2].toLowerCase().includes('heden') || match[2].toLowerCase().includes('present')
        ? new Date().getFullYear()
        : parseInt(match[2])
    return endYear - startYear
  }
  return 0
}

function formatPeriodDisplay(period: string): string {
  // Enhanced period formatting with duration
  const years = getJobYears(period)
  const yearsText = years > 0 ? ` (${years} jaar)` : ''
  return `${period}${yearsText}`
}

function expandAll() {
  props.workExperience.forEach((_: WorkExperience, index: number) => {
    expandedJobs.value.add(index)
  })
}

function collapseAll() {
  expandedJobs.value.clear()
}

// Expose useful functions for parent components
defineExpose({
  expandAll,
  collapseAll,
  toggleJobExpansion,
  getJobYears,
  formatPeriodDisplay,
})
</script>
