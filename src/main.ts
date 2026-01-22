import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth.store'

import './styles/main.css'

// Google Analytics - Standard implementation
const GA_ID = 'G-G2RYWM6FZ2'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

// Initialize dataLayer and gtag function FIRST (queues commands)
window.dataLayer = window.dataLayer || []
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}
window.gtag = gtag

// Queue the initial commands
gtag('js', new Date())
gtag('config', GA_ID)

// Load the script (it will process the queued commands)
const script = document.createElement('script')
script.async = true
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
document.head.appendChild(script)

const app = createApp(App)

try {
  const pinia = createPinia()
  app.use(pinia)

  // Initialize Unhead for SEO meta management
  const head = createHead()
  app.use(head)

  // Initialize auth store to restore authentication state
  useAuthStore()

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
