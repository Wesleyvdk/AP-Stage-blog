import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from '../src/app/app-routes'
import './assets/tailwind.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
