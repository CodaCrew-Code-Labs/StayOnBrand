import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth'
import { userService } from '@/services/user.service'

declare global {
  interface Window {
    dodoId?: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: string; email: string } | null>(null)
  const token = ref<string | null>(null)

  // Global user variables
  const email = ref<string | null>(null)
  const sobId = ref<string | null>(null) // userUuid from keycard
  const dodoId = ref<string | null>(null) // dodoCustomerId from keycard
  const currentTier = ref<string | null>(null) // user tier
  const lastSessionId = ref<string | null>(null) // last payment session id

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
              const parsedUser = JSON.parse(storedUser)
              if (
                parsedUser &&
                typeof parsedUser === 'object' &&
                parsedUser.id &&
                parsedUser.email
              ) {
                token.value = storedToken
                setUser(parsedUser) // Use setUser to trigger setupUserData
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
    if (newUser?.email) {
      // Check for globally stored dodo ID first
      if (window.dodoId) {
        dodoId.value = window.dodoId
      }
      // Then setup other user data
      setupUserData(newUser.email)
    }
  }

  async function setupUserData(userEmail: string) {
    try {
      const userData = await userService.getOrCreateUser(userEmail)
      console.log('Raw userData from API:', userData)

      email.value = userData.email
      sobId.value = userData.sob_id
      currentTier.value = userData.current_tier || null

      // Only set dodo_customer_id if we don't already have one from sync
      if (!dodoId.value) {
        dodoId.value = userData.dodo_customer_id || null
      }

      // If still no dodoId, try to sync with DodoPayments
      if (!dodoId.value) {
        try {
          const syncedDodoId = await AuthService.syncDodoUser(userEmail)
          if (syncedDodoId) {
            dodoId.value = syncedDodoId
            window.dodoId = syncedDodoId
          }
        } catch (error) {
          console.warn('DodoPayments sync failed during setupUserData:', error)
        }
      }
    } catch (error) {
      console.error('Failed to setup user data:', error)
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken
  }

  function logout() {
    user.value = null
    token.value = null
    email.value = null
    sobId.value = null
    dodoId.value = null
    currentTier.value = null
    lastSessionId.value = null
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
    email,
    sobId,
    dodoId,
    currentTier,
    lastSessionId,
    setUser,
    setToken,
    logout
  }
})
