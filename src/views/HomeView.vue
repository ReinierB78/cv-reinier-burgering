<template>
  <DefaultLayout>
    <!-- Sidebar Content -->
    <template #sidebar>
      <ProfileSidebar :profile-data="profileData" :tag-cloud="tagCloud" />
    </template>

    <!-- Main Content -->
    <template #main>
      <MainContent :tabs="tabs" :active-tab="effectiveActiveTab" :on-tab-change="handleTabChange">
        <!-- Frontend Tab -->
        <div v-if="effectiveActiveTab === 'frontend'" class="space-y-6">
          <SkillsProgress
            title="Frontend Development"
            :intro="t('skills.frontendIntro')"
            :skills="frontendSkills"
            progress-color="blue"
            title-size="medium"
            :auto-animate="false"
            ref="frontendSkillsRef"
          />
        </div>

        <!-- Backend Tab -->
        <div v-if="effectiveActiveTab === 'backend'" class="space-y-6">
          <SkillsProgress
            title="Backend Development"
            :intro="t('skills.backendIntro')"
            :skills="backendSkills"
            progress-color="green"
            title-size="medium"
            :auto-animate="false"
            ref="backendSkillsRef"
          />
        </div>

        <!-- Skills Tab -->
        <div v-if="effectiveActiveTab === 'skills'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
            {{ $t('sections.generalSkills') }}
          </h2>
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors">
                {{ $t('sections.technical') }}
              </h3>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li v-for="skill in technicalSkillsArray" :key="skill" class="flex items-center">
                  <span class="text-green-500 mr-2">✓</span>
                  <span class="text-gray-900 dark:text-gray-100 transition-colors">{{
                    skill
                  }}</span>
                </li>
              </ul>
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 transition-colors">
                {{ $t('sections.softSkills') }}
              </h3>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li v-for="skill in softSkillsArray" :key="skill" class="flex items-center">
                  <span class="text-blue-500 mr-2">✓</span>
                  <span class="text-gray-900 dark:text-gray-100 transition-colors">{{
                    skill
                  }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Joke Display - Demonstration of Pinia Store + Service Pattern -->
          <div class="mt-8">
            <h3
              class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center transition-colors"
            >
              <span class="mr-2">🛠️</span>
              <span class="text-gray-900 dark:text-gray-100 transition-colors">
                {{ $t('demo.title') }}
              </span>
            </h3>
            <JokeDisplay />
            <div
              class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 transition-colors"
            >
              <p class="text-sm text-blue-700 dark:text-blue-300 transition-colors">
                <span class="font-medium">🎯 {{ $t('demo.features') }}</span>
                {{ $t('demo.description') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Day Circle Tab -->
        <div v-if="effectiveActiveTab === 'day'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">
            {{ $t('sections.workLifeBalance') }}
          </h2>
          <div class="flex justify-center">
            <DayCircle />
          </div>
        </div>

        <!-- Experience Tab -->
        <div v-if="effectiveActiveTab === 'experience'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {{ $t('sections.workExperience') }}
          </h2>
          <ExperienceTimeline :work-experience="workExperience" />
        </div>

        <!-- Education Tab -->
        <div v-if="effectiveActiveTab === 'education'" class="space-y-6">
          <EducationSection
            :education-list="educationList"
            :development-moments="developmentMoments"
          />
        </div>
      </MainContent>
    </template>

    <!-- Mobile Bottom Navigation -->
    <template #bottom-nav>
      <MobileBottomNav
        :tabs="tabs"
        :active-tab="effectiveActiveTab"
        :on-tab-change="handleTabChange"
      />
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import type { Education, ProfileData, Skill, Tab, WorkExperience } from '@/types'
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import DayCircle from '../components/DayCircle.vue'
import EducationSection from '../components/EducationSection.vue'
import ExperienceTimeline from '../components/ExperienceTimeline.vue'
import JokeDisplay from '../components/JokeDisplay.vue'
import MainContent from '../components/MainContent.vue'
import MobileBottomNav from '../components/MobileBottomNav.vue'
import ProfileSidebar from '../components/ProfileSidebar.vue'
import SkillsProgress from '../components/SkillsProgress.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
// Heroicons imports
import { useSidebar } from '@/composables/useSidebar'
import {
  AcademicCapIcon,
  ChartBarIcon,
  CogIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

// Skills data met progress bars
const frontendSkills: Skill[] = [
  { name: 'Vue', level: 95 },
  { name: 'Nuxt', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'JavaScript', level: 95 },
  { name: 'Tailwind / Bootstrap / Foundation', level: 90 },
  { name: 'HTML/CSS/JavaScript/jQuery', level: 100 },
  { name: 'React, React Native', level: 75 },
  { name: 'Pinia / Vuex', level: 90 },
  { name: 'Composition API', level: 95 },
  { name: 'Component-based architecture', level: 95 },
  { name: 'Responsive Design (Flexbox, Grid)', level: 90 },
  { name: 'SCSS, LESS, BEM, etc.', level: 95 },
  { name: 'API Integratie (REST / Axios / Devour.js)', level: 90 },
  { name: 'Vitest / Jest / Teststrategie', level: 75 },
  { name: 'Vite / Webpack / Tooling', level: 85 },
  { name: 'Accessibility (WCAG basics)', level: 85 },
]

const backendSkills: Skill[] = [
  { name: 'Laravel', level: 80 },
  { name: 'PHP', level: 85 },
  { name: 'WordPress Custom', level: 95 },
  { name: 'WP Plugins', level: 90 },
  { name: 'REST API Development', level: 85 },
  { name: 'Headless CMS (WordPress)', level: 90 },
  { name: 'MySQL / DBNGIN', level: 80 },
  { name: 'Authentication flows (JWT / OAuth)', level: 75 },
  { name: 'CI/CD Pipelines (e.g. GitHub Actions)', level: 70 },
  { name: 'Local dev environments (Valet)', level: 85 },
  { name: 'Error handling & debugging', level: 80 },
  { name: 'API-first data architecture', level: 75 },
]

const tagCloud: string[] = [
  'Sociaal',
  'Creatief',
  'Inventief',
  'Communicatief',
  'Zelfstandig',
  'Teamspeler',
  'Projectmatig',
  'Operationeel',
]

const workExperience: WorkExperience[] = [
  {
    title: 'Fullstack Webdeveloper',
    company: 'GroupCard',
    period: 'September 2022 - heden',
    description:
      'Uitvoeren van diverse Webdevelopment taken en projecten op zowel front- als backend. Onderhoud 45+ Wordpress websites, opzetten en doorontwikkelen maatwerk plugins (PHP). Onderhouden Headless Vue/Nuxt2 platform voor onboarding partners en burgers. Bijdrage ontwikkeling Laravel platform (e-commerce).',
    tags: [
      'PHP',
      'Laravel',
      'Vue3/Nuxt3',
      'WordPress',
      'API',
      'JavaScript',
      'OOP',
      'MVC',
      'GIT',
      'Jira',
    ],
  },
  {
    title: 'Webdeveloper',
    company: 'Activate your Business',
    period: '1-9-2020 - augustus 2022',
    description:
      'Uitvoeren van diverse Webdeveloper werkzaamheden voor diverse opdrachtgevers. Werkend met WordPress en opzetten van maatwerk templates en plugins. Werkend met Laravel waarbij bijgedragen aan ontwikkeling maatwerk CMS, webshopsysteem.',
    tags: ['PHP', 'Laravel', 'JavaScript', 'OOP', 'MVC', 'GIT', 'WordPress'],
  },
  {
    title: 'Zelfstandig ondernemer ZZP',
    company: 'Burgeoning Development',
    period: '1-4-2017 - heden',
    description:
      'Uitvoeren van diverse Front End / Webdeveloper werkzaamheden voor diverse opdrachtgevers. Eigen acquisitie, eigen begeleiding, eigen beheer. Ontwikkeling, beheer en consultancy.',
    tags: ['Zelfstandig', 'Acquisitie', 'Consultancy', 'Projectmanagement'],
  },
  {
    title: 'Webdeveloper (ZZP)',
    company: 'eResults, We are Bold, Ditis.ABC, New Fountain',
    period: '2015 - 2019',
    description:
      'Uitvoeren van diverse Front End / Webdeveloper werkzaamheden voor toegekende opdrachtgevers, gebaseerd op WordPress CMS.',
    tags: ['HTML', 'CSS', 'WordPress', 'Bootstrap', 'PHP', 'MySQL'],
  },
  {
    title: 'Project-/Accountmanager',
    company: 'Diverse bedrijven',
    period: '2005 - 2015',
    description:
      'Ervaring in project- en accountmanagement bij verschillende bedrijven waaronder EDM Media B.V., Terra Preta B.V., Keystone Consultancy en Prospex B.V. Verantwoordelijk voor B2C wervingscampagnes, direct marketing en klantbegeleiding.',
    tags: ['Projectmanagement', 'Accountmanagement', 'Direct Marketing', 'B2C', 'Klantbegeleiding'],
  },
]

const educationList: Education[] = []

const developmentMoments: Education[] = [
  {
    title: 'WCAG optimalisaties inwissel platform',
    institution: 'GroupCard',
    period: '2025',
    description:
      'Verbeteren van toegankelijkheid en gebruiksvriendelijkheid van het inwissel platform. Focus op WCAG 2.1 richtlijnen, inclusief toetsenbord navigatie, schermlezer ondersteuning en visuele contrasten.',
    tags: ['PHP', 'Laravel', 'JavaScript', 'OOP', 'MVC', 'GIT', 'WordPress'],
  },
  {
    title: 'Refactor van Nuxt 2 naar Nuxt 3',
    institution: 'GroupCard',
    period: '2024 - 2025',
    description:
      'Gefaseerde refactor van bestaande Nuxt 2 applicaties naar Nuxt 3. Focus op verbeterde prestaties, effectiever developen en herbruikbaarheid van componenten.\n\nNuxt 2 project bestond uit Nuxt Property Decorator en Vuex, waar company standard meer om Pinia, Composition API en ook Tailwind draaide.',
    tags: ['JavaScript', 'Nuxt 3', 'Vue 3', 'Tailwind CSS', 'TypeScript'],
  },
  {
    title: 'Label vertaling app voor inwissel platform',
    institution: 'GroupCard',
    period: '2024 - 2025',
    description:
      'Ontwikkeling van een label vertaling app voor het inwissel platform (op basis van Vue3, Tailwind en Laravel API). Hierbij kan de tenant zelf labels vertalen en beheren. Dit verbetert de gebruikerservaring en maakt het platform toegankelijker voor verschillende taalgebieden.',
    tags: ['JavaScript', 'Nuxt 3', 'Vue 3', 'Tailwind CSS', 'TypeScript'],
  },
  {
    title: 'Custom WordPress Plugin Ontwikkeling',
    institution: 'GroupCard',
    period: '2023 - 2025',
    description:
      'Gecentraliseerde ontwikkeling van maatwerk WordPress plugins voor verschillende projecten. Focus op herbruikbaarheid, performance en integratie met bestaande systemen. Maar ook het centraal bijhouden waardoor ontwikkelingen op plugins van een centraal punt kunnen worden uitgerold over 40+ Wordpress sites.',
    tags: ['PHP', 'WordPress', 'Plugin Development', 'JavaScript', 'OOP', 'GIT'],
  },
  {
    title: 'App ontwikkeling met Laravel en Vue / Inertia',
    institution: 'GroupCard',
    period: '2022 - 2023',
    description:
      'Multi tenant app ontwikkeling met Laravel en Vue / Inertia. Focus op schaalbaarheid, performance en gebruikerservaring. Betrof een doorontwikkeling van een bestaand Laravel platform naar een multi-tenant architectuur met Vue / Inertia frontend en Tailwind configuratie.',
    tags: ['Laravel', 'Inertia', 'Vue 3', 'Tailwind CSS', 'TypeScript'],
  },
  {
    title: 'Headless corporate website obv Nuxt 3 en WordPress REST API',
    institution: 'GroupCard',
    period: '2021 - 2022',
    description:
      'Opzetten van een headless corporate website met Nuxt 3 en WordPress REST API. Focus op performance, SEO en gebruikerservaring. Nauwe samenwerking met design en Marketingafdeling. Tevens Mailchimp integratie voor nieuwsbrief en whitepapers als ook Google Analytics.',
    tags: ['Nuxt 3', 'WordPress REST API', 'SEO', 'JavaScript', 'Tailwind CSS'],
  },
  {
    title: 'Verkoopmodule voor maatwerk naamplaten en stickers',
    institution: 'Activate your Business',
    period: '2021 - 2022',
    description:
      'Voor een specifieke opdrachtgevers een verkoopmodule opgezet waarbij maatwerk naamplaten en stickers besteld kunnen worden. Hierbij is gebruik gemaakt van WooCommerce en een op maat gemaakt product configurator, met daar bovenop de eigen maatwerk inbreng.',
    tags: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', 'OOP', 'GIT'],
  },
  {
    title: 'Refactor Webshop op basis van Laravel en Vue',
    institution: 'Activate your Business',
    period: '2020 - 2022',
    description:
      'Refactor van een bestaande webshop naar een nieuwe Laravel en Vue architectuur. Focus op verbeterde prestaties, maar ook multi tenant en vernieuwde Bootstrap 5 ipv losse css.',
    tags: ['Laravel', 'Vue 3', 'Bootstrap 5', 'Tailwind CSS', 'TypeScript'],
  },
  {
    title: 'Parent - Child theme Wordpress',
    institution: 'Activate your Business',
    period: '2020 - 2022',
    description:
      'Voor een divers aantal opdrachtgevers een parent - child theme structuur opgezet. Dit om de snelheid van opleveren en ontwikkelen te verhogen en de onderhoudbaarheid van de websites te verbeteren. Tevens de mogelijkheid om continue learnings m.b.t. bijvoorbeeld SEO centraal door te voeren en over alle sites uit te rollen.',
    tags: ['WordPress', 'PHP', 'JavaScript', 'jQuery', 'OOP', 'GIT'],
  },
  {
    title: 'Overgang naar moderne web development',
    institution: 'Diverse bedrijven',
    period: '2017 - 2020',
    description:
      'Transitie van traditionele web development naar moderne frameworks en tools. Focus op component-based architectuur, state management en API-driven development.',
    tags: ['Vue.js', 'React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'GIT'],
  },
]

// Actieve tab state - responsive initialisatie
const activeTab = ref<string | null>(null)
const isDesktop = ref(false)
const frontendSkillsRef = ref()
const backendSkillsRef = ref()

// Composables
const { t } = useI18n()
const { isSidebarOpen, closeSidebar, setOnSidebarClosed } = useSidebar()

// Computed active tab - responsive logica voor desktop vs mobile
const effectiveActiveTab = computed(() => {
  if (isDesktop.value) {
    // Desktop: altijd een actieve tab tonen, fallback naar 'frontend' als nog geen tab actief
    return activeTab.value || 'frontend'
  } else {
    // Mobile: alleen actieve tab tonen als sidebar gesloten is
    if (isSidebarOpen.value) {
      return null
    }
    return activeTab.value
  }
})

// Skills arrays - direct als fallback terwijl we i18n debuggen
const technicalSkillsArray = computed(() => [
  'Responsive Design',
  'Component-based development (herbruikbare code)',
  'Composition API (Vue 3)',
  'State Management (Pinia, Vuex)',
  'Dependency Injection & Service Layer Pattern',
  'API integratie (REST)',
  'API ontwikkeling (PHP / WordPress)',
  'Typescript (strict mode, typesafety)',
  'Testing (Vitest, TDD-mindset)',
  'Tooling (Vite, CI/CD, Git, Valet)',
  'Mobile development (React Native - in ontwikkeling)',
])

const softSkillsArray = computed(() => [
  'Teamplayer met eigen verantwoordelijkheid',
  'Heldere communicatie (ook met niet-techneuten)',
  'Analytisch & oplossingsgericht',
  'Proactief in kennisdeling',
  'Ervaring met Agile / Scrum',
  'Positieve impact willen maken (zowel in code als cultuur)',
  'Snelle onboarding in bestaande projecten',
  'Mentorship & begeleiding bij migraties',
])

// Tab opties - reactief met i18n
const tabs = computed((): Tab[] => [
  {
    id: 'frontend',
    name: t('nav.frontend'),
    label: t('nav.frontend'),
    icon: ComputerDesktopIcon,
    href: '#',
    current: false,
  },
  {
    id: 'backend',
    name: t('nav.backend'),
    label: t('nav.backend'),
    icon: CogIcon,
    href: '#',
    current: false,
  },
  {
    id: 'skills',
    name: t('nav.skills'),
    label: t('nav.skills'),
    icon: WrenchScrewdriverIcon,
    href: '#',
    current: false,
  },
  {
    id: 'experience',
    name: t('nav.experience'),
    label: t('nav.experience'),
    icon: ChartBarIcon,
    href: '#',
    current: false,
  },
  {
    id: 'education',
    name: t('nav.education'),
    label: t('nav.education'),
    icon: AcademicCapIcon,
    href: '#',
    current: false,
  },
])

// CV Data - ook reactief maken
const profileData = computed(
  (): ProfileData => ({
    name: 'Reinier Burgering',
    title: 'Full Stack Developer',
    photo: '/img/reinier_profile_pic.jpeg',
    details: {
      Geboortedatum: '07-07-1978',
      Telefoon: '+31 6 505 26 727',
      Email: 'reinierburgering@gmail.com',
      Locatie: 'Nederland',
    },
    about: t('profile.about'),
  })
)

// Animatie functies
function handleTabChange(tabId: string) {
  // Sluit de sidebar als deze open is (op mobiel)
  if (isSidebarOpen.value) {
    closeSidebar()
  }

  activeTab.value = tabId

  // Trigger animatie voor skills tabs via component refs
  setTimeout(() => {
    if (tabId === 'frontend' && frontendSkillsRef.value) {
      frontendSkillsRef.value.animateProgressBars()
    } else if (tabId === 'backend' && backendSkillsRef.value) {
      backendSkillsRef.value.animateProgressBars()
    }
  }, 100)
}

// Initiële animatie bij component mount
onMounted(() => {
  // Screen size detectie
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 768 // md breakpoint

    // Luister naar resize events
    const handleResize = () => {
      isDesktop.value = window.innerWidth >= 768
    }
    window.addEventListener('resize', handleResize)

    // Cleanup op unmount
    nextTick(() => {
      const currentInstance = getCurrentInstance()
      if (currentInstance) {
        onBeforeUnmount(() => {
          window.removeEventListener('resize', handleResize)
          // Clear the sidebar callback on unmount
          setOnSidebarClosed(null)
        })
      }
    })
  }

  // Stel callback in voor wanneer sidebar wordt gesloten op mobiel
  setOnSidebarClosed(() => {
    // Alleen op mobiel: zet eerste tab actief als er nog geen actieve tab is
    if (!isDesktop.value && !activeTab.value) {
      activeTab.value = 'frontend'

      // Start animatie voor frontend tab
      nextTick(() => {
        setTimeout(() => {
          if (frontendSkillsRef.value) {
            frontendSkillsRef.value.animateProgressBars()
          }
        }, 200)
      })
    }
  })

  if (isDesktop.value) {
    // Desktop: altijd frontend tab actief bij load
    activeTab.value = 'frontend'

    // Start animatie voor frontend tab
    nextTick(() => {
      setTimeout(() => {
        if (frontendSkillsRef.value) {
          frontendSkillsRef.value.animateProgressBars()
        }
      }, 200)
    })
  }
  // Mobile: activeTab blijft null, sidebar overlay is zichtbaar
})
</script>
