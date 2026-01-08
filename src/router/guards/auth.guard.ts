import type { NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { AuthService } from '@/services/auth'

export const authGuard: NavigationGuardWithThis<undefined> = (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()

  // Check if user should be auto-logged in from localStorage
  if (!authStore.isAuthenticated) {
    const rememberMe = localStorage.getItem('rememberMe')
    if (rememberMe === 'true' && !AuthService.isAuthExpired()) {
      const storedToken = localStorage.getItem('accessToken')
      const storedUser = localStorage.getItem('userData')

      if (storedToken && storedUser) {
        try {
          authStore.setToken(storedToken)
          authStore.setUser(JSON.parse(storedUser))
        } catch {
          try {
            AuthService.logout()
          } catch {
            // Ignore logout errors in guard
          }
        }
      }
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'Login',
      query: { redirect: to.fullPath }
    }
  }

  return true
}
