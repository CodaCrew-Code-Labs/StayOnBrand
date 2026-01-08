import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: string; email: string } | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Initialize auth state from localStorage if remember me was enabled
  function initializeAuth() {
    const rememberMe = localStorage.getItem('rememberMe')
    if (rememberMe) {
      try {
        if (!AuthService.isAuthExpired()) {
          const storedToken = localStorage.getItem('accessToken')
          const storedUser = localStorage.getItem('userData')

          if (storedToken && storedUser) {
            try {
              token.value = storedToken
              const parsedUser = JSON.parse(storedUser)
              if (
                parsedUser &&
                typeof parsedUser === 'object' &&
                parsedUser.id &&
                parsedUser.email
              ) {
                user.value = parsedUser
              } else {
                throw new Error('Invalid user data structure')
              }
            } catch {
              try {
                AuthService.logout()
              } catch {
                // Ignore logout errors during initialization
              }
            }
          }
        }
      } catch {
        // Ignore auth expiry check errors
      }
    }
  }

  function setUser(newUser: { id: string; email: string } | null) {
    user.value = newUser
  }

  function setToken(newToken: string | null) {
    token.value = newToken
  }

  function logout() {
    user.value = null
    token.value = null
    try {
      AuthService.logout()
    } catch (error) {
      console.warn('Logout cleanup failed:', error)
    }
  }

  // Initialize on store creation
  try {
    initializeAuth()
  } catch (error) {
    console.warn('Auth initialization failed:', error)
  }

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout
  }
})
