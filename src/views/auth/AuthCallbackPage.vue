<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-bg">
    <div class="text-center">
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
      <h2 class="text-xl font-bold text-brand-black mb-2">Authenticating...</h2>
      <p class="text-brand-black/60">Please wait while we sign you in.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  onMounted(() => {
    // Extract authorization code from URL
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      router.push('/login?error=oauth_failed')
      return
    }

    if (code) {
      console.log('Google OAuth successful! Authorization code:', code)
      console.log('Full URL params:', Object.fromEntries(urlParams))

      // TODO: Step 1 - Exchange authorization code for tokens
      // Send POST request to Google token endpoint:
      // URL: https://oauth2.googleapis.com/token
      // Body: {
      //   client_id: VITE_GOOGLE_CLIENT_ID,
      //   client_secret: GOOGLE_CLIENT_SECRET, // This should be done on backend for security
      //   code: code,
      //   grant_type: 'authorization_code',
      //   redirect_uri: window.location.origin + '/auth/callback'
      // }
      // Response will contain: access_token, id_token, refresh_token

      // TODO: Step 2 - Verify and decode the ID token
      // Option A: Use Google's tokeninfo endpoint to verify:
      // GET https://oauth2.googleapis.com/tokeninfo?id_token={id_token}
      // Option B: Decode JWT locally (less secure, requires validation)
      // This will give you: email, name, picture, email_verified, etc.

      // TODO: Step 3 - Extract user information
      // From the verified token, extract:
      // - email (primary identifier)
      // - name (display name)
      // - picture (profile image URL)
      // - email_verified (boolean)
      // - sub (Google user ID)

      // TODO: Step 4 - Check if user exists in database
      // Send request to your backend API:
      // GET /api/auth/check-user?email={email}
      // Response: { exists: boolean, user?: UserData }

      // TODO: Step 5 - Handle user flow based on existence
      // If user exists:
      //   - Update last_login timestamp
      //   - Generate JWT token for your app
      //   - Store in auth store
      //   - Redirect to /dashboard
      // If user doesn't exist:
      //   - Create new user record with Google data
      //   - Generate JWT token for your app
      //   - Store in auth store
      //   - Redirect to /dashboard or /onboarding

      // TODO: Step 6 - Error handling
      // Handle cases like:
      //   - Invalid/expired authorization code
      //   - Network errors
      //   - Database errors
      //   - Email not verified by Google

      // Temporary redirect (remove when implementing above)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      console.error('No authorization code received')
      router.push('/login?error=no_code')
    }
  })
</script>
