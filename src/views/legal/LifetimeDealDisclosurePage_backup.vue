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
    { id: 'info-collect', title: 'Information We Collect', number: '01' },
    { id: 'info-process', title: 'How We Process Info', number: '02' },
    { id: 'info-share', title: 'Information Sharing', number: '03' },
    { id: 'cookies', title: 'Cookies & Tracking', number: '04' },
    { id: 'social-logins', title: 'Social Logins', number: '05' },
    { id: 'international', title: 'International Transfers', number: '06' },
    { id: 'retention', title: 'Data Retention', number: '07' },
    { id: 'minors', title: "Children's Privacy", number: '08' },
    { id: 'rights', title: 'Your Privacy Rights', number: '09' },
    { id: 'dnt', title: 'Do-Not-Track', number: '10' },
    { id: 'payments', title: 'Payment Handling', number: '11' },
    { id: 'updates', title: 'Policy Updates', number: '12' },
    { id: 'contact', title: 'Contact Us', number: '13' }
  ]

  // Active section tracking
  const activeSection = ref('info-collect')

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
          <span class="font-script text-lg text-brand-black">Privacy Policy</span>
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
            #YourDataMatters
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
              </svg>
            </div>
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Privacy
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <circle cx="12" cy="16" r="1" />
                <path d="m7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Subtitle -->
        <p
          class="mt-10 text-brand-gray max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed scroll-animate fade-up delay-300"
        >
          This Privacy Notice explains how Stay On Brand collects, uses, and handles personal
          information when you use our services. We are committed to protecting your data
          responsibly.
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
            href="/StayOnBrand_Privacy_Policy.pdf"
            download="StayOnBrand_Privacy_Policy.pdf"
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
            <p class="text-base font-bold text-brand-black">No Sensitive Data</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              We don't collect sensitive personal information
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
            <p class="text-base font-bold text-brand-black marker-highlight">No Data Sales</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              We never sell your personal information
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black">Your Rights</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              Access, correct, or delete your data anytime
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-bg font-bold text-lg">Privacy Policy</p>
                    <p class="text-brand-bg/50 text-xs font-script">Your Data Protection</p>
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
                    <p class="text-brand-bright text-2xl font-bold font-script">13</p>
                    <p class="text-brand-bright text-xs">Sections</p>
                  </div>
                  <div
                    class="bg-brand-bright/20 rounded-xl p-3 border-2 border-brand-bright/40 transform rotate-[-0.5deg]"
                  >
                    <p class="text-brand-bright text-2xl font-bold font-script">0</p>
                    <p class="text-brand-bright text-xs">Data Sold</p>
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
                  Need help understanding our privacy policy? Our support team is ready to assist.
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
                      class="w-10 h-10 rounded-lg bg-brand-bright/50 flex items-center justify-center group-hover:bg-brand-bright group-hover:scale-105 transition-all duration-200 border-2 border-brand-bright/50 group-hover:border-brand-black"
                    >
                      <svg
                        class="w-5 h-5 text-brand-black"
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
                      <p class="text-xs text-brand-gray font-script">Returns & refunds</p>
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
            <!-- Section 1: Information Collection -->
            <section id="info-collect" class="scroll-mt-24 scroll-animate fade-up">
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
                      What Information Do We Collect?
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-6 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <div>
                    <h3 class="text-lg font-semibold text-brand-black mb-2 font-display">
                      Personal Information You Provide
                    </h3>
                    <p>
                      We collect personal information that you voluntarily provide when you use the
                      Services, such as when you create an account, contact us, request information,
                      or otherwise interact with the product. The personal information collected may
                      include basic contact details (such as an email address) and any other
                      information you choose to share.
                    </p>
                  </div>
                  <div
                    class="p-4 rounded-xl bg-brand-bright/20 border-3 border-brand-teal/30 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">Important:</span> We do not
                      intentionally collect or process sensitive personal information.
                    </p>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-brand-black mb-2 font-display">
                      Information Automatically Collected
                    </h3>
                    <p>
                      When you visit or use the Services, certain information is automatically
                      collected. This information does not directly identify you but may include
                      technical and usage details such as:
                    </p>
                    <ul class="list-none space-y-3 mt-4">
                      <li class="flex items-start gap-3">
                        <span
                          class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2 border border-brand-black"
                        ></span>
                        <span>IP address and browser type</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <span
                          class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2 border border-brand-black"
                        ></span>
                        <span>Device characteristics and operating system</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <span
                          class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2 border border-brand-black"
                        ></span>
                        <span>Language preferences and referring URLs</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <span
                          class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2 border border-brand-black"
                        ></span>
                        <span>Approximate location (based on IP address)</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <span
                          class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2 border border-brand-black"
                        ></span>
                        <span>Information about how you interact with the Services</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 2: How We Process -->
            <section id="info-process" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path
                        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 02</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      How Do We Process Your Information?
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    We process personal information only as necessary to operate, maintain, and
                    improve the Services, communicate with users, and protect the Services from
                    misuse.
                  </p>
                  <p>The purposes for processing may include:</p>
                  <ul class="list-none space-y-3 mt-4">
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >1</span
                      >
                      <span
                        ><strong>Providing and operating the Services</strong>, including account
                        functionality and core features</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >2</span
                      >
                      <span
                        ><strong>Communicating with you</strong>, such as responding to inquiries or
                        sending service-related messages</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-bright text-brand-black flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >3</span
                      >
                      <span
                        ><strong>Improving and maintaining the Services</strong>, including
                        understanding how the product is used and fixing issues</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >4</span
                      >
                      <span
                        ><strong>Protecting the Services</strong>, including maintaining security
                        and preventing misuse or abuse</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >5</span
                      >
                      <span
                        ><strong>Complying with applicable legal obligations</strong>, if and when
                        required</span
                      >
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      Where we rely on your consent for specific processing activities, this will be
                      clearly disclosed, and you may withdraw your consent where applicable.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 3: Information Sharing -->
            <section id="info-share" class="scroll-mt-24 scroll-animate fade-up">
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
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 03</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      When Do We Share Your Information?
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <div
                    class="p-4 rounded-xl bg-brand-bright/30 border-3 border-brand-teal/40 transform rotate-[0.3deg] mb-6"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">Key Point:</span> We do
                      <strong>not</strong> sell personal information and do
                      <strong>not</strong> share it for advertising or promotional purposes.
                    </p>
                  </div>
                  <p>Personal information may be shared in the following limited situations:</p>
                  <div class="space-y-4 mt-4">
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs"
                          >1</span
                        >
                        Service Providers
                      </h4>
                      <p class="text-sm">
                        We may share personal information with third-party service providers that
                        help operate the Services, such as website hosting, analytics, email
                        delivery, or infrastructure providers. These providers are permitted to use
                        personal information only to perform services on our behalf.
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-red text-brand-bg flex items-center justify-center text-xs"
                          >2</span
                        >
                        Legal Requirements
                      </h4>
                      <p class="text-sm">
                        Information may be disclosed if required to comply with applicable laws,
                        regulations, or lawful requests from public authorities.
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2 flex items-center gap-2">
                        <span
                          class="w-6 h-6 rounded bg-brand-bright text-brand-black flex items-center justify-center text-xs"
                          >3</span
                        >
                        Service Transition
                      </h4>
                      <p class="text-sm">
                        If the Services are transferred, sold, or discontinued in the future,
                        personal information may be transferred as part of that transition. If this
                        occurs, reasonable notice will be provided where practicable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 4: Cookies -->
            <section id="cookies" class="scroll-mt-24 scroll-animate fade-up">
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
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="8" cy="9" r="1" fill="currentColor" />
                      <circle cx="15" cy="8" r="1" fill="currentColor" />
                      <circle cx="10" cy="14" r="1" fill="currentColor" />
                      <circle cx="16" cy="13" r="1" fill="currentColor" />
                      <circle cx="13" cy="17" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 04</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Cookies & Tracking Technologies
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    We may use cookies or similar technologies to collect limited information when
                    you interact with the Services. These technologies help support essential site
                    functions, remember preferences, maintain security, fix bugs, and understand
                    general usage patterns.
                  </p>
                  <p>
                    We may also use third-party analytics tools (such as privacy-focused or standard
                    analytics providers) to help understand how the Services are used. These tools
                    collect information in an aggregated or pseudonymous form and are used only to
                    improve functionality and performance.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-teal/10 border-3 border-brand-teal/30 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">Important:</span> We do
                      <strong>not</strong> use cookies or tracking technologies for targeted
                      advertising, behavioral profiling, or selling personal information.
                    </p>
                  </div>
                  <p class="mt-4">
                    You can control or disable cookies through your browser settings. If a separate
                    Cookie Notice is provided, it will contain additional details about cookie usage
                    and controls.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 5: Social Logins -->
            <section id="social-logins" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 05</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      How Do We Handle Social Logins?
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If the Services offer social login functionality and you choose to register or
                    sign in using a third-party account, we may receive certain basic profile
                    information from that provider. The information received depends on the provider
                    and your privacy settings, but typically includes your name and email address.
                  </p>
                  <div
                    class="p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-script text-lg">Note:</span> We do
                      <strong>not</strong> receive your account password from social login
                      providers.
                    </p>
                  </div>
                  <p>
                    We use this information only to create or authenticate your account and to
                    operate the Services as described in this Privacy Notice.
                  </p>
                  <p>
                    We do not control how third-party social media providers collect or use your
                    personal information. Their use of your information is governed by their own
                    privacy policies.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 6: International Transfers -->
            <section id="international" class="scroll-mt-24 scroll-animate fade-up">
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
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 06</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      International Data Transfers
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services are operated from India, and our servers are currently located in
                    India. If you access the Services from outside India, your personal information
                    may be transferred to, stored in, and processed in India or in other countries
                    where service providers are located.
                  </p>
                  <p>
                    Data protection laws in these countries may differ from those in your place of
                    residence. We take reasonable and appropriate steps to protect personal
                    information in accordance with this Privacy Notice and applicable laws.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-bright/30 border-3 border-brand-teal/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      By using the Services, you acknowledge that your information may be
                      transferred to and processed in jurisdictions outside your own.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 7: Data Retention -->
            <section id="retention" class="scroll-mt-24 scroll-animate fade-up">
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
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 07</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      How Long Do We Keep Your Information?
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    We retain personal information for as long as needed to provide and maintain the
                    Services, comply with applicable legal obligations (where required), resolve
                    disputes, and enforce our agreements.
                  </p>
                  <p>
                    When personal information is no longer needed for these purposes, we take
                    reasonable steps to delete or anonymize it. In some cases, information may be
                    retained for a limited period in backup or archival systems and will be isolated
                    from active use until it is deleted in the normal course of system maintenance.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-teal/10 border-3 border-brand-teal/30 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">Key Point:</span> We do not
                      retain personal information longer than necessary for the purposes described
                      in this Privacy Notice.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 8: Minors -->
            <section id="minors" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 08</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Children's Privacy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services are not directed to children under the age required by applicable
                    law (generally under 13). We do not knowingly collect, solicit, or process
                    personal information from children.
                  </p>
                  <p>
                    If we become aware that personal information has been collected from a child
                    without appropriate authorization, we will take reasonable steps to delete that
                    information.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      If you believe that a child has provided personal information through the
                      Services, please contact us using the contact information provided below.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 9: Privacy Rights -->
            <section id="rights" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 09</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Your Privacy Rights
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Depending on your country, state, or region of residence, you may have rights to
                    request access to, correction of, or deletion of your personal information.
                    These rights vary based on applicable data protection laws.
                  </p>
                  <div class="space-y-4 mt-6">
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2">Withdrawing Consent</h4>
                      <p class="text-sm">
                        Where we rely on your consent to process personal information, you may
                        withdraw that consent at any time by contacting us. Withdrawing consent will
                        not affect processing that occurred before the withdrawal or processing that
                        is otherwise permitted under applicable law.
                      </p>
                    </div>
                    <div class="p-4 rounded-xl bg-brand-bg border border-brand-black/20">
                      <h4 class="font-semibold text-brand-black mb-2">Account Information</h4>
                      <p class="text-sm">
                        If you have an account and would like to review, update, or request deletion
                        of your information, you can contact us using the contact information
                        provided below. Where applicable, we will take reasonable steps to
                        deactivate or delete your information from active systems.
                      </p>
                    </div>
                  </div>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-bright/30 border-3 border-brand-teal/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      In some cases, limited information may be retained for a reasonable period
                      where necessary for security, system integrity, or compliance with legal
                      obligations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 10: DNT -->
            <section id="dnt" class="scroll-mt-24 scroll-animate fade-up">
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 10</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Do-Not-Track Features
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Most web browsers and some mobile operating systems include a Do-Not-Track
                    ("DNT") setting that allows users to signal a preference regarding the tracking
                    of their online activities.
                  </p>
                  <p>
                    There is currently no widely accepted standard for recognizing or responding to
                    DNT signals. As a result, the Services do not respond to DNT browser signals or
                    similar automated tracking preference mechanisms.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-teal/10 border-3 border-brand-teal/30 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      If an applicable standard for online tracking is adopted in the future that
                      requires changes to this practice, we will update this Privacy Notice
                      accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 11: Payments -->
            <section id="payments" class="scroll-mt-24 scroll-animate fade-up">
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
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 11</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      How Do We Handle Payments?
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If the Services include paid features now or in the future, payments will be
                    processed by third-party payment processors. We do not collect, store, or
                    process full payment card details or other sensitive financial information on
                    our own servers.
                  </p>
                  <p>
                    The payment processors may collect and process payment-related information (such
                    as billing details and transaction information) in accordance with their own
                    privacy policies and security practices.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      We may receive limited information related to payments, such as confirmation
                      of payment status, subscription details, or transaction identifiers, solely
                      for the purpose of providing the Services and managing access to paid
                      features.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 12: Updates -->
            <section id="updates" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 12</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Policy Updates
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    We may update this Privacy Notice occasionally to reflect changes to the
                    Services, changes in how information is handled, or other operational or legal
                    considerations. When updates are made, the revised version will be indicated by
                    an updated "Revised" date at the top of this notice.
                  </p>
                  <p>
                    If we make material changes, we may provide notice by posting an updated version
                    of this Privacy Notice on the Services or, where reasonably practicable, by
                    other appropriate means.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-bright/30 border-3 border-brand-teal/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      We encourage you to review this Privacy Notice periodically to stay informed
                      about how personal information is handled.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 13: Contact -->
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
                    <p class="text-brand-red text-base font-script mb-1">Section 13</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Contact Us
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If you have questions or concerns about this Privacy Notice or how personal
                    information is handled, you can contact the operator of Stay On Brand at:
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
                    We will make reasonable efforts to respond to inquiries in a timely manner.
                  </p>
                </div>
              </div>
            </section>

            <!-- Data Management Section -->
            <section class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Data Management</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Review, Update, or Delete Your Data
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Depending on where you live, you may have certain rights regarding your personal
                    information. These may include the right to request access to the information we
                    hold about you, request corrections, or request deletion of your personal
                    information.
                  </p>
                  <p>
                    You may also have the right to withdraw your consent where processing is based
                    on consent. These rights may be limited in some circumstances under applicable
                    law.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      To make a request, please contact us using the contact information provided
                      above. We may need to verify your identity before responding to certain
                      requests.
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
                  Your privacy matters to us
                </p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By using Stay On Brand, you acknowledge that you have read and understood this
                  Privacy Policy.
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
              class="text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors"
              >Privacy</RouterLink
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
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="m7 11V7a5 5 0 0 1 10 0v4" />
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
