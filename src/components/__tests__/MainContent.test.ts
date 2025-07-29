import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { Tab } from '../../types'
import MainContent from '../MainContent.vue'
import TabNavigation from '../TabNavigation.vue'

// Tests for the MainContent component
// This component renders tab navigation and provides a slot for content
describe('MainContent', () => {
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
  ]

  const mockOnTabChange = vi.fn()

  beforeEach(() => {
    mockOnTabChange.mockClear()
  })

  // Test: Check if component renders without errors
  it('should render without errors', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(MainContent, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Component should exist
    expect(wrapper.exists()).toBe(true)
  })

  // Test: Check if TabNavigation component is rendered with correct props
  it('should render TabNavigation with correct props', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(MainContent, {
      props: {
        tabs: mockTabs,
        activeTab: 'experience',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Check if TabNavigation component exists
    const tabNavigation = wrapper.findComponent(TabNavigation)
    expect(tabNavigation.exists()).toBe(true)

    // Assert: Check if props are passed correctly
    expect(tabNavigation.props('tabs')).toEqual(mockTabs)
    expect(tabNavigation.props('activeTab')).toBe('experience')
    expect(tabNavigation.props('onTabChange')).toBe(mockOnTabChange)
  })

  // Test: Check if content slot is rendered correctly
  it('should render slot content correctly', () => {
    // Arrange & Act: Mount component with slot content
    const wrapper = mount(MainContent, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
      slots: {
        default: '<div class="test-content">Test slot content</div>',
      },
    })

    // Assert: Check if slot content is rendered
    expect(wrapper.html()).toContain('Test slot content')
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })

  // Test: Check if content container has correct styling
  it('should have correct content container styling', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(MainContent, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Check if content container has correct CSS classes
    const contentContainer = wrapper.find('.bg-white.rounded-lg.shadow-sm.p-6')
    expect(contentContainer.exists()).toBe(true)
  })

  // Test: Check if tab change callback is properly passed through
  it('should pass tab change callback through to TabNavigation', async () => {
    // Arrange: Mount the component
    const wrapper = mount(MainContent, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Act: Simulate tab change in TabNavigation
    const tabNavigation = wrapper.findComponent(TabNavigation)
    await tabNavigation.vm.$emit('click', 'experience')

    // Note: We can't directly test the callback since it's passed as prop
    // This test verifies the prop is correctly passed
    expect(tabNavigation.props('onTabChange')).toBe(mockOnTabChange)
  })

  // Test: Check empty tabs handling
  it('should handle empty tabs array', () => {
    // Arrange & Act: Mount component with empty tabs
    const wrapper = mount(MainContent, {
      props: {
        tabs: [],
        activeTab: '',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Component should render without crashing
    expect(wrapper.exists()).toBe(true)

    // Assert: TabNavigation should still be rendered
    const tabNavigation = wrapper.findComponent(TabNavigation)
    expect(tabNavigation.exists()).toBe(true)
    expect(tabNavigation.props('tabs')).toEqual([])
  })

  // Test: Check if multiple slot content works
  it('should handle complex slot content', () => {
    // Arrange & Act: Mount component with complex slot content
    const complexSlotContent = `
      <div>
        <h2>Complex Content</h2>
        <p>Some paragraph text</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </div>
    `

    const wrapper = mount(MainContent, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
      slots: {
        default: complexSlotContent,
      },
    })

    // Assert: Check if all slot content is rendered
    expect(wrapper.text()).toContain('Complex Content')
    expect(wrapper.text()).toContain('Some paragraph text')
    expect(wrapper.text()).toContain('List item 1')
    expect(wrapper.text()).toContain('List item 2')
  })

  // Test: Check component structure
  it('should have correct component structure', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(MainContent, {
      props: {
        tabs: mockTabs,
        activeTab: 'skills',
        onTabChange: mockOnTabChange,
      },
    })

    // Assert: Check if root div exists
    const rootDiv = wrapper.find('div')
    expect(rootDiv.exists()).toBe(true)

    // Assert: Check if TabNavigation is first child
    const children = wrapper.element.children
    expect(children[0]).toBeTruthy()

    // Assert: Check if content container is second child
    expect(children[1]).toBeTruthy()
    expect(children[1].classList.contains('bg-white')).toBe(true)
  })
})
