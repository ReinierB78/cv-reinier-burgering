<template>
  <div class="mt-8">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 transition-colors">
      Belangrijke ontwikkelingsmomenten
    </h3>

    <!-- Timeline Container -->
    <div class="relative">
      <!-- Timeline Line -->
      <div
        class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"
      ></div>

      <!-- Timeline Items -->
      <div class="space-y-8">
        <div
          v-for="(moment, index) in developmentMoments"
          :key="index"
          class="relative pl-12 group"
        >
          <!-- Timeline Dot -->
          <div
            class="absolute left-2 top-1 w-4 h-4 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full shadow-lg group-hover:border-indigo-600 transition-colors duration-300"
          >
            <div
              class="absolute inset-1 bg-blue-500 rounded-full group-hover:bg-indigo-600 transition-colors duration-300"
            ></div>
          </div>

          <!-- Content Card -->
          <div
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-500"
          >
            <!-- Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4
                  class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                >
                  {{ moment.title }}
                </h4>
                <div class="flex items-center space-x-2 mt-1">
                  <span
                    class="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors"
                  >
                    {{ moment.period }}
                  </span>
                  <span
                    v-if="moment.institution"
                    class="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full transition-colors"
                  >
                    {{ moment.institution }}
                  </span>
                </div>
              </div>

              <!-- Timeline Badge -->
              <div class="ml-4 flex-shrink-0">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                >
                  {{ getTimelineYear(moment.period) }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <p
              v-if="moment.description"
              class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors"
              style="white-space: pre-line"
            >
              {{ moment.description }}
            </p>
            <div>
              <!-- Tags -->
              <div v-if="moment.tags" class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="tag in moment.tags"
                  :key="tag"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/30 transition-colors"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <!-- Progress Indicator (optional visual enhancement) -->
            <div
              class="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden transition-colors"
            >
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                :style="{ width: `${getProgressWidth(index)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Education } from '@/types'

// Props
defineProps<{
  developmentMoments: Education[]
}>()

// Helper functions
function getTimelineYear(period: string): string {
  // Extract year from period string (e.g., "2024 - 2025" -> "2024")
  const match = period.match(/\d{4}/)
  return match ? match[0] : ''
}

function getProgressWidth(index: number): number {
  // Create a visual progress based on timeline position
  // More recent items get higher progress
  return 100 - index + index
}
</script>

<style scoped>
/* Optional: Add some subtle animations */
.group:hover .absolute div {
  transform: scale(1.1);
}

/* Smooth scroll behavior for better UX */
@media (prefers-reduced-motion: no-preference) {
  .group {
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: both;
  }

  .group:nth-child(1) {
    animation-delay: 0.1s;
  }
  .group:nth-child(2) {
    animation-delay: 0.2s;
  }
  .group:nth-child(3) {
    animation-delay: 0.3s;
  }
  .group:nth-child(4) {
    animation-delay: 0.4s;
  }
  .group:nth-child(5) {
    animation-delay: 0.5s;
  }
  .group:nth-child(6) {
    animation-delay: 0.6s;
  }
  .group:nth-child(7) {
    animation-delay: 0.7s;
  }
  .group:nth-child(8) {
    animation-delay: 0.8s;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
