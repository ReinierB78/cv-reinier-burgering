import { describe, expect, it } from 'vitest'
import type { Joke } from '../../types'
import { MockJokeService } from '../joke-service'

// Tests for the MockJokeService
// This service always returns the same jokes (no real API calls)
describe('MockJokeService', () => {
  // Test: Check if the service returns a joke
  it('should return a joke with all required fields', async () => {
    // Arrange: Create a new mock service
    const service = new MockJokeService()

    // Act: Request a joke
    const joke = await service.fetchRandomJoke()

    // Assert: Check if the joke has all required fields
    expect(joke).toHaveProperty('id')
    expect(joke).toHaveProperty('type')
    expect(joke).toHaveProperty('setup')
    expect(joke).toHaveProperty('punchline')

    // Extra controle: zorg dat setup en punchline niet leeg zijn
    expect(joke.setup).toBeTruthy()
    expect(joke.punchline).toBeTruthy()
    expect(typeof joke.id).toBe('number')
    expect(typeof joke.type).toBe('string')
  })

  // Test: Check if the service gives different jokes on repeated calls
  it('should cycle through different jokes on multiple calls', async () => {
    // Arrange: Create a new mock service
    const service = new MockJokeService()

    // Act: Request three jokes
    const joke1 = await service.fetchRandomJoke()
    const joke2 = await service.fetchRandomJoke()
    const joke3 = await service.fetchRandomJoke()

    // Assert: Check that the jokes are different
    expect(joke1.id).not.toBe(joke2.id)
    expect(joke2.id).not.toBe(joke3.id)

    // De setup teksten moeten ook verschillend zijn
    expect(joke1.setup).not.toBe(joke2.setup)
    expect(joke2.setup).not.toBe(joke3.setup)
  })

  // Test: Check if the service simulates a delay (async behavior)
  it('should simulate API delay', async () => {
    // Arrange: Create a new mock service and track time
    const service = new MockJokeService()
    const startTime = Date.now()

    // Act: Request a joke
    await service.fetchRandomJoke()

    // Assert: Check that at least 250ms has elapsed
    // (the mock service has a 300ms delay)
    const elapsed = Date.now() - startTime
    expect(elapsed).toBeGreaterThanOrEqual(250)
  })

  // Test: Check that all jokes are programming related
  it('should return programming-themed jokes', async () => {
    // Arrange: Create a new mock service
    const service = new MockJokeService()

    // Act: Request 5 jokes to test all available jokes
    const jokes: Joke[] = []
    for (let i = 0; i < 5; i++) {
      jokes.push(await service.fetchRandomJoke())
    }

    // Assert: Check that all jokes are programming related
    jokes.forEach(joke => {
      expect(joke.type).toBe('programming')

      // Check that the content contains programming keywords
      const content = `${joke.setup} ${joke.punchline}`.toLowerCase()
      const programmingKeywords = [
        'java',
        'programming',
        'bug',
        'developer',
        'code',
        'light bulb',
        'nature',
      ]
      const hasKeyword = programmingKeywords.some(keyword => content.includes(keyword))
      expect(hasKeyword).toBe(true)
    })
  })
})
