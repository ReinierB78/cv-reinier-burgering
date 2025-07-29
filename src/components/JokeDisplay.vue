<template>
  <div
    class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <span class="mr-2">😄</span>
        Developer Joke
      </h3>
      <button
        @click="fetchNewJoke"
        :disabled="isLoading"
        class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
      >
        <span v-if="isLoading" class="animate-spin">⚪</span>
        <span v-else>🔄</span>
        <span>{{ isLoading ? 'Loading...' : 'New Joke' }}</span>
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-red-500 mr-2">⚠️</span>
          <span class="text-red-700 text-sm">{{ error }}</span>
        </div>
        <button @click="clearError" class="text-red-500 hover:text-red-700 text-sm underline">
          Dismiss
        </button>
      </div>
    </div>

    <!-- Joke Display -->
    <div v-if="currentJoke" class="space-y-4">
      <div class="bg-white rounded-lg p-4 border border-yellow-300">
        <div class="text-gray-700 mb-3">
          <span class="font-medium">Setup:</span>
          <p class="mt-1 text-gray-900">{{ currentJoke.setup }}</p>
        </div>
        <div class="text-gray-700">
          <span class="font-medium">Punchline:</span>
          <p class="mt-1 text-gray-900 font-medium">{{ currentJoke.punchline }}</p>
        </div>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <div class="flex space-x-2">
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Type: {{ currentJoke.type }}
            </span>
            <span class="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">
              {{ getDisplayRating() }}
            </span>
          </div>
          <span class="text-xs text-gray-500">{{ formatJokeId(currentJoke.id) }}</span>
        </div>
      </div>

      <!-- Joke Stats -->
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>Jokes fetched: {{ jokeCount }}</span>
        <button
          v-if="jokeCount > 0"
          @click="clearHistory"
          class="text-yellow-600 hover:text-yellow-700 underline"
        >
          Clear History
        </button>
      </div>

      <!-- Joke Rating -->
      <div v-if="getDisplayRating()" class="mt-2">
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Rating: {{ getDisplayRating() }}
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading" class="text-center py-8">
      <span class="text-4xl mb-4 block">🤖</span>
      <p class="text-gray-600 mb-4">No joke loaded yet!</p>
      <p class="text-sm text-gray-500">
        Click the button above to fetch a developer joke from the API.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-pulse">
        <span class="text-4xl mb-4 block">⏳</span>
        <p class="text-gray-600">Fetching a fresh joke...</p>
      </div>
    </div>

    <!-- Recent Jokes History -->
    <div v-if="shouldShowHistory()" class="mt-6 pt-4 border-t border-yellow-200">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Recent Jokes:</h4>
      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div
          v-for="joke in lastJokes.slice(1)"
          :key="joke.id"
          class="text-xs text-gray-600 bg-yellow-50 p-2 rounded border"
        >
          <span class="font-medium">{{ truncateText(joke.setup, 30) }}</span>
          <span class="text-gray-500"> → {{ truncateText(joke.punchline, 30) }}</span>
          <span class="text-gray-400 ml-2">{{ formatJokeId(joke.id) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJokeStore } from '@/stores/joke-store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const store = useJokeStore()

// Use storeToRefs to maintain reactivity for state and getters
const { currentJoke, isLoading, error, jokeCount, lastJokes } = storeToRefs(store)

// Actions can be destructured directly (they don't need reactivity)
const { fetchNewJoke, clearError, clearHistory } = store

// Fetch initial joke on mount
onMounted(() => {
  fetchNewJoke()
})

// Helper functions
function getJokeLength(joke: { setup: string; punchline: string } | null | undefined): number {
  if (!joke) return 0
  return joke.setup.length + joke.punchline.length
}

function getJokeRating(length: number): string {
  if (length < 50) return '⭐ Short & Sweet'
  if (length < 100) return '⭐⭐ Just Right'
  if (length < 150) return '⭐⭐⭐ Detailed'
  return '⭐⭐⭐⭐ Epic'
}

function formatJokeId(id: number | undefined): string {
  if (id === undefined || id === null) return '#000'
  return `#${id.toString().padStart(3, '0')}`
}

function truncateText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function getRandomEmoji(): string {
  const emojis = ['😂', '🤣', '😄', '😆', '😁', '🙂', '😊', '😄']
  return emojis[Math.floor(Math.random() * emojis.length)]
}

function shouldShowHistory(): boolean {
  return lastJokes.value.length > 1 && !isLoading.value
}

// Computed properties for enhanced display
function getDisplayRating(): string {
  if (!currentJoke.value) return ''
  const length = getJokeLength(currentJoke.value)
  return getJokeRating(length)
}

// Expose useful functions
defineExpose({
  getJokeLength,
  getJokeRating,
  formatJokeId,
  truncateText,
  getRandomEmoji,
})
</script>
