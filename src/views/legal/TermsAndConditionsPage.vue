<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { RouterLink } from 'vue-router'

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
            to="/"
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
          to="/"
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
          <RouterLink
            to="/signup"
            class="group relative bg-brand-bright text-brand-black px-5 py-2 rounded-full border border-brand-black font-semibold text-xs tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden"
          >
            <span class="relative z-10">GET STARTED</span>
          </RouterLink>
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
            #LegalAgreement
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Subtitle -->
        <p
          class="mt-8 text-brand-gray max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed scroll-animate fade-up delay-300"
        >
          These Legal Terms constitute a legally binding agreement between you and the Operator of
          Stay On Brand, governing your access to and use of the Services. Please read them
          carefully.
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
            href="/StayOnBrand_Terms_and_Conditions.pdf"
            download="StayOnBrand_Terms_and_Conditions.pdf"
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-brand-black">Binding Agreement</p>
            <p class="text-xs text-brand-gray mt-1">
              By using our services, you agree to these terms
            </p>
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
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-brand-black">Age Requirement</p>
            <p class="text-xs text-brand-gray mt-1">Users must be at least 13 years of age</p>
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-brand-black">Keep a Copy</p>
            <p class="text-xs text-brand-gray mt-1">We recommend retaining these terms</p>
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
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-brand-bg font-bold text-lg">Terms & Conditions</p>
                        <p class="text-brand-bg/50 text-xs">Legal Agreement</p>
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
                      <p class="text-brand-bright text-2xl font-bold font-mono">21</p>
                      <p class="text-brand-bg/60 text-xs">Sections</p>
                    </div>
                    <div
                      class="bg-brand-bg/10 backdrop-blur rounded-xl p-3 border border-brand-bg/10"
                    >
                      <p class="text-brand-bright text-2xl font-bold font-mono">16</p>
                      <p class="text-brand-bg/60 text-xs">Pages</p>
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
                    to="/aup"
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
                        Acceptable Use Policy
                      </p>
                      <p class="text-xs text-brand-gray">Usage guidelines</p>
                    </div>
                  </RouterLink>
                  <RouterLink
                    to="/refund-policy"
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
                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                        <path d="M12 3v6" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-brand-black truncate">Refund Policy</p>
                      <p class="text-xs text-brand-gray">Returns & refunds</p>
                    </div>
                  </RouterLink>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right Column: Content -->
          <div class="col-span-1 lg:col-span-8 space-y-12 md:space-y-16">
            <!-- Section 1: Agreement to Legal Terms -->
            <section id="agreement" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 01</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                  <div class="p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Important:</span> If you do not
                      agree to all of these Legal Terms, you must not access or use the Services.
                    </p>
                  </div>
                  <p>
                    The Services are intended for users who are at least
                    <strong>13 years of age</strong>. If you are under the age of majority in your
                    jurisdiction, you may use the Services only with the consent of a parent or
                    legal guardian who agrees to these Legal Terms on your behalf.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 2: Our Services -->
            <section id="our-services" class="scroll-mt-24 scroll-animate fade-up">
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
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 02</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                  <div class="p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Note:</span> The Services are not
                      designed to comply with industry-specific or regulated-sector requirements
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
                      <path d="M15 9.354a4 4 0 1 0 0 5.292" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 03</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                  <div class="p-4 rounded-xl bg-brand-teal/10 border border-brand-teal/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-semibold">License:</span> Subject to your
                      compliance with these Legal Terms, the Operator grants you a limited,
                      non-exclusive, non-transferable, and revocable licence to access and use the
                      Services and to view or download Content solely for your personal or internal
                      use.
                    </p>
                  </div>
                  <h4 class="font-semibold text-brand-black mt-6">Submissions</h4>
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
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 04</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                        class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
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
                        class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >2</span
                      >
                      <span
                        >You have the legal capacity to enter into these Legal Terms and agree to
                        comply with them.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >3</span
                      >
                      <span
                        >You are at least <strong>13 years of age</strong>, and if you are under the
                        age of majority in your jurisdiction, you have obtained the consent of a
                        parent or legal guardian to use the Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
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
                        class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >5</span
                      >
                      <span
                        >You will not use the Services for any unlawful, harmful, or unauthorised
                        purpose.</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 05</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 06</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                  <div class="p-4 rounded-xl bg-brand-bright/30 border border-brand-teal/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-semibold">Note:</span> Prices, features, and
                      billing models may change from time to time. Any price changes will apply
                      prospectively. All amounts are charged in the currency displayed at checkout.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 7: Subscriptions -->
            <section id="subscriptions" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 07</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                  <div class="p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Important:</span> Except where
                      required by applicable law,
                      <strong>subscription fees are non-refundable</strong>, and no refunds or
                      credits will be provided for partial billing periods, unused time, or unused
                      features.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 8: Lifetime Deals -->
            <section id="lifetime-deals" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 08</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Lifetime Deals and Service Discontinuation
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If offered, a "Lifetime Deal" or "Long-Term Deal" provides access to the
                    Services for the
                    <strong>lifetime of the Services, not the lifetime of the user</strong>. The
                    Operator does not guarantee that the Services will be available indefinitely.
                  </p>
                  <p>
                    If the Services are permanently discontinued, access provided under a Lifetime
                    Deal will end. Except where required by applicable law, Lifetime Deal purchases
                    are non-refundable.
                  </p>
                  <div class="p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Goodwill:</span> If the Services
                      are permanently discontinued within a limited period following purchase, the
                      Operator may, at their discretion, offer a partial refund or credit as a
                      goodwill gesture. Any such refund or credit is not guaranteed and does not
                      create an ongoing obligation.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 9: Prohibited Activities -->
            <section id="prohibited-activities" class="scroll-mt-24 scroll-animate fade-up">
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
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 09</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                  <p>In particular, you agree not to:</p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Access, extract, scrape, or collect data or content from the Services in an
                        automated or systematic manner without prior written permission.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Attempt to deceive, defraud, or mislead the Operator or other users.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Circumvent, disable, or interfere with security-related features or
                        technical safeguards of the Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Use the Services to harass, threaten, abuse, or harm another person.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Use the Services in violation of applicable laws or regulations.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Upload or transmit malicious code, spam, or any material that disrupts or
                        interferes with the operation of the Services.</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span>Impersonate another person or misrepresent your identity.</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span
                        >Copy, modify, distribute, or reverse engineer any part of the Services or
                        underlying software.</span
                      >
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Warning:</span> Violation of this
                      section may result in suspension or termination of access to the Services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 10: User Generated Content -->
            <section id="user-content" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 10</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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

            <!-- Section 11: Third-Party Websites and Content -->
            <section id="third-party" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 11</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Third-Party Websites and Content
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
                      <circle cx="12" cy="12" r="3" />
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 12</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
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
                      <span class="w-2 h-2 rounded-full bg-brand-bright flex-shrink-0 mt-2"></span>
                      <span
                        >Investigating or addressing suspected violations of these Legal Terms</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-bright flex-shrink-0 mt-2"></span>
                      <span
                        >Restricting, suspending, or terminating access to the Services where
                        necessary</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-bright flex-shrink-0 mt-2"></span>
                      <span
                        >Removing or limiting access to content or data that is unlawful, harmful,
                        or burdensome to the Services</span
                      >
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-bright flex-shrink-0 mt-2"></span>
                      <span
                        >Taking reasonable steps to protect the Operator's rights, users, and
                        systems</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 13: Privacy Policy -->
            <section id="privacy-policy" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 13</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Privacy Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Operator values your privacy. Please review the
                    <RouterLink to="/privacy" class="text-brand-teal hover:underline font-semibold"
                      >Privacy Policy</RouterLink
                    >, which explains how information is collected, used, and handled in connection
                    with the Services. By using the Services, you acknowledge and agree that your
                    use is subject to the Privacy Policy.
                  </p>
                  <p>
                    The Services are hosted in <strong>India</strong>. If you access the Services
                    from outside India, you acknowledge and agree that your information may be
                    transferred to, stored in, and processed in India.
                  </p>
                  <p>
                    The Services are not intended for children under the age of
                    <strong>13</strong>, and the Operator does not knowingly collect personal
                    information from children.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 14: Term and Termination -->
            <section id="termination" class="scroll-mt-24 scroll-animate fade-up">
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
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 14</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Term and Termination
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    These Legal Terms remain in effect while you access or use the Services. The
                    Operator may suspend or terminate your access to the Services, in whole or in
                    part, at any time, if the Operator reasonably believes that you have violated
                    these Legal Terms, applicable law, or are using the Services in a manner that
                    may cause harm.
                  </p>
                  <p>
                    Upon termination or suspension, your right to access or use the Services will
                    immediately cease. If your account is terminated, you may not create a new
                    account or attempt to access the Services under another name or through another
                    person without the Operator's permission.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 15: Modifications and Interruptions -->
            <section id="modifications" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 15</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Modifications and Interruptions
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Operator reserves the right to modify, update, suspend, or discontinue the
                    Services, or any part of them, at any time and for any reason. The Operator is
                    not obligated to update or maintain any information or functionality within the
                    Services.
                  </p>
                  <p>
                    The Services are provided on an <strong>"as-available"</strong> basis, and
                    uninterrupted or error-free operation is not guaranteed. The Services may be
                    unavailable from time to time due to maintenance, technical issues, or factors
                    beyond the Operator's control.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 16: Governing Law -->
            <section id="governing-law" class="scroll-mt-24 scroll-animate fade-up">
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 16</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Governing Law
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    These Legal Terms shall be governed by and construed in accordance with the laws
                    of <strong>India</strong>, without regard to conflict of law principles.
                  </p>
                  <p>
                    Subject to the dispute resolution provisions set out below, the courts located
                    in India shall have jurisdiction over any matters arising out of or relating to
                    these Legal Terms.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 17: Dispute Resolution -->
            <section id="dispute-resolution" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 17</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Dispute Resolution
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <h4 class="font-semibold text-brand-black">Informal Resolution</h4>
                  <p>
                    Before initiating any formal dispute resolution, the parties agree to first
                    attempt to resolve any dispute through good-faith informal negotiations. Either
                    party may initiate this process by providing written notice to the other, and
                    the parties shall have <strong>30 days</strong> to attempt resolution.
                  </p>
                  <h4 class="font-semibold text-brand-black mt-6">Arbitration</h4>
                  <p>
                    If the dispute is not resolved through informal negotiations, it shall be
                    finally resolved by <strong>binding arbitration</strong> in accordance with the
                    Arbitration and Conciliation Act, 1996 (India).
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span><strong>Arbitrator:</strong> One (1) arbitrator</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span><strong>Seat of arbitration:</strong> Chennai, India</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span><strong>Language:</strong> English</span>
                    </li>
                    <li class="flex items-start gap-3 text-sm">
                      <span class="w-2 h-2 rounded-full bg-brand-red flex-shrink-0 mt-2"></span>
                      <span><strong>Governing law:</strong> Laws of India</span>
                    </li>
                  </ul>
                  <div class="mt-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-red font-semibold">Note:</span> The arbitration shall
                      be conducted on an <strong>individual basis only</strong>. Class actions,
                      class arbitrations, collective actions, and representative proceedings are not
                      permitted to the fullest extent allowed by law.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 18: Disclaimer -->
            <section id="disclaimer" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path
                        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                      />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 18</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Disclaimer
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The Services are provided on an
                    <strong>"as-is" and "as-available"</strong> basis. Your use of the Services is
                    at your own risk.
                  </p>
                  <p>
                    To the maximum extent permitted by law, the Operator disclaims all warranties of
                    any kind, whether express or implied, including implied warranties of
                    merchantability, fitness for a particular purpose, and non-infringement. The
                    Operator does not guarantee that the Services will be accurate, complete,
                    reliable, uninterrupted, secure, or error-free.
                  </p>
                  <p>
                    The Operator makes no representations regarding the accuracy or reliability of
                    any content made available through the Services or any third-party services
                    linked to or integrated with the Services.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 19: Limitation of Liability -->
            <section id="limitation-liability" class="scroll-mt-24 scroll-animate fade-up">
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
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 19</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Limitation of Liability
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    To the maximum extent permitted by applicable law, the Operator shall not be
                    liable for any indirect, incidental, consequential, special, exemplary, or
                    punitive damages, including loss of profits, revenue, data, or business
                    opportunities, arising out of or related to your use of the Services.
                  </p>
                  <p>
                    To the extent liability cannot be excluded, the Operator's total liability to
                    you for any claim arising out of or relating to the Services or these Legal
                    Terms shall not exceed:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span
                        ><strong>For free users:</strong> a nominal amount of
                        <strong>&#x20B9;1,000 INR</strong> (or equivalent)</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span class="w-2 h-2 rounded-full bg-brand-teal flex-shrink-0 mt-2"></span>
                      <span
                        ><strong>For paid users:</strong> the total amount actually paid by you to
                        the Operator for the Services in the
                        <strong>three (3) months</strong> immediately preceding the event giving
                        rise to the claim.</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 20: Indemnification -->
            <section id="indemnification" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path d="m14.5 9-5 5" />
                      <path d="m9.5 9 5 5" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 20</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Indemnification
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    You agree to indemnify and hold the Operator harmless from and against any
                    third-party claims, damages, losses, liabilities, and reasonable expenses
                    (including reasonable legal fees) arising out of or related to:
                  </p>
                  <ul class="list-none space-y-2 mt-4">
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >1</span
                      >
                      <span>Your misuse of the Services</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >2</span
                      >
                      <span>Your violation of these Legal Terms or applicable law</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >3</span
                      >
                      <span
                        >Your infringement of any third-party intellectual property or other
                        rights</span
                      >
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >4</span
                      >
                      <span>Any content or data you submit through the Services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 21: Contact Us -->
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
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 21</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Contact Us
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    If you have questions about these Legal Terms or the Services, you may contact
                    the Operator at:
                  </p>
                  <div class="mt-6 space-y-4">
                    <div
                      class="flex items-center gap-4 p-4 rounded-xl bg-brand-bg border border-brand-black/20"
                    >
                      <div
                        class="w-10 h-10 rounded-full bg-brand-bright flex items-center justify-center flex-shrink-0"
                      >
                        <svg
                          class="w-5 h-5 text-brand-black"
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
                  <div class="mt-6 p-4 rounded-xl bg-brand-bright/30 border border-brand-teal/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-semibold">Effective Date:</span> January 08,
                      2026
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Action Buttons -->
            <div class="pt-8 scroll-animate fade-up">
              <div
                class="bg-brand-black text-brand-bg rounded-3xl p-8 md:p-12 border border-brand-black shadow-[6px_6px_0px_0px_#C92216]"
              >
                <p class="text-brand-bright font-script text-2xl mb-2">Know your rights</p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By using Stay On Brand, you acknowledge that you have read and understood these
                  Terms and Conditions.
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <RouterLink
                    to="/privacy"
                    class="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-brand-bg text-brand-bg font-semibold hover:bg-brand-bg hover:text-brand-black transition-all duration-300 text-center"
                  >
                    View Privacy Policy
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
              to="/terms-and-conditions"
              class="text-brand-red hover:text-brand-red/80 transition-colors duration-300 font-semibold"
              >Terms</RouterLink
            >
            <RouterLink
              to="/cookie-policy"
              class="text-brand-black/60 hover:text-brand-black transition-colors duration-300 font-medium"
              >Cookies</RouterLink
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
