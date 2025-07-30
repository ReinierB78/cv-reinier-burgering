import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { WorkExperience } from '../../types'
import ExperienceTimeline from '../ExperienceTimeline.vue'

// Tests for the ExperienceTimeline component
// This component displays work experience in an expandable timeline format
describe('ExperienceTimeline', () => {
  // Test data used across all tests
  const mockWorkExperience: WorkExperience[] = [
    {
      title: 'Senior Frontend Developer',
      company: 'Tech Company A',
      period: '2023 - Present',
      description:
        'Leading frontend development team, working with Vue.js and modern web technologies. Responsible for architecture decisions and mentoring junior developers.',
      tags: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Team Lead'],
    },
    {
      title: 'Frontend Developer',
      company: 'Startup B',
      period: '2021 - 2023',
      description:
        'Developed responsive web applications using React and Node.js. Collaborated with design team to implement pixel-perfect UI components.',
      tags: ['React', 'JavaScript', 'SCSS', 'Node.js'],
    },
    {
      title: 'Junior Web Developer',
      company: 'Agency C',
      period: '2020 - 2021',
      description:
        'Started career building WordPress websites and learning modern JavaScript frameworks.',
      tags: ['WordPress', 'PHP', 'jQuery'],
    },
  ]

  // Test: Check if component renders without errors
  it('should render without errors', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Assert: Component should exist
    expect(wrapper.exists()).toBe(true)
  })

  // Test: Check if all work experience items are rendered
  it('should render all work experience items', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Assert: Check if all job titles are present
    expect(wrapper.text()).toContain('Senior Frontend Developer')
    expect(wrapper.text()).toContain('Frontend Developer')
    expect(wrapper.text()).toContain('Junior Web Developer')

    // Assert: Check if all companies are present
    expect(wrapper.text()).toContain('Tech Company A')
    expect(wrapper.text()).toContain('Startup B')
    expect(wrapper.text()).toContain('Agency C')

    // Assert: Check if all periods are present
    expect(wrapper.text()).toContain('2023 - Present')
    expect(wrapper.text()).toContain('2021 - 2023')
    expect(wrapper.text()).toContain('2020 - 2021')
  })

  // Test: Check alternating border colors
  it('should have alternating border colors', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Assert: Check border color classes
    const jobItems = wrapper.findAll('.border-l-4')
    expect(jobItems).toHaveLength(3)

    // First item should have blue border (index 0, even)
    expect(jobItems[0].classes()).toContain('border-blue-500')

    // Second item should have green border (index 1, odd)
    expect(jobItems[1].classes()).toContain('border-green-500')

    // Third item should have blue border (index 2, even)
    expect(jobItems[2].classes()).toContain('border-blue-500')
  })

  // Test: Check initial collapsed state
  it('should start with all jobs collapsed', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Assert: Descriptions should not be visible initially
    expect(wrapper.text()).not.toContain('Leading frontend development team')
    expect(wrapper.text()).not.toContain('Developed responsive web applications')
    expect(wrapper.text()).not.toContain('Started career building WordPress websites')

    // Assert: Tags should not be visible initially
    expect(wrapper.text()).not.toContain('Vue.js')
    expect(wrapper.text()).not.toContain('React')
    expect(wrapper.text()).not.toContain('WordPress')
  })

  // Test: Check expansion functionality
  it('should expand job details when clicked', async () => {
    // Arrange: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Act: Click on the first job header
    const firstJobHeader = wrapper.findAll('.py-3')[0]
    await firstJobHeader.trigger('click')

    // Assert: First job description should now be visible
    expect(wrapper.text()).toContain('Leading frontend development team')

    // Assert: First job tags should be visible
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('TypeScript')
    expect(wrapper.text()).toContain('Tailwind CSS')
    expect(wrapper.text()).toContain('Team Lead')

    // Assert: Other jobs should still be collapsed
    expect(wrapper.text()).not.toContain('Developed responsive web applications')
    expect(wrapper.text()).not.toContain('Started career building WordPress websites')
  })

  // Test: Check collapse functionality
  it('should collapse job details when clicked again', async () => {
    // Arrange: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Act: Click to expand
    const firstJobHeader = wrapper.findAll('.py-3')[0]
    await firstJobHeader.trigger('click')

    // Verify it's expanded
    expect(wrapper.text()).toContain('Leading frontend development team')

    // Act: Click again to collapse
    await firstJobHeader.trigger('click')

    // Assert: Description should no longer be visible
    expect(wrapper.text()).not.toContain('Leading frontend development team')
    expect(wrapper.text()).not.toContain('Vue.js')
  })

  // Test: Check multiple expansions
  it('should allow multiple jobs to be expanded simultaneously', async () => {
    // Arrange: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Act: Expand first two jobs
    const jobHeaders = wrapper.findAll('.py-3')
    await jobHeaders[0].trigger('click')
    await jobHeaders[1].trigger('click')

    // Assert: Both job descriptions should be visible
    expect(wrapper.text()).toContain('Leading frontend development team')
    expect(wrapper.text()).toContain('Developed responsive web applications')

    // Assert: Both sets of tags should be visible
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('React')

    // Assert: Third job should still be collapsed
    expect(wrapper.text()).not.toContain('Started career building WordPress websites')
  })

  // Test: Check arrow icon rotation
  it('should rotate arrow icon when expanded', async () => {
    // Arrange: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Act: Find arrow icon for first job
    const arrowIcons = wrapper.findAll('svg')
    const firstArrow = arrowIcons[0]

    // Assert: Initially should not have rotate-180 class
    expect(firstArrow.classes()).not.toContain('rotate-180')

    // Act: Click to expand
    const firstJobHeader = wrapper.findAll('.py-3')[0]
    await firstJobHeader.trigger('click')

    // Assert: Arrow should now be rotated
    expect(firstArrow.classes()).toContain('rotate-180')
  })

  // Test: Check hover effects
  it('should have hover effects on job items', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Assert: Check if job items have border-l-4 class (main container)
    const jobItems = wrapper.findAll('.border-l-4')
    expect(jobItems).toHaveLength(mockWorkExperience.length)

    // Assert: Check if job items have cursor-pointer class for interactivity
    const clickableItems = wrapper.findAll('.cursor-pointer')
    expect(clickableItems).toHaveLength(mockWorkExperience.length)

    // Assert: Check if transition classes are present on titles
    const titleElements = wrapper.findAll('h3.transition-colors')
    expect(titleElements).toHaveLength(mockWorkExperience.length)

    // Assert: Check if SVG icons have transition classes
    const svgIcons = wrapper.findAll('svg.transition-all')
    expect(svgIcons).toHaveLength(mockWorkExperience.length)
  })

  // Test: Check empty work experience handling
  it('should handle empty work experience gracefully', () => {
    // Arrange & Act: Mount component with empty array
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: [],
      },
    })

    // Assert: Component should render without crashing
    expect(wrapper.exists()).toBe(true)

    // Assert: No job items should be present
    const jobItems = wrapper.findAll('.border-l-4')
    expect(jobItems).toHaveLength(0)
  })

  // Test: Check single job handling
  it('should handle single work experience correctly', () => {
    // Arrange: Single job data
    const singleJob = [mockWorkExperience[0]]

    // Act: Mount component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: singleJob,
      },
    })

    // Assert: Single job should be rendered
    expect(wrapper.text()).toContain('Senior Frontend Developer')
    expect(wrapper.text()).toContain('Tech Company A')

    // Assert: Should have blue border (index 0, even)
    const jobItem = wrapper.find('.border-l-4')
    expect(jobItem.classes()).toContain('border-blue-500')
  })

  // Test: Check job without tags
  it('should handle jobs without tags', async () => {
    // Arrange: Job data without tags
    const jobWithoutTags: WorkExperience[] = [
      {
        title: 'Test Position',
        company: 'Test Company',
        period: '2023',
        description: 'Test description without tags',
      },
    ]

    // Act: Mount component and expand
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: jobWithoutTags,
      },
    })

    const jobHeader = wrapper.find('.py-3')
    await jobHeader.trigger('click')

    // Assert: Description should be visible but no tags section
    expect(wrapper.text()).toContain('Test description without tags')

    // Assert: No tag elements should be present
    const tags = wrapper.findAll('.bg-blue-50')
    expect(tags).toHaveLength(0)
  })

  // Test: Check component structure and styling
  it('should have correct component structure and styling', () => {
    // Arrange & Act: Mount the component
    const wrapper = mount(ExperienceTimeline, {
      props: {
        workExperience: mockWorkExperience,
      },
    })

    // Assert: Check main container
    const mainContainer = wrapper.find('.space-y-4')
    expect(mainContainer.exists()).toBe(true)

    // Assert: Check job item structure
    const jobItems = wrapper.findAll('.border-l-4.pl-4.rounded-r-lg')
    expect(jobItems).toHaveLength(mockWorkExperience.length)

    // Assert: Check cursor pointer for clickable elements
    const clickableElements = wrapper.findAll('.cursor-pointer')
    expect(clickableElements).toHaveLength(mockWorkExperience.length)
  })
})
