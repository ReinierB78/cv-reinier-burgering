<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Mobi<script setup lang="ts">
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import SourceCodeLink from '@/components/SourceCodeLink.vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'eader with hamburger menu -->
    <header class="md:hidden bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div class="flex items-center justify-between p-4">
        <!-- Logo/Title -->
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">CV</h1>

        <!-- Mobile controls -->
        <div class="flex items-center space-x-3">
          <!-- Theme Switcher -->
          <ThemeSwitcher />

          <!-- Hamburger Menu Button -->
          <button
            @click="toggleSidebar"
            class="p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
            style="font-size: 16px; min-height: 44px; min-width: 44px"
            :aria-expanded="isSidebarOpen"
            aria-label="Toggle navigation menu"
          >
            <UserCircleIcon v-if="!isSidebarOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Desktop Theme Switcher (top-right) -->
    <div class="hidden md:block fixed top-4 right-4 z-50">
      <ThemeSwitcher />
    </div>

    <!-- Source Code Link -->
    <SourceCodeLink />

    <!-- Mobile Sidebar Overlay with backdrop blur - only show when user explicitly opens sidebar -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 backdrop-blur-none"
      enter-to-class="opacity-100 backdrop-blur-sm"
      leave-active-class="transition-all duration-250"
      leave-from-class="opacity-100 backdrop-blur-sm"
      leave-to-class="opacity-0 backdrop-blur-none"
    >
      <div
        v-if="isSidebarOpen && userHasInteracted"
        class="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
        @click="closeSidebar"
      />
    </Transition>

    <!-- Main Container -->
    <div class="flex max-w-7xl mx-auto">
      <!-- Desktop Sidebar -->
      <aside
        class="hidden md:block md:w-1/4 bg-white dark:bg-gray-800 shadow-lg p-6 sticky top-0 h-screen overflow-y-auto transition-colors duration-300"
      >
        <slot name="sidebar" />
      </aside>

      <!-- Mobile Sidebar - Bottom slide-up (Bottom Sheet) -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition-all duration-250 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
      >
        <aside
          v-if="isSidebarOpen"
          class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl rounded-t-3xl z-30 max-h-[calc(100vh-4rem)] overflow-hidden border-t border-gray-200 dark:border-gray-700"
          :class="{ 'transition-none': isDragging }"
          :style="sidebarTransform"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Drag handle with better visual feedback -->
          <div
            class="flex justify-center py-4 bg-gray-50/80 dark:bg-gray-700/80 rounded-t-3xl cursor-pointer touch-none"
          >
            <div
              class="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded-full transition-all duration-200 hover:bg-gray-400 dark:hover:bg-gray-500"
              :class="{ 'bg-gray-400 dark:bg-gray-500 scale-110': isDragging }"
            ></div>
          </div>

          <!-- Sidebar content with smooth scrolling - max height to leave space for bottom nav -->
          <div class="p-6 overflow-y-auto max-h-[calc(100vh-8rem)] overscroll-contain">
            <slot name="sidebar" />
          </div>
        </aside>
      </Transition>

      <!-- Main Content Area -->
      <main class="flex-1 min-h-screen flex flex-col">
        <!-- Content -->
        <div class="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <slot name="main" />
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="md:hidden">
          <slot name="bottom-nav" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { UserCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

// Mobile sidebar state - open by default on mobile for initial profile view
const isSidebarOpen = ref(true)
const isDragging = ref(false)
const dragOffset = ref(0)
const userHasInteracted = ref(false) // Track if user has manually toggled sidebar

// Touch gesture state for swipe-to-close
let touchStartY = 0
let touchCurrentY = 0

// Computed style for smooth drag feedback
const sidebarTransform = computed(() => {
  if (isDragging.value && dragOffset.value > 0) {
    const clampedOffset = Math.min(dragOffset.value, 150) // Max drag distance
    return `transform: translateY(${clampedOffset}px)`
  }
  return ''
})

// Mobile sidebar controls
const toggleSidebar = () => {
  userHasInteracted.value = true // Mark that user has interacted
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  userHasInteracted.value = true // Mark that user has interacted
  isSidebarOpen.value = false
  dragOffset.value = 0
  isDragging.value = false
}

// Enhanced touch handlers for swipe-to-close functionality
const handleTouchStart = (event: TouchEvent) => {
  touchStartY = event.touches[0].clientY
  touchCurrentY = touchStartY
  isDragging.value = false
  dragOffset.value = 0
}

const handleTouchMove = (event: TouchEvent) => {
  touchCurrentY = event.touches[0].clientY
  const deltaY = touchCurrentY - touchStartY

  // Only allow downward swipes (closing)
  if (deltaY > 0) {
    isDragging.value = true
    dragOffset.value = deltaY

    // Prevent default scrolling when dragging
    if (deltaY > 10) {
      event.preventDefault()
    }
  }
}

const handleTouchEnd = () => {
  const deltaY = touchCurrentY - touchStartY

  isDragging.value = false
  dragOffset.value = 0

  // Close if swiped down more than 80px or with sufficient velocity
  if (deltaY > 80) {
    closeSidebar()
  }
}

// Close sidebar when screen becomes desktop size
// This would need to be handled with a resize listener if needed
</script>
