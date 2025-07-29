import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { ApiJokeService } from './services/joke-service'
import { JokeServiceKey } from './services/joke-service-key'

const app = createApp(App)

// Provide services for dependency injection
app.provide(JokeServiceKey, new ApiJokeService())

app.use(createPinia())
app.use(router)

app.mount('#app')
