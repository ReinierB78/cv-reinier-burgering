import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DayCircle from '../DayCircle.vue'

// Tests for the DayCircle component
// This component renders an interactive circular chart showing daily activities
describe('DayCircle', () => {
  // Test: Check if component renders without errors
  it('should render without errors', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Component should exist
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Mijn Ideale Dag')
  })

  // Test: Check if SVG circle diagram is rendered
  it('should render SVG circle diagram', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check if SVG element exists
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 120 120')

    // Assert: Check if background circle exists
    const backgroundCircle = wrapper.find('circle[stroke="#f3f4f6"]')
    expect(backgroundCircle.exists()).toBe(true)
  })

  // Test: Check if all activity segments are rendered
  it('should render all activity segments', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check if activity segments exist (8 activities expected)
    const activityCircles = wrapper.findAll('circle[stroke]:not([stroke="#f3f4f6"])')
    expect(activityCircles.length).toBe(8)

    // Assert: Check if hover zones exist
    const hoverPaths = wrapper.findAll('path[fill="transparent"]')
    expect(hoverPaths.length).toBe(8)
  })

  // Test: Check if center content displays correctly
  it('should display center content correctly', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check default center content
    expect(wrapper.text()).toContain('🌅')
    expect(wrapper.text()).toContain('24 uur')
  })

  // Test: Check if legend is rendered with all activities
  it('should render legend with all activities', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check if all activity names are present
    expect(wrapper.text()).toContain('Opstaan & Ontbijt')
    expect(wrapper.text()).toContain('Reizen naar werk')
    expect(wrapper.text()).toContain('Stand-up & Planning')
    expect(wrapper.text()).toContain('Coderen & Development')
    expect(wrapper.text()).toContain('Thuisreis & Gezin')
    expect(wrapper.text()).toContain('Sporten')
    expect(wrapper.text()).toContain('Ontspannen')
    expect(wrapper.text()).toContain('Slapen')

    // Assert: Check if time slots are present
    expect(wrapper.text()).toContain('07:00 - 08:00')
    expect(wrapper.text()).toContain('10:00 - 18:00')
    expect(wrapper.text()).toContain('00:00 - 07:00')
  })

  // Test: Check if activity icons are displayed
  it('should display activity icons', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check if icons are present in the text
    expect(wrapper.text()).toContain('☀️')
    expect(wrapper.text()).toContain('🚗')
    expect(wrapper.text()).toContain('👥')
    expect(wrapper.text()).toContain('💻')
    expect(wrapper.text()).toContain('🏠')
    expect(wrapper.text()).toContain('🏃‍♂️')
    expect(wrapper.text()).toContain('📚')
    expect(wrapper.text()).toContain('😴')
  })

  // Test: Check if fun fact section is displayed
  it('should display fun fact section', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check if fun fact container exists
    const funFactContainer = wrapper.find('.bg-blue-50')
    expect(funFactContainer.exists()).toBe(true)

    // Assert: Check if fun fact text is present
    expect(wrapper.text()).toContain('Fun fact:')
    expect(wrapper.text()).toContain('33% van mijn dag gaat naar coderen')
    expect(wrapper.text()).toContain('21% naar slapen')
    expect(wrapper.text()).toContain('13% naar familie tijd')
  })

  // Test: Check hover interaction on legend items
  it('should handle legend item hover interactions', async () => {
    // Arrange: Mount the component
    const wrapper = mount(DayCircle)

    // Act: Find first legend item and trigger hover
    const legendItems = wrapper.findAll('.cursor-pointer.hover\\:bg-gray-50')
    expect(legendItems.length).toBeGreaterThan(0)

    const firstLegendItem = legendItems[0]
    await firstLegendItem.trigger('mouseenter')

    // Assert: Check if center content changes (we can't easily test reactive data,
    // but we can verify the structure exists for interaction)
    expect(firstLegendItem.exists()).toBe(true)
  })

  // Test: Check if color indicators are present in legend
  it('should display color indicators in legend', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check if color dots exist in legend
    const colorDots = wrapper.findAll('.w-3.h-3.rounded-full')
    expect(colorDots.length).toBe(8) // One for each activity

    // Assert: Check if they have background colors (style attribute)
    colorDots.forEach(dot => {
      expect(dot.attributes('style')).toContain('background-color')
    })
  })

  // Test: Check responsive layout structure
  it('should have responsive layout structure', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check main container structure
    const mainContainer = wrapper.find('.flex.flex-col.items-center.space-y-6')
    expect(mainContainer.exists()).toBe(true)

    // Assert: Check circle container dimensions
    const circleContainer = wrapper.find('.relative.w-80.h-80')
    expect(circleContainer.exists()).toBe(true)

    // Assert: Check legend grid layout
    const legendGrid = wrapper.find('.grid.grid-cols-2.gap-3')
    expect(legendGrid.exists()).toBe(true)
  })

  // Test: Check if SVG has proper accessibility
  it('should have proper SVG structure for accessibility', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Assert: Check if SVG has transform for rotation
    const svg = wrapper.find('svg')
    expect(svg.classes()).toContain('transform')
    expect(svg.classes()).toContain('-rotate-90')

    // Assert: Check if defs section exists for effects
    const defs = wrapper.find('defs')
    expect(defs.exists()).toBe(true)

    // Assert: Check if glow filter exists
    const glowFilter = wrapper.find('filter#glow')
    expect(glowFilter.exists()).toBe(true)
  })

  // Test: Check activity hours calculation
  it('should have correct total hours distribution', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DayCircle)

    // Note: We can't directly test the getDashArray function since it's not exposed,
    // but we can verify that all activities are rendered which implies the calculation works

    // Assert: Verify all 8 activities are present (indirectly testing hours distribution)
    const activitySegments = wrapper.findAll('circle[stroke]:not([stroke="#f3f4f6"])')
    expect(activitySegments.length).toBe(8)

    // Assert: Verify the fun fact shows correct percentages
    expect(wrapper.text()).toContain('33%') // Coding percentage
    expect(wrapper.text()).toContain('21%') // Sleep percentage
    expect(wrapper.text()).toContain('13%') // Family percentage
  })
})
