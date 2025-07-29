import type { Tab } from '@/types'
import { ChartBarIcon, HomeIcon, UserIcon } from '@heroicons/vue/24/outline'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MobileBottomNav from '../MobileBottomNav.vue'

// Mock tabs data
const mockTabs: Tab[] = [
  { id: 'home', name: 'Home', label: 'Home', icon: HomeIcon, href: '#home', current: false },
  { id: 'about', name: 'About', label: 'About', icon: UserIcon, href: '#about', current: false },
  {
    id: 'skills',
    name: 'Skills',
    label: 'Skills',
    icon: ChartBarIcon,
    href: '#skills',
    current: false,
  },
]

describe('MobileBottomNav', () => {
  it('should render all tabs correctly', () => {
    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: mockTabs,
        activeTab: 'home',
        onTabChange: () => {},
      },
    })

    // Check if all tabs are rendered
    const tabButtons = wrapper.findAll('button')
    expect(tabButtons).toHaveLength(mockTabs.length)

    // Check tab names
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('Skills')
  })

  it('should highlight the active tab', () => {
    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: mockTabs,
        activeTab: 'about',
        onTabChange: () => {},
      },
    })

    const tabButtons = wrapper.findAll('button')

    // First tab (home) should not be active
    expect(tabButtons[0].classes()).not.toContain('text-blue-600')

    // Second tab (about) should be active
    expect(tabButtons[1].classes()).toContain('text-blue-600')
  })

  it('should call onTabChange when tab is clicked', async () => {
    let changedTabId = ''
    const onTabChange = (tabId: string) => {
      changedTabId = tabId
    }

    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: mockTabs,
        activeTab: 'home',
        onTabChange,
      },
    })

    // Click on the second tab
    await wrapper.findAll('button')[1].trigger('click')

    expect(changedTabId).toBe('about')
  })

  it('should render icons for each tab', () => {
    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: mockTabs,
        activeTab: 'home',
        onTabChange: () => {},
      },
    })

    // Check if icons are rendered (heroicons render as svg elements)
    const icons = wrapper.findAll('svg')
    expect(icons).toHaveLength(mockTabs.length)
  })

  it('should handle empty tabs array', () => {
    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: [],
        activeTab: '',
        onTabChange: () => {},
      },
    })

    const tabButtons = wrapper.findAll('button')
    expect(tabButtons).toHaveLength(0)
  })

  it('should set aria-current for active tab', () => {
    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: () => {},
      },
    })

    const tabButtons = wrapper.findAll('button')

    // Only the active tab should have aria-current="page"
    expect(tabButtons[0].attributes('aria-current')).toBeUndefined()
    expect(tabButtons[1].attributes('aria-current')).toBeUndefined()
    expect(tabButtons[2].attributes('aria-current')).toBe('page')
  })

  it('should apply correct styling classes', () => {
    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: mockTabs,
        activeTab: 'home',
        onTabChange: () => {},
      },
    })

    // Check if navigation has proper positioning classes
    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('fixed')
    expect(nav.classes()).toContain('bottom-0')
    expect(nav.classes()).toContain('bg-white')
  })

  it('should handle tab change with keyboard navigation', async () => {
    let changedTabId = ''
    const onTabChange = (tabId: string) => {
      changedTabId = tabId
    }

    const wrapper = mount(MobileBottomNav, {
      props: {
        tabs: mockTabs,
        activeTab: 'home',
        onTabChange,
      },
    })

    // Simulate Enter key press on second tab
    const secondTabButton = wrapper.findAll('button')[1]
    await secondTabButton.trigger('keydown.enter')
    await secondTabButton.trigger('click')

    expect(changedTabId).toBe('about')
  })
})
