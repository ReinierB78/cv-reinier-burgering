import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import { ApiJokeService } from './services/joke-service'
import { JokeServiceKey } from './services/joke-service-key'

const app = createApp(App)

// Provide services for dependency injection
app.provide(JokeServiceKey, new ApiJokeService())

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
