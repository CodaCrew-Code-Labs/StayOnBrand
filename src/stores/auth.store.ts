import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth'
import { userService } from '@/services/user.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: string; email: string; username?: string } | null>(null)
  const token = ref<string | null>(null)

  // Global user variables
  const email = ref<string | null>(null)
  const username = ref<string | null>(null)
  const sobId = ref<string | null>(null) // userUuid from keycard
  const dodoId = ref<string | null>(null) // dodoCustomerId from keycard
  const currentTier = ref<string | null>(null) // user tier
  const activeLength = ref<string | null>(null) // payment frequency (monthly/yearly)
  const tierExpiresAt = ref<string | null>(null) // tier expiry date
  const subscriptionStatus = ref<string | null>(null) // subscription status
  const lastSessionId = ref<string | null>(null) // last payment session id
  const memberSince = ref<string | null>(null) // created_at from keycard

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

  function setUser(newUser: { id: string; email: string; username?: string } | null) {
    user.value = newUser
    username.value = newUser?.username || null
    if (newUser?.email) {
      setupUserData(newUser.email)
    }
  }

  async function setupUserData(userEmail: string) {
    try {
      const userData = await userService.getOrCreateUser(userEmail)
      console.log('Raw userData from API:', userData)

      email.value = userData.email
      sobId.value = userData.user_uuid
      dodoId.value = userData.dodo_customer_id || null
      currentTier.value = userData.active_tier || null
      activeLength.value = userData.active_length || null
      tierExpiresAt.value = userData.tier_expires_at || null
      subscriptionStatus.value = userData.subscription_status || null
      memberSince.value = userData.created_at || null
    } catch (error) {
      console.error('Failed to setup user data:', error)
    }
  }

  async function refreshUserData() {
    if (email.value) {
      await setupUserData(email.value)
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken
  }

  function logout() {
    user.value = null
    token.value = null
    email.value = null
    username.value = null
    sobId.value = null
    dodoId.value = null
    currentTier.value = null
    activeLength.value = null
    tierExpiresAt.value = null
    subscriptionStatus.value = null
    lastSessionId.value = null
    memberSince.value = null
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
    username,
    sobId,
    dodoId,
    currentTier,
    activeLength,
    tierExpiresAt,
    subscriptionStatus,
    lastSessionId,
    memberSince,
    setUser,
    setToken,
    logout,
    refreshUserData
  }
})
