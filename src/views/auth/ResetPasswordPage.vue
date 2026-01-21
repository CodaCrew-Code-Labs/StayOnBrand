<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { RouterLink, useRoute, useRouter } from 'vue-router'
  import { AuthService } from '@/services/auth'
  import { useAuthStore } from '@/stores/auth.store'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  // Form state
  const email = ref('')
  const code = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const showNewPassword = ref(false)
  const showConfirmPassword = ref(false)

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

  const getCleanErrorMessage = (error: Error) => {
    const message = error.message.toLowerCase()

    if (message.includes('user does not exist')) {
      return 'Email address not found. Please check your email or sign up for a new account'
    }
    if (message.includes('invalid code')) {
      return 'Invalid or expired reset code'
    }
    if (message.includes('network operation failed')) {
      return 'Request failed. Please try again'
    }

    // Extract the actual error after the colon if it exists
    const parts = error.message.split(': ')
    return parts.length > 1 ? parts[parts.length - 1] : error.message
  }

  // Animation state
  const isVisible = ref(false)

  // Password validation
  const passwordsMatch = computed(() => {
    return newPassword.value === confirmPassword.value
  })

  const passwordStrength = computed(() => {
    const password = newPassword.value
    if (!password) return { level: 0, text: '', color: '' }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: strength, text: 'Weak', color: 'bg-brand-red' }
    if (strength <= 3) return { level: strength, text: 'Medium', color: 'bg-yellow-500' }
    return { level: strength, text: 'Strong', color: 'bg-brand-bright' }
  })

  onMounted(() => {
    // Get email from query params if available
    if (route.query.email) {
      email.value = route.query.email as string
    }

    setTimeout(() => {
      isVisible.value = true
    }, 100)

    setupRevealObserver()
  })

  const setupRevealObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el)
    })
  }

  const handleSubmit = async () => {
    if (
      !email.value ||
      !code.value ||
      !newPassword.value ||
      !confirmPassword.value ||
      !passwordsMatch.value
    )
      return

    console.log('=== RESET PASSWORD FORM SUBMIT ===')
    console.log('Email:', email.value)
    console.log('Code:', code.value)
    console.log('Has new password:', !!newPassword.value)

    isLoading.value = true

    try {
      console.log('Calling AuthService.resetPassword...')
      const cleanCode = code.value.trim()
      console.log('Original code:', `"${code.value}"`)
      console.log('Cleaned code:', `"${cleanCode}"`)

      const result = await AuthService.resetPassword(email.value, cleanCode, newPassword.value)
      console.log('Reset password success:', result)

      isLoading.value = false
      showToast('Password updated successfully! Redirecting to login...', 'success')

      // Navigate to login page after showing toast
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      console.error('Reset password failed:', error)
      isLoading.value = false
      showToast(getCleanErrorMessage(error as Error), 'error')
    }
  }
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-bright selection:text-brand-black bg-brand-bg text-brand-black overflow-x-hidden"
  >
    <!-- Neo-Brutalist Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="toast-container fixed bottom-6 left-0 right-0 flex justify-center z-50"
        @click="dismissToast"
      >
        <div
          class="toast-content flex items-center gap-3 px-5 py-3.5 border-3 border-brand-black cursor-pointer transform rotate-[-0.5deg]"
          :class="{
            'bg-brand-red text-white shadow-[4px_4px_0px_0px_#1A1A1A]': toast.type === 'error',
            'bg-brand-bright text-brand-black shadow-[4px_4px_0px_0px_#1A1A1A]':
              toast.type === 'success',
            'bg-yellow-400 text-brand-black shadow-[4px_4px_0px_0px_#1A1A1A]':
              toast.type === 'warning'
          }"
        >
          <!-- Icon -->
          <div
            class="toast-icon flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border-2 border-brand-black"
            :class="{
              'bg-white/30': toast.type === 'error',
              'bg-brand-black/20': toast.type === 'success' || toast.type === 'warning'
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
              class="w-4 h-4 text-brand-black"
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
              class="w-4 h-4 text-brand-black"
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
          <span class="toast-message text-sm font-bold">{{ toast.message }}</span>
          <!-- Progress bar -->
          <div
            class="toast-progress absolute bottom-0 left-0 h-1 border-t-2 border-brand-black"
            :class="{
              'bg-white/50': toast.type === 'error',
              'bg-brand-teal': toast.type === 'success',
              'bg-brand-black/30': toast.type === 'warning'
            }"
          ></div>
        </div>
      </div>
    </Transition>

    <!-- Background Grid -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.12] bg-grid z-0"></div>

    <!-- Notebook lines background effect -->
    <div class="absolute inset-0 pointer-events-none notebook-lines opacity-30 z-0"></div>

    <!-- Hand-drawn decorative SVGs -->
    <svg
      class="absolute top-20 left-10 w-16 h-16 pointer-events-none z-0 opacity-20"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#2F7A72"
        stroke-width="2"
        stroke-dasharray="8 4"
        class="draw-in"
      />
    </svg>
    <svg
      class="absolute top-40 right-20 w-12 h-12 pointer-events-none z-0 opacity-15"
      viewBox="0 0 100 100"
    >
      <path
        d="M10 50 Q 50 10 90 50 Q 50 90 10 50"
        fill="none"
        stroke="#C92216"
        stroke-width="2"
        class="draw-in"
        style="animation-delay: 0.5s"
      />
    </svg>
    <svg
      class="absolute bottom-40 left-20 w-10 h-10 pointer-events-none z-0 opacity-15 hidden lg:block"
      viewBox="0 0 100 100"
    >
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        fill="none"
        stroke="#79dcaf"
        stroke-width="2"
        transform="rotate(12 50 50)"
        class="draw-in"
        style="animation-delay: 0.8s"
      />
    </svg>

    <!-- Navigation -->
    <header class="relative z-50 w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-6">
      <nav
        class="flex justify-between items-center scroll-animate fade-down"
        :class="{ animate: isVisible }"
      >
        <!-- Logo -->
        <RouterLink
          :to="authStore.isAuthenticated ? '/dashboard' : '/'"
          class="flex items-center gap-2 group"
        >
          <div
            class="relative w-10 h-10 bg-brand-black rounded-full flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 border-3 border-brand-black shadow-[3px_3px_0px_0px_#2F7A72] overflow-hidden"
          >
            <span class="font-display font-bold text-base text-brand-bright relative z-10">S.</span>
            <!-- Shine Effect -->
            <div
              class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <!-- Sonar Effect -->
            <div
              class="absolute inset-0 bg-brand-bright rounded-full opacity-0 group-hover:animate-sonar"
            ></div>
          </div>
          <span
            class="text-xl font-bold tracking-tight text-brand-black group-hover:text-brand-teal transition-colors hidden sm:inline"
          >
            Stay on Brand
          </span>
        </RouterLink>

        <!-- Sign In Button -->
        <RouterLink
          to="/login"
          class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright hidden md:flex items-center gap-2 wiggle-hover"
        >
          <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          <span class="relative z-10">SIGN IN</span>
        </RouterLink>
      </nav>
    </header>

    <!-- Main Content - Centered Layout -->
    <main
      class="relative z-10 min-h-screen w-full flex items-center justify-center pt-12 pb-20 px-6"
    >
      <div
        class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        <!-- Left Decorative Card -->
        <div class="hidden lg:flex lg:col-span-3 justify-end scroll-animate fade-left delay-200">
          <div
            class="w-48 h-48 border-3 border-brand-black rounded transform -rotate-6 flex flex-col items-center justify-center p-4 relative"
            style="box-shadow: 4px 4px 0px 0px #1a1a1a; background-color: #c92216"
          >
            <!-- Tape decoration -->
            <div
              class="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-brand-bright/80 border-2 border-brand-black transform rotate-[-2deg]"
            ></div>
            <div
              class="w-16 h-16 bg-white border-3 border-brand-black rounded-xl flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#1A1A1A]"
            >
              <svg
                class="w-8 h-8 text-brand-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span class="text-white font-bold text-sm">Secure</span>
            <span class="text-white/70 text-xs mt-1 font-script">256-bit SSL</span>
          </div>
        </div>

        <!-- Center Form Section -->
        <div class="lg:col-span-6 flex flex-col items-center text-center">
          <!-- Badge -->
          <div class="scroll-animate fade-up mb-6">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] transform rotate-[0.5deg]"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span class="text-xs font-bold uppercase tracking-wide text-white"
                >Create New Password</span
              >
            </div>
          </div>

          <!-- Heading -->
          <div class="scroll-animate fade-up delay-100 mb-6">
            <h1
              class="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.9] text-brand-black relative tracking-tight uppercase"
            >
              Set a new
            </h1>
            <div class="relative inline-block mt-2">
              <h1
                class="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.9] text-brand-red uppercase tracking-tight"
              >
                password
              </h1>
              <!-- Hand-drawn underline -->
              <svg
                class="absolute -bottom-2 left-0 w-full h-4 md:h-6"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q 50 2 100 8 T 200 6"
                  stroke="#79dcaf"
                  stroke-width="3"
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>

          <p
            class="scroll-animate fade-up delay-200 text-lg text-brand-gray font-light max-w-md leading-relaxed mb-8"
          >
            Choose a strong password that you haven't used before. Make it
            <span class="marker-highlight font-medium">memorable</span> but hard to guess.
          </p>

          <!-- Form Card -->
          <div
            v-if="!isSuccess"
            class="scroll-animate fade-up delay-300 w-full max-w-md card-hybrid paper-bg p-6 md:p-8 relative transform rotate-slight-left tape-decoration"
          >
            <!-- Decorative corner -->
            <div
              class="absolute -top-3 -right-3 w-8 h-8 bg-brand-bright border-3 border-brand-black rounded-lg shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-brand-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
              <!-- Email Address -->
              <div class="text-left">
                <label
                  class="block font-bold text-brand-black uppercase tracking-wide mb-2 font-script text-base"
                >
                  Email Address
                </label>
                <div class="relative">
                  <input
                    v-model="email"
                    type="email"
                    placeholder="name@example.com"
                    class="input-hybrid w-full px-4 py-3.5 bg-white border-2 border-brand-black/20 focus:border-brand-black focus:shadow-[3px_3px_0px_0px_#2F7A72] transition-all text-brand-black placeholder:text-brand-black/40 font-medium"
                    required
                  />
                </div>
              </div>

              <!-- Reset Code -->
              <div class="text-left">
                <label
                  class="block font-bold text-brand-black uppercase tracking-wide mb-2 font-script text-base"
                >
                  Reset Code
                </label>
                <div class="relative">
                  <input
                    v-model="code"
                    type="text"
                    placeholder="Enter 6-digit code from email"
                    class="input-hybrid w-full px-4 py-3.5 bg-white border-2 border-brand-black/20 focus:border-brand-black focus:shadow-[3px_3px_0px_0px_#2F7A72] transition-all text-brand-black placeholder:text-brand-black/40 font-medium"
                    maxlength="6"
                    required
                  />
                </div>
              </div>

              <!-- New Password -->
              <div class="text-left">
                <label
                  class="block font-bold text-brand-black uppercase tracking-wide mb-2 font-script text-base"
                >
                  New Password
                </label>
                <div class="relative">
                  <input
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="Enter new password"
                    class="input-hybrid w-full px-4 pr-12 py-3.5 bg-white border-2 border-brand-black/20 focus:border-brand-black focus:shadow-[3px_3px_0px_0px_#2F7A72] transition-all text-brand-black placeholder:text-brand-black/40 font-medium"
                    required
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/40 hover:text-brand-black transition-colors"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <svg
                      v-if="showNewPassword"
                      class="w-5 h-5"
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
                    <svg
                      v-else
                      class="w-5 h-5"
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
                  </button>
                </div>

                <!-- Password Strength Indicator -->
                <div v-if="newPassword" class="mt-3">
                  <div class="flex items-center gap-2 mb-1.5">
                    <div
                      class="flex-1 h-2 bg-brand-black/10 overflow-hidden flex gap-1 border-2 border-brand-black/20"
                    >
                      <div
                        v-for="i in 5"
                        :key="i"
                        class="flex-1 transition-all duration-300"
                        :class="
                          i <= passwordStrength.level ? passwordStrength.color : 'bg-transparent'
                        "
                      ></div>
                    </div>
                    <span
                      class="text-xs font-bold font-script"
                      :class="passwordStrength.color.replace('bg-', 'text-')"
                    >
                      {{ passwordStrength.text }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="text-left">
                <label
                  class="block font-bold text-brand-black uppercase tracking-wide mb-2 font-script text-base"
                >
                  Confirm Password
                </label>
                <div class="relative">
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm new password"
                    class="input-hybrid w-full px-4 pr-12 py-3.5 bg-white border-2 transition-all text-brand-black placeholder:text-brand-black/40 font-medium"
                    :class="{
                      'border-brand-red focus:border-brand-red focus:shadow-[3px_3px_0px_0px_#C92216]':
                        confirmPassword && !passwordsMatch,
                      'border-brand-bright focus:border-brand-bright focus:shadow-[3px_3px_0px_0px_#79dcaf]':
                        confirmPassword && passwordsMatch,
                      'border-brand-black/20 focus:border-brand-black focus:shadow-[3px_3px_0px_0px_#2F7A72]':
                        !confirmPassword
                    }"
                    required
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/40 hover:text-brand-black transition-colors"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <svg
                      v-if="showConfirmPassword"
                      class="w-5 h-5"
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
                    <svg
                      v-else
                      class="w-5 h-5"
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
                  </button>
                </div>

                <!-- Match indicator -->
                <div v-if="confirmPassword" class="mt-2 flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded border-2 border-brand-black flex items-center justify-center"
                    :class="passwordsMatch ? 'bg-brand-bright' : 'bg-brand-red'"
                  >
                    <svg
                      v-if="passwordsMatch"
                      class="w-3 h-3 text-brand-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <span
                    class="text-xs font-bold font-script"
                    :class="passwordsMatch ? 'text-brand-teal' : 'text-brand-red'"
                  >
                    {{ passwordsMatch ? 'Passwords match!' : 'Passwords do not match' }}
                  </span>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="
                  isLoading ||
                  !passwordsMatch ||
                  !newPassword ||
                  !confirmPassword ||
                  !email ||
                  !code
                "
                class="group relative w-full bg-brand-black text-white py-4 border-3 border-brand-black font-bold tracking-wide shadow-[4px_4px_0px_0px_#2F7A72] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2F7A72] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#2F7A72] mt-6 neo-button"
                :class="{ 'tech-loading': isLoading }"
              >
                <span v-if="isLoading" class="flex items-center gap-3">
                  <div class="tech-loader">
                    <div class="tech-circle"></div>
                    <div class="tech-circle"></div>
                    <div class="tech-circle"></div>
                    <div class="tech-pulse"></div>
                  </div>
                  <span class="tech-text">Processing</span>
                  <div class="tech-bars">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                  </div>
                </span>
                <template v-else>
                  <span class="relative z-10 uppercase">Change Password</span>
                  <svg
                    class="relative z-10 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </template>
              </button>
            </form>

            <!-- Password Requirements -->
            <div class="mt-6 pt-5 border-t-2 border-dashed border-brand-black/20">
              <p class="text-sm text-brand-black font-script mb-3">Password must contain:</p>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div
                  class="flex items-center gap-2 p-2 border-2 transition-all"
                  :class="
                    newPassword.length >= 8
                      ? 'border-brand-bright bg-brand-bright/20'
                      : 'border-brand-black/10 bg-white'
                  "
                >
                  <div
                    class="w-4 h-4 rounded border-2 border-brand-black flex items-center justify-center"
                    :class="newPassword.length >= 8 ? 'bg-brand-bright' : 'bg-white'"
                  >
                    <svg
                      v-if="newPassword.length >= 8"
                      class="w-2.5 h-2.5 text-brand-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span class="font-medium">8+ characters</span>
                </div>
                <div
                  class="flex items-center gap-2 p-2 border-2 transition-all"
                  :class="
                    /[A-Z]/.test(newPassword)
                      ? 'border-brand-bright bg-brand-bright/20'
                      : 'border-brand-black/10 bg-white'
                  "
                >
                  <div
                    class="w-4 h-4 rounded border-2 border-brand-black flex items-center justify-center"
                    :class="/[A-Z]/.test(newPassword) ? 'bg-brand-bright' : 'bg-white'"
                  >
                    <svg
                      v-if="/[A-Z]/.test(newPassword)"
                      class="w-2.5 h-2.5 text-brand-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span class="font-medium">Uppercase</span>
                </div>
                <div
                  class="flex items-center gap-2 p-2 border-2 transition-all"
                  :class="
                    /[0-9]/.test(newPassword)
                      ? 'border-brand-bright bg-brand-bright/20'
                      : 'border-brand-black/10 bg-white'
                  "
                >
                  <div
                    class="w-4 h-4 rounded border-2 border-brand-black flex items-center justify-center"
                    :class="/[0-9]/.test(newPassword) ? 'bg-brand-bright' : 'bg-white'"
                  >
                    <svg
                      v-if="/[0-9]/.test(newPassword)"
                      class="w-2.5 h-2.5 text-brand-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span class="font-medium">Number</span>
                </div>
                <div
                  class="flex items-center gap-2 p-2 border-2 transition-all"
                  :class="
                    /[^A-Za-z0-9]/.test(newPassword)
                      ? 'border-brand-bright bg-brand-bright/20'
                      : 'border-brand-black/10 bg-white'
                  "
                >
                  <div
                    class="w-4 h-4 rounded border-2 border-brand-black flex items-center justify-center"
                    :class="/[^A-Za-z0-9]/.test(newPassword) ? 'bg-brand-bright' : 'bg-white'"
                  >
                    <svg
                      v-if="/[^A-Za-z0-9]/.test(newPassword)"
                      class="w-2.5 h-2.5 text-brand-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span class="font-medium">Special char</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Success State -->
          <div
            v-else
            class="scroll-animate fade-up w-full max-w-2xl card-hybrid paper-bg p-8 text-center transform rotate-slight-right"
          >
            <!-- Tape decoration -->
            <div
              class="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-brand-bright/70 border-2 border-brand-black transform rotate-[-2deg]"
            ></div>

            <div
              class="w-20 h-20 mx-auto mb-6 bg-brand-bright border-3 border-brand-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1A] animate-float"
            >
              <svg
                class="w-10 h-10 text-brand-black"
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
            </div>
            <h3 class="text-3xl font-display font-bold text-brand-black mb-4 uppercase">
              Password Reset Complete!
            </h3>
            <p class="text-lg text-brand-gray font-light mb-6 max-w-md mx-auto leading-relaxed">
              Your password has been successfully updated. You're all set to dive back into your
              brand management journey.
            </p>
            <div
              class="bg-brand-teal/10 border-3 border-brand-teal/30 p-4 mb-6 transform rotate-[-0.3deg]"
            >
              <p class="text-sm text-brand-black font-script">
                <strong>Pro tip:</strong> Consider using a password manager to keep your credentials
                secure and easily accessible.
              </p>
            </div>
            <RouterLink
              to="/login"
              class="group relative inline-flex items-center gap-2 bg-brand-black text-white px-8 py-4 border-3 border-brand-black font-bold shadow-[4px_4px_0px_0px_#2F7A72] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2F7A72] neo-button"
            >
              <span class="uppercase">Sign In with New Password</span>
              <span class="font-script text-xl">→</span>
            </RouterLink>
          </div>
        </div>

        <!-- Right Decorative Card -->
        <div class="hidden lg:flex lg:col-span-3 justify-start scroll-animate fade-right delay-300">
          <div
            class="card-hybrid w-48 h-48 bg-brand-bright border-3 border-brand-black transform rotate-6 flex flex-col items-center justify-center p-4 corner-fold"
            style="box-shadow: 4px 4px 0px 0px #1a1a1a"
          >
            <div
              class="w-16 h-16 bg-white border-3 border-brand-black rounded-xl flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#1A1A1A]"
            >
              <svg
                class="w-8 h-8 text-brand-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span class="text-brand-black font-bold text-sm">Protected</span>
            <span class="text-brand-black/70 text-xs mt-1 font-script">End-to-End</span>
          </div>
        </div>
      </div>

      <!-- Floating decorative elements -->
      <div class="hidden xl:block absolute bottom-20 left-20 animate-float">
        <div
          class="w-12 h-12 bg-brand-teal border-3 border-brand-black rounded-lg transform rotate-12 shadow-[3px_3px_0px_0px_#1A1A1A]"
        ></div>
      </div>
      <div class="hidden xl:block absolute top-40 right-20 animate-float-delayed">
        <div
          class="w-8 h-8 bg-brand-red border-3 border-brand-black rounded-lg transform -rotate-12 shadow-[2px_2px_0px_0px_#1A1A1A]"
        ></div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full border-t-3 border-brand-black/10 bg-brand-bg relative z-10 py-8 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 bg-brand-teal border-2 border-brand-black rounded animate-pulse"
          ></div>
          <span class="text-xs font-bold text-brand-black/50 font-script"
            >Secure Connection Active</span
          >
        </div>

        <div class="flex gap-6">
          <RouterLink
            to="/help"
            class="text-sm font-semibold text-brand-black/60 hover:text-brand-teal transition-colors hand-underline"
          >
            Help Center
          </RouterLink>
          <RouterLink
            to="/privacy"
            class="text-sm font-semibold text-brand-black/60 hover:text-brand-teal transition-colors hand-underline"
          >
            Privacy
          </RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  /* Toast Notification Styles */
  .toast-container {
    perspective: 1000px;
  }

  .toast-content {
    position: relative;
    overflow: hidden;
    transform-origin: top center;
  }

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

  .toast-enter-active {
    animation: toast-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .toast-leave-active {
    animation: toast-out 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
  }

  @keyframes toast-in {
    0% {
      opacity: 0;
      transform: translateY(30px) rotate(-2deg);
    }
    100% {
      opacity: 1;
      transform: translateY(0) rotate(-0.5deg);
    }
  }

  @keyframes toast-out {
    0% {
      opacity: 1;
      transform: translateY(0) rotate(-0.5deg);
    }
    100% {
      opacity: 0;
      transform: translateY(20px) rotate(1deg);
    }
  }

  /* Tech Loading Animation */
  .tech-loading {
    background: linear-gradient(
      45deg,
      #1a1a1a 0%,
      #2d2d2d 25%,
      #1a1a1a 50%,
      #2d2d2d 75%,
      #1a1a1a 100%
    );
    background-size: 400% 400%;
    animation: tech-gradient 2s ease infinite;
  }

  @keyframes tech-gradient {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .tech-loader {
    position: relative;
    width: 24px;
    height: 24px;
  }

  .tech-circle {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2f7a72;
    animation: tech-orbit 2s linear infinite;
  }

  .tech-circle:nth-child(1) {
    animation-delay: 0s;
    background: #2f7a72;
  }

  .tech-circle:nth-child(2) {
    animation-delay: -0.6s;
    background: #79dcaf;
  }

  .tech-circle:nth-child(3) {
    animation-delay: -1.2s;
    background: #ffffff;
  }

  .tech-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: #79dcaf;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: tech-pulse 1s ease-in-out infinite;
  }

  @keyframes tech-orbit {
    0% {
      transform: rotate(0deg) translateX(10px) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) translateX(10px) rotate(-360deg);
    }
  }

  @keyframes tech-pulse {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0.5;
    }
  }

  .tech-text {
    animation: tech-glow 2s ease-in-out infinite;
  }

  @keyframes tech-glow {
    0%,
    100% {
      text-shadow: 0 0 5px rgba(121, 220, 175, 0.5);
    }
    50% {
      text-shadow:
        0 0 10px rgba(121, 220, 175, 0.8),
        0 0 15px rgba(47, 122, 114, 0.6);
    }
  }

  .tech-bars {
    display: flex;
    gap: 2px;
    align-items: end;
  }

  .tech-bars .bar {
    width: 3px;
    background: #79dcaf;
    border-radius: 1px;
    animation: tech-bars 1.2s ease-in-out infinite;
  }

  .tech-bars .bar:nth-child(1) {
    height: 8px;
    animation-delay: 0s;
  }

  .tech-bars .bar:nth-child(2) {
    height: 12px;
    animation-delay: 0.1s;
  }

  .tech-bars .bar:nth-child(3) {
    height: 6px;
    animation-delay: 0.2s;
  }

  .tech-bars .bar:nth-child(4) {
    height: 10px;
    animation-delay: 0.3s;
  }

  @keyframes tech-bars {
    0%,
    100% {
      transform: scaleY(1);
      opacity: 0.7;
    }
    50% {
      transform: scaleY(1.5);
      opacity: 1;
    }
  }

  /* Card hover effect */
  .card-hybrid {
    transition:
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.3s ease;
  }

  .card-hybrid:hover {
    transform: translateY(-2px) rotate(0deg);
  }
</style>
