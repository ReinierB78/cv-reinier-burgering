<template>
  <DefaultLayout>
    <!-- Sidebar Content -->
    <template #sidebar>
      <ProfileSidebar :profile-data="profileData" :tag-cloud="tagCloud" />
    </template>

    <!-- Main Content -->
    <template #main>
      <MainContent :tabs="tabs" :active-tab="activeTab" :on-tab-change="handleTabChange">
        <!-- Frontend Tab -->
        <div v-if="activeTab === 'frontend'" class="space-y-6">
          <SkillsProgress
            title="Frontend Development"
            :skills="frontendSkills"
            progress-color="blue"
            title-size="medium"
            :auto-animate="false"
            ref="frontendSkillsRef"
          />
        </div>

        <!-- Backend Tab -->
        <div v-if="activeTab === 'backend'" class="space-y-6">
          <SkillsProgress
            title="Backend Development"
            :skills="backendSkills"
            progress-color="green"
            title-size="extra-large"
            :auto-animate="false"
            ref="backendSkillsRef"
          />
        </div>

        <!-- Skills Tab -->
        <div v-if="activeTab === 'skills'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Algemene Vaardigheden</h2>
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-gray-800">Technisch</h3>
              <ul class="space-y-2 text-sm text-gray-700">
                <li v-for="skill in technicalSkillsList" :key="skill" class="flex items-center">
                  <span class="text-green-500 mr-2">✓</span>{{ skill }}
                </li>
              </ul>
            </div>
            <div class="space-y-3">
              <h3 class="text-lg font-semibold text-gray-800">Soft Skills</h3>
              <ul class="space-y-2 text-sm text-gray-700">
                <li v-for="skill in softSkillsList" :key="skill" class="flex items-center">
                  <span class="text-blue-500 mr-2">✓</span>{{ skill }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Joke Display - Demonstration of Pinia Store + Service Pattern -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span class="mr-2">🛠️</span>
              Technical Demo: Pinia Store + Service Pattern
            </h3>
            <JokeDisplay />
            <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-sm text-blue-700">
                <span class="font-medium">🎯 Demo Features:</span>
                Pinia store management, dependency injection via symbols, service layer pattern, API
                error handling, loading states, en TypeScript interfaces.
              </p>
            </div>
          </div>
        </div>

        <!-- Day Circle Tab -->
        <div v-if="activeTab === 'day'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Work-Life Balance</h2>
          <div class="flex justify-center">
            <DayCircle />
          </div>
        </div>

        <!-- Experience Tab -->
        <div v-if="activeTab === 'experience'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Werkervaring</h2>
          <ExperienceTimeline :work-experience="workExperience" />
        </div>

        <!-- Education Tab -->
        <div v-if="activeTab === 'education'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Bijdrage & Ontwikkeling</h2>
          <div class="space-y-4">
            <div
              v-for="(edu, index) in educationList"
              :key="index"
              class="bg-gray-50 p-4 rounded-lg"
            >
              <h3 class="text-lg font-semibold text-gray-900">{{ edu.title }}</h3>
              <p class="text-gray-600">{{ edu.institution }} • {{ edu.period }}</p>
              <p v-if="edu.description" class="text-sm text-gray-700 mt-2">{{ edu.description }}</p>
            </div>

            <!-- Development Timeline Component -->
            <DevelopmentTimeline :development-moments="developmentMoments" />
          </div>
        </div>
      </MainContent>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import type { Education, ProfileData, Skill, Tab, WorkExperience } from '@/types'
import { nextTick, onMounted, ref } from 'vue'
import DayCircle from '../components/DayCircle.vue'
import DevelopmentTimeline from '../components/DevelopmentTimeline.vue'
import ExperienceTimeline from '../components/ExperienceTimeline.vue'
import JokeDisplay from '../components/JokeDisplay.vue'
import MainContent from '../components/MainContent.vue'
import ProfileSidebar from '../components/ProfileSidebar.vue'
import SkillsProgress from '../components/SkillsProgress.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'

// Skills data met progress bars
const frontendSkills: Skill[] = [
  { name: 'Vue.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Tailwind CSS', level: 80 },
  { name: 'React', level: 75 },
  { name: 'JavaScript', level: 95 },
  { name: 'HTML', level: 100 },
  { name: 'CSS', level: 90 },
  { name: 'Nuxt', level: 80 },
]

const backendSkills: Skill[] = [
  { name: 'Laravel', level: 80 },
  { name: 'PHP', level: 85 },
  { name: 'Wordpress', level: 95 },
  { name: 'WP Plugins', level: 90 },
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

const technicalSkillsList: string[] = [
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
]

const softSkillsList: string[] = [
  'Teamplayer met eigen verantwoordelijkheid',
  'Heldere communicatie (ook met niet-techneuten)',
  'Analytisch & oplossingsgericht',
  'Proactief in kennisdeling',
  'Ervaring met Agile / Scrum',
  'Positieve impact willen maken (zowel in code als cultuur)',
  'Snelle onboarding in bestaande projecten',
  'Mentorship & begeleiding bij migraties',
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

const educationList: Education[] = [
  {
    title: 'Zelfstandig ondernemer - Continue ontwikkeling',
    institution: 'Autodidactisch leren',
    period: '2017 - heden',
    description:
      'Continue bijscholing in moderne web technologieën, frameworks en development best practices',
  },
  {
    title: 'Vrijwilliger/Adviseur',
    institution: 'Stichting Philia',
    period: '2015 - 2016',
    description: 'Crowdfunding en online zichtbaarheid advisering',
  },
]

const developmentMoments: Education[] = [
  {
    title: 'Refactor van Nuxt 2 naar Nuxt 3',
    institution: 'GroupCard',
    period: '2024 - 2025',
    description:
      'Gefaseerde refactor van bestaande Nuxt 2 applicaties naar Nuxt 3. Focus op verbeterde prestaties, effectiever developen en herbruikbaarheid van componenten.\n\nNuxt 2 project bestond uit Nuxt Property Decorator en Vuex, waar company standard meer om Pinia, Composition API en ook Tailwind draaide.',
  },
  {
    title: 'Custom WordPress Plugin Ontwikkeling',
    institution: 'GroupCard',
    period: '2023 - 2025',
    description:
      'Gecentraliseerde ontwikkeling van maatwerk WordPress plugins voor verschillende projecten. Focus op herbruikbaarheid, performance en integratie met bestaande systemen. Maar ook het centraal bijhouden waardoor ontwikkelingen op plugins van een centraal punt kunnen worden uitgerold over 40+ Wordpress sites.',
  },
  {
    title: 'App ontwikkeling met Laravel en Vue / Inertia',
    institution: 'GroupCard',
    period: '2022 - 2023',
    description:
      'Multi tenant app ontwikkeling met Laravel en Vue / Inertia. Focus op schaalbaarheid, performance en gebruikerservaring. Betrof een doorontwikkeling van een bestaand Laravel platform naar een multi-tenant architectuur met Vue / Inertia frontend en Tailwind configuratie.',
  },
  {
    title: 'Headless corporate website obv Nuxt 3 en WordPress REST API',
    institution: 'GroupCard',
    period: '2021 - 2022',
    description:
      'Opzetten van een headless corporate website met Nuxt 3 en WordPress REST API. Focus op performance, SEO en gebruikerservaring. Nauwe samenwerking met design en Marketingafdeling. Tevens Mailchimp integratie voor nieuwsbrief en whitepapers als ook Google Analytics.',
  },
  {
    title: 'Verkoopmodule voor maatwerk naamplaten en stickers',
    institution: 'Activate your Business',
    period: '2021 - 2022',
    description:
      'Voor een specifieke opdrachtgevers een verkoopmodule opgezet waarbij maatwerk naamplaten en stickers besteld kunnen worden. Hierbij is gebruik gemaakt van WooCommerce en een op maat gemaakt product configurator, met daar bovenop de eigen maatwerk inbreng.',
  },
  {
    title: 'Refactor Webshop op basis van Laravel en Vue',
    institution: 'Activate your Business',
    period: '2020 - 2022',
    description:
      'Refactor van een bestaande webshop naar een nieuwe Laravel en Vue architectuur. Focus op verbeterde prestaties, maar ook multi tenant en vernieuwde Bootstrap 5 ipv losse css.',
  },
  {
    title: 'Parent - Child theme Wordpress',
    institution: 'Activate your Business',
    period: '2020 - 2022',
    description:
      'Voor een divers aantal opdrachtgevers een parent - child theme structuur opgezet. Dit om de snelheid van opleveren en ontwikkelen te verhogen en de onderhoudbaarheid van de websites te verbeteren. Tevens de mogelijkheid om continue learnings m.b.t. bijvoorbeeld SEO centraal door te voeren en over alle sites uit te rollen.',
  },
  {
    title: 'Overgang naar moderne web development',
    institution: 'Diverse bedrijven',
    period: '2017 - 2020',
    description:
      'Transitie van traditionele web development naar moderne frameworks en tools. Focus op component-based architectuur, state management en API-driven development.',
  },
]

// Actieve tab state
const activeTab = ref('frontend')
const frontendSkillsRef = ref()
const backendSkillsRef = ref()

// Tab opties
const tabs: Tab[] = [
  { id: 'frontend', name: 'Frontend', label: 'Frontend', icon: '💻', href: '#', current: false },
  { id: 'backend', name: 'Backend', label: 'Backend', icon: '⚙️', href: '#', current: false },
  { id: 'skills', name: 'Skills', label: 'Skills', icon: '🛠️', href: '#', current: false },
  // { id: 'day', name: 'Mijn Dag', label: 'Mijn Dag', icon: '🌅', href: '#', current: false },
  { id: 'experience', name: 'Ervaring', label: 'Ervaring', icon: '📈', href: '#', current: false },
  { id: 'education', name: 'Bijdrage', label: 'Bijdrage', icon: '🎓', href: '#', current: false },
]

// CV Data
const profileData: ProfileData = {
  name: 'Reinier Burgering',
  title: 'Full Stack Developer',
  photo: '/src/assets/logo.svg', // Vervang met jouw foto
  details: {
    Geboortedatum: '07-07-1978',
    Telefoon: '+31 6 505 26 727',
    Email: 'reinierburgering@gmail.com',
    Locatie: 'Nederland',
  },
  about:
    'Een leergierig/autodidactisch, veelzijdig en zelfstandige front-end / webdeveloper met bruikbare back-end skills. Inventief en schuwt niet de kwantiteit op te zoeken om te komen tot beste oplossingen. Kritisch reflectievermogen om altijd te willen ontwikkelen en kan daarbij adequaat anticiperen en inspelen op nieuwe situaties',
}

// Animatie functies
function handleTabChange(tabId: string) {
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
  // Wacht tot de component refs beschikbaar zijn, dan start animatie voor de actieve tab
  nextTick(() => {
    setTimeout(() => {
      if (activeTab.value === 'frontend' && frontendSkillsRef.value) {
        frontendSkillsRef.value.animateProgressBars()
      } else if (activeTab.value === 'backend' && backendSkillsRef.value) {
        backendSkillsRef.value.animateProgressBars()
      }
    }, 200) // Iets meer tijd voor de component om volledig te mounten
  })
})
</script>
