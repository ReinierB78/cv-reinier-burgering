import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Education } from '../../types'
import EducationSection from '../EducationSection.vue'

// Tests for the EducationSection component
describe('EducationSection', () => {
  // Mock education data
  const mockEducationList: Education[] = [
    {
      title: 'Bachelor Computer Science',
      institution: 'University of Technology',
      period: '2015 - 2019',
      description: 'Focused on software engineering and web development',
    },
    {
      title: 'Frontend Development Bootcamp',
      institution: 'Code Academy',
      period: '2020',
    },
  ]

  const mockDevelopmentMoments: Education[] = [
    {
      title: 'Vue 3 Migration Project',
      institution: 'Tech Company',
      period: '2023',
      description: 'Led migration from Vue 2 to Vue 3 with Composition API',
    },
  ]

  // Test: Component renders without errors
  it('should render without errors', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  // Test: Renders default title
  it('should render default title', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    expect(wrapper.text()).toContain('Bijdrage & Ontwikkeling')
  })

  // Test: Renders custom title
  it('should render custom title when provided', () => {
    const customTitle = 'Opleiding & Certificaten'
    const wrapper = mount(EducationSection, {
      props: {
        title: customTitle,
        educationList: mockEducationList,
      },
    })

    expect(wrapper.text()).toContain(customTitle)
    expect(wrapper.text()).not.toContain('Bijdrage & Ontwikkeling')
  })

  // Test: Renders all education items
  it('should render all education items', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    // Check if education titles are present
    expect(wrapper.text()).toContain('Bachelor Computer Science')
    expect(wrapper.text()).toContain('Frontend Development Bootcamp')

    // Check if institutions are present
    expect(wrapper.text()).toContain('University of Technology')
    expect(wrapper.text()).toContain('Code Academy')

    // Check if periods are present
    expect(wrapper.text()).toContain('2015 - 2019')
    expect(wrapper.text()).toContain('2020')
  })

  // Test: Renders descriptions when available
  it('should render descriptions when available', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    // First item has description
    expect(wrapper.text()).toContain('Focused on software engineering and web development')

    // Second item has no description, so it shouldn't appear
    const descriptionElements = wrapper.findAll('p.text-sm')
    expect(descriptionElements).toHaveLength(1)
  })

  // Test: Handles empty education list
  it('should handle empty education list', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: [],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Bijdrage & Ontwikkeling')

    // No education cards should be present
    const educationCards = wrapper.findAll('.bg-gray-50')
    expect(educationCards).toHaveLength(0)
  })

  // Test: Renders development timeline when provided
  it('should render development timeline when provided', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // DevelopmentTimeline component should be present
    const developmentTimeline = wrapper.findComponent({ name: 'DevelopmentTimeline' })
    expect(developmentTimeline.exists()).toBe(true)
  })

  // Test: Does not render development timeline when not provided
  it('should not render development timeline when not provided', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    // DevelopmentTimeline component should not be present
    const developmentTimeline = wrapper.findComponent({ name: 'DevelopmentTimeline' })
    expect(developmentTimeline.exists()).toBe(false)
  })

  // Test: Has correct styling classes
  it('should have correct styling classes', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    // Check main container
    expect(wrapper.classes()).toContain('space-y-6')

    // Check title styling
    const title = wrapper.find('h2')
    expect(title.classes()).toContain('text-2xl')
    expect(title.classes()).toContain('font-bold')
    expect(title.classes()).toContain('text-gray-900')
    expect(title.classes()).toContain('dark:text-gray-100')

    // Check education card styling
    const educationCards = wrapper.findAll('.bg-gray-50')
    expect(educationCards).toHaveLength(mockEducationList.length)

    const firstCard = educationCards[0]
    expect(firstCard.classes()).toContain('dark:bg-gray-800')
    expect(firstCard.classes()).toContain('rounded-lg')
    expect(firstCard.classes()).toContain('border')
    expect(firstCard.classes()).toContain('transition-colors')
  })

  // Test: Hover effects are present
  it('should have hover effects on education cards', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    const educationCards = wrapper.findAll('.hover\\:shadow-sm')
    expect(educationCards).toHaveLength(mockEducationList.length)
  })

  // Test: Dark mode classes are present
  it('should have dark mode classes', () => {
    const wrapper = mount(EducationSection, {
      props: {
        educationList: mockEducationList,
      },
    })

    // Check title dark mode
    const title = wrapper.find('h2')
    expect(title.classes()).toContain('dark:text-gray-100')

    // Check education card titles dark mode
    const cardTitles = wrapper.findAll('h3')
    cardTitles.forEach(title => {
      expect(title.classes()).toContain('dark:text-gray-100')
    })

    // Check institution text dark mode
    const institutionTexts = wrapper.findAll('p.text-gray-600')
    institutionTexts.forEach(text => {
      expect(text.classes()).toContain('dark:text-gray-400')
    })
  })
})
