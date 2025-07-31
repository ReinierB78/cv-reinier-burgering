import { ref } from 'vue'

// Global sidebar state - shared across all components
const isSidebarOpen = ref(true) // Open by default for mobile profile view
const userHasInteracted = ref(false)

// Callback for when sidebar is closed (for setting active tab on mobile)
let onSidebarClosed: (() => void) | null = null

export function useSidebar() {
  const toggleSidebar = () => {
    userHasInteracted.value = true
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    userHasInteracted.value = true
    isSidebarOpen.value = false

    // Trigger callback if set (for mobile tab activation)
    if (onSidebarClosed) {
      onSidebarClosed()
    }
  }

  const openSidebar = () => {
    userHasInteracted.value = true
    isSidebarOpen.value = true
  }

  const setOnSidebarClosed = (callback: (() => void) | null) => {
    onSidebarClosed = callback
  }

  return {
    isSidebarOpen,
    userHasInteracted,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    setOnSidebarClosed,
  }
}
