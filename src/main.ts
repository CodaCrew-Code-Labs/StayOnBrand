import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth.store'

import './styles/main.css'

// Google Analytics
const GA_ID = 'G-G2RYWM6FZ2'
const script = document.createElement('script')
script.async = true
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
document.head.appendChild(script)

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

window.dataLayer = window.dataLayer || []
window.gtag = function gtag(...args: unknown[]) {
  window.dataLayer.push(args)
}
window.gtag('js', new Date())
window.gtag('config', GA_ID)

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
