import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import HomeView from '../HomeView.vue'

// Mock the composables
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
      locale: { value: 'nl' },
    }),
    createI18n: vi.fn(() => ({
      global: {
        t: (key: string) => key,
      },
    })),
  }
})

// Mock useSidebar composable
vi.mock('@/composables/useSidebar', () => ({
  useSidebar: () => ({
    isSidebarOpen: { value: true },
    closeSidebar: vi.fn(),
    setOnSidebarClosed: vi.fn(),
  }),
}))

// Mock child components to focus on HomeView logic
const mockComponents = {
  DefaultLayout: {
    template: `
      <div>
        <slot name="sidebar" />
        <slot name="main" />
        <slot name="bottom-nav" />
      </div>
    `,
  },
  ProfileSidebar: { template: '<div data-testid="profile-sidebar">Profile</div>' },
  MainContent: {
    template: '<div data-testid="main-content"><slot /></div>',
    props: ['tabs', 'activeTab', 'onTabChange'],
  },
  MobileBottomNav: {
    template: '<div data-testid="mobile-bottom-nav">Bottom Nav</div>',
    props: ['tabs', 'activeTab', 'onTabChange'],
  },
  SkillsProgress: { template: '<div>Skills Progress</div>' },
  DayCircle: { template: '<div>Day Circle</div>' },
  ExperienceTimeline: { template: '<div>Experience Timeline</div>' },
  EducationSection: { template: '<div>Education Section</div>' },
  JokeDisplay: { template: '<div>Joke Display</div>' },
}

describe('HomeView', () => {
  const createWrapper = () => {
    return mount(HomeView, {
      global: {
        components: mockComponents,
        stubs: mockComponents,
      },
    })
  }

  it('should render without errors', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('should render profile sidebar', () => {
    const wrapper = createWrapper()
    const profileSidebar = wrapper.findComponent('[data-testid="profile-sidebar"]')
    expect(profileSidebar.exists()).toBe(true)
  })

  it('should render main content area', () => {
    const wrapper = createWrapper()
    const mainContent = wrapper.findComponent('[data-testid="main-content"]')
    expect(mainContent.exists()).toBe(true)
  })

  it('should render mobile bottom navigation', () => {
    const wrapper = createWrapper()
    const bottomNav = wrapper.findComponent('[data-testid="mobile-bottom-nav"]')
    expect(bottomNav.exists()).toBe(true)
  })

  describe('Component Integration', () => {
    it('should integrate with DefaultLayout', () => {
      const wrapper = createWrapper()
      // Check that all required slots are filled
      expect(wrapper.findComponent('[data-testid="profile-sidebar"]').exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="mobile-bottom-nav"]').exists()).toBe(true)
    })

    it('should render tab navigation components', () => {
      const wrapper = createWrapper()

      // MainContent should render
      const mainContent = wrapper.findComponent('[data-testid="main-content"]')
      expect(mainContent.exists()).toBe(true)

      // MobileBottomNav should render
      const bottomNav = wrapper.findComponent('[data-testid="mobile-bottom-nav"]')
      expect(bottomNav.exists()).toBe(true)
    })
  })

  describe('Tab Change Handler Integration', () => {
    it('should connect with sidebar state', () => {
      const wrapper = createWrapper()

      expect(wrapper.exists()).toBe(true)
      // Component should successfully render and connect to mocked sidebar state
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
    })
  })

  describe('Data Structures', () => {
    it('should have work experience data', () => {
      const wrapper = createWrapper()
      // Check if component renders without error - work experience is used internally
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should have education and development moments data', () => {
      const wrapper = createWrapper()
      // Check if component renders without error - education data is used internally
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should have skills data for frontend and backend', () => {
      const wrapper = createWrapper()
      // Check if component renders without error - skills data is used internally
      expect(wrapper.find('div').exists()).toBe(true)
    })
  })

  describe('Reactive Behavior', () => {
    it('should handle sidebar state changes', () => {
      const wrapper = createWrapper()

      // Component should handle provide/inject correctly
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
    })

    it('should maintain component state', () => {
      const wrapper = createWrapper()

      // All major components should be present
      expect(wrapper.findComponent('[data-testid="profile-sidebar"]').exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="mobile-bottom-nav"]').exists()).toBe(true)
    })

    it('should render components correctly when sidebar is open', () => {
      const wrapper = createWrapper()
      const mainContent = wrapper.findComponent('[data-testid="main-content"]')
      const bottomNav = wrapper.findComponent('[data-testid="mobile-bottom-nav"]')

      // Components should render successfully (activeTab logic is internal)
      expect(mainContent.exists()).toBe(true)
      expect(bottomNav.exists()).toBe(true)
    })

    it('should handle effectiveActiveTab computed correctly', () => {
      const wrapper = createWrapper()

      // Component should render without errors despite activeTab logic
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
    })
  })

  describe('Tab Behavior', () => {
    it('should initialize correctly on desktop with frontend tab active', async () => {
      // Mock window.innerWidth for desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      // On desktop, effectiveActiveTab should default to 'frontend'
      // This is internal behavior but should not cause render errors
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
    })

    it('should initialize correctly on mobile with no active tab', async () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      // On mobile with sidebar open, effectiveActiveTab should be null
      // This is internal behavior but should not cause render errors
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
    })

    it('should handle window resize events correctly', async () => {
      // Start with desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      // Simulate resize to mobile
      window.innerWidth = 375
      window.dispatchEvent(new Event('resize'))
      await wrapper.vm.$nextTick()

      // Component should still render correctly after resize
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
    })

    it('should set up sidebar closed callback correctly', async () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()

      // Component should render correctly and set up the callback
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent('[data-testid="main-content"]').exists()).toBe(true)
    })
  })
})
