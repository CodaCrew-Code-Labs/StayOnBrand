<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  import { AuthService } from '@/services/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  // Computed home link - dashboard for logged in, landing for logged out
  const homeLink = computed(() => (authStore.isAuthenticated ? '/dashboard' : '/'))

  // Handle sign out
  function handleSignOut() {
    AuthService.logout()
    authStore.logout()
    router.push('/login')
  }

  // Scroll progress tracking
  const scrollProgress = ref(0)

  // Navigation sections
  const sections = [
    { id: 'who-we-are', title: 'Who We Are', number: '01' },
    { id: 'general-policy', title: 'General Refund Policy', number: '02' },
    { id: 'subscriptions', title: 'Subscriptions & Payments', number: '03' },
    { id: 'one-time', title: 'One-Time Purchases', number: '04' },
    { id: 'exceptions', title: 'Exceptions (Limited)', number: '05' },
    { id: 'termination', title: 'Policy Violations', number: '06' },
    { id: 'taxes', title: 'Taxes & Fees', number: '07' },
    { id: 'pricing', title: 'Pricing Changes', number: '08' },
    { id: 'refund-method', title: 'Refund Method', number: '09' },
    { id: 'chargebacks', title: 'Chargebacks & Disputes', number: '10' },
    { id: 'legal-rights', title: 'Legal Rights', number: '11' },
    { id: 'contact', title: 'Contact', number: '12' }
  ]

  // Active section tracking
  const activeSection = ref('who-we-are')

  // Animation state
  const isLoaded = ref(false)

  // Scroll animation observer
  let scrollObserver: IntersectionObserver | null = null

  // Scroll handler
  function handleScroll() {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = (scrollTop / docHeight) * 100

    // Update active section based on scroll position
    const sectionElements = sections
      .map(section => document.getElementById(section.id))
      .filter(Boolean)

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const element = sectionElements[i]
      if (element && element.offsetTop <= scrollTop + 200) {
        activeSection.value = sections[i].id
        break
      }
    }
  }

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
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    initScrollAnimations()

    setTimeout(() => {
      isLoaded.value = true
    }, 100)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollObserver) {
      scrollObserver.disconnect()
    }
  })

  // Smooth scroll to section
  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
</script>

<template>
  <div class="bg-brand-bg text-brand-black relative flex flex-col font-sans min-h-screen">
    <!-- Background Grid -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.15] bg-grid z-0"></div>
    <!-- Dotted Line Grid with Beam -->
    <div class="absolute inset-0 pointer-events-none bg-grid-lines z-0">
      <div
        class="absolute inset-0 bg-linear-to-b from-transparent via-brand-red/5 to-transparent h-[50vh] animate-scan-vertical blur-md"
      ></div>
    </div>

    <!-- Decorative Noodle SVGs -->
    <svg
      class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 100 200 Q 50 400 150 600"
        fill="none"
        stroke="#C92216"
        stroke-width="1.5"
        class="opacity-30 noodle-path"
      />
      <path
        d="M 90% 100 Q 85% 300 95% 500"
        fill="none"
        stroke="#2F7A72"
        stroke-width="1.5"
        class="opacity-30 noodle-path"
        style="animation-delay: 0.5s"
      />
      <circle r="4" fill="#C92216">
        <animateMotion dur="10s" repeatCount="indefinite" path="M 100 200 Q 50 400 150 600" />
      </circle>
    </svg>

    <!-- Scroll Progress Indicator -->
    <div class="fixed top-0 left-0 w-full h-1 bg-brand-bg/50 z-[60]">
      <div
        class="h-full bg-brand-red transition-all duration-300 ease-out"
        :style="{ width: `${scrollProgress}%` }"
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
            :to="homeLink"
            class="group text-brand-black border-brand-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright text-xs font-semibold tracking-wide border rounded-full pt-2 px-5 pb-2 relative shadow-[3px_3px_0px_0px_#1A1A1A]"
          >
            <span class="z-10 relative">HOME</span>
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
            to="/pricing"
            class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-full border border-brand-black font-semibold text-xs tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright hidden md:flex"
          >
            <span class="z-10 relative">PRICING</span>
          </RouterLink>
          <!-- Show signup for guests -->
          <template v-if="!authStore.isAuthenticated">
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

    <!-- Hero Section -->
    <section class="relative z-10 pt-12 md:pt-20 pb-16 px-6 md:px-12">
      <div class="max-w-screen-2xl mx-auto text-center">
        <!-- Script Header -->
        <div class="relative mb-6 scroll-animate fade-up">
          <span
            class="md:text-3xl text-brand-red block transform hover:rotate-0 transition-transform cursor-default text-2xl font-medium font-script rotate-[-3deg] wiggle-hover"
          >
            #ClearPolicies
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute -right-6 -top-3 text-brand-teal opacity-80 animate-pulse"
          >
            <path
              d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
            />
          </svg>
        </div>

        <!-- Main Headline -->
        <div class="leading-none flex flex-col max-w-5xl mx-auto relative items-center">
          <div class="relative scroll-animate fade-up delay-100">
            <div
              class="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-brand-bg text-brand-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-medium text-xs border border-brand-black animate-float shadow-[2px_2px_0px_0px_#2F7A72] pulse-glow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Refund
            </h1>
          </div>
          <div class="relative scroll-animate fade-up delay-200">
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-red leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Policy
            </h1>
            <svg
              class="absolute -bottom-1 left-0 w-full h-3 md:h-5 text-brand-bright opacity-90"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
            <div
              class="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 bg-brand-bright text-brand-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-medium text-xs border border-brand-black shadow-[2px_2px_0px_0px_#C92216] animate-float-delayed pulse-glow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Subtitle -->
        <p
          class="mt-8 text-brand-gray max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed scroll-animate fade-up delay-300"
        >
          This Refund Policy explains how refunds are handled for purchases made through the
          Services. This Policy should be read together with our Terms of Service, Acceptable Use
          Policy, and Privacy Policy.
        </p>

        <!-- Last Updated Badge & Download Button -->
        <div
          class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 scroll-animate fade-up delay-400"
        >
          <div
            class="inline-flex items-center gap-2 bg-brand-black text-brand-bg px-4 py-2 rounded-full text-xs font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Last Updated: January 08, 2026
          </div>
          <a
            href="/StayOnBrand_Refund_Policy.pdf"
            download="StayOnBrand_Refund_Policy.pdf"
            class="group inline-flex items-center gap-2 bg-brand-red text-brand-bg px-5 py-2 rounded-full text-xs font-semibold border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="group-hover:animate-bounce"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </a>
        </div>

        <!-- Key Points Summary -->
        <div
          class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto scroll-animate fade-up delay-500"
        >
          <div
            class="bg-brand-bg border border-brand-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#2F7A72] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2F7A72] transition-all duration-300"
          >
            <div class="w-10 h-10 bg-brand-teal rounded-xl flex items-center justify-center mb-3">
              <svg
                class="w-5 h-5 text-brand-bg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-brand-black">Digital Service</p>
            <p class="text-xs text-brand-gray mt-1">All purchases are for digital service access</p>
          </div>
          <div
            class="bg-brand-bg border border-brand-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#C92216] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] transition-all duration-300"
          >
            <div class="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center mb-3">
              <svg
                class="w-5 h-5 text-brand-bg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-brand-black">Final Purchases</p>
            <p class="text-xs text-brand-gray mt-1">All purchases are final and non-refundable</p>
          </div>
          <div
            class="bg-brand-bg border border-brand-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#79dcaf] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#79dcaf] transition-all duration-300"
          >
            <div class="w-10 h-10 bg-brand-bright rounded-xl flex items-center justify-center mb-3">
              <svg
                class="w-5 h-5 text-brand-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-brand-black">Exceptions Apply</p>
            <p class="text-xs text-brand-gray mt-1">Limited exceptions for duplicate charges</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="relative z-10 flex-grow pb-20 px-6 md:px-12">
      <div class="max-w-screen-2xl mx-auto">
        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <!-- Left Sidebar: Navigation -->
          <aside class="hidden lg:block lg:col-span-4">
            <div class="sticky top-20 space-y-5">
              <!-- Reading Progress Card -->
              <div
                class="relative overflow-hidden bg-gradient-to-br from-brand-black via-brand-black to-brand-black/90 rounded-3xl p-6 border border-brand-black shadow-[6px_6px_0px_0px_#2F7A72]"
              >
                <!-- Decorative Background Pattern -->
                <div class="absolute inset-0 opacity-10">
                  <div
                    class="absolute top-0 right-0 w-32 h-32 bg-brand-bright rounded-full blur-3xl"
                  ></div>
                  <div
                    class="absolute bottom-0 left-0 w-24 h-24 bg-brand-teal rounded-full blur-2xl"
                  ></div>
                </div>

                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-12 h-12 bg-brand-bright rounded-2xl flex items-center justify-center shadow-lg"
                      >
                        <svg
                          class="w-6 h-6 text-brand-black"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-brand-bg font-bold text-lg">Refund Policy</p>
                        <p class="text-brand-bg/50 text-xs">Clear & Transparent</p>
                      </div>
                    </div>
                  </div>

                  <!-- Reading Progress -->
                  <div class="mb-4">
                    <div class="flex justify-between text-xs mb-2">
                      <span class="text-brand-bg/70">Reading Progress</span>
                      <span class="text-brand-bright font-mono font-bold"
                        >{{ Math.round(scrollProgress) }}%</span
                      >
                    </div>
                    <div class="h-2 bg-brand-bg/20 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-gradient-to-r from-brand-teal to-brand-bright rounded-full transition-all duration-300"
                        :style="{ width: `${scrollProgress}%` }"
                      ></div>
                    </div>
                  </div>

                  <!-- Quick Stats -->
                  <div class="grid grid-cols-2 gap-3">
                    <div
                      class="bg-brand-bg/10 backdrop-blur rounded-xl p-3 border border-brand-bg/10"
                    >
                      <p class="text-brand-bright text-2xl font-bold font-mono">12</p>
                      <p class="text-brand-bg/60 text-xs">Sections</p>
                    </div>
                    <div
                      class="bg-brand-bg/10 backdrop-blur rounded-xl p-3 border border-brand-bg/10"
                    >
                      <p class="text-brand-bright text-2xl font-bold font-mono">0</p>
                      <p class="text-brand-bg/60 text-xs">Hidden Fees</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Table of Contents -->
              <div
                class="bg-brand-bg border-2 border-brand-black rounded-3xl overflow-hidden shadow-[5px_5px_0px_0px_#C92216]"
              >
                <!-- Header -->
                <div class="bg-brand-black px-5 py-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
                      <svg
                        class="w-4 h-4 text-brand-bg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    </div>
                    <span class="text-brand-bg font-bold text-sm uppercase tracking-wider"
                      >Contents</span
                    >
                  </div>
                  <span class="text-brand-bg/50 text-xs font-mono"
                    >{{ sections.length }} items</span
                  >
                </div>

                <!-- Navigation Items -->
                <div class="p-3 max-h-[40vh] overflow-y-auto scrollbar-thin">
                  <div class="space-y-1.5">
                    <button
                      v-for="section in sections"
                      :key="section.id"
                      :class="[
                        'w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-left',
                        activeSection === section.id
                          ? 'bg-brand-bright border-2 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]'
                          : 'hover:bg-brand-bright/20 border-2 border-transparent'
                      ]"
                      @click="scrollToSection(section.id)"
                    >
                      <div
                        :class="[
                          'w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 shrink-0',
                          activeSection === section.id
                            ? 'bg-brand-black text-brand-bright'
                            : 'bg-brand-black/10 text-brand-black group-hover:bg-brand-red group-hover:text-brand-bg'
                        ]"
                      >
                        {{ section.number }}
                      </div>
                      <span
                        :class="[
                          'flex-1 text-sm font-medium transition-all duration-200 truncate',
                          activeSection === section.id
                            ? 'text-brand-black'
                            : 'text-brand-black/70 group-hover:text-brand-black'
                        ]"
                      >
                        {{ section.title }}
                      </span>
                      <svg
                        :class="[
                          'w-4 h-4 transition-all duration-200 shrink-0',
                          activeSection === section.id
                            ? 'text-brand-black opacity-100'
                            : 'text-brand-gray opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                        ]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contact Card -->
              <div
                class="relative overflow-hidden bg-gradient-to-br from-brand-teal to-brand-teal/80 rounded-3xl p-5 border border-brand-black shadow-[5px_5px_0px_0px_#1A1A1A]"
              >
                <div
                  class="absolute top-0 right-0 w-20 h-20 bg-brand-bright/20 rounded-full blur-2xl"
                ></div>

                <div class="relative z-10">
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      class="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center shrink-0 shadow-md"
                    >
                      <svg
                        class="w-5 h-5 text-brand-teal"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-brand-bg font-bold">Questions?</p>
                      <p class="text-brand-bg/70 text-xs">We're here to help</p>
                    </div>
                  </div>

                  <a
                    href="mailto:legal@stayonbrand.in"
                    class="flex items-center justify-center gap-2 w-full bg-brand-bg text-brand-teal px-4 py-3 rounded-xl text-sm font-bold hover:bg-brand-bright hover:text-brand-black transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Contact Support
                  </a>
                </div>
              </div>

              <!-- Quick Links -->
              <div
                class="bg-brand-bg border-2 border-brand-black rounded-3xl p-4 shadow-[4px_4px_0px_0px_#79dcaf]"
              >
                <p class="text-xs font-bold text-brand-black uppercase tracking-wider mb-3 px-1">
                  Related
                </p>
                <div class="space-y-2">
                  <RouterLink
                    to="/terms"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bright/30 transition-all duration-200 group"
                  >
                    <div
                      class="w-9 h-9 rounded-xl bg-brand-teal/20 flex items-center justify-center group-hover:bg-brand-teal group-hover:scale-105 transition-all duration-200"
                    >
                      <svg
                        class="w-4 h-4 text-brand-teal group-hover:text-brand-bg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-black truncate">
                        Terms of Service
                      </p>
                      <p class="text-xs text-brand-gray">Usage guidelines</p>
                    </div>
                  </RouterLink>
                  <RouterLink
                    to="/privacy"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bright/30 transition-all duration-200 group"
                  >
                    <div
                      class="w-9 h-9 rounded-xl bg-brand-red/20 flex items-center justify-center group-hover:bg-brand-red group-hover:scale-105 transition-all duration-200"
                    >
                      <svg
                        class="w-4 h-4 text-brand-red group-hover:text-brand-bg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-black truncate">Privacy Policy</p>
                      <p class="text-xs text-brand-gray">How we handle data</p>
                    </div>
                  </RouterLink>
                  <RouterLink
                    to="/help"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bright/30 transition-all duration-200 group"
                  >
                    <div
                      class="w-9 h-9 rounded-xl bg-brand-bright/50 flex items-center justify-center group-hover:bg-brand-bright group-hover:scale-105 transition-all duration-200"
                    >
                      <svg
                        class="w-4 h-4 text-brand-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                        />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-black truncate">Help & FAQ</p>
                      <p class="text-xs text-brand-gray">Common questions</p>
                    </div>
                  </RouterLink>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right Column: Content -->
          <div class="col-span-1 lg:col-span-8 space-y-12 md:space-y-16">
            <!-- Section 1: Who We Are -->
            <section id="who-we-are" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#2F7A72] hover:shadow-[8px_8px_0px_0px_#2F7A72] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 01</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Who We Are
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services are operated by an individual ("we," "us," or "our"). We are not
                    currently operating as a registered company or legal entity.
                  </p>
                  <div class="p-4 rounded-xl bg-brand-teal/10 border border-brand-teal/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-semibold">Note:</span> References to "we,"
                      "us," or "our" refer to the individual operator of the Services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 2: General Refund Policy -->
            <section id="general-policy" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#C92216] hover:shadow-[8px_8px_0px_0px_#C92216] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 02</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      General Refund Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <div class="p-4 rounded-xl bg-brand-red/10 border border-brand-red/30 mb-6">
                    <p class="text-sm text-brand-black font-semibold">
                      <span class="text-brand-red">Important:</span> Unless otherwise required by
                      applicable law, <strong>all purchases are final and non-refundable</strong>.
                    </p>
                  </div>
                  <p>
                    By purchasing any paid plan, subscription, lifetime deal, or add-on, you
                    acknowledge and agree that:
                  </p>
                  <ul class="list-none space-y-3 mt-4">
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >1</span
                      >
                      <span>You are purchasing access to a <strong>digital service</strong></span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >2</span
                      >
                      <span>Refunds are <strong>not guaranteed</strong></span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-bright text-brand-black flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >3</span
                      >
                      <span>Access may begin <strong>immediately after purchase</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 3: Subscriptions & Recurring Payments -->
            <section id="subscriptions" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#79dcaf] hover:shadow-[8px_8px_0px_0px_#79dcaf] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-bright flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-black"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 03</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Subscriptions & Recurring Payments
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>For subscription-based plans:</p>
                  <div class="space-y-4 mt-4">
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs"
                          >1</span
                        >
                        Your Responsibility
                      </h4>
                      <p class="text-sm">
                        You are responsible for managing your subscription and cancellations.
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-red text-brand-bg flex items-center justify-center text-xs"
                          >2</span
                        >
                        Cancellation Effect
                      </h4>
                      <p class="text-sm">
                        Cancelling a subscription stops future charges but
                        <strong>does not retroactively refund past payments</strong>.
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-bright text-brand-black flex items-center justify-center text-xs"
                          >3</span
                        >
                        No Partial Refunds
                      </h4>
                      <p class="text-sm">
                        We do not provide partial refunds for unused time, unused features, or
                        periods of inactivity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 4: One-Time Purchases & Lifetime Deals -->
            <section id="one-time" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#2F7A72] hover:shadow-[8px_8px_0px_0px_#2F7A72] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 04</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      One-Time Purchases & Lifetime Deals
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>For one-time purchases (including lifetime deals):</p>
                  <div class="p-4 rounded-xl bg-brand-teal/10 border border-brand-teal/30 mb-4">
                    <p class="text-sm text-brand-black font-semibold">
                      <span class="text-brand-teal">Key Point:</span> Payments are
                      <strong>non-refundable</strong> once access is granted.
                    </p>
                  </div>
                  <p>No refunds are provided for:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Change of mind</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Lack of usage</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Feature expectations</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Service updates or modifications</span>
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-bright/30 border border-brand-teal/30">
                    <p class="text-sm text-brand-black">
                      Lifetime deals are governed by the <strong>Lifetime Deal Disclosure</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 5: Exceptions (Limited) -->
            <section id="exceptions" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#C92216] hover:shadow-[8px_8px_0px_0px_#C92216] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 05</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Exceptions (Limited)
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    We may, <strong>at our sole discretion</strong>, consider a refund in limited
                    cases such as:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span>Duplicate charges</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span
                        >Technical errors preventing access that cannot be reasonably resolved</span
                      >
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Important:</span> Granting a refund
                      in one case does <strong>not</strong> create an obligation to issue refunds in
                      the future.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 6: Termination for Policy Violations -->
            <section id="termination" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#79dcaf] hover:shadow-[8px_8px_0px_0px_#79dcaf] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-bright flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-black"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 06</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Termination for Policy Violations
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Accounts that are suspended, restricted, or terminated due to violations of the
                    Terms of Service, Acceptable Use Policy, or other applicable policies are
                    <strong>not eligible for refunds</strong>.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 7: Taxes & Fees -->
            <section id="taxes" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#2F7A72] hover:shadow-[8px_8px_0px_0px_#2F7A72] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 07</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Taxes & Fees
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Refunds, if issued, do not include taxes, fees, or charges imposed by payment
                    processors, banks, or third parties, unless required by applicable law.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 8: Pricing Changes -->
            <section id="pricing" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#C92216] hover:shadow-[8px_8px_0px_0px_#C92216] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 08</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Pricing Changes
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Changes to pricing, plans, features, or availability do
                    <strong>not</strong> entitle users to refunds for past payments.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 9: Refund Method -->
            <section id="refund-method" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#79dcaf] hover:shadow-[8px_8px_0px_0px_#79dcaf] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-bright flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-black"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 09</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Refund Method
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Approved refunds, if any, will be issued using the original payment method where
                    reasonably possible. Processing times may vary depending on the payment
                    provider.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 10: Chargebacks & Payment Disputes -->
            <section id="chargebacks" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#2F7A72] hover:shadow-[8px_8px_0px_0px_#2F7A72] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 10</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Chargebacks & Payment Disputes
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Initiating a chargeback or payment dispute without first contacting us may
                    result in:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Immediate suspension or termination of access</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Restriction from future use of the Services</span>
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-teal/10 border border-brand-teal/30">
                    <p class="text-sm text-brand-black">
                      We reserve the right to contest chargebacks where appropriate.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 11: Legal Rights -->
            <section id="legal-rights" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#C92216] hover:shadow-[8px_8px_0px_0px_#C92216] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 11</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Legal Rights
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Nothing in this Refund Policy limits your statutory consumer rights where
                    applicable law requires refunds or cancellation rights.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 12: Contact -->
            <section id="contact" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="bg-brand-bg border border-brand-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#79dcaf] hover:shadow-[8px_8px_0px_0px_#79dcaf] transition-shadow duration-300"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-bright flex items-center justify-center flex-shrink-0 border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-black"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 12</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Contact
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If you have questions about this Refund Policy, you may contact the operator of
                    the Services at:
                  </p>
                  <div class="mt-6 space-y-4">
                    <div
                      class="flex items-center gap-4 p-4 rounded-xl bg-brand-bg border border-brand-black/20"
                    >
                      <div
                        class="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center flex-shrink-0"
                      >
                        <svg
                          class="w-5 h-5 text-brand-bg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-xs text-brand-gray uppercase tracking-wide">Email</p>
                        <a
                          href="mailto:legal@stayonbrand.in"
                          class="text-brand-black font-semibold hover:text-brand-teal transition-colors"
                          >legal@stayonbrand.in</a
                        >
                      </div>
                    </div>
                  </div>
                  <p class="mt-6">Responses are provided at our discretion.</p>
                </div>
              </div>
            </section>

            <!-- Action Buttons -->
            <div class="pt-8 scroll-animate fade-up">
              <div
                class="bg-brand-black text-brand-bg rounded-3xl p-8 md:p-12 border border-brand-black shadow-[6px_6px_0px_0px_#C92216]"
              >
                <p class="text-brand-bright font-script text-2xl mb-2">
                  Clear and transparent policies
                </p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By using Stay On Brand, you acknowledge that you have read and understood this
                  Refund Policy.
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <RouterLink
                    to="/terms"
                    class="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-brand-bg text-brand-bg font-semibold hover:bg-brand-bg hover:text-brand-black transition-all duration-300 text-center"
                  >
                    View Terms of Service
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    class="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-bright text-brand-black font-bold tracking-tight border border-brand-black shadow-[4px_4px_0px_0px_#2F7A72] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2F7A72] transition-all duration-300 text-center"
                  >
                    Get Started
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-12 border-t border-brand-black/10 relative z-20">
      <div class="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div
              class="w-8 h-8 bg-brand-black rounded-full flex items-center justify-center border border-brand-black"
            >
              <span class="font-display font-bold text-sm text-brand-bright">S.</span>
            </div>
            <span class="text-brand-black/60 text-sm"
              >&copy; 2026 Stay on Brand. All rights reserved.</span
            >
          </div>

          <div class="flex items-center gap-6 text-sm">
            <RouterLink
              to="/privacy"
              class="text-brand-black/60 hover:text-brand-black transition-colors duration-300 font-medium"
              >Privacy</RouterLink
            >
            <RouterLink
              to="/terms"
              class="text-brand-black/60 hover:text-brand-black transition-colors duration-300 font-medium"
              >Terms</RouterLink
            >
            <RouterLink
              to="/refund-policy"
              class="text-brand-red hover:text-brand-red/80 transition-colors duration-300 font-semibold"
              >Refund</RouterLink
            >
            <a
              href="mailto:legal@stayonbrand.in"
              class="text-brand-black/60 hover:text-brand-black transition-colors duration-300 font-medium"
              >Contact</a
            >
          </div>
        </div>
      </div>
    </footer>

    <!-- Floating Decorative Elements -->
    <div class="fixed bottom-10 right-10 hidden lg:block animate-float z-10 pointer-events-none">
      <div
        class="w-12 h-12 bg-brand-red rounded-full border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-brand-bg"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Use global styles from main.css for animations */
  /* Additional scoped styles */

  .noodle-path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 3s ease-out forwards;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Custom scrollbar for navigation */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #c92216;
    border-radius: 2px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a31c12;
  }

  /* Smooth Scrolling */
  html {
    scroll-behavior: smooth;
  }
</style>
