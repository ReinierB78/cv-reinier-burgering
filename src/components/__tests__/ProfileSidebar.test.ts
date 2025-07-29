import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { ProfileData } from '../../types'
import ProfileSidebar from '../ProfileSidebar.vue'

// Mock window.matchMedia for useTheme composable
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
})

// Mock the ThemeSwitcher component to avoid useTheme composable issues in tests
vi.mock('../ThemeSwitcher.vue', () => ({
  default: {
    name: 'ThemeSwitcher',
    template: '<div data-testid="theme-switcher">Theme Switcher Mock</div>',
  },
}))

// Tests for the ProfileSidebar component
// This component displays profile information and tags
describe('ProfileSidebar', () => {
  // Test data used in all tests
  const mockProfileData: ProfileData = {
    name: 'John Doe',
    title: 'Senior Frontend Developer',
    photo: '/test-photo.jpg',
    about: 'Gepassioneerde developer met 5+ jaar ervaring in Vue.js en TypeScript.',
    details: {
      Email: 'john@example.com',
      Telefoon: '+31 6 12345678',
      Locatie: 'Amsterdam, Nederland',
      LinkedIn: 'linkedin.com/in/johndoe',
    },
  }

  const mockTagCloud = ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Vitest', 'Git']

  // Test: Check if basic profile information is displayed
  it('should display profile information correctly', () => {
    // Arrange: Mount the component with test data
    const wrapper = mount(ProfileSidebar, {
      props: {
        profileData: mockProfileData,
        tagCloud: mockTagCloud,
      },
    })

    // Assert: Check if the name is displayed
    expect(wrapper.text()).toContain('John Doe')

    // Assert: Check if the title is displayed
    expect(wrapper.text()).toContain('Senior Frontend Developer')

    // Assert: Check if the "About Me" text is displayed
    expect(wrapper.text()).toContain('Gepassioneerde developer met 5+ jaar ervaring')
  })

  // Test: Check if the profile photo is rendered correctly
  it('should display profile photo with correct attributes', () => {
    // Arrange: Mount the component
    const wrapper = mount(ProfileSidebar, {
      props: {
        profileData: mockProfileData,
        tagCloud: mockTagCloud,
      },
    })

    // 🎬 Act: Zoek de img tag
    const img = wrapper.find('img')

    // Assert: Check if the img exists and has correct attributes
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/test-photo.jpg')
    expect(img.attributes('alt')).toBe('John Doe')
  })

  // Test: Check if all contact details are displayed
  it('should display all contact details', () => {
    // Arrange: Mount the component
    const wrapper = mount(ProfileSidebar, {
      props: {
        profileData: mockProfileData,
        tagCloud: mockTagCloud,
      },
    })

    // Assert: Check if all contact details are present
    expect(wrapper.text()).toContain('Email:')
    expect(wrapper.text()).toContain('john@example.com')
    expect(wrapper.text()).toContain('Telefoon:')
    expect(wrapper.text()).toContain('+31 6 12345678')
    expect(wrapper.text()).toContain('Locatie:')
    expect(wrapper.text()).toContain('Amsterdam, Nederland')
    expect(wrapper.text()).toContain('LinkedIn:')
    expect(wrapper.text()).toContain('linkedin.com/in/johndoe')
  })

  // Test: Check if all tags from the tag cloud are displayed
  it('should display all tags from tagCloud', () => {
    // Arrange: Mount the component
    const wrapper = mount(ProfileSidebar, {
      props: {
        profileData: mockProfileData,
        tagCloud: mockTagCloud,
      },
    })

    // Assert: Check if all tags are present
    mockTagCloud.forEach(tag => {
      expect(wrapper.text()).toContain(tag)
    })

    // Assert: Check if the correct number of tag elements exist
    const tagElements = wrapper.findAll('.bg-green-50') // Tag styling class
    expect(tagElements).toHaveLength(mockTagCloud.length)
  })

  // Test: Check the correct HTML structure
  it('should have correct HTML structure', () => {
    // Arrange: Mount the component
    const wrapper = mount(ProfileSidebar, {
      props: {
        profileData: mockProfileData,
        tagCloud: mockTagCloud,
      },
    })

    // Assert: Check if important sections exist
    expect(wrapper.find('h1').exists()).toBe(true) // Name header
    expect(wrapper.find('h2').exists()).toBe(true) // Contact/About Me headers

    // Assert: Check if the profile photo container exists
    expect(wrapper.find('.w-32.h-32').exists()).toBe(true)

    // Assert: Check if the tag container exists
    expect(wrapper.find('.mt-4').exists()).toBe(true)
  })

  // Test: Check what happens with empty tag cloud
  it('should handle empty tagCloud gracefully', () => {
    // Arrange: Mount the component with empty tag cloud
    const wrapper = mount(ProfileSidebar, {
      props: {
        profileData: mockProfileData,
        tagCloud: [], // Lege array
      },
    })

    // ✅ Assert: Component should still render without errors
    expect(wrapper.text()).toContain('John Doe')

    // Assert: No tag elements
    const tagElements = wrapper.findAll('.bg-green-50')
    expect(tagElements).toHaveLength(0)
  })

  // Test: Check what happens with minimal profile data
  it('should handle minimal profile data', () => {
    // Arrange: Minimal profile data
    const minimalProfile: ProfileData = {
      name: 'Jane Doe',
      title: 'Developer',
      photo: '/jane.jpg',
      about: 'Developer',
      details: {},
    }

    // Arrange: Mount the component with minimal data
    const wrapper = mount(ProfileSidebar, {
      props: {
        profileData: minimalProfile,
        tagCloud: ['Vue'],
      },
    })

    // Assert: Basic information is still displayed
    expect(wrapper.text()).toContain('Jane Doe')
    expect(wrapper.text()).toContain('Developer')
    expect(wrapper.text()).toContain('Vue')
  })
})
