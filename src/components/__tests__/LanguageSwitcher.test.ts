import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Ref } from 'vue'
import { createI18n } from 'vue-i18n'
import LanguageSwitcher from '../LanguageSwitcher.vue'

// Mock translations
const messages = {
  nl: { test: 'Test NL' },
  en: { test: 'Test EN' },
}

describe('LanguageSwitcher', () => {
  let i18n: ReturnType<typeof createI18n>

  beforeEach(() => {
    i18n = createI18n({
      legacy: false,
      locale: 'nl',
      fallbackLocale: 'en',
      messages,
    })
  })

  it('renders without errors', () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('shows current language flag and name', () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n],
      },
    })

    // Should show Dutch flag and name initially
    expect(wrapper.text()).toContain('🇳🇱')
    expect(wrapper.text()).toContain('Nederlands')
  })

  it('toggles dropdown on button click', async () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n],
      },
    })

    const button = wrapper.find('button')
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)

    await button.trigger('click')
    expect(wrapper.find('[role="menu"]').exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
  })

  it('changes language when option is clicked', async () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n],
      },
    })

    // Open dropdown
    await wrapper.find('button').trigger('click')

    // Find and click English option
    const englishOption = wrapper.find('[role="menuitem"]:last-child')
    await englishOption.trigger('click')

    // Language should change to English
    expect((i18n.global.locale as Ref<string>).value).toBe('en')

    // Dropdown should close
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
  })

  it('shows correct icons for each language', async () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n],
      },
    })

    // Open dropdown
    await wrapper.find('button').trigger('click')

    const menuItems = wrapper.findAll('[role="menuitem"]')
    expect(menuItems[0].text()).toContain('🇳🇱')
    expect(menuItems[0].text()).toContain('Nederlands')
    expect(menuItems[1].text()).toContain('🇬🇧')
    expect(menuItems[1].text()).toContain('English')
  })

  it('renders menu items correctly', async () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n],
      },
    })

    // Open dropdown
    await wrapper.find('button').trigger('click')

    // Should have 2 menu items (Dutch and English)
    const menuItems = wrapper.findAll('[role="menuitem"]')
    expect(menuItems.length).toBe(2)
  })
})
