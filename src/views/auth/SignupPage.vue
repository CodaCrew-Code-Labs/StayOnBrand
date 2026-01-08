<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'

  import { AuthService } from '@/services/auth'

  const router = useRouter()

  // Form state
  const email = ref('')
  const password = ref('')
  const username = ref('')
  const isLoading = ref(false)
  const showPassword = ref(false)
  const isPasswordTransitioning = ref(false)
  const errorMessage = ref('')

  const togglePasswordVisibility = () => {
    isPasswordTransitioning.value = true
    showPassword.value = !showPassword.value
    setTimeout(() => {
      isPasswordTransitioning.value = false
    }, 400)
  }

  // Password validation rules
  const passwordRules = computed(() => [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.value.length >= 8
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password.value)
    },
    {
      id: 'number',
      label: 'One number',
      met: /[0-9]/.test(password.value)
    },
    {
      id: 'special',
      label: 'One special symbol',
      met: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/`~;']/.test(password.value)
    }
  ])

  const allPasswordRulesMet = computed(() => passwordRules.value.every(rule => rule.met))

  // Toast notification state
  const toast = ref({
    show: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'warning'
  })

  let toastTimeout: ReturnType<typeof setTimeout> | null = null

  const showToast = (message: string, type: 'error' | 'success' | 'warning' = 'error') => {
    if (toastTimeout) clearTimeout(toastTimeout)
    toast.value = { show: true, message, type }
    toastTimeout = setTimeout(() => {
      toast.value.show = false
    }, 4000)
  }

  const dismissToast = () => {
    toast.value.show = false
  }

  // Animation state - check if coming from login page (skip entry animation for smooth transition)
  const isVisible = ref(false)
  const skipEntryAnimation = ref(false)

  onMounted(() => {
    // Check if navigating from login page
    const fromLogin = window.history.state?.back?.includes('/login')
    skipEntryAnimation.value = fromLogin

    // If from login, show immediately; otherwise animate in
    if (fromLogin) {
      isVisible.value = true
    } else {
      setTimeout(() => {
        isVisible.value = true
      }, 100)
    }
  })

  const handleSubmit = async () => {
    console.log('=== SIGNUP FORM SUBMISSION START ===')
    errorMessage.value = '' // Clear any previous errors

    // Decode HTML entities if present
    const decodeHtml = (str: string) => {
      const textarea = document.createElement('textarea')
      textarea.innerHTML = str
      return textarea.value
    }

    const cleanEmail = decodeHtml(email.value.trim())
    const cleanPassword = decodeHtml(password.value)
    const cleanUsername = decodeHtml(username.value.trim())

    // Validate email
    if (!cleanEmail) {
      showToast('Please enter your email address', 'error')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    // Validate password rules
    if (!allPasswordRulesMet.value) {
      const unmetRules = passwordRules.value.filter(rule => !rule.met)
      showToast(
        `Password requires: ${unmetRules.map(r => r.label.toLowerCase()).join(', ')}`,
        'error'
      )
      return
    }

    // Validate username
    if (!cleanUsername) {
      showToast('Please choose a username', 'error')
      return
    }

    if (cleanUsername.length < 3) {
      showToast('Username must be at least 3 characters', 'error')
      return
    }

    console.log('Form data:', {
      email: cleanEmail,
      password: cleanPassword,
      username: cleanUsername
    })
    console.log('API URL being used:', `http://localhost:${import.meta.env.VITE_AUTH_PORT || 3001}`)

    isLoading.value = true
    try {
      console.log('Calling AuthService.signup...')
      const result = await AuthService.signup(cleanEmail, cleanPassword, cleanUsername)
      console.log('Signup successful:', result)
      showToast('Account created successfully! Now login', 'success')
      // Redirect to login page after showing toast
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: unknown) {
      console.error('Signup failed:', error)
      console.error('Error message:', (error as Error).message)
      console.error('Full error object:', error)

      // Extract detailed error message
      let errorMsg = 'Signup failed. Please try again.'
      if ((error as Error).message && (error as Error).message !== 'Signup failed') {
        errorMsg = (error as Error).message
      } else if (
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        errorMsg = (error as { response: { data: { message: string } } }).response.data.message
      } else if ((error as { response?: { data?: { error?: string } } }).response?.data?.error) {
        errorMsg = (error as { response: { data: { error: string } } }).response.data.error
      }

      errorMessage.value = errorMsg
    } finally {
      isLoading.value = false
      console.log('=== SIGNUP FORM SUBMISSION END ===')
    }
  }

  const handleGoogleSignup = async () => {
    errorMessage.value = '' // Clear errors on any button click
    try {
      const url = await AuthService.getGoogleAuthUrl()
      console.log('Google Auth URL from backend:', url)
      // Store auth flow type for callback page messaging
      sessionStorage.setItem('authFlow', 'signup')
      window.location.href = url
    } catch (error: unknown) {
      console.error('Failed to get Google auth URL:', error)
      showToast((error as Error).message || 'Failed to initiate Google sign up', 'error')
    }
  }
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-teal selection:text-white bg-brand-dark overflow-x-hidden"
  >
    <!-- Modern Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="toast-container fixed top-6 left-0 right-0 flex justify-center z-50"
        @click="dismissToast"
      >
        <div
          class="toast-content flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border cursor-pointer"
          :class="{
            'bg-red-500/80 border-red-400/60 text-white': toast.type === 'error',
            'bg-green-500/80 border-green-400/60 text-white': toast.type === 'success',
            'bg-yellow-500/80 border-yellow-400/60 text-white': toast.type === 'warning'
          }"
        >
          <!-- Icon -->
          <div
            class="toast-icon flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            :class="{
              'bg-red-600/40': toast.type === 'error',
              'bg-green-600/40': toast.type === 'success',
              'bg-yellow-600/40': toast.type === 'warning'
            }"
          >
            <!-- Error Icon -->
            <svg
              v-if="toast.type === 'error'"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <!-- Success Icon -->
            <svg
              v-if="toast.type === 'success'"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <!-- Warning Icon -->
            <svg
              v-if="toast.type === 'warning'"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <!-- Message -->
          <span class="toast-message text-sm font-medium">{{ toast.message }}</span>
          <!-- Progress bar -->
          <div
            class="toast-progress absolute bottom-0 left-0 h-0.5 rounded-full"
            :class="{
              'bg-red-300': toast.type === 'error',
              'bg-green-300': toast.type === 'success',
              'bg-yellow-300': toast.type === 'warning'
            }"
          ></div>
        </div>
      </div>
    </Transition>

    <!-- Ambient Background Lighting -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Top Left Glow -->
      <div
        class="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-teal/10 rounded-full blur-[120px]"
      ></div>
      <!-- Bottom Right Glow -->
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-bright/5 rounded-full blur-[100px]"
      ></div>
      <!-- Center Subtle Glow -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-brand-black/40 rounded-full blur-[120px]"
      ></div>

      <!-- Connecting Line -->
      <svg class="absolute w-full h-full" preserveAspectRatio="none">
        <path
          d="M200 450 C 300 450, 400 300, 800 200"
          stroke="rgba(255,255,255,0.03)"
          stroke-width="2"
          fill="none"
          class="hidden lg:block"
        />
        <path
          d="M200 450 C 300 450, 400 300, 800 200"
          stroke="url(#gradient-line)"
          stroke-width="1.5"
          fill="none"
          class="hidden lg:block noodle-path"
          stroke-linecap="round"
        />
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#2F7A72" />
            <stop offset="50%" stop-color="#79dcaf" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Subtle Grid -->
      <div class="absolute inset-0 bg-grid-light opacity-5"></div>
    </div>

    <!-- Navigation -->
    <nav
      class="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between"
      :class="{ 'reveal-visible': isVisible }"
    >
      <RouterLink to="/" class="flex items-center gap-2 group">
        <div
          class="w-8 h-8 bg-brand-bg rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300"
        >
          <span class="font-display font-bold text-sm text-brand-black">S.</span>
        </div>
        <span
          class="text-xl font-bold tracking-tight text-brand-bg group-hover:text-brand-bright transition-colors"
        >
          Stay on Brand
        </span>
      </RouterLink>
      <div class="hidden md:flex gap-2">
        <div
          class="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-brand-bg/40 flex items-center gap-2"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>
          SECURE CONNECTION
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main
      class="flex-grow flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 py-8 relative z-10 gap-12 lg:gap-24"
    >
      <!-- Left Column: Branding & Steps -->
      <div class="w-full lg:w-1/2 flex flex-col gap-8 lg:pr-12">
        <div class="relative" :class="{ 'animate-reveal-text': isVisible && !skipEntryAnimation }">
          <h1
            class="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-brand-bg mb-2 font-display"
          >
            Welcome to <br />
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-bright to-brand-teal inline-block relative pb-2"
            >
              Stay on Brand
              <!-- Underline decoration -->
              <svg
                class="absolute bottom-0 left-0 w-full h-3 text-brand-teal/50"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2" fill="none" />
              </svg>
            </span>
          </h1>
          <p class="text-lg text-brand-bg/60 mt-6 max-w-md leading-relaxed font-medium">
            Create your account to start validating your brand colors and ensuring accessibility
            compliance.
          </p>
        </div>

        <!-- Stepper Indicators -->
        <div class="flex items-center gap-4 mt-4 relative" :class="{ 'reveal-visible': isVisible }">
          <!-- Step 1 (Active) -->
          <div class="relative sonar-circle">
            <div
              class="w-10 h-10 rounded-full bg-brand-teal text-brand-black flex items-center justify-center font-bold text-sm z-10 relative shadow-[0_0_25px_rgba(47,122,114,0.5)]"
            >
              1
            </div>
            <span
              class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-brand-teal/60 tracking-widest"
            >
              01
            </span>
          </div>

          <!-- Spacer Dots -->
          <div class="flex gap-3">
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors relative group"
            >
              <span
                class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                04
              </span>
            </div>
          </div>
        </div>

        <!-- Decorative technical numbers -->
        <div class="mt-auto pt-12 hidden lg:flex gap-12 text-[10px] font-mono text-brand-bg/30">
          <div class="flex flex-col gap-1">
            <span class="text-brand-teal">REF:</span>
            <span>8921-X</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-brand-bright">LATENCY:</span>
            <span>12ms</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-brand-red">SECURE:</span>
            <span>TLS 1.3</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Sign Up Card -->
      <div
        class="w-full lg:w-[480px] relative group"
        :class="{ 'animate-reveal-card': isVisible && !skipEntryAnimation }"
      >
        <!-- Card Glow Behind -->
        <div
          class="absolute -inset-1 bg-gradient-to-tr from-brand-teal via-brand-bright to-brand-teal rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"
        ></div>

        <div class="relative bg-brand-bg rounded-2xl p-8 md:p-10 shadow-2xl text-brand-black">
          <!-- Decorative Top Detail -->
          <div class="absolute top-4 right-4 flex gap-1">
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Email -->
            <div class="space-y-1.5">
              <label
                for="email"
                class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
              >
                E-mail address
              </label>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm font-medium placeholder:text-brand-black/30 bg-transparent"
                  placeholder="name@company.com"
                />
                <svg
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40 w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label
                for="password"
                class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
              >
                Password
              </label>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <div class="password-input-wrapper">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 pr-20 rounded-lg outline-none text-sm font-medium placeholder:text-brand-black/30 bg-transparent"
                    :class="{ 'password-transitioning': isPasswordTransitioning }"
                    placeholder="At least 8 characters"
                  />
                </div>
                <!-- Toggle Password Visibility Button -->
                <button
                  type="button"
                  class="password-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-brand-black/5 transition-colors group"
                  @click="togglePasswordVisibility"
                >
                  <div class="eye-icon-container" :class="{ showing: showPassword }">
                    <!-- Eye Open Icon -->
                    <svg
                      class="eye-icon eye-open w-[18px] h-[18px] text-brand-black/40 group-hover:text-brand-teal transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <!-- Eye Closed Icon -->
                    <svg
                      class="eye-icon eye-closed w-[18px] h-[18px] text-brand-black/40 group-hover:text-brand-teal transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              <!-- Password Rules -->
              <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                <div
                  v-for="rule in passwordRules"
                  :key="rule.id"
                  class="password-rule flex items-center gap-2 text-xs transition-all duration-300"
                  :class="rule.met ? 'rule-met' : 'rule-unmet'"
                >
                  <div class="rule-icon-wrapper">
                    <svg
                      v-if="rule.met"
                      class="rule-icon w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div v-else class="rule-dot w-1.5 h-1.5 rounded-full bg-current"></div>
                  </div>
                  <span class="rule-text">{{ rule.label }}</span>
                </div>
              </div>
            </div>

            <!-- Username -->
            <div class="space-y-1.5">
              <label
                for="username"
                class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
              >
                Username
              </label>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm font-medium placeholder:text-brand-black/30 bg-transparent"
                  placeholder="Choose a username"
                />
                <svg
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40 w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <!-- Sign Up Button -->
            <div class="pt-2 border-beam-container rounded-full">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-brand-black hover:bg-brand-dark text-brand-bg font-bold py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 btn-beam relative z-10 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                :class="{ 'loading-button': isLoading }"
                @click="errorMessage = ''"
              >
                <template v-if="isLoading">
                  <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                  </div>
                  <span class="loading-text">Creating account</span>
                  <span class="loading-dots">
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                  </span>
                </template>
                <template v-else>
                  Sign up
                  <svg
                    class="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </template>
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-red-500 text-sm text-center mt-3 px-2">
              {{ errorMessage }}
            </div>

            <!-- Divider -->
            <div class="relative flex items-center py-2">
              <div class="flex-grow border-t border-brand-black/10"></div>
              <span class="flex-shrink-0 mx-4 text-xs text-brand-black/40 font-medium">or</span>
              <div class="flex-grow border-t border-brand-black/10"></div>
            </div>

            <!-- Google Button -->
            <button
              type="button"
              class="w-full bg-white border border-brand-black/10 text-brand-black font-bold py-3.5 rounded-full transition-all duration-300 hover:bg-brand-black/5 hover:border-brand-black/20 flex items-center justify-center gap-3 relative overflow-hidden"
              @click="handleGoogleSignup"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span class="text-sm">Continue with Google</span>
            </button>

            <!-- Footer Links -->
            <div class="text-center space-y-4 pt-2">
              <p class="text-[10px] text-brand-black/40 leading-relaxed max-w-xs mx-auto">
                By continuing, you agree to Stay on Brand's
                <RouterLink
                  to="/terms"
                  class="underline decoration-brand-black/30 hover:text-brand-black"
                >
                  Terms of Service </RouterLink
                >,
                <RouterLink
                  to="/privacy"
                  class="underline decoration-brand-black/30 hover:text-brand-black"
                >
                  Privacy Policy
                </RouterLink>
                and Cookie Use.
              </p>

              <div class="text-xs font-semibold text-brand-black/60">
                Already a member?
                <RouterLink to="/login" class="text-brand-black hover:underline">Log in</RouterLink>
              </div>

              <div class="text-xs font-semibold text-brand-black/60">
                Forgot your password?
                <RouterLink to="/forgot-password" class="text-brand-black hover:underline"
                  >Recover</RouterLink
                >
              </div>
            </div>
          </form>
        </div>

        <!-- Number Detail Decoration around card -->
        <div
          class="absolute -right-8 top-20 hidden xl:block text-white/10 font-mono text-xs rotate-90 origin-left"
        >
          02 // ENCRYPTION
        </div>
        <div
          class="absolute -left-10 bottom-20 hidden xl:block text-white/10 font-mono text-xs -rotate-90 origin-right"
        >
          03 // VERIFICATION
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="relative z-10 w-full border-t border-white/5 bg-brand-dark/50 backdrop-blur-sm mt-auto"
    >
      <div
        class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <!-- Left Text -->
        <div
          class="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-brand-bg/40 font-medium"
        >
          <span>&copy; {{ new Date().getFullYear() }} Stay on Brand</span>
          <div class="flex gap-6">
            <RouterLink to="/terms" class="hover:text-brand-bg transition-colors"
              >Terms &amp; Conditions</RouterLink
            >
            <RouterLink to="/privacy" class="hover:text-brand-bg transition-colors"
              >Privacy Policy</RouterLink
            >
            <RouterLink to="/help" class="hover:text-brand-bg transition-colors">FAQ</RouterLink>
          </div>
        </div>

        <!-- Status indicator -->
        <div class="flex items-center gap-2 text-brand-bg/30 text-xs font-medium">
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
          </span>
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  /* --- Clip Path Reveal Animation --- */
  @keyframes reveal-right {
    0% {
      clip-path: inset(0 100% 0 0);
    }
    100% {
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes reveal-up {
    0% {
      clip-path: inset(100% 0 0 0);
      transform: translateY(20px);
    }
    100% {
      clip-path: inset(0 0 0 0);
      transform: translateY(0);
    }
  }

  .animate-reveal-text {
    animation: reveal-right 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-reveal-card {
    animation: reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  }

  /* --- Noodle / Line Drawing Animation --- */
  .noodle-path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* --- Sonar Animation --- */
  @keyframes sonar {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }

  .sonar-circle::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 1px solid #2f7a72;
    animation: sonar 2s infinite ease-out;
    z-index: -1;
  }

  /* --- Button Border Beam --- */
  .btn-beam {
    position: relative;
    overflow: hidden;
  }

  .btn-beam::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
    z-index: 10;
    pointer-events: none;
  }

  .btn-beam:hover::before {
    left: 100%;
    transition: left 0.5s;
  }

  /* Border Beam Container */
  .border-beam-container {
    position: relative;
  }

  .border-beam-container::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 9999px;
    background: linear-gradient(90deg, #2f7a72, #79dcaf, #2f7a72);
    background-size: 200% 100%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: border-animate 2s linear infinite;
  }

  .border-beam-container:hover::after {
    opacity: 1;
  }

  @keyframes border-animate {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  /* Custom Input Styling */
  .custom-input:focus-within {
    border-color: #2f7a72;
    box-shadow: 0 0 0 3px rgba(47, 122, 114, 0.1);
  }

  /* Reveal animation classes */
  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Loading Button Styles */
  .loading-button {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    background-size: 200% 200%;
    animation: gradient-shift 2s ease infinite;
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Spinner Styles */
  .loading-spinner {
    position: relative;
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid transparent;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  .spinner-ring:nth-child(1) {
    border-top-color: #2f7a72;
    animation-delay: -0.45s;
  }

  .spinner-ring:nth-child(2) {
    border-top-color: #79dcaf;
    animation-delay: -0.3s;
  }

  .spinner-ring:nth-child(3) {
    border-top-color: #ffffff;
    animation-delay: -0.15s;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Loading Text Animation */
  .loading-text {
    animation: pulse-text 1.5s ease-in-out infinite;
  }

  @keyframes pulse-text {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* Loading Dots Animation */
  .loading-dots {
    display: inline-flex;
    margin-left: 2px;
  }

  .loading-dots .dot {
    animation: bounce-dot 1.4s ease-in-out infinite;
    opacity: 0;
  }

  .loading-dots .dot:nth-child(1) {
    animation-delay: 0s;
  }

  .loading-dots .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dots .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce-dot {
    0%,
    60%,
    100% {
      opacity: 0;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-2px);
    }
  }

  /* Password Rules Styles */
  .password-rule {
    position: relative;
  }

  .rule-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    position: relative;
  }

  /* Unmet rule state */
  .rule-unmet {
    color: rgba(0, 0, 0, 0.35);
  }

  .rule-unmet .rule-text {
    opacity: 0.6;
  }

  /* Met rule state with animations */
  .rule-met {
    color: #2f7a72;
  }

  .rule-met .rule-text {
    opacity: 1;
    font-weight: 500;
  }

  .rule-met .rule-icon {
    animation: check-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  .rule-met .rule-icon-wrapper::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #2f7a72;
    opacity: 0;
    animation: ripple-out 0.6s ease-out forwards;
  }

  @keyframes check-pop {
    0% {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.3) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  @keyframes ripple-out {
    0% {
      transform: scale(0.5);
      opacity: 0.4;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }

  /* Shimmer effect on met text */
  .rule-met .rule-text {
    background: linear-gradient(90deg, #2f7a72 0%, #79dcaf 50%, #2f7a72 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 1.5s ease-in-out forwards;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% center;
    }
    100% {
      background-position: 0% center;
    }
  }

  /* Password Visibility Toggle Styles */
  .password-input-wrapper {
    position: relative;
    overflow: hidden;
  }

  .password-transitioning {
    animation: password-morph 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes password-morph {
    0% {
      filter: blur(0px);
      opacity: 1;
    }
    30% {
      filter: blur(4px);
      opacity: 0.7;
      transform: scale(0.98);
    }
    70% {
      filter: blur(4px);
      opacity: 0.7;
      transform: scale(0.98);
    }
    100% {
      filter: blur(0px);
      opacity: 1;
      transform: scale(1);
    }
  }

  .password-toggle {
    z-index: 10;
  }

  .eye-icon-container {
    position: relative;
    width: 18px;
    height: 18px;
  }

  .eye-icon {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Default state: eye-closed visible, eye-open hidden */
  .eye-closed {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  .eye-open {
    opacity: 0;
    transform: scale(0.5) rotate(-90deg);
  }

  /* Showing state: eye-open visible, eye-closed hidden */
  .eye-icon-container.showing .eye-open {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  .eye-icon-container.showing .eye-closed {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }

  /* Click ripple effect on toggle button */
  .password-toggle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(47, 122, 114, 0.2);
    transform: translate(-50%, -50%);
    transition:
      width 0.3s,
      height 0.3s,
      opacity 0.3s;
    opacity: 0;
  }

  .password-toggle:active::after {
    width: 40px;
    height: 40px;
    opacity: 1;
    transition:
      width 0s,
      height 0s,
      opacity 0s;
  }

  /* Toast Notification Styles */
  .toast-container {
    perspective: 1000px;
  }

  .toast-content {
    position: relative;
    overflow: hidden;
    transform-origin: top center;
  }

  /* Toast icon animation */
  .toast-icon {
    animation: icon-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
  }

  @keyframes icon-pop {
    0% {
      transform: scale(0) rotate(-180deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  /* Toast message animation */
  .toast-message {
    animation: message-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
  }

  @keyframes message-slide {
    0% {
      opacity: 0;
      transform: translateX(-10px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Toast progress bar */
  .toast-progress {
    animation: progress-shrink 4s linear forwards;
  }

  @keyframes progress-shrink {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }

  /* Toast enter/leave transitions */
  .toast-enter-active {
    animation: toast-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .toast-leave-active {
    animation: toast-out 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
  }

  @keyframes toast-in {
    0% {
      opacity: 0;
      transform: translateY(-30px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes toast-out {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
  }

  /* Glow effect behind toast based on type */
  .toast-content::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* Shimmer effect on toast */
  .toast-content::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: toast-shimmer 2s ease-in-out 0.5s;
  }

  @keyframes toast-shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
</style>
