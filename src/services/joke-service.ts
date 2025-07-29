import type { Joke } from '@/types'

export interface JokeService {
  fetchRandomJoke(): Promise<Joke>
}

export class ApiJokeService implements JokeService {
  private readonly baseUrl = 'https://official-joke-api.appspot.com'

  async fetchRandomJoke(): Promise<Joke> {
    try {
      const response = await fetch(`${this.baseUrl}/random_joke`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const joke = await response.json()

      // Validate response structure
      if (!joke.id || !joke.setup || !joke.punchline) {
        throw new Error('Invalid joke response format')
      }

      return {
        id: joke.id,
        type: joke.type || 'general',
        setup: joke.setup,
        punchline: joke.punchline,
      }
    } catch (error) {
      console.error('Failed to fetch joke:', error)

      // Fallback joke when API is not available
      return {
        id: 0,
        type: 'fallback',
        setup: 'Why do programmers prefer dark mode?',
        punchline: 'Because light attracts bugs! 🐛',
      }
    }
  }
}

// Mock service for testing
export class MockJokeService implements JokeService {
  private jokes: Joke[] = [
    {
      id: 1,
      type: 'programming',
      setup: 'Why do Java developers wear glasses?',
      punchline: "Because they can't C# 👓",
    },
    {
      id: 2,
      type: 'programming',
      setup: 'How many programmers does it take to change a light bulb?',
      punchline: "None, that's a hardware problem! 💡",
    },
    {
      id: 3,
      type: 'programming',
      setup: "Why don't programmers like nature?",
      punchline: 'It has too many bugs! 🌲🐛',
    },
  ]

  private currentIndex = 0

  async fetchRandomJoke(): Promise<Joke> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const joke = this.jokes[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.jokes.length

    return joke
  }
}
