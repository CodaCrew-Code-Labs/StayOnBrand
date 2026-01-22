import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { authGuard } from './guards/auth.guard'
import { guestGuard } from './guards/guest.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Stay on Brand` : 'Stay on Brand'
  next()
})

router.beforeEach(authGuard)
router.beforeEach(guestGuard)

// Track page views for Google Analytics (SPA navigation)
router.afterEach(to => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_title: document.title
    })
  }
})

export default router
