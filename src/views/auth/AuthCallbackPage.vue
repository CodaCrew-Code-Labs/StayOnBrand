<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-bg">
    <div class="text-center">
      <!-- Loading State -->
      <div v-if="!errorMessage">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-teal flex items-center justify-center animate-spin"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-brand-black mb-2">
          {{ isSignup ? 'Creating your profile...' : 'Signing you in...' }}
        </h2>
        <p class="text-brand-black/60">
          {{
            isSignup
              ? 'Please wait while we set up your account.'
              : 'Please wait while we sign you in.'
          }}
        </p>
      </div>

      <!-- Error State -->
      <div v-else>
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-brand-black mb-2">Authentication Failed</h2>
        <p class="text-brand-black/60 mb-4">{{ errorMessage }}</p>
        <RouterLink
          to="/login"
          class="inline-block px-6 py-2 bg-brand-teal text-white rounded-full hover:bg-brand-teal/90 transition-colors"
        >
          Back to Login
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { AuthService } from '@/services/auth'
  import { useAuthStore } from '@/stores/auth.store'

  const router = useRouter()
  const authStore = useAuthStore()
  const errorMessage = ref('')
  const isSignup = ref(false)

  // Check if this is a signup or login flow
  const authFlow = sessionStorage.getItem('authFlow')
  isSignup.value = authFlow === 'signup'

  onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    console.log('OAuth callback received:', { code: !!code, error, errorDescription })

    if (error) {
      console.error('OAuth error:', error, errorDescription)
      errorMessage.value = errorDescription || 'Authentication failed. Please try again.'
      return
    }

    if (!code) {
      console.error('No authorization code received')
      errorMessage.value = 'No authorization code received. Please try again.'
      return
    }

    try {
      // Exchange code for tokens via backend (Cognito handles everything)
      const tokens = await AuthService.exchangeGoogleCode(code)
      console.log('Authentication successful:', tokens)
      console.log('Tokens structure:', JSON.stringify(tokens, null, 2))

      // Store auth data
      authStore.setToken(tokens.accessToken || tokens.idToken || '')

      // Decode the idToken to extract user info including email
      let userEmail = ''
      let userId = ''

      if (tokens.idToken) {
        try {
          // Decode JWT token (simple base64 decode of payload)
          const payload = JSON.parse(atob(tokens.idToken.split('.')[1]))
          console.log('Decoded JWT payload:', payload)
          userEmail = payload.email || ''
          userId = payload.sub || 'google-user'
        } catch (error) {
          console.error('Failed to decode JWT token:', error)
          userEmail = tokens.user?.email || tokens.email || ''
          userId = tokens.user?.id || tokens.sub || 'google-user'
        }
      } else {
        userEmail = tokens.user?.email || tokens.email || ''
        userId = tokens.user?.id || tokens.sub || 'google-user'
      }

      console.log('Extracted email:', userEmail)
      console.log('Extracted user ID:', userId)

      authStore.setUser({
        id: userId,
        email: userEmail
      })

      // Get redirect URL from session storage
      const authRedirect = sessionStorage.getItem('authRedirect')

      // Clean up auth flow indicators
      sessionStorage.removeItem('authFlow')
      sessionStorage.removeItem('authRedirect')

      // Redirect to saved URL or dashboard
      router.push(authRedirect || '/dashboard')
    } catch (err: unknown) {
      console.error('Token exchange failed:', err)
      errorMessage.value =
        (err as Error).message || 'Failed to complete authentication. Please try again.'
    }
  })
</script>
