import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import DefaultLayout from '../DefaultLayout.vue'

// Mock the composables
vi.mock('@/composables/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'nl' },
  }),
}))

// Mock the useSidebar composable
const mockIsSidebarOpen = ref(true)
const mockCloseSidebar = vi.fn()
const mockToggleSidebar = vi.fn()

vi.mock('@/composables/useSidebar', () => ({
  useSidebar: () => ({
    isSidebarOpen: mockIsSidebarOpen,
    closeSidebar: mockCloseSidebar,
    toggleSidebar: mockToggleSidebar,
  }),
}))

describe('DefaultLayout', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockIsSidebarOpen.value = true
    mockCloseSidebar.mockClear()
    mockToggleSidebar.mockClear()
  })
  const createWrapper = (slots = {}) => {
    return mount(DefaultLayout, {
      slots: {
        sidebar: '<div data-testid="sidebar-content">Sidebar Content</div>',
        main: '<div data-testid="main-content">Main Content</div>',
        'bottom-nav': '<div data-testid="bottom-nav">Bottom Nav</div>',
        ...slots,
      },
      global: {
        stubs: {
          LanguageSwitcher: true,
          ThemeSwitcher: true,
          SourceCodeLink: true,
        },
      },
    })
  }

  it('should render without errors', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('should show desktop sidebar on larger screens', () => {
    const wrapper = createWrapper()
    const desktopSidebar = wrapper.find('aside.hidden.md\\:block')
    expect(desktopSidebar.exists()).toBe(true)
    expect(desktopSidebar.text()).toContain('Sidebar Content')
  })

  it('should render main content area', () => {
    const wrapper = createWrapper()
    const mainContent = wrapper.find('[data-testid="main-content"]')
    expect(mainContent.exists()).toBe(true)
  })

  it('should render bottom navigation on mobile', () => {
    const wrapper = createWrapper()
    const bottomNav = wrapper.find('[data-testid="bottom-nav"]')
    expect(bottomNav.exists()).toBe(true)
  })

  describe('Mobile Profile Overlay', () => {
    it('should start with profile overlay open on mobile', () => {
      const wrapper = createWrapper()

      // Profile overlay should be visible initially
      const profileOverlay = wrapper.find('.md\\:hidden.fixed.inset-0')
      expect(profileOverlay.exists()).toBe(true)

      // Mobile header should be hidden when profile is open
      const mobileHeader = wrapper.find('header')
      expect(mobileHeader.exists()).toBe(false)
    })

    it('should show close button in profile overlay', () => {
      const wrapper = createWrapper()

      const closeButton = wrapper.find('button[aria-label="Profiel sluiten"]')
      expect(closeButton.exists()).toBe(true)
    })

    it('should close profile overlay when close button is clicked', async () => {
      const wrapper = createWrapper()

      // Initially profile should be open
      expect(wrapper.find('.md\\:hidden.fixed.inset-0').exists()).toBe(true)

      // Click close button
      const closeButton = wrapper.find('button[aria-label="Profiel sluiten"]')
      await closeButton.trigger('click')

      // Check that closeSidebar was called
      expect(mockCloseSidebar).toHaveBeenCalled()
    })

    it('should reopen profile when profile button is clicked', async () => {
      // First set sidebar to closed
      mockIsSidebarOpen.value = false
      const wrapper = createWrapper()

      // Profile should be closed initially
      expect(wrapper.find('.md\\:hidden.fixed.inset-0').exists()).toBe(false)

      // Click profile button to reopen
      const profileButton = wrapper.find('button[aria-label="Open profiel"]')
      expect(profileButton.exists()).toBe(true)
      await profileButton.trigger('click')

      // Check that toggleSidebar was called
      expect(mockToggleSidebar).toHaveBeenCalled()
    })

    it('should display profile title in overlay header', () => {
      const wrapper = createWrapper()

      const profileTitle = wrapper.find('.md\\:hidden.fixed.inset-0 h1')
      expect(profileTitle.exists()).toBe(true)
      expect(profileTitle.text()).toBe('Profiel Reinier')
    })

    it('should show sidebar content in profile overlay', () => {
      const wrapper = createWrapper()

      const sidebarContent = wrapper.find('[data-testid="sidebar-content"]')
      expect(sidebarContent.exists()).toBe(true)
      expect(sidebarContent.text()).toContain('Sidebar Content')
    })
  })

  describe('Theme Controls', () => {
    it('should show theme switcher in mobile header when profile is closed', async () => {
      // Set sidebar to closed
      mockIsSidebarOpen.value = false
      const wrapper = createWrapper()

      // Check theme switcher in mobile header
      const mobileHeader = wrapper.find('header')
      expect(mobileHeader.exists()).toBe(true)
      const themeSwitcher = mobileHeader.findComponent({ name: 'ThemeSwitcher' })
      expect(themeSwitcher.exists()).toBe(true)
    })

    it('should show theme switcher in profile overlay header', () => {
      const wrapper = createWrapper()

      const profileOverlay = wrapper.find('.md\\:hidden.fixed.inset-0')
      expect(profileOverlay.exists()).toBe(true)
      const themeSwitcher = profileOverlay.findComponent({ name: 'ThemeSwitcher' })
      expect(themeSwitcher.exists()).toBe(true)
    })

    it('should show desktop theme controls in top-right', () => {
      const wrapper = createWrapper()

      const desktopControls = wrapper.find('.hidden.md\\:flex.fixed.top-4.right-4')
      expect(desktopControls.exists()).toBe(true)
    })
  })

  describe('Responsive Behavior', () => {
    it('should hide mobile elements on desktop', () => {
      const wrapper = createWrapper()

      // Mobile header should be hidden on desktop (md:hidden class)
      const mobileElements = wrapper.findAll('.md\\:hidden')
      expect(mobileElements.length).toBeGreaterThan(0)
    })

    it('should hide desktop sidebar on mobile', () => {
      const wrapper = createWrapper()

      // Desktop sidebar should be hidden on mobile (hidden class, visible on md:block)
      const desktopSidebar = wrapper.find('aside.hidden.md\\:block')
      expect(desktopSidebar.exists()).toBe(true)
    })
  })

  describe('Sidebar State Management', () => {
    it('should use useSidebar composable correctly', () => {
      const wrapper = createWrapper()

      // Check that the composable is working by verifying the sidebar is initially open
      const profileOverlay = wrapper.find('.md\\:hidden.fixed.inset-0')
      expect(profileOverlay.exists()).toBe(true)
    })

    it('should provide closeSidebar function that works', async () => {
      const wrapper = createWrapper()

      // Initially open
      expect(wrapper.find('.md\\:hidden.fixed.inset-0').exists()).toBe(true)

      // Close via sidebar function (simulated by clicking close button)
      const closeButton = wrapper.find('button[aria-label="Profiel sluiten"]')
      await closeButton.trigger('click')

      // Check that closeSidebar was called
      expect(mockCloseSidebar).toHaveBeenCalled()
    })
  })
})
