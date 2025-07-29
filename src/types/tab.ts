import type { Component } from 'vue'

export interface Tab {
  id: string
  name: string
  label: string
  icon: string | Component
  href: string
  current: boolean
}
