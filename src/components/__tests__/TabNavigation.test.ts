import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Tab } from '../../types'
import TabNavigation from '../TabNavigation.vue'

// Tests for the TabNavigation component
// This component renders tabs for both mobile (select) and desktop (buttons)
// and handles tab switching via callback to parent
describe('TabNavigation', () => {
  // Test data used across all tests
  const mockTabs: Tab[] = [
    {
      id: 'skills',
      name: 'Skills',
      label: 'Technical Skills',
      icon: '⚙️',
      href: '#skills',
      current: false,
    },
    {
      id: 'experience',
      name: 'Experience',
      label: 'Work Experience',
      icon: '💼',
      href: '#experience',
      current: false,
    },
    {
      id: 'education',
      name: 'Education',
      label: 'Educational Background',
      icon: '🎓',
      href: '#education',
      current: false,
    },
  ]

  // Create a mock callback function for tab changes
  const mockOnTabChange = vi.fn()

  // Reset mocks before each test
  beforeEach(() => {
    mockOnTabChange.mockClear()
  })

  // Test: Check if all tabs are rendered with correct content
  it('should render all tabs with correct content', () => {
    // Arrange: Mount the component with test data
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Check if all tab names are present in the text
    expect(wrapper.text()).toContain('Skills')
    expect(wrapper.text()).toContain('Experience')
    expect(wrapper.text()).toContain('Education')

    // Assert: Check if icons are rendered
    expect(wrapper.text()).toContain('⚙️')
    expect(wrapper.text()).toContain('💼')
    expect(wrapper.text()).toContain('🎓')
  })

  // Test: Check if active tab is properly highlighted in desktop view
  it('should highlight the active tab in desktop view', () => {
    // Arrange: Mount component with 'experience' as active tab
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'experience',
        onTabChange: mockOnTabChange,
      },
    })

    // Act: Find all desktop tab buttons
    const tabButtons = wrapper.findAll('button')

    // Assert: Check if the active tab has the correct styling classes
    const activeButton = tabButtons.find(button => button.text().includes('Experience'))
    expect(activeButton?.classes()).toContain('border-indigo-500')
    expect(activeButton?.classes()).toContain('text-indigo-600')

    // Assert: Check if non-active tabs have default styling
    const inactiveButton = tabButtons.find(button => button.text().includes('Skills'))
    expect(inactiveButton?.classes()).toContain('border-transparent')
    expect(inactiveButton?.classes()).toContain('text-gray-500')
  })

  // Test: Check if active tab is selected in mobile dropdown
  it('should select the active tab in mobile dropdown', () => {
    // Arrange: Mount component with 'education' as active tab
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'education',
        onTabChange: mockOnTabChange,
      },
    })

    // Act: Find the mobile select element
    const select = wrapper.find('select')

    // Assert: Check if the select has the correct value
    expect(select.element.value).toBe('education')

    // Assert: Check if all options are present
    const options = select.findAll('option')
    expect(options).toHaveLength(3)
    expect(options[0].text()).toContain('Skills')
    expect(options[1].text()).toContain('Experience')
    expect(options[2].text()).toContain('Education')
  })

  // Test: Check if clicking desktop tab calls the callback function
  it('should call onTabChange when clicking a desktop tab button', async () => {
    // Arrange: Mount the component
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Act: Find and click the 'Experience' tab button
    const experienceButton = wrapper
      .findAll('button')
      .find(button => button.text().includes('Experience'))
    await experienceButton?.trigger('click')

    // Assert: Check if callback was called with correct tab ID
    expect(mockOnTabChange).toHaveBeenCalledTimes(1)
    expect(mockOnTabChange).toHaveBeenCalledWith('experience')
  })

  // Test: Check if changing mobile select calls the callback function
  it('should call onTabChange when changing mobile select', async () => {
    // Arrange: Mount the component
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Act: Find select element and change its value
    const select = wrapper.find('select')
    await select.setValue('education')

    // Assert: Check if callback was called with correct tab ID
    expect(mockOnTabChange).toHaveBeenCalledTimes(1)
    expect(mockOnTabChange).toHaveBeenCalledWith('education')
  })

  // Test: Check if component handles single tab correctly
  it('should handle single tab correctly', () => {
    // Arrange: Mount component with only one tab
    const singleTab = [mockTabs[0]]
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: singleTab,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Component should render without errors
    expect(wrapper.text()).toContain('Skills')

    // Assert: Both mobile and desktop views should have one tab
    const buttons = wrapper.findAll('button')
    const options = wrapper.findAll('option')
    expect(buttons).toHaveLength(1)
    expect(options).toHaveLength(1)
  })

  // Test: Check if component handles empty tabs array
  it('should handle empty tabs array gracefully', () => {
    // Arrange: Mount component with empty tabs array
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: [],
        activeTab: '',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Component should render without crashing
    expect(wrapper.exists()).toBe(true)

    // Assert: No tabs should be present
    const buttons = wrapper.findAll('button')
    const options = wrapper.findAll('option')
    expect(buttons).toHaveLength(0)
    expect(options).toHaveLength(0)
  })

  // Test: Check if aria attributes are correctly set
  it('should have correct accessibility attributes', () => {
    // Arrange: Mount the component
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Check mobile select has aria-label
    const select = wrapper.find('select')
    expect(select.attributes('aria-label')).toBe('Select a tab')

    // Assert: Check desktop nav has aria-label
    const nav = wrapper.find('nav')
    expect(nav.attributes('aria-label')).toBe('Tabs')

    // Assert: Check active tab has aria-current
    const activeButton = wrapper.findAll('button').find(button => button.text().includes('Skills'))
    expect(activeButton?.attributes('aria-current')).toBe('page')
  })

  // Test: Check responsive behavior - mobile vs desktop elements
  it('should have responsive mobile and desktop elements', () => {
    // Arrange: Mount the component
    const wrapper = mount(TabNavigation, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Check mobile container has correct classes (hidden on desktop)
    const mobileContainer = wrapper.find('.grid.grid-cols-1.sm\\:hidden')
    expect(mobileContainer.exists()).toBe(true)

    // Assert: Check desktop container has correct classes (hidden on mobile)
    const desktopContainer = wrapper.find('.hidden.sm\\:block')
    expect(desktopContainer.exists()).toBe(true)
  })
})
