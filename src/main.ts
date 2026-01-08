import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './styles/main.css'

const app = createApp(App)

try {
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
} catch (error) {
  console.error('Failed to initialize Vue app:', error)
  const appElement = document.getElementById('app')
  if (appElement) {
    appElement.innerHTML =
      '<div style="padding: 20px; text-align: center;"><h1>Application Error</h1><p>Failed to load the application. Please refresh the page.</p></div>'
  }
}
