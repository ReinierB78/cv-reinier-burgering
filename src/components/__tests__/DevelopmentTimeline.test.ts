import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Education } from '../../types'
import DevelopmentTimeline from '../DevelopmentTimeline.vue'

// Tests for the DevelopmentTimeline component
// This component renders a visual timeline of development moments/education
describe('DevelopmentTimeline', () => {
  // Test data used across all tests
  const mockDevelopmentMoments: Education[] = [
    {
      title: 'Vue.js Advanced Certification',
      institution: 'Vue School',
      period: '2024 - 2025',
      description:
        'Deep dive into advanced Vue.js patterns, composition API, and performance optimization.\nLearned about state management and testing strategies.',
    },
    {
      title: 'TypeScript Mastery Course',
      institution: 'Frontend Masters',
      period: '2023 - 2024',
      description:
        'Comprehensive TypeScript training covering advanced types, generics, and enterprise patterns.',
    },
    {
      title: 'Full Stack JavaScript Bootcamp',
      institution: 'Tech Academy',
      period: '2022 - 2023',
      description: 'Complete web development training from frontend to backend deployment.',
    },
  ]

  // Test: Check if component renders without crashing
  it('should render without errors', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Component should exist
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Belangrijke ontwikkelingsmomenten')
  })

  // Test: Check if all development moments are rendered
  it('should render all development moments with correct content', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Check if all titles are present
    expect(wrapper.text()).toContain('Vue.js Advanced Certification')
    expect(wrapper.text()).toContain('TypeScript Mastery Course')
    expect(wrapper.text()).toContain('Full Stack JavaScript Bootcamp')

    // Assert: Check if all institutions are present
    expect(wrapper.text()).toContain('Vue School')
    expect(wrapper.text()).toContain('Frontend Masters')
    expect(wrapper.text()).toContain('Tech Academy')

    // Assert: Check if all periods are present
    expect(wrapper.text()).toContain('2024 - 2025')
    expect(wrapper.text()).toContain('2023 - 2024')
    expect(wrapper.text()).toContain('2022 - 2023')
  })

  // Test: Check if descriptions are rendered with line breaks
  it('should render descriptions with proper line breaks', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Check if multi-line description is present
    expect(wrapper.text()).toContain('Deep dive into advanced Vue.js patterns')
    expect(wrapper.text()).toContain('Learned about state management')

    // Assert: Check if white-space: pre-line style is applied for line breaks
    const descriptionElements = wrapper.findAll('p[style*="white-space: pre-line"]')
    expect(descriptionElements.length).toBeGreaterThan(0)
  })

  // Test: Check timeline visual elements
  it('should render timeline visual elements correctly', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Check if timeline line exists
    const timelineLine = wrapper.find('.absolute.left-4.top-0.bottom-0.w-0\\.5')
    expect(timelineLine.exists()).toBe(true)

    // Assert: Check if timeline dots exist (one per moment)
    const timelineDots = wrapper.findAll('.absolute.left-2.top-1.w-4.h-4')
    expect(timelineDots).toHaveLength(mockDevelopmentMoments.length)

    // Assert: Check if progress bars exist
    const progressBars = wrapper.findAll('.h-full.bg-gradient-to-r.from-blue-500.to-indigo-600')
    expect(progressBars).toHaveLength(mockDevelopmentMoments.length)
  })

  // Test: Check year extraction function
  it('should extract years correctly from period strings', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Check if year badges are rendered with correct years
    const yearBadges = wrapper.findAll('.inline-flex.items-center.px-3.py-1.rounded-full')
    expect(yearBadges).toHaveLength(mockDevelopmentMoments.length)

    // Check specific years are extracted and displayed
    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toContain('2023')
    expect(wrapper.text()).toContain('2022')
  })

  // Test: Check progress width calculation
  it('should calculate progress widths correctly', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Check if progress bars have different widths
    const progressBars = wrapper.findAll('.h-full.bg-gradient-to-r.from-blue-500.to-indigo-600')

    // First item should have highest progress (100%)
    expect(progressBars[0].attributes('style')).toContain('width: 100%')

    // Second item should have lower progress (90%)
    expect(progressBars[1].attributes('style')).toContain('width: 90%')

    // Third item should have even lower progress (80%)
    expect(progressBars[2].attributes('style')).toContain('width: 80%')
  })

  // Test: Check hover interactions
  it('should have hover states for interactive elements', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Check if hover classes are present
    const groupElements = wrapper.findAll('.group')
    expect(groupElements).toHaveLength(mockDevelopmentMoments.length)

    // Assert: Check if cards have hover effects
    const cards = wrapper.findAll('.group-hover\\:border-blue-300')
    expect(cards).toHaveLength(mockDevelopmentMoments.length)

    // Assert: Check if titles have hover effects
    const titles = wrapper.findAll('.group-hover\\:text-blue-600')
    expect(titles).toHaveLength(mockDevelopmentMoments.length)
  })

  // Test: Check empty state handling
  it('should handle empty development moments gracefully', () => {
    // Arrange & Act: Mount component with empty array
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: [],
      },
    })

    // Assert: Component should render without crashing
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Belangrijke ontwikkelingsmomenten')

    // Assert: No timeline items should be present
    const timelineItems = wrapper.findAll('.group')
    expect(timelineItems).toHaveLength(0)

    // Assert: Timeline line should still be present
    const timelineLine = wrapper.find('.absolute.left-4.top-0.bottom-0.w-0\\.5')
    expect(timelineLine.exists()).toBe(true)
  })

  // Test: Check single item handling
  it('should handle single development moment correctly', () => {
    // Arrange: Mount component with single item
    const singleMoment = [mockDevelopmentMoments[0]]
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: singleMoment,
      },
    })

    // Assert: Single item should be rendered
    expect(wrapper.text()).toContain('Vue.js Advanced Certification')
    expect(wrapper.text()).toContain('Vue School')

    // Assert: Should have one timeline item
    const timelineItems = wrapper.findAll('.group')
    expect(timelineItems).toHaveLength(1)

    // Assert: Progress should be 100% for single item
    const progressBar = wrapper.find('.h-full.bg-gradient-to-r.from-blue-500.to-indigo-600')
    expect(progressBar.attributes('style')).toContain('width: 100%')
  })

  // Test: Check accessibility features
  it('should have proper semantic structure', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: mockDevelopmentMoments,
      },
    })

    // Assert: Check heading structure
    const mainHeading = wrapper.find('h3')
    expect(mainHeading.exists()).toBe(true)

    const subHeadings = wrapper.findAll('h4')
    expect(subHeadings).toHaveLength(mockDevelopmentMoments.length)

    // Assert: Check if content is properly structured
    const contentCards = wrapper.findAll('.bg-white.border.border-gray-200.rounded-lg')
    expect(contentCards).toHaveLength(mockDevelopmentMoments.length)
  })

  // Test: Check edge cases for period parsing
  it('should handle various period formats', () => {
    // Arrange: Test data with different period formats
    const edgeCaseMoments: Education[] = [
      {
        title: 'Course A',
        institution: 'School A',
        period: '2024',
        description: 'Single year format',
      },
      {
        title: 'Course B',
        institution: 'School B',
        period: 'January 2023 - December 2023',
        description: 'Month-year format',
      },
      {
        title: 'Course C',
        institution: 'School C',
        period: 'Ongoing since 2022',
        description: 'Ongoing format',
      },
    ]

    // Act: Mount component
    const wrapper = mount(DevelopmentTimeline, {
      props: {
        developmentMoments: edgeCaseMoments,
      },
    })

    // Assert: Years should be extracted from various formats
    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toContain('2023')
    expect(wrapper.text()).toContain('2022')
  })
})
