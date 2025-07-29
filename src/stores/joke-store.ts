import { JokeServiceKey } from '@/services/joke-service-key'
import type { Joke } from '@/types'
import { defineStore } from 'pinia'
import { computed, inject, readonly, ref } from 'vue'

export const useJokeStore = defineStore('joke', () => {
  // State
  const currentJoke = ref<Joke | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const jokeHistory = ref<Joke[]>([])

  // Service injection
  const jokeService = inject(JokeServiceKey)

  if (!jokeService) {
    throw new Error('JokeService not provided! Make sure to provide it in your app setup.')
  }

  // Actions
  async function fetchNewJoke(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const joke = await jokeService!.fetchRandomJoke()
      currentJoke.value = joke

      // Add to history (keep last 10 jokes)
      jokeHistory.value.unshift(joke)
      if (jokeHistory.value.length > 10) {
        jokeHistory.value = jokeHistory.value.slice(0, 10)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch joke'
      console.error('Error fetching joke:', err)
    } finally {
      isLoading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  function clearHistory(): void {
    jokeHistory.value = []
  }

  // Getters
  const hasJoke = computed(() => currentJoke.value !== null)
  const jokeCount = computed(() => jokeHistory.value.length)
  const lastJokes = computed(() => jokeHistory.value.slice(0, 5))

  return {
    // State
    currentJoke: readonly(currentJoke),
    isLoading: readonly(isLoading),
    error: readonly(error),
    jokeHistory: readonly(jokeHistory),

    // Getters
    hasJoke,
    jokeCount,
    lastJokes,

    // Actions
    fetchNewJoke,
    clearError,
    clearHistory,
  }
})

// Export type for testing
export type JokeStore = ReturnType<typeof useJokeStore>
