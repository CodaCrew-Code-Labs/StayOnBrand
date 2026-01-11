<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  import { AuthService } from '@/services/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  // Computed home link - dashboard for logged in, landing for logged out
  const homeLink = computed(() => (authStore.isAuthenticated ? '/dashboard' : '/'))

  // Handle subscribe button click - redirect based on auth status
  function handleSubscribeClick(plan: string) {
    if (authStore.isAuthenticated) {
      router.push({ path: '/confirm-subscription', query: { plan } })
    } else {
      router.push({ path: '/login', query: { redirect: `/confirm-subscription?plan=${plan}` } })
    }
  }

  // Handle sign out
  function handleSignOut() {
    AuthService.logout()
    authStore.logout()
    router.push('/login')
  }

  // Billing toggle state
  const isYearlyBilling = ref(true)

  // Scroll animation observer
  let scrollObserver: IntersectionObserver | null = null

  // Pricing plans data
  const pricingPlans = computed(() => ({
    starter: {
      name: 'STARTER',
      number: '01',
      description: 'Perfect for getting started with brand color validation',
      monthly: 0,
      yearly: 0,
      features: [
        { text: '5 color checks per day', icon: 'check' },
        { text: 'Max 2 Colors per check', icon: 'check' },
        { text: 'Basic WCAG compliance', icon: 'check' },
        { text: '1 brand palette', icon: 'check' }
      ],
      cta: 'Get Started Free',
      ctaStyle: 'outline',
      accentColor: 'brand-gray'
    },
    professional: {
      name: 'PRO',
      number: '02',
      description: 'Unlimited validation with team features',
      monthly: 5,
      yearly: 48,
      features: [
        { text: 'Use your domain', icon: 'star', highlight: true },
        { text: 'Unlimited color checks', icon: 'check' },
        { text: 'Max 3 colors per check', icon: 'check' },
        { text: 'Full WCAG 2.1 AA + AAA', icon: 'check' },
        { text: '7-day free trial', icon: 'clock' }
      ],
      cta: 'Subscribe Now',
      ctaStyle: 'primary',
      accentColor: 'brand-teal',
      popular: true
    },
    business: {
      name: 'BUSINESS',
      number: '03',
      description: 'Custom solutions for large teams',
      monthly: 20,
      yearly: 192,
      features: [
        { text: 'Teammate SSO / SAML', icon: 'shield', highlight: true },
        { text: 'Includes 3 pages of any type', icon: 'check' },
        { text: 'Custom yearly invoicing', icon: 'check' },
        { text: 'Unlimited team & subs', icon: 'check' },
        { text: '30-day free trial', icon: 'clock' }
      ],
      cta: 'Subscribe Now',
      ctaStyle: 'outline',
      accentColor: 'brand-purple'
    }
  }))

  // Comparison table data
  const comparisonFeatures = [
    { name: 'Monitors', starter: '15', pro: '50', business: '1,000' },
    { name: 'Checks', starter: '2 min', pro: '30 sec', business: '30 sec' },
    { name: 'Alerts', starter: 'Email', pro: 'Email & SMS', business: 'SMS & Calls' },
    { name: 'Team members', starter: '5', pro: '50', business: 'unlimited' },
    { name: 'On-call members', starter: '2', pro: '20', business: '50' },
    { name: 'SAML SSO', starter: false, pro: false, business: true },
    { name: 'Status page type', starter: 'Public', pro: 'toggle', business: 'All' },
    { name: 'Custom domain', starter: false, pro: '1', business: '3' }
  ]

  // Animated title characters
  const titleChars = 'PRICING'.split('')
  const subtitleChars = 'GROWS'.split('')
  const lastLineChars = 'WITH YOU'.split('')

  // Initialize scroll animations
  function initScrollAnimations() {
    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    }

    scrollObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
        }
      })
    }, options)

    nextTick(() => {
      document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver?.observe(el)
      })
    })
  }

  onMounted(() => {
    initScrollAnimations()
  })

  onUnmounted(() => {
    if (scrollObserver) {
      scrollObserver.disconnect()
    }
  })
</script>

<template>
  <div class="bg-brand-bg text-brand-black relative flex flex-col font-sans min-h-screen">
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <!-- Dot Grid -->
      <div class="absolute inset-0 opacity-[0.12] bg-grid"></div>
      <!-- Gradient Mesh -->
      <div
        class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-teal/5 blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-red/5 blur-[120px]"
      ></div>
    </div>

    <!-- Navigation -->
    <header
      class="z-50 md:px-12 w-full max-w-screen-2xl mr-auto ml-auto pt-6 px-6 pb-6 relative scroll-animate fade-down"
    >
      <nav class="flex w-full items-center justify-between">
        <!-- Left Nav Items -->
        <div class="gap-3 hidden md:flex">
          <RouterLink
            to="/terms"
            class="group text-brand-black border-brand-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright text-xs font-semibold tracking-wide border rounded-full pt-2 px-5 pb-2 relative shadow-[3px_3px_0px_0px_#1A1A1A]"
          >
            <span class="z-10 relative">TERMS OF SERVICE</span>
          </RouterLink>
          <RouterLink
            to="/help"
            class="group text-brand-black border-brand-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright text-xs font-semibold tracking-wide border rounded-full pt-2 px-5 pb-2 relative shadow-[3px_3px_0px_0px_#1A1A1A]"
          >
            <span class="z-10 relative">WHAT'S WCAG ???</span>
          </RouterLink>
        </div>

        <!-- Mobile Menu Icon -->
        <button class="md:hidden text-brand-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        <!-- Center Logo -->
        <RouterLink
          :to="homeLink"
          class="group cursor-pointer transform -translate-x-1/2 absolute left-1/2"
        >
          <div
            class="absolute inset-0 bg-brand-bright rounded-full opacity-0 group-hover:animate-sonar"
          ></div>
          <div
            class="w-10 h-10 bg-brand-black rounded-full flex items-center justify-center text-brand-bg transition-transform hover:scale-105 border border-brand-black relative overflow-hidden"
          >
            <span class="font-display font-bold tracking-tighter text-lg text-brand-bright"
              >S.</span
            >
          </div>
        </RouterLink>

        <!-- Right Nav Items -->
        <div class="flex gap-3 items-center">
          <RouterLink
            :to="homeLink"
            class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-full border border-brand-black font-semibold text-xs tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright hidden md:flex"
          >
            <span class="z-10 relative">{{
              authStore.isAuthenticated ? 'DASHBOARD' : 'HOME'
            }}</span>
          </RouterLink>
          <!-- Show login/signup for guests -->
          <template v-if="!authStore.isAuthenticated">
            <RouterLink
              to="/login"
              class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-full border border-brand-black font-semibold text-xs tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright hidden md:flex"
            >
              <span class="z-10 relative">LOGIN</span>
            </RouterLink>
            <RouterLink
              to="/signup"
              class="group relative bg-brand-bright text-brand-black px-5 py-2 rounded-full border border-brand-black font-semibold text-xs tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden"
            >
              <span class="relative z-10">GET STARTED</span>
            </RouterLink>
          </template>
          <!-- Show sign out for authenticated users -->
          <template v-else>
            <button
              class="group relative bg-brand-bright text-brand-black px-5 py-2 rounded-full border border-brand-black font-semibold text-xs tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden"
              @click="handleSignOut"
            >
              <span class="relative z-10">SIGN OUT</span>
            </button>
          </template>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main
      class="relative z-10 w-full max-w-screen-2xl mx-auto px-4 pt-12 pb-20 flex flex-col items-center"
    >
      <!-- Card Frame Wrapper -->
      <div
        class="w-full relative bg-brand-bg/40 backdrop-blur-sm border border-brand-black/5 rounded-[3rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        <!-- Vertical Container Lines -->
        <div
          class="absolute inset-0 pointer-events-none flex justify-between px-[15%] md:px-[25%] lg:px-[33.33%] z-0 opacity-10"
        >
          <div class="w-px h-full bg-brand-black"></div>
          <div class="hidden lg:block w-px h-full bg-brand-black absolute right-[33.33%]"></div>
        </div>

        <!-- Hero Section -->
        <section class="relative py-20 md:py-32 flex flex-col items-center text-center z-10">
          <!-- Animated Title -->
          <h1
            class="font-display font-semibold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] text-brand-black mb-8 flex flex-col gap-2 items-center"
          >
            <!-- PRICING -->
            <div
              class="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden pb-2 scroll-animate fade-up"
            >
              <span
                v-for="(char, index) in titleChars"
                :key="'title-' + index"
                class="char-wrapper"
              >
                <span
                  class="char inline-block"
                  :style="{ animationDelay: `${0.05 + index * 0.05}s` }"
                  >{{ char }}</span
                >
              </span>
            </div>

            <!-- that GROWS -->
            <div
              class="flex flex-wrap justify-center gap-x-4 md:gap-x-6 items-center scroll-animate fade-up delay-200"
            >
              <span
                class="text-brand-black/40 text-3xl md:text-5xl lg:text-6xl font-serif italic font-light tracking-tight mr-2 md:mr-4"
                >that</span
              >

              <div class="relative inline-block">
                <div class="flex overflow-hidden">
                  <span
                    v-for="(char, index) in subtitleChars"
                    :key="'sub-' + index"
                    class="char-wrapper"
                  >
                    <span
                      class="char inline-block"
                      :style="{ animationDelay: `${0.4 + index * 0.05}s` }"
                      >{{ char }}</span
                    >
                  </span>
                </div>
                <!-- Strikethrough Effect -->
                <div class="strikethrough-line"></div>
              </div>
            </div>

            <!-- WITH YOU -->
            <div
              class="flex flex-wrap justify-center gap-x-4 md:gap-x-6 overflow-hidden scroll-animate fade-up delay-300"
            >
              <template v-for="(char, index) in lastLineChars" :key="'last-' + index">
                <span v-if="char === ' '" class="w-4 md:w-8"></span>
                <span v-else class="char-wrapper">
                  <span
                    class="char inline-block"
                    :style="{ animationDelay: `${0.65 + index * 0.05}s` }"
                    >{{ char }}</span
                  >
                </span>
              </template>
            </div>
          </h1>

          <p
            class="text-lg md:text-xl text-brand-black/60 max-w-xl mx-auto mb-10 leading-relaxed font-sans font-medium scroll-animate fade-up delay-400"
          >
            We won't punish you for success. Flat-rate pricing that scales only when you're ready.
          </p>

          <!-- Billing Toggle -->
          <div
            class="bg-white p-1.5 rounded-full border border-brand-black/10 shadow-[4px_4px_0px_0px_#1A1A1A] inline-flex items-center relative gap-1 scroll-animate fade-up delay-500"
          >
            <button
              :class="[
                'relative px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all z-10',
                !isYearlyBilling
                  ? 'text-brand-black bg-brand-bright shadow-sm border border-brand-black/10'
                  : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
              ]"
              @click="isYearlyBilling = false"
            >
              MONTHLY
            </button>
            <button
              :class="[
                'relative px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all z-10',
                isYearlyBilling
                  ? 'text-brand-black bg-brand-bright shadow-sm border border-brand-black/10'
                  : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
              ]"
              @click="isYearlyBilling = true"
            >
              YEARLY
            </button>
          </div>
        </section>

        <!-- Pricing Cards Section -->
        <section class="relative px-4 pb-20 md:px-12 lg:px-20 z-10">
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto items-stretch"
          >
            <!-- Card 1: Starter -->
            <div
              class="group relative flex flex-col h-full bg-brand-card text-brand-bg rounded-3xl p-8 border border-white/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-[8px_8px_0px_0px_#2F7A72] hover:shadow-[4px_4px_0px_0px_#2F7A72] scroll-animate fade-up delay-100"
            >
              <!-- Floating Number -->
              <div
                class="absolute top-6 right-6 font-mono text-xs text-white/20 group-hover:text-brand-teal/50 transition-colors"
              >
                01
              </div>

              <!-- Glow on hover -->
              <div
                class="absolute -top-20 -right-20 w-40 h-40 bg-brand-teal/0 group-hover:bg-brand-teal/10 blur-[60px] rounded-full pointer-events-none transition-all duration-500"
              ></div>

              <div class="mb-8 relative z-10">
                <h3
                  class="text-xs font-bold tracking-[0.2em] uppercase text-brand-gray mb-4 group-hover:text-brand-teal transition-colors"
                >
                  Starter
                </h3>
                <div class="flex items-baseline gap-1">
                  <span
                    class="text-5xl font-display font-bold tracking-tighter group-hover:text-brand-bright transition-colors"
                    >Free</span
                  >
                </div>
                <div class="h-6 mt-2"></div>
              </div>

              <ul class="flex flex-col gap-4 mb-8 flex-grow relative z-10">
                <li
                  class="flex items-center gap-3 text-sm text-white/70 group-hover:text-white/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-teal transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  5 color checks per day
                </li>
                <li
                  class="flex items-center gap-3 text-sm text-white/70 group-hover:text-white/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-teal transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Max 2 Colors per check
                </li>
                <li
                  class="flex items-center gap-3 text-sm text-white/70 group-hover:text-white/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-teal transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Basic WCAG compliance
                </li>
                <li
                  class="flex items-center gap-3 text-sm text-white/70 group-hover:text-white/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-teal transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  1 brand palette
                </li>
              </ul>

              <RouterLink
                to="/signup"
                class="w-full py-3 rounded-xl border border-white/10 text-center text-sm font-semibold hover:bg-white/5 transition-colors relative z-10 group-hover:border-brand-teal/30"
              >
                Get Started
              </RouterLink>
            </div>

            <!-- Card 2: Pro (Featured) -->
            <div
              class="group relative flex flex-col bg-brand-black text-brand-bg rounded-3xl p-8 border border-brand-teal/30 hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-[8px_8px_0px_0px_#79dcaf] hover:shadow-[4px_4px_0px_0px_#79dcaf] scroll-animate fade-up delay-200"
            >
              <!-- Popular Badge -->
              <div
                class="absolute -top-0 left-1/2 -translate-x-1/2 bg-brand-bright text-brand-black text-[10px] font-bold tracking-wider px-4 py-1 rounded-b-lg uppercase"
              >
                Most Popular
              </div>

              <!-- Glow Effect -->
              <div
                class="absolute -top-20 -right-20 w-40 h-40 bg-brand-teal/20 blur-[60px] rounded-full pointer-events-none"
              ></div>

              <div class="absolute top-6 right-6 font-mono text-xs text-brand-teal">02</div>

              <div class="mb-8 mt-4">
                <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-brand-teal mb-4">
                  Professional
                </h3>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-light text-brand-gray">$</span>
                  <span
                    class="text-6xl font-display font-bold tracking-tighter text-brand-bright"
                    >{{
                      isYearlyBilling
                        ? pricingPlans.professional.yearly
                        : pricingPlans.professional.monthly
                    }}</span
                  >
                </div>
                <div class="text-xs text-white/50 mt-1">
                  {{ isYearlyBilling ? '/year' : '/month' }}
                  <span
                    v-if="isYearlyBilling"
                    class="ml-2 text-[10px] font-bold text-brand-bright bg-brand-teal/20 px-2 py-0.5 rounded-full tracking-tight animate-pulse"
                  >
                    SAVE 20%
                  </span>
                </div>
              </div>

              <ul class="flex flex-col gap-4 mb-8 flex-grow">
                <li class="flex items-center gap-3 text-sm text-white font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-bright shrink-0"
                  >
                    <path
                      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                    />
                  </svg>
                  Unlimited color checks
                </li>
                <li class="flex items-center gap-3 text-sm text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-teal shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Max 3 colors per check
                </li>
                <li class="flex items-center gap-3 text-sm text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-teal shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Full WCAG 2.1 AA + AAA
                </li>
                <li class="flex items-center gap-3 text-sm text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-teal shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  10 brand palettes
                </li>
                <li class="flex items-center gap-3 text-sm text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-teal shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  2 Image validations per day
                </li>
              </ul>

              <button
                class="w-full py-3.5 rounded-xl bg-brand-teal text-white text-center text-sm font-bold tracking-wide hover:bg-brand-bright hover:text-brand-black transition-colors shadow-[0_0_20px_-5px_rgba(47,122,114,0.5)] hover:shadow-[0_0_30px_-5px_rgba(121,220,175,0.6)] cursor-pointer"
                @click="handleSubscribeClick('professional')"
              >
                Subscribe Now
              </button>
            </div>

            <!-- Card 3: Business -->
            <div
              class="group relative flex flex-col h-full bg-brand-card text-brand-bg rounded-3xl p-8 border border-white/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-[8px_8px_0px_0px_#C92216] hover:shadow-[4px_4px_0px_0px_#C92216] scroll-animate fade-up delay-300"
            >
              <div
                class="absolute top-6 right-6 font-mono text-xs text-white/20 group-hover:text-brand-purple/50 transition-colors"
              >
                03
              </div>

              <!-- Glow on hover -->
              <div
                class="absolute -top-20 -right-20 w-40 h-40 bg-brand-purple/0 group-hover:bg-brand-purple/10 blur-[60px] rounded-full pointer-events-none transition-all duration-500"
              ></div>

              <div class="mb-8 relative z-10">
                <h3
                  class="text-xs font-bold tracking-[0.2em] uppercase text-brand-purple mb-4 group-hover:text-brand-purple transition-colors"
                >
                  Business
                </h3>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-light text-brand-gray">$</span>
                  <span
                    class="text-6xl font-display font-bold tracking-tighter text-brand-purple group-hover:text-brand-purple transition-colors"
                    >{{
                      isYearlyBilling ? pricingPlans.business.yearly : pricingPlans.business.monthly
                    }}</span
                  >
                </div>
                <div class="text-xs text-white/50 mt-1">
                  {{ isYearlyBilling ? '/year' : '/month' }}
                  <span
                    v-if="isYearlyBilling"
                    class="ml-2 text-[10px] font-bold text-brand-bright bg-brand-purple/20 px-2 py-0.5 rounded-full tracking-tight"
                  >
                    SAVE 20%
                  </span>
                </div>
              </div>

              <ul class="flex flex-col gap-4 mb-8 flex-grow relative z-10">
                <li class="flex items-center gap-3 text-sm text-white font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-purple shrink-0"
                  >
                    <path
                      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                    />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Everything in Pro
                </li>
                <li class="flex items-center gap-3 text-sm text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-purple transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Unlimited palettes
                </li>
                <li class="flex items-center gap-3 text-sm text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-purple transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Max 5 colors per check
                </li>
                <li class="flex items-center gap-3 text-sm text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-purple transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  Unlimited Image Validation
                </li>
                <li class="flex items-center gap-3 text-sm text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-brand-gray shrink-0 group-hover:text-brand-purple transition-colors"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  White-label reports
                </li>
              </ul>

              <button
                class="w-full py-3 rounded-xl border border-white/10 text-center text-sm font-semibold hover:bg-white/5 transition-colors relative z-10 group-hover:border-brand-purple/30 cursor-pointer"
                @click="handleSubscribeClick('business')"
              >
                Subscribe Now
              </button>
            </div>
          </div>

          <!-- Lifetime Deal Card -->
          <div class="mt-16 w-full max-w-7xl mx-auto scroll-animate fade-up delay-400">
            <div
              class="group relative bg-brand-black rounded-3xl p-8 md:p-12 border border-brand-teal/30 hover:-translate-y-1 transition-all duration-500 overflow-hidden shadow-[8px_8px_0px_0px_#2F7A72] hover:shadow-[4px_4px_0px_0px_#2F7A72]"
            >
              <!-- Background Effects -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-bright/5 pointer-events-none"
              ></div>
              <div
                class="absolute -top-32 -left-32 w-64 h-64 bg-brand-teal/10 blur-[100px] rounded-full pointer-events-none"
              ></div>
              <div
                class="absolute -bottom-32 -right-32 w-64 h-64 bg-brand-bright/10 blur-[100px] rounded-full pointer-events-none"
              ></div>

              <!-- Limited Time Badge -->
              <div
                class="absolute top-0 left-12 md:left-16 bg-brand-bright text-brand-black text-xs font-bold tracking-wider px-4 py-2 rounded-b-xl uppercase shadow-lg border-x border-b border-brand-black"
              >
                Limited Time Offer
              </div>

              <div
                class="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-10 mt-4"
              >
                <!-- Left Content -->
                <div class="flex-1">
                  <div class="flex items-center gap-4 mb-6">
                    <div
                      class="w-14 h-14 bg-brand-teal/20 rounded-2xl flex items-center justify-center border border-brand-teal/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-brand-bright"
                      >
                        <path
                          d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3
                        class="text-2xl md:text-3xl font-display font-bold text-brand-bg uppercase tracking-wide"
                      >
                        Lifetime Deal
                      </h3>
                      <p class="text-brand-teal text-sm font-medium">Pay once, use forever</p>
                    </div>
                  </div>

                  <p class="text-brand-bg/70 text-base mb-8 max-w-xl leading-relaxed">
                    Get unlimited access to all Professional features with no recurring fees.
                    Perfect for freelancers, agencies, and teams who want long-term value.
                  </p>

                  <!-- Features Grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div class="flex items-center gap-3 text-sm text-brand-bg/90">
                      <div
                        class="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          class="text-brand-bright"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      Unlimited color checks
                    </div>
                    <div class="flex items-center gap-3 text-sm text-brand-bg/90">
                      <div
                        class="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          class="text-brand-bright"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      Unlimited image validation
                    </div>
                    <div class="flex items-center gap-3 text-sm text-brand-bg/90">
                      <div
                        class="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          class="text-brand-bright"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      Unlimited brand palettes
                    </div>
                    <div class="flex items-center gap-3 text-sm text-brand-bg/90">
                      <div
                        class="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          class="text-brand-bright"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      Priority support
                    </div>
                    <div class="flex items-center gap-3 text-sm text-brand-bg/90">
                      <div
                        class="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          class="text-brand-bright"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      Future updates included
                    </div>
                    <div class="flex items-center gap-3 text-sm text-brand-bg/90">
                      <div
                        class="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          class="text-brand-bright"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </div>
                      White-label branding
                    </div>
                  </div>

                  <!-- License Notice -->
                  <div class="text-xs text-brand-bg/50 border-t border-brand-bg/10 pt-4">
                    <p class="leading-relaxed">
                      Lifetime license for personal and commercial use. Non-transferable. Subject to
                      <RouterLink
                        to="/terms"
                        class="text-brand-teal hover:text-brand-bright transition-colors"
                        >Terms of Service</RouterLink
                      >.
                    </p>
                  </div>
                </div>

                <!-- Right Pricing -->
                <div class="w-full lg:w-auto flex-shrink-0">
                  <div
                    class="bg-brand-card rounded-2xl p-8 border border-brand-teal/20 text-center lg:min-w-[280px]"
                  >
                    <div class="text-brand-bg/50 text-xs font-bold tracking-wider uppercase mb-3">
                      One-time payment
                    </div>
                    <div class="flex items-baseline justify-center gap-3 mb-2">
                      <span class="text-brand-bg/40 text-xl line-through font-medium">$750</span>
                      <span class="text-5xl font-display font-bold text-brand-bright tracking-tight"
                        >$450</span
                      >
                    </div>
                    <div
                      class="text-brand-black text-xs font-bold bg-brand-bright px-4 py-1.5 rounded-full mb-6 inline-block"
                    >
                      Save 40%
                    </div>

                    <button
                      class="group flex items-center justify-center gap-2 w-full bg-brand-teal text-brand-bg px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-brand-bright hover:text-brand-black transition-all shadow-[0_0_20px_-5px_rgba(47,122,114,0.5)] cursor-pointer"
                      @click="handleSubscribeClick('lifetime')"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        class="group-hover:scale-110 transition-transform"
                      >
                        <path
                          d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
                        />
                      </svg>
                      Get Lifetime Access
                    </button>

                    <p class="text-xs text-brand-bg/40 mt-4">Limited spots available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Comparison Table Section -->
        <section class="w-full px-4 pb-20 md:px-12 lg:px-20 z-10 relative">
          <!-- Divider -->
          <div
            class="w-full h-px bg-gradient-to-r from-transparent via-brand-black/10 to-transparent mb-16 scroll-animate fade-up"
          ></div>

          <div
            class="max-w-7xl mx-auto overflow-x-auto no-scrollbar pb-12 scroll-animate fade-up delay-200"
          >
            <div
              class="min-w-[800px] grid grid-cols-4 text-sm bg-white/40 backdrop-blur-sm rounded-3xl border border-brand-black/5 shadow-[6px_6px_0px_0px_#1A1A1A] overflow-hidden"
            >
              <!-- Header Row -->
              <!-- Yearly Toggle Cell -->
              <div
                class="p-6 md:p-8 flex flex-col justify-end items-start border-r border-b border-brand-black/5"
              >
                <div class="flex items-center gap-3 mb-2">
                  <span
                    class="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-black/60 italic"
                    >Yearly</span
                  >
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="isYearlyBilling" type="checkbox" class="sr-only peer" />
                    <div
                      class="w-9 h-5 bg-brand-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal"
                    ></div>
                  </label>
                </div>
                <span
                  v-if="isYearlyBilling"
                  class="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full tracking-tight"
                  >20% OFF</span
                >
              </div>

              <!-- Starter Header -->
              <div
                class="p-6 md:p-8 flex flex-col items-center gap-4 border-r border-b border-brand-black/5 bg-brand-bg/50"
              >
                <div class="text-xs font-bold tracking-[0.2em] uppercase text-brand-gray italic">
                  Starter
                </div>
                <div
                  class="font-display font-bold text-3xl md:text-4xl text-brand-black tracking-tight"
                >
                  $0
                </div>
                <RouterLink
                  to="/signup"
                  class="w-full py-2.5 rounded-lg bg-brand-black text-brand-bg text-xs font-bold hover:opacity-80 transition-opacity text-center"
                >
                  START FREE
                </RouterLink>
              </div>

              <!-- Pro Header (Highlighted) -->
              <div
                class="relative p-6 md:p-8 flex flex-col items-center gap-4 border-r border-b border-brand-black/5 bg-brand-black/5"
              >
                <!-- Top Highlight -->
                <div class="absolute top-0 left-0 w-full h-1 bg-brand-teal"></div>

                <div class="text-xs font-bold tracking-[0.2em] uppercase text-brand-teal italic">
                  Professional
                </div>
                <div
                  class="font-display font-bold text-3xl md:text-4xl text-brand-black tracking-tight"
                >
                  ${{
                    isYearlyBilling
                      ? pricingPlans.professional.yearly
                      : pricingPlans.professional.monthly
                  }}
                </div>
                <button
                  class="w-full py-2.5 rounded-lg bg-brand-teal text-white text-xs font-bold hover:bg-brand-bright hover:text-brand-black transition-colors shadow-lg shadow-brand-teal/20 text-center cursor-pointer"
                  @click="handleSubscribeClick('professional')"
                >
                  SUBSCRIBE NOW
                </button>
              </div>

              <!-- Business Header -->
              <div
                class="p-6 md:p-8 flex flex-col items-center gap-4 border-b border-brand-black/5 bg-brand-bg/50"
              >
                <div class="text-xs font-bold tracking-[0.2em] uppercase text-brand-purple italic">
                  Business
                </div>
                <div
                  class="font-display font-bold text-3xl md:text-4xl text-brand-black tracking-tight"
                >
                  ${{
                    isYearlyBilling ? pricingPlans.business.yearly : pricingPlans.business.monthly
                  }}
                </div>
                <button
                  class="w-full py-2.5 rounded-lg border border-brand-black/10 bg-white text-xs font-bold hover:bg-brand-black hover:text-brand-bg transition-colors text-center cursor-pointer"
                  @click="handleSubscribeClick('business')"
                >
                  SUBSCRIBE NOW
                </button>
              </div>

              <!-- Feature Rows -->
              <template v-for="(feature, index) in comparisonFeatures" :key="feature.name">
                <!-- Feature Name -->
                <div
                  :class="[
                    'p-5 pl-8 border-r border-brand-black/5 font-semibold text-brand-black/80 flex items-center',
                    index < comparisonFeatures.length - 1 ? 'border-b' : ''
                  ]"
                >
                  {{ feature.name }}
                </div>

                <!-- Starter Value -->
                <div
                  :class="[
                    'p-5 border-r border-brand-black/5 text-center flex justify-center items-center',
                    index < comparisonFeatures.length - 1 ? 'border-b' : '',
                    feature.starter === false
                      ? 'text-brand-black/30'
                      : 'text-brand-black/60 font-medium'
                  ]"
                >
                  <svg
                    v-if="feature.starter === false"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                  <template v-else>{{ feature.starter }}</template>
                </div>

                <!-- Pro Value (Highlighted) -->
                <div
                  :class="[
                    'p-5 border-r border-brand-black/5 text-center flex justify-center items-center bg-brand-black/5',
                    index < comparisonFeatures.length - 1 ? 'border-b' : '',
                    feature.pro === false ? 'text-brand-black/30' : 'font-bold text-brand-black'
                  ]"
                >
                  <svg
                    v-if="feature.pro === false"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                  <div
                    v-else-if="feature.pro === 'toggle'"
                    class="w-8 h-4 bg-brand-black/20 rounded-full relative cursor-not-allowed"
                  >
                    <div class="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <template v-else>{{ feature.pro }}</template>
                </div>

                <!-- Business Value -->
                <div
                  :class="[
                    'p-5 text-center flex justify-center items-center',
                    index < comparisonFeatures.length - 1 ? 'border-b border-brand-black/5' : '',
                    feature.business === true
                      ? 'text-brand-purple'
                      : feature.business === false
                        ? 'text-brand-black/30'
                        : 'text-brand-black/60 font-medium'
                  ]"
                >
                  <svg
                    v-if="feature.business === true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <svg
                    v-else-if="feature.business === false"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                  <svg
                    v-else-if="feature.business === 'unlimited'"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"
                    />
                  </svg>
                  <template v-else>{{ feature.business }}</template>
                </div>
              </template>
            </div>
          </div>
        </section>

        <!-- FAQ Teaser Section -->
        <section class="w-full px-4 pb-20 md:px-12 lg:px-20 z-10 relative">
          <div
            class="max-w-4xl mx-auto text-center bg-brand-black rounded-3xl p-12 md:p-16 relative overflow-hidden shadow-[8px_8px_0px_0px_#2F7A72] scroll-animate fade-up"
          >
            <!-- Background glow -->
            <div
              class="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-brand-teal/10 blur-[80px] rounded-full pointer-events-none"
            ></div>

            <h2
              class="text-3xl md:text-5xl font-display font-bold text-brand-bg tracking-tight mb-6 relative z-10"
            >
              Still have questions?
            </h2>
            <p class="text-brand-bg/60 text-lg mb-8 max-w-xl mx-auto relative z-10">
              Our team is here to help you find the perfect plan for your brand.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <RouterLink
                to="/help"
                class="group flex items-center justify-center gap-2 bg-brand-bg text-brand-black px-8 py-3 rounded-full font-semibold text-sm border border-brand-black shadow-[4px_4px_0px_0px_#79dcaf] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#79dcaf] transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                View FAQ
              </RouterLink>
              <a
                href="mailto:support@stayonbrand.com"
                class="group flex items-center justify-center gap-2 bg-transparent text-brand-bg px-8 py-3 rounded-full font-semibold text-sm border border-brand-bg/30 hover:border-brand-bright hover:text-brand-bright transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>

      <!-- === FOOTER SECTION === -->
      <footer class="relative w-full bg-brand-bg py-8 px-4 md:px-12 z-20 overflow-hidden">
        <!-- Background Grid (same as hero) -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.15] bg-grid z-0"></div>

        <!-- Top border line -->
        <div
          class="absolute top-0 left-4 right-4 md:left-12 md:right-12 h-px bg-brand-black/10"
        ></div>

        <div class="max-w-screen-2xl mx-auto relative z-10">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <!-- Logo -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center text-brand-teal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                  <path
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <RouterLink
                to="/contact"
                class="text-brand-black/60 hover:text-brand-teal text-sm font-medium transition-colors underline-reveal"
              >
                Contact
              </RouterLink>
              <RouterLink
                to="/privacy"
                class="text-brand-black/60 hover:text-brand-teal text-sm font-medium transition-colors underline-reveal"
              >
                Privacy & Cookie Policy
              </RouterLink>
              <RouterLink
                to="/terms"
                class="text-brand-black/60 hover:text-brand-teal text-sm font-medium transition-colors underline-reveal"
              >
                Legal
              </RouterLink>
            </nav>

            <!-- Made with love -->
            <div class="text-brand-black/50 text-sm">
              Made with <span class="text-brand-red">♥</span> by
              <a
                href="https://twitter.com/this_is_mhd"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-black/70 hover:text-brand-teal transition-colors font-medium"
              >
                Mhd Rahman
              </a>
            </div>
          </div>

          <!-- Bottom row with copyright -->
          <div
            class="mt-6 pt-6 border-t border-brand-black/10 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <p class="text-brand-black/40 text-xs">
              © {{ new Date().getFullYear() }} Stay on Brand. All rights reserved.
            </p>
            <div class="flex items-center gap-4">
              <a
                href="#"
                class="text-brand-black/40 hover:text-brand-red transition-colors"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-brand-black/40 hover:text-brand-red transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                class="text-brand-black/40 hover:text-brand-teal transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="#"
                class="text-brand-black/40 hover:text-brand-black transition-colors"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                  />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
  /* Background Grid Pattern */
  .bg-grid {
    background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
    background-size: 24px 24px;
    background-attachment: fixed;
  }

  /* Character Animation */
  .char-wrapper {
    overflow: hidden;
    display: inline-flex;
  }

  .char {
    animation: reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(100%);
  }

  @keyframes reveal-up {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Strikethrough Line Animation */
  .strikethrough-line {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 4px;
    background: #c92216;
    transform: scaleX(0) rotate(-2deg);
    transform-origin: left center;
    animation: reveal-width 1s ease-out 0.8s forwards;
    opacity: 0;
  }

  @media (min-width: 768px) {
    .strikethrough-line {
      height: 6px;
    }
  }

  @keyframes reveal-width {
    to {
      opacity: 0.8;
      transform: scaleX(1) rotate(-2deg);
    }
  }

  /* Scroll Animation Classes */
  .scroll-animate {
    opacity: 0;
    transition:
      opacity 0.8s ease-out,
      transform 0.8s ease-out;
  }

  .scroll-animate.animate {
    opacity: 1;
  }

  .fade-up {
    transform: translateY(30px);
  }

  .fade-up.animate {
    transform: translateY(0);
  }

  .fade-down {
    transform: translateY(-30px);
  }

  .fade-down.animate {
    transform: translateY(0);
  }

  .scale-in {
    transform: scale(0.95);
  }

  .scale-in.animate {
    transform: scale(1);
  }

  /* Animation Delays */
  .delay-100 {
    transition-delay: 0.1s;
  }
  .delay-200 {
    transition-delay: 0.2s;
  }
  .delay-300 {
    transition-delay: 0.3s;
  }
  .delay-400 {
    transition-delay: 0.4s;
  }
  .delay-500 {
    transition-delay: 0.5s;
  }

  /* Hover Beam Effect */
  .hover-beam {
    position: relative;
  }

  .hover-beam::before {
    content: '';
    position: absolute;
    inset: -1px;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(121, 220, 175, 0.5) 50%,
      transparent 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    background-size: 200% 100%;
    animation: beam-slide 3s linear infinite;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .group:hover .hover-beam::before,
  .hover-beam:hover::before {
    opacity: 1;
  }

  @keyframes beam-slide {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }

  /* Sonar Animation for Logo */
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

  .group:hover .group-hover\:animate-sonar {
    animation: sonar 1s ease-out forwards;
  }

  /* No Scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
