<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { AuthService } from '@/services/auth'
  import { useAuthStore } from '@/stores/auth.store'
  import { LOGO_VIEWBOX, LOGO_PATH, LOGO_TRANSFORM } from '@/constants/logo'

  const router = useRouter()
  const authStore = useAuthStore()

  // Form state
  const email = ref('')
  const isLoading = ref(false)
  const isSubmitted = ref(false)

  // Animation state
  const isVisible = ref(false)

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

  onMounted(() => {
    setTimeout(() => {
      isVisible.value = true
    }, 100)

    // Setup flashlight effect for cards
    setupFlashlightEffect()

    // Setup intersection observer for reveal animations
    setupRevealObserver()
  })

  const setupFlashlightEffect = () => {
    const cards = document.querySelectorAll('.flashlight-card')
    cards.forEach(card => {
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = mouseEvent.clientX - rect.left
        const y = mouseEvent.clientY - rect.top
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    })
  }

  const setupRevealObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    document.querySelectorAll('.scroll-animate, .dash-draw').forEach(el => {
      observer.observe(el)
    })
  }

  const handleSubmit = async () => {
    if (!email.value) return

    console.log('=== FORGOT PASSWORD FORM SUBMIT ===')
    console.log('Email:', email.value)

    isLoading.value = true

    try {
      console.log('Calling AuthService.forgotPassword...')
      const result = await AuthService.forgotPassword(email.value)
      console.log('Forgot password success:', result)

      isLoading.value = false
      showToast('Reset code sent to your email!', 'success')

      // Navigate to reset password page with email
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.value)}`)
      }, 1500)
    } catch (error) {
      console.error('Forgot password failed:', error)
      isLoading.value = false
      showToast(getCleanErrorMessage(error as Error), 'error')
    }
  }

  // Troubleshooting tips data
  const troubleshootingTips = [
    {
      icon: 'inbox',
      title: 'Check Spam Folder',
      description: 'Sometimes our emails like to hide in Junk or Promotions tabs.',
      color: 'bg-brand-teal'
    },
    {
      icon: 'timer',
      title: 'Wait 5 Minutes',
      description: 'Email delivery can occasionally be delayed by your provider.',
      color: 'bg-brand-bright'
    },
    {
      icon: 'lifebuoy',
      title: 'Contact Support',
      description: 'Still nothing? Our team is ready to help you manually.',
      color: 'bg-brand-red'
    },
    {
      icon: 'globe',
      title: 'SSO Login',
      description: "If you used Google or Apple to sign up, you don't have a password.",
      color: 'bg-brand-teal'
    }
  ]

  // Duplicate tips for seamless marquee
  const allTips = [...troubleshootingTips, ...troubleshootingTips]
</script>

<template>
  <div class="bg-brand-bg text-brand-black relative flex flex-col font-sans min-h-screen">
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

    <!-- Modern Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="toast-container fixed bottom-6 left-0 right-0 flex justify-center z-50"
        @click="dismissToast"
      >
        <div
          class="toast-content flex items-center gap-3 px-5 py-3.5 border-3 border-brand-black cursor-pointer paper-bg"
          :class="{
            'shadow-[4px_4px_0px_0px_#C92216]': toast.type === 'error',
            'shadow-[4px_4px_0px_0px_#2F7A72]': toast.type === 'success',
            'shadow-[4px_4px_0px_0px_#1A1A1A]': toast.type === 'warning'
          }"
        >
          <!-- Icon -->
          <div
            class="toast-icon flex-shrink-0 w-8 h-8 rounded-lg border-2 border-brand-black flex items-center justify-center"
            :class="{
              'bg-brand-red': toast.type === 'error',
              'bg-brand-teal': toast.type === 'success',
              'bg-brand-bright': toast.type === 'warning'
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
          <span class="toast-message text-sm font-bold text-brand-black">{{ toast.message }}</span>
        </div>
      </div>
    </Transition>

    <!-- Navigation -->
    <nav
      class="relative z-50 w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between scroll-animate fade-down"
    >
      <!-- Logo -->
      <RouterLink
        :to="authStore.isAuthenticated ? '/dashboard' : '/'"
        class="group cursor-pointer relative"
      >
        <!-- Sonar Effect -->
        <div
          class="absolute inset-0 bg-brand-bright rounded-full opacity-0 group-hover:animate-sonar"
        ></div>
        <!-- Main Logo -->
        <div
          class="relative w-12 h-12 bg-brand-black rounded-full flex items-center justify-center text-brand-bg transition-all duration-300 hover:scale-105 border-2 border-brand-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(47,122,114,0.4)] group-hover:shadow-[3px_3px_0px_0px_rgba(47,122,114,0.5)]"
        >
          <svg :viewBox="LOGO_VIEWBOX" class="w-7 h-7 transition-colors" fill="currentColor">
            <path
              :d="LOGO_PATH"
              class="text-brand-bright group-hover:text-brand-bg transition-colors"
              :transform="LOGO_TRANSFORM"
            />
          </svg>
        </div>
      </RouterLink>

      <!-- Center Badge -->
      <div class="hidden md:flex absolute left-1/2 -translate-x-1/2">
        <div
          class="bg-brand-bright border-3 border-brand-black px-4 py-2 rounded-[4px] shadow-[4px_4px_0px_0px_#1A1A1A] transform rotate-[0.5deg]"
        >
          <span class="font-script text-lg text-brand-black">Password Recovery</span>
        </div>
      </div>

      <!-- Right Nav Items -->
      <RouterLink
        to="/login"
        class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright flex items-center gap-2 wiggle-hover"
      >
        <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span class="z-10 relative">BACK TO LOGIN</span>
      </RouterLink>
    </nav>

    <!-- Main Content -->
    <main class="relative min-h-screen w-full flex flex-col pt-12 pb-20 overflow-hidden">
      <!-- Hero Section -->
      <section
        class="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <!-- Left Column: Copy & Form -->
        <div class="flex flex-col items-start text-left relative">
          <!-- Badge -->
          <div class="scroll-animate fade-up mb-8 relative">
            <div
              class="absolute -left-12 top-1 w-8 h-8 rounded-full border-3 border-brand-black flex items-center justify-center text-xs font-bold bg-white shadow-[3px_3px_0px_0px_#2F7A72] z-20 hidden xl:flex transform rotate-[-3deg]"
            >
              <span class="font-script text-base">01</span>
            </div>
            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[4px] bg-brand-bright border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] transform rotate-[-0.5deg]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span class="text-xs font-bold uppercase tracking-wide">Secure Recovery</span>
            </div>
          </div>

          <!-- Heading -->
          <div class="leading-none flex flex-col relative items-start">
            <div class="relative scroll-animate fade-up delay-100">
              <!-- Hand-drawn circle decoration -->
              <div
                class="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-brand-black bg-brand-bg flex items-center justify-center shadow-[3px_3px_0px_0px_#2F7A72] transform rotate-[-3deg] animate-float"
              >
                <svg
                  class="w-5 h-5 text-brand-teal"
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
              <h1
                class="md:text-7xl lg:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
              >
                Forgot your
              </h1>
            </div>
            <div class="relative scroll-animate fade-up delay-200 mt-2">
              <h1
                class="md:text-7xl lg:text-8xl uppercase text-brand-red leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
              >
                password?
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
              <!-- Floating badge -->
              <div
                class="absolute -right-2 md:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-brand-black bg-brand-bright flex items-center justify-center shadow-[3px_3px_0px_0px_#C92216] transform rotate-[3deg] animate-float-delayed"
              >
                <svg
                  class="w-5 h-5 text-brand-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
            </div>
          </div>

          <p
            class="scroll-animate fade-up delay-300 mt-10 text-brand-gray max-w-lg text-base md:text-lg font-light leading-relaxed"
          >
            Don't worry, it happens. Enter the email address associated with your account and we'll
            send you a magic link to regain access.
          </p>

          <!-- Input Form -->
          <div
            v-if="!isSubmitted"
            class="scroll-animate fade-up delay-400 w-full max-w-md card-hybrid paper-bg p-4 mt-10 transform rotate-slight-left tape-decoration overflow-visible"
          >
            <form
              class="flex flex-col sm:flex-row gap-3 relative z-10"
              @submit.prevent="handleSubmit"
            >
              <div class="flex-grow relative">
                <input
                  v-model="email"
                  type="email"
                  placeholder="name@example.com"
                  class="input-hybrid w-full h-full px-4 py-3 text-brand-black placeholder:text-brand-black/40 font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative bg-brand-teal text-white px-6 py-3 rounded-[4px] border-3 border-brand-black font-bold tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed neo-button"
              >
                <span v-if="isLoading" class="flex items-center gap-2">
                  <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                  </div>
                  <span class="loading-text">Sending</span>
                  <span class="loading-dots">
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                    <span class="dot">.</span>
                  </span>
                </span>
                <template v-else>
                  <span class="relative z-10">Send Code</span>
                  <svg
                    class="relative z-10 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </template>
              </button>
            </form>
          </div>

          <!-- Success Message -->
          <div
            v-else
            class="scroll-animate fade-up w-full max-w-md card-hybrid paper-bg p-6 text-center mt-10 transform rotate-slight-right"
            style="box-shadow: 4px 4px 0px 0px #2f7a72"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-bright border-3 border-brand-black flex items-center justify-center shadow-[3px_3px_0px_0px_#1A1A1A]"
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
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-brand-black mb-2">Check your inbox!</h3>
            <p class="text-brand-gray text-sm font-script">
              We've sent a password reset link to
              <span class="font-semibold text-brand-teal">{{ email }}</span>
            </p>
          </div>
        </div>

        <!-- Right Column: Illustrations -->
        <div
          class="relative w-full flex flex-col items-center lg:items-end scroll-animate fade-up delay-300"
        >
          <!-- 02 Badge -->
          <div
            class="absolute right-4 lg:right-0 top-0 w-8 h-8 rounded-full border-3 border-brand-black flex items-center justify-center text-xs font-bold bg-white shadow-[3px_3px_0px_0px_#C92216] z-20 animate-bounce hidden xl:flex transform rotate-[3deg]"
          >
            <span class="font-script text-base">02</span>
          </div>

          <!-- Cards Container - Overlapping -->
          <div class="relative h-[320px] lg:h-[360px] w-64 lg:w-72">
            <!-- Red Card (Back) -->
            <div
              class="illustration-card absolute top-0 right-0 w-56 lg:w-64 h-52 lg:h-60 card-hybrid transform rotate-[6deg] flex flex-col items-center justify-center p-4 z-0"
              style="background: #c92216; box-shadow: 4px 4px 0px 0px #1a1a1a"
            >
              <div
                class="w-16 lg:w-20 h-16 lg:h-20 bg-white border-3 border-brand-black rounded-full overflow-hidden mb-3 relative flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A]"
              >
                <svg
                  class="w-8 lg:w-10 h-8 lg:h-10 text-brand-black"
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
              <h3 class="font-bold text-white text-lg">Encrypted</h3>
              <div
                class="mt-2 bg-white border-2 border-brand-black px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#1A1A1A]"
              >
                End-to-End
              </div>
            </div>

            <!-- Bright Card (Front) - Overlapping -->
            <div
              class="illustration-card absolute top-16 lg:top-20 left-0 w-56 lg:w-64 h-56 lg:h-64 card-hybrid transform rotate-[-3deg] flex flex-col items-center justify-center p-4 z-10 group cursor-default paper-bg"
            >
              <!-- Sonar effect behind icon -->
              <div
                class="absolute top-[25%] left-[50%] -translate-x-1/2 w-20 h-20 bg-brand-teal rounded-full animate-sonar-slow opacity-50"
              ></div>

              <div
                class="w-20 lg:w-24 h-20 lg:h-24 bg-white border-3 border-brand-black rounded-full overflow-hidden mb-3 relative z-10 flex items-center justify-center shadow-[3px_3px_0px_0px_#2F7A72]"
              >
                <svg
                  class="w-10 lg:w-12 h-10 lg:h-12 text-brand-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>
              <h3 class="font-bold text-lg text-brand-black">Check Inbox</h3>
              <div
                class="mt-2 bg-brand-bright border-2 border-brand-black px-4 py-1.5 rounded-[4px] text-xs font-bold uppercase tracking-wider group-hover:bg-brand-black group-hover:text-white transition-colors shadow-[2px_2px_0px_0px_#1A1A1A]"
              >
                Instructions Sent
              </div>
            </div>
          </div>

          <!-- Toast Notification Card - Below the cards -->
          <div
            class="card-hybrid px-5 py-3 flex items-center gap-3 animate-float z-20 mt-20 lg:mt-24"
            style="background: #1a1a1a; box-shadow: 4px 4px 0px 0px #2f7a72"
          >
            <div
              class="w-6 h-6 rounded-full bg-brand-bright text-brand-black flex items-center justify-center shrink-0 border-2 border-brand-black"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p class="text-xs font-bold leading-tight text-brand-bg">
              Link expires in 60 minutes for security.
            </p>
          </div>
        </div>
      </section>

      <!-- Marquee Section (Troubleshooting) -->
      <section class="mt-32 w-full relative z-10 flex flex-col gap-8 scroll-animate fade-up">
        <div class="text-center relative max-w-7xl mx-auto w-full px-6">
          <!-- 03 Badge -->
          <div
            class="absolute left-1/2 -top-16 -translate-x-1/2 w-8 h-8 rounded-full border-3 border-brand-black flex items-center justify-center text-xs font-bold bg-brand-teal text-white shadow-[3px_3px_0px_0px_#1A1A1A] z-20 hidden md:flex transform rotate-[-2deg]"
          >
            <span class="font-script text-base">03</span>
          </div>

          <span
            class="font-script text-lg text-brand-red transform rotate-[-1deg] inline-block mb-2"
            >#HelpfulTips</span
          >
          <h2
            class="text-3xl font-display font-bold text-brand-black mb-2 hand-underline hand-underline-teal inline-block"
          >
            Troubleshooting
          </h2>
        </div>

        <!-- Marquee Container -->
        <div class="w-full overflow-hidden relative py-10">
          <!-- Fade Masks -->
          <div
            class="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-brand-bg to-transparent z-20 pointer-events-none"
          ></div>
          <div
            class="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-brand-bg to-transparent z-20 pointer-events-none"
          ></div>

          <div
            class="flex w-max animate-marquee hover:[animation-play-state:paused] items-stretch gap-6 pl-6"
          >
            <div
              v-for="(tip, index) in allTips"
              :key="index"
              class="flashlight-card relative group w-[280px] lg:w-[300px] card-hybrid paper-bg p-6 flex flex-col gap-4 transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#2F7A72] shrink-0 transform"
              :class="index % 2 === 0 ? 'rotate-slight-left' : 'rotate-slight-right'"
            >
              <div
                class="w-12 h-12 rounded-lg border-3 border-brand-black flex items-center justify-center shadow-[2px_2px_0px_0px_#1A1A1A]"
                :class="tip.color"
              >
                <!-- Inbox Icon -->
                <svg
                  v-if="tip.icon === 'inbox'"
                  class="w-6 h-6"
                  :class="tip.color === 'bg-brand-bright' ? 'text-brand-black' : 'text-white'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <!-- Timer Icon -->
                <svg
                  v-else-if="tip.icon === 'timer'"
                  class="w-6 h-6"
                  :class="tip.color === 'bg-brand-bright' ? 'text-brand-black' : 'text-white'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <!-- Lifebuoy Icon -->
                <svg
                  v-else-if="tip.icon === 'lifebuoy'"
                  class="w-6 h-6"
                  :class="tip.color === 'bg-brand-bright' ? 'text-brand-black' : 'text-white'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <!-- Globe Icon -->
                <svg
                  v-else-if="tip.icon === 'globe'"
                  class="w-6 h-6"
                  :class="tip.color === 'bg-brand-bright' ? 'text-brand-black' : 'text-white'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg text-brand-black mb-1">{{ tip.title }}</h3>
                <p class="text-sm text-brand-gray leading-relaxed font-script">
                  {{ tip.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer
      class="relative z-10 w-full border-t-3 border-brand-black bg-brand-bg py-8 px-6 md:px-12"
    >
      <div
        class="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div class="flex items-center gap-4">
          <RouterLink
            :to="authStore.isAuthenticated ? '/dashboard' : '/'"
            class="group cursor-pointer relative"
          >
            <!-- Sonar Effect -->
            <div
              class="absolute inset-0 bg-brand-bright rounded-full opacity-0 group-hover:animate-sonar"
            ></div>
            <!-- Main Logo -->
            <div
              class="relative w-10 h-10 bg-brand-black rounded-full flex items-center justify-center text-brand-bg transition-all duration-300 hover:scale-105 border-2 border-brand-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(47,122,114,0.4)] group-hover:shadow-[3px_3px_0px_0px_rgba(47,122,114,0.5)]"
            >
              <svg :viewBox="LOGO_VIEWBOX" class="w-6 h-6 transition-colors" fill="currentColor">
                <path
                  :d="LOGO_PATH"
                  class="text-brand-bright group-hover:text-brand-bg transition-colors"
                  :transform="LOGO_TRANSFORM"
                />
              </svg>
            </div>
          </RouterLink>
          <span class="font-script text-base text-brand-black/60"
            >&copy; {{ new Date().getFullYear() }} Stay on Brand</span
          >
        </div>

        <div class="flex gap-8">
          <RouterLink
            to="/help"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors hand-underline"
          >
            Support Center
          </RouterLink>
          <RouterLink
            to="/login"
            class="text-sm font-medium text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors"
          >
            Login Help
          </RouterLink>
          <RouterLink
            to="/privacy"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors hand-underline"
          >
            Privacy
          </RouterLink>
        </div>

        <!-- Status Badge -->
        <div
          class="bg-brand-bright border-3 border-brand-black px-4 py-2 rounded-[4px] shadow-[2px_2px_0px_0px_#1A1A1A] transform rotate-[0.5deg] flex items-center gap-2"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-teal"></span>
          </span>
          <span class="text-xs font-bold text-brand-black">System Operational</span>
        </div>
      </div>
    </footer>

    <!-- Floating Decorative Element -->
    <div class="fixed bottom-8 right-8 hidden lg:block animate-float z-10 pointer-events-none">
      <div
        class="w-14 h-14 bg-brand-bright rounded-xl border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center transform rotate-[5deg]"
      >
        <svg
          class="w-6 h-6 text-brand-black"
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
    </div>
  </div>
</template>

<style scoped>
  /* Sonar animation for logo */
  @keyframes sonar {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }

  .group-hover\:animate-sonar {
    animation: sonar 1.5s ease-out infinite;
  }

  /* Marquee animation */
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    animation: marquee 30s linear infinite;
  }

  /* Flashlight Effect */
  .flashlight-card {
    --mouse-x: 0px;
    --mouse-y: 0px;
  }

  .flashlight-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      400px circle at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.4),
      transparent 40%
    );
    z-index: 2;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
    border-radius: inherit;
  }

  .flashlight-card:hover::before {
    opacity: 1;
  }

  /* Illustration Card Swap Animation */
  .illustration-card {
    transition:
      transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
      z-index 0s,
      box-shadow 0.4s ease,
      filter 0.4s ease;
    cursor: pointer;
    will-change: transform, z-index;
  }

  .illustration-card:hover {
    z-index: 30 !important;
    transform: scale(1.08) rotate(0deg) translateY(-10px) !important;
    box-shadow: 8px 8px 0px 0px #1a1a1a !important;
    filter: brightness(1.05);
  }

  .illustration-card:not(:hover) {
    transition:
      transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
      z-index 0.3s step-end,
      box-shadow 0.4s ease,
      filter 0.4s ease;
  }

  /* When one card is hovered, dim the other slightly */
  .illustration-card:hover ~ .illustration-card,
  .illustration-card:has(~ .illustration-card:hover) {
    filter: brightness(0.95);
    transform: scale(0.98);
  }

  /* Toast Notification Styles */
  .toast-container {
    perspective: 1000px;
  }

  .toast-content {
    position: relative;
    overflow: hidden;
    transform-origin: top center;
    border-radius: 4px;
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

  /* Loading Spinner Styles */
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

  /* Custom scrollbar */
  .hide-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .hide-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .hide-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(26, 26, 26, 0.2);
    border-radius: 2px;
  }

  .hide-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(26, 26, 26, 0.4);
  }
</style>
