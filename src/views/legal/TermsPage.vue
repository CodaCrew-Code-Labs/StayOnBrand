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
    { id: 'conditions', title: 'Terms and Conditions', number: '01' },
    { id: 'privacy', title: 'Privacy Policy', number: '02' },
    { id: 'cookie', title: 'Cookie Policy', number: '03' },
    { id: 'aup', title: 'Acceptable Use Policy', number: '04' },
    { id: 'refund', title: 'Refund Policy', number: '05' },
    { id: 'ltd', title: 'Lifetime Deal Disclosure', number: '06' }
  ]

  // Active section tracking
  const activeSection = ref('conditions')

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
          <span class="font-script text-lg text-brand-black">Legal</span>
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
            #LegalStuff
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
              Terms of
            </h1>
          </div>
          <div class="relative scroll-animate fade-up delay-200">
            <h1
              class="md:text-7xl lg:text-8xl uppercase text-brand-red leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Service
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
          Please read these terms carefully before using our services. By using Stay on Brand, you
          agree to these terms.
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
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="relative z-10 flex-grow pb-20 px-6 md:px-12">
      <div class="max-w-screen-2xl mx-auto">
        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <!-- Left Sidebar: Navigation -->
          <aside class="lg:col-span-4 scroll-animate fade-left">
            <div class="lg:sticky lg:top-24 space-y-4">
              <!-- Navigation Card -->
              <div class="card-hybrid paper-bg p-5 rotate-slight-left overflow-hidden">
                <p class="font-script text-lg text-brand-teal mb-4">Quick Navigation</p>

                <div class="space-y-2">
                  <button
                    v-for="section in sections"
                    :key="section.id"
                    :class="[
                      'w-full group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border-2 text-left',
                      activeSection === section.id
                        ? 'bg-brand-bright border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]'
                        : 'bg-brand-bg/50 border-brand-black/30 hover:border-brand-black hover:bg-brand-bright/20 hover:shadow-[2px_2px_0px_0px_#1A1A1A]'
                    ]"
                    @click="scrollToSection(section.id)"
                  >
                    <!-- Number Badge -->
                    <div
                      :class="[
                        'w-8 h-8 rounded-lg flex items-center justify-center font-script text-base transition-all duration-300 border-2 border-brand-black',
                        activeSection === section.id
                          ? 'bg-brand-black text-brand-bright'
                          : 'bg-brand-bg text-brand-black group-hover:bg-brand-teal group-hover:text-brand-bg'
                      ]"
                    >
                      {{ section.number }}
                    </div>

                    <!-- Title -->
                    <span
                      :class="[
                        'flex-1 font-medium text-sm transition-all duration-300',
                        activeSection === section.id
                          ? 'text-brand-black font-bold'
                          : 'text-brand-black/80'
                      ]"
                    >
                      {{ section.title }}
                    </span>

                    <!-- Arrow Icon -->
                    <svg
                      :class="[
                        'w-4 h-4 transition-all duration-300',
                        activeSection === section.id
                          ? 'text-brand-black translate-x-0'
                          : 'text-brand-black/40 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
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

              <!-- Questions Card -->
              <div
                class="bg-brand-black border-3 border-brand-black rounded-xl p-6 hidden lg:block rotate-slight-right shadow-[4px_4px_0px_0px_#2F7A72]"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-10 h-10 bg-brand-bright rounded-xl flex items-center justify-center border-2 border-brand-bright"
                  >
                    <svg
                      class="w-5 h-5 text-brand-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-bright font-display font-bold">Questions?</p>
                    <p class="font-script text-brand-bg/60 text-sm">We're here to help</p>
                  </div>
                </div>
                <p class="text-sm text-brand-bg/80 mb-4">
                  Need help understanding our terms? Our support team is ready to assist.
                </p>
                <RouterLink
                  to="/help"
                  class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-bright text-brand-black text-sm font-bold rounded border-2 border-brand-bright shadow-[3px_3px_0px_0px_#2F7A72] hover:bg-brand-bg hover:border-brand-bg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#2F7A72] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#2F7A72] transition-all w-full"
                >
                  Contact Support
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </RouterLink>
              </div>
            </div>
          </aside>

          <!-- Right Column: Content -->
          <div class="lg:col-span-8 space-y-12 md:space-y-16">
            <!-- Section 1: Conditions of Use -->
            <section id="conditions" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-10 rotate-slight-left tape-decoration overflow-hidden"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
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
                      Terms and Conditions
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    These
                    <RouterLink
                      to="/terms-and-conditions"
                      class="text-brand-teal hover:text-brand-teal/80 underline decoration-brand-teal/30 underline-offset-4 hover:decoration-brand-teal transition-all duration-300 font-semibold"
                    >
                      Terms and Conditions
                    </RouterLink>
                    govern your access to and use of our services. By accessing, using, or
                    interacting with this platform, you acknowledge that you have read, understood,
                    and agree to be bound by these Terms and our Privacy Policy.
                  </p>
                  <p>
                    If you do not agree with any part of these Terms, you must discontinue use of
                    the service immediately.
                  </p>
                  <div
                    class="mt-6 p-4 rounded-xl bg-brand-bright/20 border-2 border-dashed border-brand-teal/50"
                  >
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-script text-lg">Note:</span> Your continued
                      use of our services constitutes acceptance of these terms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 2: Privacy Policy -->
            <section id="privacy" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid card-hybrid-red paper-bg p-6 md:p-10 rotate-slight-right overflow-hidden"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="m7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 02</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Privacy Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Before continuing to use our Services, please review our
                    <RouterLink
                      to="/privacy"
                      class="text-brand-red hover:text-brand-red/80 underline decoration-brand-red/30 underline-offset-4 hover:decoration-brand-red transition-all duration-300 font-semibold"
                    >
                      privacy policy
                    </RouterLink>
                    to understand how we collect, use, and protect your information.
                  </p>
                  <p>
                    We are committed to handling personal data responsibly and transparently, in
                    accordance with applicable privacy laws such as GDPR and CCPA.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 3: Cookie -->
            <section id="cookie" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-10 rotate-slight-left corner-fold overflow-hidden"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-bright flex items-center justify-center shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
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
                      Cookie Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Cookies and similar technologies are used on this website to ensure proper
                    functionality, improve performance, and support security. Some cookies are
                    essential for the operation of the Services, while others help us understand how
                    the Services are used so we can improve them. As per the
                    <RouterLink
                      to="/cookie-policy"
                      class="text-brand-teal hover:text-brand-teal/80 underline decoration-brand-teal/30 underline-offset-4 hover:decoration-brand-teal transition-all duration-300 font-semibold"
                    >
                      cookie policy
                    </RouterLink>
                    it do not give us access to your device or personal information beyond what you
                    choose to share.
                  </p>
                  <p>
                    We use cookies responsibly and transparently, in accordance with applicable
                    privacy laws such as GDPR and CCPA. You can manage or disable non-essential
                    cookies through your browser settings or available cookie preference tools.
                  </p>
                  <ul class="list-none space-y-3 mt-6">
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >1</span
                      >
                      <span
                        >Essential cookies are required for core functionality and security and
                        cannot be disabled</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >2</span
                      >
                      <span
                        >Optional analytics cookies are used only to improve performance and user
                        experience</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-bright text-brand-black flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >3</span
                      >
                      <span
                        >Third-party cookies, if used, are governed by the privacy policies of their
                        respective providers</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 4: AUP -->
            <section id="aup" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-10 rotate-slight-right tape-decoration tape-mint overflow-hidden"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-teal flex items-center justify-center shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
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
                    <p class="text-brand-teal text-base font-script mb-1">Section 04</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Acceptable Use Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    <RouterLink
                      to="/aup"
                      class="text-brand-teal hover:text-brand-teal/80 underline decoration-dashed underline-offset-4 hover:decoration-solid transition-all duration-300 font-semibold"
                    >
                      Use of our Services
                    </RouterLink>
                    is subject to reasonable and lawful conduct. By accessing or using the Services,
                    you agree to use them responsibly, in compliance with applicable laws, and in
                    accordance with our Acceptable Use Policy. You are responsible for all activity
                    carried out through your access to the Services.
                  </p>
                  <p>
                    We reserve the right to monitor, restrict, suspend, or terminate access to the
                    Services if we believe, in our sole discretion, that the Services are being
                    misused, abused, or used in violation of our policies. Actions we take to
                    protect the Services, users, or the operator may be carried out without prior
                    notice where permitted by law.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 5: Refund -->
            <section id="refund" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid card-hybrid-red paper-bg p-6 md:p-10 rotate-slight-left overflow-hidden"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-red flex items-center justify-center shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  >
                    <svg
                      class="w-7 h-7 text-brand-bg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-base font-script mb-1">Section 05</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-red inline-block"
                    >
                      Refund Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    All purchases made through our Services are subject to our
                    <RouterLink
                      to="/refund-policy"
                      class="text-brand-red hover:text-brand-red/80 underline decoration-dashed underline-offset-4 hover:decoration-solid transition-all duration-300 font-semibold"
                    >
                      Refund Policy
                    </RouterLink>
                    . Refunds are not guaranteed and are handled in accordance with the terms
                    outlined in that policy. By purchasing a paid plan, subscription, or one-time
                    product, you acknowledge that access to a digital service may begin immediately
                    and that refunds may be limited or unavailable except where required by
                    applicable law.
                  </p>
                  <p>
                    We encourage users to contact us first if they experience billing issues,
                    duplicate charges, or technical problems affecting access. Many concerns can be
                    reviewed and resolved through direct communication before any further action is
                    taken.
                  </p>
                  <div class="mt-6 p-4 rounded-xl bg-brand-black/90 border-2 border-brand-black">
                    <p class="text-sm text-brand-bg">
                      <span class="text-brand-bright font-script text-lg">Contact Support:</span>
                      For refund-related questions or billing concerns, reach out to us at
                      <a
                        href="mailto:legal@stayonbrand.com"
                        class="text-brand-bright hover:underline decoration-dashed"
                        >legal@stayonbrand.in</a
                      >
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 6: LTD -->
            <section id="ltd" class="scroll-mt-24 scroll-animate fade-up">
              <div
                class="card-hybrid paper-bg p-6 md:p-10 rotate-slight-right corner-fold overflow-hidden"
              >
                <div class="flex items-start gap-4 mb-6">
                  <div
                    class="w-14 h-14 rounded-2xl bg-brand-bright flex items-center justify-center shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
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
                    <p class="text-brand-teal text-base font-script mb-1">Section 06</p>
                    <h2
                      class="text-2xl md:text-3xl font-display font-bold text-brand-black hand-underline hand-underline-teal inline-block"
                    >
                      Lifetime Deal Disclosure
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    <RouterLink
                      to="/ltd-disclosure"
                      class="text-brand-teal hover:text-brand-teal/80 underline decoration-dashed underline-offset-4 hover:decoration-solid transition-all duration-300 font-semibold"
                    >
                      Lifetime deals
                    </RouterLink>
                    provide one-time access to the Services for as long as the Services remain
                    available. "Lifetime" refers to the lifetime of the Services, not the lifetime
                    of any individual user, device, company, or legal entity. Access is provided
                    subject to technical, financial, and operational considerations.
                  </p>
                  <p>
                    Lifetime deals are offered transparently and responsibly. Usage is subject to
                    fair-use principles, service limitations, and applicable policies. Features,
                    functionality, or availability may change over time as the Services evolve.
                  </p>
                  <ul class="list-none space-y-3 mt-6">
                    <li class="flex items-start gap-3">
                      <span
                        class="w-7 h-7 rounded-lg bg-brand-teal text-brand-bg flex items-center justify-center font-script text-base shrink-0 mt-0.5 border-2 border-brand-black"
                        >1</span
                      >
                      <span
                        >Lifetime access applies only to the Services and features included at the
                        time of purchase</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-7 h-7 rounded-lg bg-brand-red text-brand-bg flex items-center justify-center font-script text-base shrink-0 mt-0.5 border-2 border-brand-black"
                        >2</span
                      >
                      <span
                        >Usage limits, technical constraints, and fair-use restrictions may
                        apply</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-7 h-7 rounded-lg bg-brand-bright text-brand-black flex items-center justify-center font-script text-base shrink-0 mt-0.5 border-2 border-brand-black"
                        >3</span
                      >
                      <span
                        >Service availability may depend on infrastructure or third-party services
                        and may change or be discontinued</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Action Buttons -->
            <div class="pt-8 scroll-animate fade-up">
              <div
                class="bg-brand-black border-3 border-brand-black rounded-xl p-8 md:p-12 rotate-slight-right shadow-[4px_4px_0px_0px_#2F7A72]"
              >
                <p class="text-brand-bright font-script text-2xl mb-2">Ready to get started?</p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By continuing to use our services, you agree to these terms.
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <RouterLink
                    :to="homeLink"
                    class="inline-flex items-center justify-content gap-2 px-5 py-3 bg-transparent text-brand-bg font-bold rounded border-3 border-brand-bg shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:bg-brand-bg hover:text-brand-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] transition-all"
                  >
                    Back to Home
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-bright text-brand-black font-bold rounded border-3 border-brand-bright shadow-[4px_4px_0px_0px_#2F7A72] hover:bg-brand-bg hover:border-brand-bg hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#2F7A72] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#2F7A72] transition-all"
                  >
                    Accept & Get Started
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
