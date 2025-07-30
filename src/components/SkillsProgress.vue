<template>
  <div class="space-y-6">
    <h2 :class="titleClass" class="text-gray-900 dark:text-gray-100">{{ title }}</h2>
    <p v-if="intro" class="text-gray-700 dark:text-gray-300">{{ intro }}</p>
    <div class="grid gap-4">
      <div v-for="skill in animatedSkills" :key="skill.name" class="space-y-2">
        <div class="flex justify-between">
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ skill.name }}</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ skill.level }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="progressBarClass"
            class="h-2 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${skill.animatedLevel}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnimatedSkill, Skill } from '@/types'
import { computed, onMounted, ref, watch } from 'vue'

interface Props {
  title: string
  intro?: string
  skills: Skill[]
  progressColor?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo'
  titleSize?: 'small' | 'medium' | 'large' | 'extra-large'
  autoAnimate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  progressColor: 'blue',
  titleSize: 'medium',
  autoAnimate: true,
})

// Reactive data
const animatedSkills = ref<AnimatedSkill[]>(
  props.skills.map(skill => ({ ...skill, animatedLevel: 0 }))
)

// Computed classes
const titleClass = computed(() => {
  const sizeClasses = {
    small: 'text-lg font-semibold  mb-3',
    medium: 'text-2xl font-bold  mb-4',
    large: 'text-3xl font-bold  mb-4',
    'extra-large': 'text-6xl font-light text-gray-500 mb-4',
  }
  return sizeClasses[props.titleSize]
})

const progressBarClass = computed(() => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500',
  }
  return colorClasses[props.progressColor]
})

// Animation function
function animateProgressBars() {
  // Reset all bars to 0
  animatedSkills.value.forEach(skill => {
    skill.animatedLevel = 0
  })

  // Staggered animation - each bar starts 150ms later
  props.skills.forEach((skill, index) => {
    setTimeout(() => {
      animatedSkills.value[index].animatedLevel = skill.level
    }, index * 150)
  })
}

// Auto-animate on mount if enabled
onMounted(() => {
  if (props.autoAnimate) {
    animateProgressBars()
  }
})

// Watch for skill changes and re-animate
watch(
  () => props.skills,
  () => {
    animatedSkills.value = props.skills.map(skill => ({ ...skill, animatedLevel: 0 }))
    if (props.autoAnimate) {
      setTimeout(() => animateProgressBars(), 100)
    }
  },
  { deep: true }
)

// Expose animate function for manual control
defineExpose({
  animateProgressBars,
})
</script>
