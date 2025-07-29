import { AcademicCapIcon, ChartBarIcon, UserIcon } from '@heroicons/vue/24/outline'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Tab } from '../../types'
import TabNavigation from '../TabNavigation.vue'

// Tests for the TabNavigation component (Desktop only)
// This component renders desktop tab navigation and is hidden on mobile
describe('TabNavigation', () => {
  // Mock tabs data with proper Tab interface
  const mockTabs: Tab[] = [
    {
      id: 'skills',
      name: 'Skills',
      label: 'Technical Skills',
      icon: ChartBarIcon,
      href: '#skills',
      current: false,
    },
    {
      id: 'experience',
      name: 'Experience',
      label: 'Work Experience',
      icon: UserIcon,
      href: '#experience',
      current: false,
    },
    {
      id: 'education',
      name: 'Education',
      label: 'Education & Learning',
      icon: AcademicCapIcon,
      href: '#education',
      current: false,
    },
  ]

  it('should render all tabs correctly', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: () => {},
      },
    })

    // Check if all tab names are present
    expect(wrapper.text()).toContain('Skills')
    expect(wrapper.text()).toContain('Experience')
    expect(wrapper.text()).toContain('Education')

    // Check if correct number of buttons are rendered
    const tabButtons = wrapper.findAll('button')
    expect(tabButtons).toHaveLength(mockTabs.length)
  })

  it('should highlight the active tab', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'experience',
        onTabChange: () => {},
      },
    })

    const tabButtons = wrapper.findAll('button')

    // First tab (skills) should not be active
    expect(tabButtons[0].classes()).not.toContain('text-indigo-600')

    // Second tab (experience) should be active
    expect(tabButtons[1].classes()).toContain('text-indigo-600')
  })

  it('should call onTabChange when tab is clicked', async () => {
    let changedTabId = ''
    const onTabChange = (tabId: string) => {
      changedTabId = tabId
    }

    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange,
      },
    })

    // Click on the second tab (experience)
    await wrapper.findAll('button')[1].trigger('click')

    expect(changedTabId).toBe('experience')
  })

  it('should be hidden on mobile (have md:block class)', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: () => {},
      },
    })

    // Check if the main container has the responsive classes
    const container = wrapper.find('div')
    expect(container.classes()).toContain('hidden')
    expect(container.classes()).toContain('md:block')
  })

  it('should render icons for each tab', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: () => {},
      },
    })

    // Check if icons are rendered (heroicons render as svg elements)
    const icons = wrapper.findAll('svg')
    expect(icons).toHaveLength(mockTabs.length)
  })

  it('should set aria-current for active tab', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'education',
        onTabChange: () => {},
      },
    })

    const tabButtons = wrapper.findAll('button')

    // Only the active tab should have aria-current="page"
    expect(tabButtons[0].attributes('aria-current')).toBeUndefined()
    expect(tabButtons[1].attributes('aria-current')).toBeUndefined()
    expect(tabButtons[2].attributes('aria-current')).toBe('page')
  })

  it('should handle keyboard navigation', async () => {
    let changedTabId = ''
    const onTabChange = (tabId: string) => {
      changedTabId = tabId
    }

    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange,
      },
    })

    // Simulate arrow right key press on first tab
    const firstTabButton = wrapper.findAll('button')[0]
    await firstTabButton.trigger('keydown', { key: 'ArrowRight' })

    expect(changedTabId).toBe('experience')
  })

  it('should handle empty tabs array', () => {
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: [],
        activeTab: '',
        onTabChange: () => {},
      },
    })

    const tabButtons = wrapper.findAll('button')
    expect(tabButtons).toHaveLength(0)
  })
})
