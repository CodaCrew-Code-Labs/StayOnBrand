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
    { id: 'agreement', title: 'Agreement to Legal Terms', number: '01' },
    { id: 'our-services', title: 'Our Services', number: '02' },
    { id: 'intellectual-property', title: 'Intellectual Property', number: '03' },
    { id: 'user-representations', title: 'User Representations', number: '04' },
    { id: 'user-registration', title: 'User Registration', number: '05' },
    { id: 'purchases-payment', title: 'Purchases & Payment', number: '06' },
    { id: 'subscriptions', title: 'Subscriptions', number: '07' },
    { id: 'lifetime-deals', title: 'Lifetime Deals', number: '08' },
    { id: 'prohibited-activities', title: 'Prohibited Activities', number: '09' },
    { id: 'user-content', title: 'User Generated Content', number: '10' },
    { id: 'third-party', title: 'Third-Party Content', number: '11' },
    { id: 'services-management', title: 'Services Management', number: '12' },
    { id: 'privacy-policy', title: 'Privacy Policy', number: '13' },
    { id: 'termination', title: 'Term & Termination', number: '14' },
    { id: 'modifications', title: 'Modifications', number: '15' },
    { id: 'governing-law', title: 'Governing Law', number: '16' },
    { id: 'dispute-resolution', title: 'Dispute Resolution', number: '17' },
    { id: 'disclaimer', title: 'Disclaimer', number: '18' },
    { id: 'limitation-liability', title: 'Limitation of Liability', number: '19' },
    { id: 'indemnification', title: 'Indemnification', number: '20' },
    { id: 'contact', title: 'Contact Us', number: '21' }
  ]

  // Active section tracking
  const activeSection = ref('agreement')

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
          <span class="font-script text-lg text-brand-black">Legal Agreement</span>
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
    <section class="relative z-10 pt-12 md:pt-16 pb-12 px-6 md:px-12">
      <div class="max-w-screen-2xl mx-auto text-center">
        <!-- Script Header -->
        <div class="relative mb-6 scroll-animate fade-up inline-block">
          <span
            class="md:text-3xl text-brand-red block text-2xl font-script transform rotate-[-2deg] wiggle-hover cursor-default"
          >
            #LegalAgreement
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Terms &
            </h1>
          </div>
          <div class="relative scroll-animate fade-up delay-200">
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-red leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Conditions
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

        <!-- Subtitle -->
        <p
          class="mt-10 text-brand-gray max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed scroll-animate fade-up delay-300"
        >
          These Legal Terms constitute a legally binding agreement between you and the Operator of
          Stay On Brand, governing your access to and use of the Services.
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
            href="/StayOnBrand_Terms_and_Conditions.pdf"
            download="StayOnBrand_Terms_and_Conditions.pdf"
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
            <p class="text-base font-bold text-brand-black">Binding Agreement</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              By using our services, you agree to these terms
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
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black marker-highlight">Age Requirement</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              Users must be at least 13 years of age
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
              </svg>
            </div>
            <p class="text-base font-bold text-brand-black">Keep a Copy</p>
            <p class="text-sm text-brand-gray mt-1 font-script">
              We recommend retaining these terms
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
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-bg font-bold text-lg">Terms & Conditions</p>
                    <p class="text-brand-bg/50 text-xs font-script">Legal Agreement</p>
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
                    <p class="text-brand-bright text-2xl font-bold font-script">21</p>
                    <p class="text-brand-bright text-xs">Sections</p>
                  </div>
                  <div
                    class="bg-brand-bright/20 rounded-xl p-3 border-2 border-brand-bright/40 transform rotate-[-0.5deg]"
                  >
                    <p class="text-brand-bright text-2xl font-bold font-script">16</p>
                    <p class="text-brand-bright text-xs">Pages</p>
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
            <!-- Section 1: Agreement to Legal Terms -->
            <section id="agreement" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 01</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Agreement to Our Legal Terms
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Stay On Brand is an independently operated software service provided by an
                    individual founder ("Operator", "we", "us"). Stay On Brand is
                    <strong>not a registered company or separate legal entity</strong>. The Services
                    are operated solely in the Operator's personal capacity.
                  </p>
                  <p>
                    We operate the website <strong>Stayonbrand.in</strong> (the "Site"), as well as
                    any related products or services that refer or link to these legal terms
                    (collectively, the "Services").
                  </p>
                  <p>
                    These Legal Terms constitute a legally binding agreement between you, whether
                    personally or on behalf of an entity ("you"), and the Operator of Stay On Brand,
                    governing your access to and use of the Services. By accessing or using the
                    Services, you confirm that you have read, understood, and agree to be bound by
                    these Legal Terms.
                  </p>
                  <div
                    class="p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-script text-lg">Important:</span> If you do
                      not agree to all of these Legal Terms, you must not access or use the
                      Services.
                    </p>
                  </div>
                  <p>
                    The Services are intended for users who are at least
                    <strong class="marker-highlight">13 years of age</strong>. If you are under the
                    age of majority in your jurisdiction, you may use the Services only with the
                    consent of a parent or legal guardian who agrees to these Legal Terms on your
                    behalf.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 2: Our Services -->
            <section id="our-services" class="scroll-mt-24 scroll-animate fade-up">
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
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 02</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Our Services
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services are provided for general use only and are not intended for
                    distribution or use in any jurisdiction where such use would violate applicable
                    laws or regulations. If you access the Services from outside India, you do so on
                    your own initiative and are solely responsible for complying with any applicable
                    local laws and regulations.
                  </p>
                  <div
                    class="p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[-0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-script text-lg">Note:</span> The Services are
                      not designed to comply with industry-specific or regulated-sector requirements
                      (including healthcare, financial, or government regulations). You must not use
                      the Services in connection with any activities that are subject to such
                      regulations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 3: Intellectual Property Rights -->
            <section id="intellectual-property" class="scroll-mt-24 scroll-animate fade-up">
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
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9.354a4 4 0 1 0 0 5.292" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 03</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Intellectual Property Rights
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Operator owns or licenses all intellectual property rights in the Services,
                    including all source code, databases, functionality, software, website designs,
                    text, graphics, and other materials made available through the Services
                    (collectively, the "Content"), as well as any associated names, logos, or
                    branding ("Marks").
                  </p>
                  <p>
                    The Content and Marks are protected by applicable intellectual property laws and
                    are provided through the Services on an <strong>"as-is"</strong> basis for
                    personal or internal lawful use only, subject to these Legal Terms.
                  </p>
                  <div
                    class="p-4 rounded-xl bg-brand-teal/10 border-3 border-brand-teal/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">License:</span> Subject to
                      your compliance with these Legal Terms, the Operator grants you a limited,
                      non-exclusive, non-transferable, and revocable licence to access and use the
                      Services and to view or download Content solely for your personal or internal
                      use.
                    </p>
                  </div>
                  <h4 class="font-semibold text-brand-black mt-6 font-display">Submissions</h4>
                  <p>
                    If you voluntarily submit feedback, suggestions, ideas, or other information
                    regarding the Services ("Submissions"), you grant the Operator a non-exclusive,
                    royalty-free, worldwide, perpetual licence to use, reproduce, modify, and
                    incorporate such Submissions for any lawful purpose, without compensation or
                    attribution. You retain ownership of your Submissions.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 4: User Representations -->
            <section id="user-representations" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 04</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      User Representations
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>By using the Services, you <strong>represent</strong> that:</p>
                  <ul class="list-none space-y-3 mt-4">
                    <li class="flex items-start gap-3">
                      <span
                        class="w-8 h-8 rounded-lg bg-brand-teal text-brand-bg flex items-center justify-center font-script text-base flex-shrink-0 mt-0.5 border-2 border-brand-black"
                        >1</span
                      >
                      <span
                        >Any information you submit in connection with the Services is true,
                        accurate, current, and complete, and you will keep such information up to
                        date where applicable.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-8 h-8 rounded-lg bg-brand-teal text-brand-bg flex items-center justify-center font-script text-base flex-shrink-0 mt-0.5 border-2 border-brand-black"
                        >2</span
                      >
                      <span
                        >You have the legal capacity to enter into these Legal Terms and agree to
                        comply with them.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-8 h-8 rounded-lg bg-brand-teal text-brand-bg flex items-center justify-center font-script text-base flex-shrink-0 mt-0.5 border-2 border-brand-black"
                        >3</span
                      >
                      <span
                        >You are at least <strong class="marker-highlight">13 years of age</strong>,
                        and if you are under the age of majority in your jurisdiction, you have
                        obtained the consent of a parent or legal guardian to use the
                        Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-8 h-8 rounded-lg bg-brand-teal text-brand-bg flex items-center justify-center font-script text-base flex-shrink-0 mt-0.5 border-2 border-brand-black"
                        >4</span
                      >
                      <span
                        >You will not access or use the Services through unauthorised automated or
                        non-human means, including bots or scripts, except where expressly
                        permitted.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-8 h-8 rounded-lg bg-brand-teal text-brand-bg flex items-center justify-center font-script text-base flex-shrink-0 mt-0.5 border-2 border-brand-black"
                        >5</span
                      >
                      <span
                        >You will not use the Services for any unlawful, harmful, or unauthorised
                        purpose.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-8 h-8 rounded-lg bg-brand-teal text-brand-bg flex items-center justify-center font-script text-base flex-shrink-0 mt-0.5 border-2 border-brand-black"
                        >6</span
                      >
                      <span
                        >Your use of the Services will comply with applicable laws and
                        regulations.</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 5: User Registration -->
            <section id="user-registration" class="scroll-mt-24 scroll-animate fade-up">
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
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 05</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      User Registration
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    You may be required to register an account to access certain features of the
                    Services. You are responsible for maintaining the confidentiality of your
                    account credentials and for all activities that occur under your account.
                  </p>
                  <p>
                    The Operator is not responsible for any loss or damage arising from unauthorised
                    access to your account.
                  </p>
                  <p>
                    Usernames must not be misleading, offensive, or otherwise inappropriate. The
                    Operator reserves the right, in their sole discretion, to remove, change, or
                    restrict any username that violates these Legal Terms or is otherwise
                    objectionable.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 6: Purchases and Payment -->
            <section id="purchases-payment" class="scroll-mt-24 scroll-animate fade-up">
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
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 06</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Purchases and Payment
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Certain features of the Services may be offered for a fee now or in the future.
                    If you choose to make a purchase, you agree to provide accurate, current, and
                    complete payment and account information and to keep such information up to
                    date.
                  </p>
                  <p>
                    Payments are processed through third-party payment processors. The Operator does
                    not store or process payment card details directly. By submitting payment
                    information, you authorise the applicable payment processor to charge the
                    selected payment method for the amounts due at the prices in effect at the time
                    of purchase, including any applicable taxes required by law.
                  </p>
                  <div
                    class="p-4 rounded-xl bg-brand-bright/30 border-3 border-brand-teal/40 transform rotate-[-0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">Note:</span> Prices,
                      features, and billing models may change from time to time. Any price changes
                      will apply prospectively. All amounts are charged in the currency displayed at
                      checkout.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 7: Subscriptions -->
            <section id="subscriptions" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 07</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Subscriptions
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If you purchase a subscription, it will continue and automatically renew at the
                    end of each billing period unless cancelled before the renewal date. By
                    subscribing, you authorise recurring charges to your selected payment method in
                    accordance with the billing cycle and pricing disclosed at the time of purchase.
                  </p>
                  <p>
                    You may cancel your subscription at any time through your account settings,
                    where available. Cancellation will take effect at the end of the current billing
                    period, and you will retain access to paid features until that time.
                  </p>
                  <div
                    class="p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-script text-lg">Important:</span> Except
                      where required by applicable law,
                      <strong class="marker-highlight marker-highlight-red"
                        >subscription fees are non-refundable</strong
                      >, and no refunds or credits will be provided for partial billing periods,
                      unused time, or unused features.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 8: Lifetime Deals -->
            <section id="lifetime-deals" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 08</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Lifetime Deals
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If offered, a "Lifetime Deal" or "Long-Term Deal" provides access to the
                    Services for the
                    <strong class="marker-highlight marker-highlight-red"
                      >lifetime of the Services, not the lifetime of the user</strong
                    >. The Operator does not guarantee that the Services will be available
                    indefinitely.
                  </p>
                  <p>
                    If the Services are permanently discontinued, access provided under a Lifetime
                    Deal will end. Except where required by applicable law, Lifetime Deal purchases
                    are non-refundable.
                  </p>
                  <div
                    class="p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[-0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-script text-lg">Goodwill:</span> If the
                      Services are permanently discontinued within a limited period following
                      purchase, the Operator may, at their discretion, offer a partial refund or
                      credit as a goodwill gesture. Any such refund or credit is not guaranteed and
                      does not create an ongoing obligation.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 9: Prohibited Activities -->
            <section id="prohibited-activities" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-left tape-decoration tape-red overflow-visible"
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
                    <p class="text-brand-teal text-base font-script mb-1">Section 09</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Prohibited Activities
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    You may not access or use the Services except for their intended purpose and in
                    accordance with these Legal Terms. You agree not to use the Services in any
                    manner that is unlawful, abusive, harmful, or interferes with the proper
                    operation of the Services.
                  </p>
                  <p>In particular, you agree <strong>not to</strong>:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Access, extract, scrape, or collect data or content from the Services in an
                        automated or systematic manner without prior written permission.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Attempt to deceive, defraud, or mislead the Operator or other users.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Circumvent, disable, or interfere with security-related features or
                        technical safeguards of the Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Use the Services to harass, threaten, abuse, or harm another person.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Use the Services in violation of applicable laws or regulations.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Upload or transmit malicious code, spam, or any material that disrupts or
                        interferes with the operation of the Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Impersonate another person or misrepresent your identity.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Copy, modify, distribute, or reverse engineer any part of the Services or
                        underlying software.</span
                      >
                    </li>
                  </ul>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-red/10 border-3 border-brand-red/40 transform rotate-[0.3deg]"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-script text-lg">Warning:</span> Violation of
                      this section may result in suspension or termination of access to the
                      Services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 10: User Generated Content -->
            <section id="user-content" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-right corner-fold overflow-visible"
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
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 10</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      User Generated Content
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services do not generally allow users to publicly post or share content.
                    However, certain features may allow you to submit information, inputs, feedback,
                    or other materials to the Operator or through the Services ("User Content").
                  </p>
                  <p>
                    You are solely responsible for any User Content you submit. By submitting User
                    Content, you represent that you have the necessary rights to do so and that such
                    content does not infringe the rights of any third party, violate applicable
                    laws, or breach these Legal Terms.
                  </p>
                  <p>
                    The Operator does not review, endorse, or assume responsibility for User Content
                    and is under no obligation to monitor, screen, or remove User Content. The
                    Operator reserves the right to remove or restrict access to User Content that
                    violates these Legal Terms or applicable law.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 11: Third-Party Content -->
            <section id="third-party" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 11</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Third-Party Content
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services may include links to third-party websites or content that are not
                    owned or controlled by the Operator ("Third-Party Websites" and "Third-Party
                    Content"). The Operator does not control, endorse, or assume responsibility for
                    any Third-Party Websites or Third-Party Content, including their accuracy,
                    availability, legality, or practices.
                  </p>
                  <p>
                    If you choose to access Third-Party Websites or use Third-Party Content, you do
                    so at your own risk. Any interactions, transactions, or purchases you make with
                    third parties are solely between you and the applicable third party.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 12: Services Management -->
            <section id="services-management" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-right tape-decoration overflow-visible"
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
                      <circle cx="12" cy="12" r="3" />
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 12</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Services Management
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Operator reserves the right, but does not have any obligation, to manage and
                    operate the Services in a manner that protects the integrity, security, and
                    proper functioning of the Services. This may include:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-bright flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Investigating or addressing suspected violations of these Legal Terms</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-bright flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Monitoring user activity for abuse, spam, or unlawful conduct</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-bright flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Refusing, restricting, or limiting access to any part of the Services</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-bright flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Removing or disabling content that violates these Legal Terms or applicable
                        law</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-bright flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span
                        >Reporting activity to law enforcement as required or permitted by law</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 13: Privacy Policy -->
            <section id="privacy-policy" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-left corner-fold overflow-visible"
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 13</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Privacy Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Your use of the Services is also governed by our
                    <RouterLink
                      to="/privacy"
                      class="text-brand-teal hover:text-brand-teal/80 underline decoration-brand-teal/30 underline-offset-4 hover:decoration-brand-teal transition-all duration-300 font-semibold"
                      >Privacy Policy</RouterLink
                    >. By using the Services, you acknowledge that you have read and understood the
                    Privacy Policy.
                  </p>
                  <p>
                    The Services may be hosted on servers located in jurisdictions outside your home
                    country. By using the Services, you consent to the transfer of your information
                    to jurisdictions that may have different data protection laws than your own.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 14: Term & Termination -->
            <section id="termination" class="scroll-mt-24 scroll-animate fade-up">
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
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 14</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Term & Termination
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    These Legal Terms remain in effect while you use the Services. You may
                    discontinue use of the Services at any time by ceasing all access and, if
                    applicable, deleting your account.
                  </p>
                  <p>
                    The Operator reserves the right to suspend or terminate your access to the
                    Services at any time, with or without notice, for any reason, including but not
                    limited to:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Breach of these Legal Terms or applicable law</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Conduct that is harmful, fraudulent, or inappropriate</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Non-payment of any applicable fees</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Discontinuation or modification of the Services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 15: Modifications -->
            <section id="modifications" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-left tape-decoration tape-mint overflow-visible"
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
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 15</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Modifications
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Operator may update, modify, or discontinue any part of the Services or
                    these Legal Terms at any time, at their sole discretion.
                  </p>
                  <p>
                    We will make reasonable efforts to notify users of material changes. Your
                    continued use of the Services following any changes constitutes acceptance of
                    those changes. If you do not agree to the updated terms, you must stop using the
                    Services.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 16: Governing Law -->
            <section id="governing-law" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-right corner-fold overflow-visible"
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
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 16</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Governing Law
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    These Legal Terms and any disputes arising from or related to them or the
                    Services shall be governed by and construed in accordance with the laws of
                    <strong>India</strong>, without regard to conflict of law principles.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 17: Dispute Resolution -->
            <section id="dispute-resolution" class="scroll-mt-24 scroll-animate fade-up">
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
                    <p class="text-brand-red text-base font-script mb-1">Section 17</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Dispute Resolution
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If you have a dispute regarding the Services, you agree to first attempt to
                    resolve it informally by contacting the Operator at
                    <a
                      href="mailto:legal@stayonbrand.in"
                      class="text-brand-red hover:underline font-semibold"
                      >legal@stayonbrand.in</a
                    >. The parties will make reasonable efforts to resolve any dispute through
                    good-faith negotiation.
                  </p>
                  <p>
                    If the dispute is not resolved within 30 days, either party may pursue formal
                    legal remedies. Any legal action shall be brought exclusively in the courts of
                    India, and you consent to the personal jurisdiction of such courts.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 18: Disclaimer -->
            <section id="disclaimer" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-right tape-decoration overflow-visible"
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
                      <path
                        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 18</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Disclaimer
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    THE SERVICES ARE PROVIDED ON AN
                    <strong class="marker-highlight">"AS IS"</strong> AND
                    <strong class="marker-highlight">"AS AVAILABLE"</strong>
                    BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, THE OPERATOR EXPRESSLY DISCLAIMS
                    ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING
                    WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                    NON-INFRINGEMENT.
                  </p>
                  <p>
                    The Operator does not warrant that the Services will be uninterrupted, secure,
                    error-free, accurate, or free from harmful components. Use of the Services is at
                    your own risk.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 19: Limitation of Liability -->
            <section id="limitation-liability" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-8 transform rotate-slight-left corner-fold overflow-visible"
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
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-base font-script mb-1">Section 19</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Limitation of Liability
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR SHALL NOT BE LIABLE FOR ANY
                    INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF
                    OR IN CONNECTION WITH THESE LEGAL TERMS OR YOUR USE OF THE SERVICES.
                  </p>
                  <p>
                    THE OPERATOR'S TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF (A) THE
                    AMOUNT YOU PAID TO THE OPERATOR IN THE 12 MONTHS PRIOR TO THE CLAIM, OR (B) ONE
                    HUNDRED US DOLLARS (US$100).
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 20: Indemnification -->
            <section id="indemnification" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 20</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Indemnification
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    You agree to defend, indemnify, and hold harmless the Operator from and against
                    any claims, liabilities, damages, losses, and expenses arising from or related
                    to:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Your use of or access to the Services</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Your violation of these Legal Terms</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Your infringement of any third-party rights</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span
                        class="w-3 h-3 rounded-full bg-brand-red flex-shrink-0 mt-1.5 border border-brand-black"
                      ></span>
                      <span>Any User Content you submit</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 21: Contact Us -->
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
                    <p class="text-brand-red text-base font-script mb-1">Section 21</p>
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
                  <p>If you have any questions about these Legal Terms, please contact us at:</p>
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
                    We aim to respond within 2-3 business days. This contact method is intended for
                    legal inquiries only.
                  </p>
                </div>
              </div>
            </section>

            <!-- Final CTA Section -->
            <div class="pt-6 scroll-animate fade-up">
              <div
                class="card-hybrid p-8 md:p-10 transform rotate-[0.3deg] relative overflow-visible"
                style="background: #1a1a1a; box-shadow: 4px 4px 0px 0px #2f7a72"
              >
                <!-- Corner fold -->
                <div
                  class="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-brand-bg border-l-[24px] border-l-transparent"
                ></div>

                <p class="text-brand-bright font-script text-2xl md:text-3xl mb-2">
                  Ready to get started?
                </p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By continuing to use our services, you agree to these terms.
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <RouterLink
                    :to="homeLink"
                    class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright wiggle-hover w-full sm:w-auto justify-center inline-flex items-center"
                  >
                    <span class="z-10 relative">BACK TO HOME</span>
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    class="group relative bg-brand-bright text-brand-black px-5 py-2 rounded-[4px] border-3 border-brand-black font-semibold text-xs tracking-wide shadow-[4px_4px_0px_0px_#C92216] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] hover-beam overflow-hidden neo-button w-full sm:w-auto justify-center inline-flex items-center gap-2"
                  >
                    <span class="relative z-10">ACCEPT & GET STARTED</span>
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
            <RouterLink
              to="/terms"
              class="text-brand-teal font-semibold hover:text-brand-teal/80 transition-colors"
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
