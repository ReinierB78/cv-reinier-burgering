<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Sidebar (25%) - Sticky -->
    <aside class="w-1/4 bg-white shadow-lg p-6 sticky top-0 h-screen overflow-y-auto">
      <slot name="sidebar" />
    </aside>

    <!-- Right Main Content Area (75%) - Scrollable -->
    <main class="w-3/4 p-6 overflow-y-auto">
      <slot name="main" />
    </main>
  </div>
</template>

<script setup lang="ts">
// Default layout component voor de applicatie
// Biedt een 25/75 layout met sidebar en main content area
</script>
