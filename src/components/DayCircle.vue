<template>
  <div class="flex flex-col items-center space-y-6">
    <h3 class="text-xl font-semibold text-gray-900">Mijn Ideale Dag</h3>

    <!-- Cirkel diagram -->
    <div class="relative w-80 h-80 p-4">
      <!-- SVG cirkel -->
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <!-- Shadow/Glow effect voor actieve segment -->
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Achtergrond cirkel -->
        <circle cx="60" cy="60" r="40" fill="none" stroke="#f3f4f6" stroke-width="18" />

        <!-- Invisibele hover zones per segment -->
        <g v-for="(activity, index) in activities" :key="`hover-${index}`">
          <path
            :d="getSegmentPath(activity.hours, index)"
            fill="transparent"
            stroke="transparent"
            stroke-width="25"
            class="cursor-pointer"
            @mouseenter="setActiveActivity(index)"
            @mouseleave="setActiveActivity(null)"
          />
        </g>

        <!-- Dagdelen segmenten -->
        <circle
          v-for="(activity, index) in activities"
          :key="index"
          cx="60"
          cy="60"
          r="40"
          fill="none"
          :stroke="activity.color"
          :stroke-width="activeActivity === index ? '22' : '18'"
          :stroke-dasharray="getDashArray(activity.hours)"
          :stroke-dashoffset="getDashOffset(index)"
          :opacity="activeActivity === null ? 1 : activeActivity === index ? 1 : 0.6"
          :filter="activeActivity === index ? 'url(#glow)' : 'none'"
          class="transition-all duration-300 pointer-events-none"
        />
      </svg>

      <!-- Centrum content -->
      <div class="absolute inset-4 flex items-center justify-center">
        <div class="text-center transition-all duration-300">
          <div
            class="text-3xl mb-2 transition-transform duration-300"
            :class="{ 'transform scale-110': activeActivity !== null }"
          >
            {{ activeActivity !== null ? activities[activeActivity].icon : '🌅' }}
          </div>
          <div class="text-sm font-medium text-gray-700">
            {{ activeActivity !== null ? activities[activeActivity].name : '24 uur' }}
          </div>
          <div v-if="activeActivity !== null" class="text-xs text-gray-500 mt-1">
            {{ activities[activeActivity].time }} •
            {{ formatDuration(activities[activeActivity].hours) }}
          </div>
          <div v-if="activeActivity !== null" class="text-xs text-blue-500 mt-1 font-medium">
            {{ getActivityPercentage(activities[activeActivity].hours) }} van de dag
          </div>
          <div v-if="activeActivity !== null" class="text-xs text-gray-400 mt-1 italic max-w-32">
            {{ activities[activeActivity].description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Legenda -->
    <div class="grid grid-cols-2 gap-3 text-sm max-w-md">
      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-50"
        @mouseenter="setActiveActivity(index)"
        @mouseleave="setActiveActivity(null)"
        :class="{ 'bg-gray-100': activeActivity === index }"
      >
        <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: activity.color }"></div>
        <div class="flex-1">
          <div class="font-medium text-gray-900 flex items-center">
            <span class="mr-1">{{ activity.icon }}</span>
            {{ activity.name }}
          </div>
          <div class="text-xs text-gray-500 flex justify-between">
            <span>{{ activity.time }}</span>
            <span class="font-medium">{{ getActivityPercentage(activity.hours) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fun fact -->
    <div class="bg-blue-50 p-4 rounded-lg max-w-md text-center">
      <p class="text-sm text-blue-700">
        <span class="font-semibold">Fun fact:</span>
        33% van mijn dag gaat naar coderen & development, 21% naar slapen en 13% naar familie tijd!
        🎯
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DayActivity {
  name: string
  icon: string
  hours: number
  time: string
  color: string
  description: string
}

const activeActivity = ref<number | null>(null)

const activities: DayActivity[] = [
  {
    name: 'Opstaan & Ontbijt',
    icon: '☀️',
    hours: 1,
    time: '07:00 - 08:00',
    color: '#fbbf24', // yellow-400
    description: 'Rustig beginnen met koffie en plannen voor de dag',
  },
  {
    name: 'Reizen naar werk',
    icon: '🚗',
    hours: 1,
    time: '08:00 - 09:00',
    color: '#60a5fa', // blue-400
    description: 'Onderweg luisteren naar podcasts of muziek',
  },
  {
    name: 'Stand-up & Planning',
    icon: '👥',
    hours: 1,
    time: '09:00 - 10:00',
    color: '#34d399', // emerald-400
    description: 'Team sync en dagplanning bespreken',
  },
  {
    name: 'Coderen & Development',
    icon: '💻',
    hours: 8,
    time: '10:00 - 18:00',
    color: '#8b5cf6', // violet-400
    description: 'In de flow met Vue.js, Laravel en nieuwe features',
  },
  {
    name: 'Thuisreis & Gezin',
    icon: '🏠',
    hours: 3,
    time: '18:00 - 21:00',
    color: '#f87171', // red-400
    description: 'Samen eten, verhalen delen en quality time',
  },
  {
    name: 'Sporten',
    icon: '🏃‍♂️',
    hours: 1,
    time: '21:00 - 22:00',
    color: '#fb923c', // orange-400
    description: 'Hardlopen of fitness voor balans',
  },
  {
    name: 'Ontspannen',
    icon: '📚',
    hours: 2,
    time: '22:00 - 24:00',
    color: '#a78bfa', // purple-400
    description: 'Lezen, series of even bijpraten',
  },
  {
    name: 'Slapen',
    icon: '😴',
    hours: 7,
    time: '00:00 - 07:00',
    color: '#6366f1', // indigo-400
    description: 'Herstel en energie tanken voor morgen',
  },
]

function setActiveActivity(index: number | null) {
  console.log('Setting active activity:', index)
  activeActivity.value = index
}

function getDashArray(hours: number): string {
  const circumference = 2 * Math.PI * 40 // r=40
  const percentage = hours / 24
  const dashLength = circumference * percentage
  const gapLength = circumference - dashLength
  return `${dashLength} ${gapLength}`
}

function getDashOffset(index: number): number {
  const circumference = 2 * Math.PI * 40
  let offset = 0

  for (let i = 0; i < index; i++) {
    offset += (activities[i].hours / 24) * circumference
  }

  return -offset
}

function getSegmentPath(hours: number, index: number): string {
  const centerX = 60
  const centerY = 60
  const radius = 40

  // Calculate start and end angles for this segment
  let startAngle = 0
  for (let i = 0; i < index; i++) {
    startAngle += (activities[i].hours / 24) * 360
  }
  const endAngle = startAngle + (hours / 24) * 360

  // Convert to radians
  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180

  // Calculate coordinates
  const x1 = centerX + radius * Math.cos(startRad)
  const y1 = centerY + radius * Math.sin(startRad)
  const x2 = centerX + radius * Math.cos(endRad)
  const y2 = centerY + radius * Math.sin(endRad)

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

// Additional helper functions
function getTotalHours(): number {
  return activities.reduce((total, activity) => total + activity.hours, 0)
}

function getActivityPercentage(hours: number): string {
  const total = getTotalHours()
  const percentage = (hours / total) * 100
  return `${Math.round(percentage)}%`
}

function getLargestActivity(): DayActivity | null {
  if (activities.length === 0) return null
  return activities.reduce((largest, current) =>
    current.hours > largest.hours ? current : largest
  )
}

function getSmallestActivity(): DayActivity | null {
  if (activities.length === 0) return null
  return activities.reduce((smallest, current) =>
    current.hours < smallest.hours ? current : smallest
  )
}

function formatDuration(hours: number): string {
  if (hours === 1) return '1 uur'
  return `${hours} uur`
}

function getTimeCategory(time: string): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = parseInt(time.split(':')[0])
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

// Expose useful functions
defineExpose({
  setActiveActivity,
  getTotalHours,
  getActivityPercentage,
  getLargestActivity,
  getSmallestActivity,
  formatDuration,
  getTimeCategory,
})
</script>
