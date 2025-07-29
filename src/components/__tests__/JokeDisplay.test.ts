import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Joke } from '../../types'
import JokeDisplay from '../JokeDisplay.vue'

// Create reactive refs for mocking
const mockCurrentJoke = ref<Joke | null>(null)
const mockIsLoading = ref(false)
const mockError = ref<string | null>(null)
const mockJokeCount = ref(0)
const mockLastJokes = ref<Joke[]>([])

// Mock functions
const mockFetchNewJoke = vi.fn()
const mockClearError = vi.fn()
const mockClearHistory = vi.fn()

// Mock the joke store
vi.mock('../../stores/joke-store', () => ({
  useJokeStore: () => ({
    fetchNewJoke: mockFetchNewJoke,
    clearError: mockClearError,
    clearHistory: mockClearHistory,
  }),
}))

// Mock storeToRefs to return our reactive refs
vi.mock('pinia', async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    storeToRefs: vi.fn(() => ({
      currentJoke: mockCurrentJoke,
      isLoading: mockIsLoading,
      error: mockError,
      jokeCount: mockJokeCount,
      lastJokes: mockLastJokes,
    })),
  }
})

// Tests for the JokeDisplay component
// This component displays jokes from the store with loading and error states
describe('JokeDisplay', () => {
  const mockJoke: Joke = {
    id: 1,
    type: 'programming',
    setup: 'Why do Java developers wear glasses?',
    punchline: "Because they can't C#!",
  }

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Reset mock reactive refs
    mockCurrentJoke.value = null
    mockIsLoading.value = false
    mockError.value = null
    mockJokeCount.value = 0
    mockLastJokes.value = []

    // Setup Pinia
    setActivePinia(createPinia())
  })

  // Test: Check if component renders without errors
  it('should render without errors', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Component should exist
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Developer Joke')
  })

  // Test: Check empty state when no joke is loaded
  it('should show empty state when no joke is loaded', () => {
    // Arrange: Set empty state
    mockCurrentJoke.value = null
    mockIsLoading.value = false

    // Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check empty state content
    expect(wrapper.text()).toContain('🤖')
    expect(wrapper.text()).toContain('No joke loaded yet!')
    expect(wrapper.text()).toContain('Click the button above to fetch a developer joke')
  })

  // Test: Check loading state
  it('should show loading state when fetching joke', () => {
    // Arrange: Set loading state
    mockIsLoading.value = true
    mockCurrentJoke.value = null

    // Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check loading state content
    expect(wrapper.text()).toContain('⏳')
    expect(wrapper.text()).toContain('Fetching a fresh joke...')
    expect(wrapper.text()).toContain('Loading...')

    // Assert: Check if loading button is disabled
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  // Test: Check joke display when joke is loaded
  it('should display joke when loaded', () => {
    // Arrange: Set joke state
    mockCurrentJoke.value = mockJoke
    mockIsLoading.value = false
    mockJokeCount.value = 1

    // Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check joke content
    expect(wrapper.text()).toContain('Setup:')
    expect(wrapper.text()).toContain('Why do Java developers wear glasses?')
    expect(wrapper.text()).toContain('Punchline:')
    expect(wrapper.text()).toContain("Because they can't C#!")
    expect(wrapper.text()).toContain('Type: programming')
    expect(wrapper.text()).toContain('#001')
    expect(wrapper.text()).toContain('Jokes fetched: 1')
  })

  // Test: Check error state display
  it('should display error when present', () => {
    // Arrange: Set error state
    mockError.value = 'Failed to fetch joke'
    mockCurrentJoke.value = null

    // Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check error display
    expect(wrapper.text()).toContain('⚠️')
    expect(wrapper.text()).toContain('Failed to fetch joke')
    expect(wrapper.text()).toContain('Dismiss')

    // Assert: Check if error container has correct styling
    const errorContainer = wrapper.find('.bg-red-50')
    expect(errorContainer.exists()).toBe(true)
  })

  // Test: Check New Joke button functionality
  it('should call fetchNewJoke when New Joke button is clicked', async () => {
    // Arrange: Mount the component (this will call fetchNewJoke once on mount)
    const wrapper = mount(JokeDisplay)

    // Reset the mock to ignore the mount call
    mockFetchNewJoke.mockClear()

    // Act: Click the New Joke button
    const button = wrapper.find('button:not([disabled])')
    await button.trigger('click')

    // Assert: Check if fetchNewJoke was called once after the click
    expect(mockFetchNewJoke).toHaveBeenCalledTimes(1)
  })

  // Test: Check Clear History button functionality
  it('should show and handle Clear History button', () => {
    // Arrange: Set state with jokes
    mockCurrentJoke.value = mockJoke
    mockJokeCount.value = 3

    // Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check if Clear History button is visible
    expect(wrapper.text()).toContain('Clear History')

    // Act: Find and verify button exists
    const clearButton = wrapper.find('button.text-yellow-600')
    expect(clearButton.exists()).toBe(true)
  })

  // Test: Check recent jokes history display
  it('should display recent jokes history when available', () => {
    // Arrange: Set state with multiple jokes
    const recentJokes = [
      mockJoke,
      { id: 2, type: 'programming', setup: 'Setup 2', punchline: 'Punchline 2' },
      { id: 3, type: 'programming', setup: 'Setup 3', punchline: 'Punchline 3' },
    ]
    mockCurrentJoke.value = mockJoke
    mockLastJokes.value = recentJokes

    // Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check if recent jokes section is displayed
    expect(wrapper.text()).toContain('Recent Jokes:')
    expect(wrapper.text()).toContain('Setup 2')
    expect(wrapper.text()).toContain('Punchline 2')
    expect(wrapper.text()).toContain('→')
  })

  // Test: Check component header structure
  it('should have correct header structure', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check header elements
    expect(wrapper.text()).toContain('😄')
    expect(wrapper.text()).toContain('Developer Joke')
    expect(wrapper.text()).toContain('🔄')
    expect(wrapper.text()).toContain('New Joke')

    // Assert: Check if main container has correct styling
    const mainContainer = wrapper.find('.bg-gradient-to-br.from-yellow-50.to-orange-50')
    expect(mainContainer.exists()).toBe(true)
  })

  // Test: Check if component fetches joke on mount
  it('should fetch joke on component mount', () => {
    // Act: Mount the component
    mount(JokeDisplay)

    // Assert: Check if fetchNewJoke was called during mount
    expect(mockFetchNewJoke).toHaveBeenCalledTimes(1)
  })

  // Test: Check button states and styling
  it('should have correct button styling and states', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(JokeDisplay)

    // Assert: Check button classes
    const button = wrapper.find('button')
    expect(button.classes()).toContain('px-4')
    expect(button.classes()).toContain('py-2')
    expect(button.classes()).toContain('bg-yellow-500')
    expect(button.classes()).toContain('hover:bg-yellow-600')
    expect(button.classes()).toContain('text-white')
    expect(button.classes()).toContain('rounded-lg')
  })

  // Test: Check conditional rendering logic
  it('should correctly handle conditional rendering', () => {
    // Test Case 1: Loading state
    mockIsLoading.value = true
    let wrapper = mount(JokeDisplay)
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)

    // Test Case 2: Error state
    mockIsLoading.value = false
    mockError.value = 'Test error'
    wrapper = mount(JokeDisplay)
    expect(wrapper.find('.bg-red-50').exists()).toBe(true)

    // Test Case 3: Joke loaded state
    mockError.value = null
    mockCurrentJoke.value = mockJoke
    wrapper = mount(JokeDisplay)
    expect(wrapper.find('.bg-white.rounded-lg.p-4.border.border-yellow-300').exists()).toBe(true)
  })
})
