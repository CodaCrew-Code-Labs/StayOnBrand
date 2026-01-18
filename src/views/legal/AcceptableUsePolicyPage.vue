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
    { id: 'use-of-services', title: 'Use of the Services', number: '01' },
    { id: 'consequences', title: 'Consequences of Breach', number: '02' },
    { id: 'contact', title: 'Contact Us', number: '03' }
  ]

  // Active section tracking
  const activeSection = ref('use-of-services')

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
          <span class="font-script text-lg text-brand-black">Acceptable Use Policy</span>
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
            #UsageGuidelines
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Acceptable Use
            </h1>
          </div>
          <div class="relative scroll-animate fade-up delay-200">
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-red leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Policy
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Subtitle -->
        <p
          class="mt-8 text-brand-gray max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed scroll-animate fade-up delay-300"
        >
          This Acceptable Use Policy is incorporated into and forms part of our Terms of Service. It
          should be read alongside the Legal Terms. By accessing or using the Services, you agree to
          comply with this Policy.
        </p>

        <!-- Last Updated & Download Row -->
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
            href="/StayOnBrand_Acceptable_Use_Policy.pdf"
            download="StayOnBrand_Acceptable_Use_Policy.pdf"
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black">Fair Use</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              Use the Services responsibly and lawfully
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
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black marker-highlight">No Abuse</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              No harmful, illegal, or disruptive behavior
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black">Clear Rules</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              Know what's expected when using our platform
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="relative z-10 flex-grow pb-20 px-6 md:px-12">
      <div class="max-w-screen-2xl mx-auto">
        <!-- Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-bg font-bold text-lg">Usage Policy</p>
                    <p class="text-brand-bg/50 text-xs font-script">Guidelines & Rules</p>
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
                    <p class="text-brand-bright text-2xl font-bold font-script">3</p>
                    <p class="text-brand-bright text-xs">Sections</p>
                  </div>
                  <div
                    class="bg-brand-bright/20 rounded-xl p-3 border-2 border-brand-bright/40 transform rotate-[-0.5deg]"
                  >
                    <p class="text-brand-bright text-2xl font-bold font-script">18</p>
                    <p class="text-brand-bright text-xs">Rules</p>
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
                  Need help understanding our usage policy? Our support team is ready to assist.
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
                    to="/privacy"
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-black truncate">Privacy Policy</p>
                      <p class="text-xs text-brand-gray font-script">How we handle data</p>
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
            <!-- Who We Are Section -->
            <section class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">About</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Who We Are
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services are operated by an individual ("we," "us," or "our"). We are not
                    currently operating as a registered company or legal entity. References to "we,"
                    "us," and "our" in this Policy refer to the individual operator of the Services.
                  </p>
                  <p>
                    This Policy applies to your use of the Services (as defined in the Legal Terms)
                    and any content you submit, upload, transmit, generate, or otherwise make
                    available through the Services, including forms, submissions, comments,
                    messages, and other materials ("Content").
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 1: Use of the Services -->
            <section id="use-of-services" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-right tape-decoration overflow-visible"
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 01</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Use of the Services
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-6 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    When you use the Services, you agree to comply with this Policy and all
                    applicable laws and regulations, and you are solely responsible for your use of
                    the Services. You acknowledge that you may not:
                  </p>
                  <ul class="list-none space-y-3 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Systematically retrieve data or other content from the Services to create
                        or compile, directly or indirectly, a collection, compilation, database, or
                        directory without our prior authorization.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Make any unauthorized use of the Services, including collecting usernames
                        or email addresses of users for the purpose of sending unsolicited
                        communications, creating accounts by automated means, or operating under
                        false or misleading pretenses.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Circumvent, disable, interfere with, or attempt to bypass any
                        security-related features of the Services, including features that limit
                        access, copying, or usage of Content.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Engage in unauthorized framing of or linking to the Services.</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Trick, defraud, mislead, impersonate, or attempt to impersonate us or
                        another user, including attempts to obtain sensitive information such as
                        account credentials.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Engage in or promote fraud, scams, phishing, deceptive practices, or any
                        illegal, harmful, or misleading activity.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Make improper use of the Services or support channels, including submitting
                        false or abusive reports.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Engage in any automated use of the Services, including scripts, bots,
                        scrapers, crawlers, data mining tools, or similar technologies, except as
                        permitted by standard search engine or browser usage.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Interfere with, disrupt, overload, or create an undue burden on the
                        Services or connected networks.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Use any information obtained from the Services to harass, abuse, threaten,
                        or harm another person.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Use the Services to compete with us or for unauthorized commercial,
                        revenue-generating, or resale purposes.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Reverse engineer, decompile, disassemble, or attempt to derive the source
                        code of any part of the Services, except where expressly permitted by
                        law.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Harass, intimidate, or threaten the operator of the Services or anyone
                        involved in providing or supporting the Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Remove or alter copyright, trademark, or other proprietary notices.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Copy, modify, or adapt the Services' software or code.</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Upload, transmit, or attempt to upload or transmit malware, viruses,
                        spyware, tracking mechanisms, or any content that disrupts, degrades, or
                        interferes with the normal operation or security of the Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Disparage, tarnish, or otherwise harm, in our sole discretion, us or the
                        Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Use the Services in a manner inconsistent with applicable laws or
                        regulations.</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 2: Consequences of Breaching -->
            <section id="consequences" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path
                        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 02</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Consequences of Breaching This Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The consequences for violating this Policy may vary depending on the nature,
                    severity, and frequency of the breach, as well as the user's prior conduct on
                    the Services. The actions described below are non-exhaustive examples.
                  </p>
                  <div class="space-y-4 mt-6">
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs"
                          >1</span
                        >
                        Warnings
                      </h4>
                      <p class="text-sm">
                        We may, at our sole discretion, provide a warning in some cases; however, we
                        are under no obligation to do so.
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-red text-brand-bg flex items-center justify-center text-xs"
                          >2</span
                        >
                        Account Actions
                      </h4>
                      <p class="text-sm">
                        If a breach is serious, repeated, or otherwise unacceptable, we reserve the
                        right, at our sole discretion and with or without notice, to suspend,
                        restrict, or terminate your access to the Services, disable your account, or
                        take any other action we consider appropriate.
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-bright text-brand-black flex items-center justify-center text-xs"
                          >3</span
                        >
                        Legal Cooperation
                      </h4>
                      <p class="text-sm">
                        Where we reasonably believe that a violation involves illegal activity, risk
                        of harm to an individual, or a threat to public safety, we may cooperate
                        with law enforcement or regulatory authorities as required by applicable
                        law.
                      </p>
                    </div>
                  </div>
                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Note:</span> To the maximum extent
                      permitted by applicable law, we disclaim liability for actions taken in good
                      faith to investigate, prevent, or enforce violations of this Policy.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 3: Contact -->
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
                    <p class="text-brand-red text-base font-script mb-1">Section 03</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      How Can You Contact Us About This Policy?
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If you have questions or concerns specifically related to this Acceptable Use
                    Policy, you may contact the operator of the Services by email at:
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
                    This contact method is intended for Policy-related inquiries only. We may not
                    respond to all messages, and responses are provided at our discretion.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-teal/10 border-3 border-brand-teal/30 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">Report Violations:</span> If
                      you believe a user is violating this Policy, you may report the issue using
                      the contact email above.
                    </p>
                  </div>
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
                  Responsible usage matters
                </p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By using Stay On Brand, you acknowledge that you have read and understood this
                  Acceptable Use Policy.
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
              to="/aup"
              class="text-brand-red font-semibold hover:text-brand-red/80 transition-colors"
              >AUP</RouterLink
            >
            <RouterLink to="/terms" class="hover:text-brand-black transition-colors hand-underline"
              >Terms</RouterLink
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
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
