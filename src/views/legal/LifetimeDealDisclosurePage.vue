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
    { id: 'lifetime-meaning', title: 'What "Lifetime" Means', number: '01' },
    { id: 'scope-access', title: 'Scope of Access', number: '02' },
    { id: 'usage-limits', title: 'Usage Limits', number: '03' },
    { id: 'infrastructure', title: 'Infrastructure & Dependencies', number: '04' },
    { id: 'service-changes', title: 'Service Changes', number: '05' },
    { id: 'no-ownership', title: 'No Ownership Rights', number: '06' },
    { id: 'transferability', title: 'Transferability', number: '07' },
    { id: 'other-policies', title: 'Related Policies', number: '08' },
    { id: 'contact', title: 'Contact', number: '09' }
  ]

  // Active section tracking
  const activeSection = ref('lifetime-meaning')

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

    <!-- Scroll Progress Indicator -->
    <div
      class="fixed top-0 left-0 w-full h-1.5 bg-brand-bg/50 z-[60] border-b-2 border-brand-black/10"
    >
      <div
        class="h-full bg-brand-red transition-all duration-300 ease-out"
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>

    <!-- Navigation -->
    <nav
      class="relative z-50 w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between scroll-animate fade-down"
    >
      <!-- Logo -->
      <RouterLink :to="homeLink" class="flex items-center gap-2 group">
        <div
          class="w-10 h-10 bg-brand-black rounded-full flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 border-3 border-brand-black shadow-[3px_3px_0px_0px_#2F7A72]"
        >
          <span class="font-display font-bold text-base text-brand-bright">S.</span>
        </div>
        <span
          class="text-xl font-bold tracking-tight text-brand-black group-hover:text-brand-teal transition-colors hidden sm:inline"
        >
          Stay on Brand
        </span>
      </RouterLink>

      <!-- Center Badge -->
      <div class="hidden md:flex absolute left-1/2 -translate-x-1/2">
        <div
          class="bg-brand-bright border-3 border-brand-black px-4 py-2 rounded-[4px] shadow-[4px_4px_0px_0px_#1A1A1A] transform rotate-[0.5deg]"
        >
          <span class="font-script text-lg text-brand-black">Lifetime Deal</span>
        </div>
      </div>

      <!-- Right Nav Items -->
      <div class="flex gap-3 items-center">
        <RouterLink
          :to="homeLink"
          class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright hidden md:flex wiggle-hover"
        >
          <span class="z-10 relative">HOME</span>
        </RouterLink>
        <RouterLink
          to="/pricing"
          class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright hidden md:flex wiggle-hover"
        >
          <span class="z-10 relative">PRICING</span>
        </RouterLink>
        <!-- Show signup for guests -->
        <template v-if="!authStore.isAuthenticated">
          <RouterLink
            to="/signup"
            class="group relative bg-brand-bright text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#C92216] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] hover-beam overflow-hidden neo-button"
          >
            <span class="relative z-10">GET STARTED</span>
          </RouterLink>
        </template>
        <!-- Show sign out for authenticated users -->
        <template v-else>
          <button
            class="group relative bg-brand-bright text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#C92216] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] hover-beam overflow-hidden neo-button"
            @click="handleSignOut"
          >
            <span class="relative z-10">SIGN OUT</span>
          </button>
        </template>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative z-10 pt-12 md:pt-20 pb-16 px-6 md:px-12">
      <div class="max-w-screen-2xl mx-auto text-center">
        <!-- Script Header -->
        <div class="relative mb-6 scroll-animate fade-up inline-block">
          <span
            class="md:text-3xl text-brand-red block text-2xl font-script transform rotate-[-2deg] wiggle-hover cursor-default"
          >
            #LifetimeDeal
          </span>
          <!-- Hand-drawn star decoration -->
          <svg
            class="absolute -right-8 -top-2 w-6 h-6 text-brand-teal opacity-80"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
          </svg>
        </div>

        <!-- Main Headline -->
        <div class="leading-none flex flex-col max-w-5xl mx-auto relative items-center">
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
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Lifetime Deal
            </h1>
          </div>
          <div class="relative scroll-animate fade-up delay-200">
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-red leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Disclosure
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
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Subtitle -->
        <p
          class="mt-8 text-brand-gray max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed scroll-animate fade-up delay-300"
        >
          This Lifetime Deal Disclosure explains the terms and limitations of any "lifetime,"
          "one-time," or similar offers provided through the Services.
        </p>

        <!-- Last Updated Badge & Download Button -->
        <div
          class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 scroll-animate fade-up delay-400"
        >
          <!-- Last Updated Badge -->
          <div
            class="inline-flex items-center gap-2 bg-brand-black text-brand-bg px-5 py-2.5 rounded-[4px] text-sm font-semibold border-3 border-brand-black shadow-[4px_4px_0px_0px_#2F7A72] transform rotate-[-0.3deg]"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="font-script text-base">Last Updated:</span>
            <span>January 08, 2026</span>
          </div>

          <!-- Download Button -->
          <a
            href="/StayOnBrand_LTD_Disclosure.pdf"
            download="StayOnBrand_LTD_Disclosure.pdf"
            class="group relative bg-brand-red text-brand-bg px-5 py-2.5 rounded-[4px] border-3 border-brand-black font-semibold text-sm tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] overflow-hidden inline-flex items-center gap-2 transform rotate-[0.3deg]"
          >
            <svg
              class="w-4 h-4 relative z-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span class="relative z-10">DOWNLOAD PDF</span>
          </a>
        </div>

        <!-- Key Points Summary Cards -->
        <div
          class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto scroll-animate fade-up delay-500"
        >
          <!-- Card 1 -->
          <div class="card-hybrid paper-bg p-5 transform rotate-[-0.3deg] tape-decoration">
            <div
              class="w-12 h-12 bg-brand-teal rounded-xl flex items-center justify-center mb-3 border-3 border-brand-black shadow-[2px_2px_0px_0px_#1A1A1A]"
            >
              <svg
                class="w-6 h-6 text-brand-bg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black">Service Lifetime</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              "Lifetime" means the lifetime of the Services
            </p>
          </div>

          <!-- Card 2 - Highlighted -->
          <div class="card-hybrid card-hybrid-red paper-bg p-5 transform rotate-[0.5deg] relative">
            <!-- Marker highlight effect on this card -->
            <div class="absolute top-2 right-2">
              <span class="font-script text-xs text-brand-red transform rotate-[8deg] inline-block"
                >important!</span
              >
            </div>
            <div
              class="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center mb-3 border-3 border-brand-black shadow-[2px_2px_0px_0px_#1A1A1A]"
            >
              <svg
                class="w-6 h-6 text-brand-bg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black marker-highlight">Core Features</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              Access to features at time of purchase
            </p>
          </div>

          <!-- Card 3 -->
          <div class="card-hybrid paper-bg p-5 transform rotate-[-0.5deg] corner-fold">
            <div
              class="w-12 h-12 bg-brand-bright rounded-xl flex items-center justify-center mb-3 border-3 border-brand-black shadow-[2px_2px_0px_0px_#1A1A1A]"
            >
              <svg
                class="w-6 h-6 text-brand-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black">Non-Transferable</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              Cannot be resold, shared, or assigned
            </p>
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
          <aside class="md:col-span-5 lg:col-span-4">
            <div class="sticky top-24 space-y-5">
              <!-- Reading Progress Card -->
              <div
                class="card-hybrid p-6 transform rotate-slight-left relative overflow-hidden"
                style="background: #1a1a1a; box-shadow: 4px 4px 0px 0px #2f7a72"
              >
                <!-- Tape decoration -->
                <div
                  class="absolute -top-1 left-6 w-12 h-5 bg-brand-bright/70 border-2 border-brand-black transform rotate-[-4deg]"
                ></div>

                <div class="flex items-center gap-3 mb-4 mt-2">
                  <div
                    class="w-12 h-12 bg-brand-bright rounded-xl flex items-center justify-center border-3 border-brand-bright"
                  >
                    <svg
                      class="w-6 h-6 text-brand-black"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 8v4l3 3" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-bg font-bold text-lg">LTD Disclosure</p>
                    <p class="text-brand-bg/50 text-xs font-script">Terms & Limitations</p>
                  </div>
                </div>

                <!-- Reading Progress -->
                <div class="mb-4">
                  <div class="flex justify-between text-xs mb-2">
                    <span class="text-brand-bright font-script">Reading Progress</span>
                    <span class="text-brand-bright font-bold"
                      >{{ Math.round(scrollProgress) }}%</span
                    >
                  </div>
                  <div
                    class="h-3 bg-brand-bright/30 rounded-lg overflow-hidden border-2 border-brand-bright/50"
                  >
                    <div
                      class="h-full bg-brand-bright rounded-lg transition-all duration-300"
                      :style="{ width: `${scrollProgress}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 gap-3">
                  <div
                    class="bg-brand-bright/20 rounded-xl p-3 border-2 border-brand-bright/40 transform rotate-[0.5deg]"
                  >
                    <p class="text-brand-bright text-2xl font-bold font-script">9</p>
                    <p class="text-brand-bright text-xs">Sections</p>
                  </div>
                  <div
                    class="bg-brand-bright/20 rounded-xl p-3 border-2 border-brand-bright/40 transform rotate-[-0.5deg]"
                  >
                    <p class="text-brand-bright text-2xl font-bold font-script">1x</p>
                    <p class="text-brand-bright text-xs">Payment</p>
                  </div>
                </div>
              </div>

              <!-- Table of Contents -->
              <div
                class="card-hybrid paper-bg overflow-hidden transform rotate-slight-right"
                style="box-shadow: 4px 4px 0px 0px #c92216"
              >
                <!-- Header -->
                <div
                  class="bg-brand-black px-5 py-4 flex items-center justify-between border-b-3 border-brand-black"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 bg-brand-red rounded-lg flex items-center justify-center border-2 border-brand-red"
                    >
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
                  <span class="text-brand-bg/50 text-xs font-script"
                    >{{ sections.length }} items</span
                  >
                </div>

                <!-- Navigation Items -->
                <div class="p-3 max-h-[45vh] overflow-y-auto hide-scrollbar">
                  <div class="space-y-1.5">
                    <button
                      v-for="section in sections"
                      :key="section.id"
                      :class="[
                        'w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-left',
                        activeSection === section.id
                          ? 'bg-brand-bright border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] transform rotate-[-0.3deg]'
                          : 'hover:bg-brand-bright/20 border-2 border-transparent hover:border-brand-black/20'
                      ]"
                      @click="scrollToSection(section.id)"
                    >
                      <!-- Number Badge with hand-drawn feel -->
                      <div
                        :class="[
                          'w-8 h-8 rounded-lg flex items-center justify-center font-script text-base font-bold transition-all duration-200 shrink-0 border-2',
                          activeSection === section.id
                            ? 'bg-brand-black text-brand-bright border-brand-black'
                            : 'bg-brand-bg text-brand-black border-brand-black/30 group-hover:bg-brand-red group-hover:text-brand-bg group-hover:border-brand-red'
                        ]"
                      >
                        {{ section.number }}
                      </div>
                      <span
                        :class="[
                          'flex-1 text-sm font-medium transition-all duration-200 truncate',
                          activeSection === section.id
                            ? 'text-brand-black font-bold'
                            : 'text-brand-black/70 group-hover:text-brand-black'
                        ]"
                      >
                        {{ section.title }}
                      </span>
                      <!-- Hand-drawn arrow -->
                      <span
                        :class="[
                          'font-script text-lg transition-all duration-200 shrink-0',
                          activeSection === section.id
                            ? 'text-brand-black opacity-100'
                            : 'text-brand-gray opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                        ]"
                      >
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contact Card -->
              <div
                class="card-hybrid p-5 transform rotate-slight-left relative"
                style="background: #1a1a1a; box-shadow: 4px 4px 0px 0px #2f7a72"
              >
                <!-- Corner fold effect -->
                <div
                  class="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-brand-bg border-l-[20px] border-l-transparent"
                ></div>

                <div class="flex items-start gap-3 mb-4">
                  <div
                    class="w-11 h-11 bg-brand-bright rounded-xl flex items-center justify-center shrink-0 border-3 border-brand-bright"
                  >
                    <svg
                      class="w-5 h-5 text-brand-black"
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
                    <p class="text-brand-bright font-bold">Questions?</p>
                    <p class="text-brand-bright text-xs font-script">We're here to help</p>
                  </div>
                </div>

                <p class="text-brand-bg/80 text-sm mb-4">
                  Need help understanding our terms? Our support team is ready to assist.
                </p>

                <a
                  href="mailto:legal@stayonbrand.in"
                  class="group relative bg-brand-bright text-brand-black px-4 py-3 rounded-[4px] border-3 border-brand-black font-semibold text-sm tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden neo-button w-full justify-center inline-flex items-center gap-2"
                >
                  <span class="relative z-10">Contact Support</span>
                  <span class="font-script text-lg relative z-10">→</span>
                </a>
              </div>

              <!-- Quick Links -->
              <div class="card-hybrid paper-bg p-4 transform rotate-slight-right">
                <p
                  class="text-xs font-bold text-brand-black uppercase tracking-wider mb-3 px-1 font-script"
                >
                  Related Documents
                </p>
                <div class="space-y-2">
                  <RouterLink
                    to="/terms"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-bright/30 transition-all duration-200 group border-2 border-transparent hover:border-brand-black/20"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center group-hover:bg-brand-teal group-hover:scale-105 transition-all duration-200 border-2 border-brand-teal/30 group-hover:border-brand-teal"
                    >
                      <svg
                        class="w-5 h-5 text-brand-teal group-hover:text-brand-bg"
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
                      <p class="text-xs text-brand-gray font-script">Usage guidelines</p>
                    </div>
                    <span
                      class="font-script text-brand-gray group-hover:text-brand-black transition-colors"
                      >→</span
                    >
                  </RouterLink>
                  <RouterLink
                    to="/refund-policy"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-bright/30 transition-all duration-200 group border-2 border-transparent hover:border-brand-black/20"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-brand-red/20 flex items-center justify-center group-hover:bg-brand-red group-hover:scale-105 transition-all duration-200 border-2 border-brand-red/30 group-hover:border-brand-red"
                    >
                      <svg
                        class="w-5 h-5 text-brand-red group-hover:text-brand-bg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                        <path d="M12 3v6" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-black truncate">Refund Policy</p>
                      <p class="text-xs text-brand-gray font-script">Payment terms</p>
                    </div>
                    <span
                      class="font-script text-brand-gray group-hover:text-brand-black transition-colors"
                      >→</span
                    >
                  </RouterLink>
                  <RouterLink
                    to="/privacy"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-bright/30 transition-all duration-200 group border-2 border-transparent hover:border-brand-black/20"
                  >
                    <div
                      class="w-10 h-10 rounded-lg bg-brand-bright/50 flex items-center justify-center group-hover:bg-brand-bright group-hover:scale-105 transition-all duration-200 border-2 border-brand-bright/50 group-hover:border-brand-black"
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
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-black truncate">Privacy Policy</p>
                      <p class="text-xs text-brand-gray font-script">Data handling</p>
                    </div>
                    <span
                      class="font-script text-brand-gray group-hover:text-brand-black transition-colors"
                      >→</span
                    >
                  </RouterLink>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right Column: Content -->
          <div class="col-span-1 md:col-span-7 lg:col-span-8 space-y-10 md:space-y-12">
            <!-- Section 1: What "Lifetime" Means -->
            <section id="lifetime-meaning" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-left tape-decoration overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-teal flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M12 8v4l3 3" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 01</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      What "Lifetime" Means
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <div
                    class="p-4 rounded-xl bg-brand-teal/10 border-3 border-brand-teal/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black font-semibold">
                      <span class="text-brand-teal font-script text-lg">Important:</span> "Lifetime"
                      refers to the <strong>lifetime of the Services</strong>, not the lifetime of
                      any individual user, device, company, or legal entity.
                    </p>
                  </div>
                  <p>
                    The Services are operated by an individual, and continued operation depends on
                    technical, financial, and practical considerations.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 2: Scope of Access -->
            <section id="scope-access" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid card-hybrid-red paper-bg p-6 md:p-8 transform rotate-slight-right overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 02</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Scope of Access
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>A lifetime deal typically includes:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span>Access to the core features available at the time of purchase</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span>Access to updates or improvements at our discretion</span>
                    </li>
                  </ul>

                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black font-semibold mb-2">
                      <span class="text-brand-red">Lifetime deals do NOT guarantee:</span>
                    </p>
                    <ul class="list-none space-y-2">
                      <li class="flex items-start gap-3 text-sm">
                        <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-1.5"></span>
                        <span>Access to all future features</span>
                      </li>
                      <li class="flex items-start gap-3 text-sm">
                        <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-1.5"></span>
                        <span>Access to professional, business, or add-on functionality</span>
                      </li>
                      <li class="flex items-start gap-3 text-sm">
                        <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-1.5"></span>
                        <span>Unlimited usage</span>
                      </li>
                      <li class="flex items-start gap-3 text-sm">
                        <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-1.5"></span>
                        <span>Uninterrupted or perpetual availability of the Services</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 3: Usage Limits -->
            <section id="usage-limits" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-left corner-fold overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-bright flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-black"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 03</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Usage Limits
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Lifetime access is subject to <strong>reasonable usage limits</strong>,
                    technical constraints, and <strong>fair use policies</strong>.
                  </p>
                  <p>We reserve the right to:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span>Apply or adjust usage caps</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span>Restrict excessive, abusive, or disproportionate usage</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span
                        >Introduce limits necessary to protect service stability and
                        sustainability</span
                      >
                    </li>
                  </ul>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-bright/30 border-3 border-brand-teal/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      Excessive or abusive usage may result in temporary restrictions, permanent
                      limitations, or termination in accordance with our policies.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 4: Infrastructure & Third-Party Dependencies -->
            <section id="infrastructure" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-right tape-decoration tape-mint overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-teal flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                      <line x1="6" y1="6" x2="6.01" y2="6" />
                      <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 04</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Infrastructure & Third-Party Dependencies
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The availability and functionality of the Services may depend on
                    <strong
                      >third-party platforms, infrastructure, APIs, hosting providers, or external
                      services</strong
                    >.
                  </p>
                  <p>
                    Changes to, interruptions of, pricing increases by, or discontinuation of such
                    third-party services may:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Affect features or performance</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Limit availability</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Require modification or discontinuation of certain functionality</span>
                    </li>
                  </ul>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-teal/10 border-3 border-brand-teal/30 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      We are not responsible for service limitations or changes caused by
                      third-party dependencies beyond our reasonable control.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 5: Service Changes & Discontinuation -->
            <section id="service-changes" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid card-hybrid-red paper-bg p-6 md:p-8 transform rotate-slight-left overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
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
                    <p class="text-brand-red text-base font-script mb-1">Section 05</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Service Changes & Discontinuation
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>We may, at any time:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Modify, replace, or remove features</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Change how the Services operate</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Suspend or discontinue the Services entirely</span>
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black font-semibold">
                      <span class="text-brand-red">Important:</span> If the Services are
                      discontinued, lifetime access will end. Refunds are
                      <strong>not guaranteed</strong> unless required by applicable law.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 6: No Ownership or Vested Rights -->
            <section id="no-ownership" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-right corner-fold overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-bright flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
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
                    <p class="text-brand-teal text-base font-script mb-1">Section 06</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      No Ownership or Vested Rights
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>A lifetime deal:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Does <strong>not</strong> grant ownership rights</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Does <strong>not</strong> create vested or perpetual rights</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span
                        >Grants only a <strong>limited, revocable right</strong> to access the
                        Services under the applicable policies</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 7: Transferability -->
            <section id="transferability" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-left tape-decoration overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-teal flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M16 3h5v5" />
                      <path d="M8 21H3v-5" />
                      <path d="M21 3L14 10" />
                      <path d="M3 21l7-7" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 07</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Transferability
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Unless explicitly stated otherwise, lifetime deals are
                    <strong>non-transferable</strong> and may not be resold, shared, or assigned.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 8: Relationship to Other Policies -->
            <section id="other-policies" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid card-hybrid-red paper-bg p-6 md:p-8 transform rotate-slight-right overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 08</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Relationship to Other Policies
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>Lifetime deals are subject to:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <RouterLink to="/terms" class="text-brand-teal hover:underline"
                        >Terms of Service</RouterLink
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span>Acceptable Use Policy</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <RouterLink to="/privacy" class="text-brand-teal hover:underline"
                        >Privacy Policy</RouterLink
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <RouterLink to="/refund-policy" class="text-brand-teal hover:underline"
                        >Refund Policy</RouterLink
                      >
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black font-semibold">
                      <span class="text-brand-red">Important:</span> Violation of any applicable
                      policy may result in suspension or termination of access
                      <strong>without refund</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 9: Contact -->
            <section id="contact" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid card-hybrid-red paper-bg p-6 md:p-8 transform rotate-slight-right overflow-visible"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
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
                    <p class="text-brand-red text-base font-script mb-1">Section 09</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Contact
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If you have questions about lifetime deals, you may contact the operator of the
                    Services at:
                  </p>
                  <div class="mt-6">
                    <div
                      class="flex items-center gap-4 p-5 rounded-lg bg-white border-3 border-brand-black shadow-[3px_3px_0px_0px_#C92216] rotate-slight-left wiggle-hover"
                    >
                      <div
                        class="w-12 h-12 rounded-lg bg-brand-red flex items-center justify-center flex-shrink-0 border-2 border-brand-black"
                      >
                        <svg
                          class="w-6 h-6 text-brand-bg"
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
                        <p class="text-xs text-brand-gray uppercase tracking-wide font-script">
                          email us
                        </p>
                        <a
                          href="mailto:legal@stayonbrand.in"
                          class="text-brand-black font-bold hover:text-brand-red transition-colors hand-underline hand-underline-red"
                          >legal@stayonbrand.in</a
                        >
                      </div>
                    </div>
                  </div>
                  <p class="mt-6 text-sm text-brand-gray font-script">
                    Responses are provided at our discretion.
                  </p>
                </div>
              </div>
            </section>

            <!-- Action Buttons -->
            <div class="pt-8 scroll-animate fade-up">
              <div
                class="card-hybrid p-8 md:p-12 transform rotate-[0.3deg] relative overflow-visible"
                style="background: #1a1a1a; box-shadow: 4px 4px 0px 0px #2f7a72"
              >
                <!-- Corner fold -->
                <div
                  class="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-brand-bg border-l-[24px] border-l-transparent"
                ></div>

                <p class="text-brand-bright font-script text-2xl md:text-3xl mb-2">
                  Transparent lifetime deal terms
                </p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By purchasing a lifetime deal, you acknowledge that you have read and understood
                  this Disclosure.
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <RouterLink
                    to="/terms"
                    class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright wiggle-hover w-full sm:w-auto justify-center inline-flex items-center"
                  >
                    <span class="z-10 relative">VIEW TERMS OF SERVICE</span>
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    class="group relative bg-brand-bright text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#C92216] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] hover-beam overflow-hidden neo-button w-full sm:w-auto justify-center inline-flex items-center gap-2"
                  >
                    <span class="relative z-10">GET STARTED</span>
                    <span class="font-script text-lg relative z-10">→</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-8 border-t-3 border-brand-black/20 relative z-20 bg-brand-bg">
      <div class="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- Logo & Copyright -->
          <div class="flex items-center gap-4">
            <RouterLink :to="homeLink" class="flex items-center gap-2 group">
              <div
                class="w-9 h-9 bg-brand-black rounded-full flex items-center justify-center border-3 border-brand-black transform group-hover:rotate-6 transition-transform shadow-[2px_2px_0px_0px_#2F7A72]"
              >
                <span class="font-display font-bold text-sm text-brand-bright">S.</span>
              </div>
            </RouterLink>
            <span class="font-script text-base text-brand-black/60"
              >&copy; {{ new Date().getFullYear() }} Stay on Brand</span
            >
          </div>

          <!-- Quick Links -->
          <div class="flex items-center gap-6 text-sm text-brand-black/60">
            <RouterLink
              to="/privacy"
              class="hover:text-brand-black transition-colors hand-underline"
              >Privacy</RouterLink
            >
            <RouterLink to="/terms" class="hover:text-brand-black transition-colors hand-underline"
              >Terms</RouterLink
            >
            <RouterLink
              to="/ltd-disclosure"
              class="text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors"
              >LTD</RouterLink
            >
            <RouterLink to="/help" class="hover:text-brand-black transition-colors hand-underline"
              >Help</RouterLink
            >
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
            <span class="text-xs font-bold text-brand-black">All systems operational</span>
          </div>
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
          <path d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Scoped styles for this page */
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

  /* Smooth Scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar for table of contents */
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
