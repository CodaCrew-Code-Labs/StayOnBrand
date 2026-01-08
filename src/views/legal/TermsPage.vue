<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { RouterLink } from 'vue-router'

  // Scroll progress tracking
  const scrollProgress = ref(0)

  // Navigation sections
  const sections = [
    { id: 'conditions', title: 'Conditions of Use', number: '01' },
    { id: 'privacy', title: 'Privacy Policy', number: '02' },
    { id: 'copyright', title: 'Copyright', number: '03' },
    { id: 'communications', title: 'Communications', number: '04' },
    { id: 'disputes', title: 'Disputes', number: '05' }
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
    <div class="absolute inset-0 pointer-events-none opacity-[0.15] bg-grid z-0"></div>
    <!-- Dotted Line Grid with Beam -->
    <div class="absolute inset-0 pointer-events-none bg-grid-lines z-0">
      <div
        class="absolute inset-0 bg-linear-to-b from-transparent via-brand-teal/5 to-transparent h-[50vh] animate-scan-vertical blur-md"
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
        stroke="#2F7A72"
        stroke-width="1.5"
        class="opacity-30 noodle-path"
      />
      <path
        d="M 90% 100 Q 85% 300 95% 500"
        fill="none"
        stroke="#C92216"
        stroke-width="1.5"
        class="opacity-30 noodle-path"
        style="animation-delay: 0.5s"
      />
      <circle r="4" fill="#2F7A72">
        <animateMotion dur="10s" repeatCount="indefinite" path="M 100 200 Q 50 400 150 600" />
      </circle>
    </svg>

    <!-- Scroll Progress Indicator -->
    <div class="fixed top-0 left-0 w-full h-1 bg-brand-bg/50 z-[60]">
      <div
        class="h-full bg-brand-teal transition-all duration-300 ease-out"
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
            <span class="z-10 relative">WHATS WCAG ???</span>
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
            class="md:text-3xl text-brand-teal block transform hover:rotate-0 transition-transform cursor-default text-2xl font-medium font-script rotate-[-3deg] wiggle-hover"
          >
            #LegalStuff
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
            class="absolute -right-6 -top-3 text-brand-red opacity-80 animate-pulse"
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
              class="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-brand-bg text-brand-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-medium text-xs border border-brand-black animate-float shadow-[2px_2px_0px_0px_#C92216] pulse-glow"
            >
              01
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
            <svg
              class="absolute -bottom-1 left-0 w-full h-3 md:h-5 text-brand-bright opacity-90"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
            <div
              class="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 bg-brand-bright text-brand-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-medium text-xs border border-brand-black shadow-[2px_2px_0px_0px_#2F7A72] animate-float-delayed pulse-glow"
            >
              02
            </div>
          </div>
        </div>

        <!-- Subtitle -->
        <p
          class="mt-8 text-brand-gray max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed scroll-animate fade-up delay-300"
        >
          Please read these terms carefully before using our services. By using Stay on Brand, you
          agree to these terms.
        </p>

        <!-- Last Updated Badge -->
        <div
          class="mt-6 inline-flex items-center gap-2 bg-brand-black text-brand-bg px-4 py-2 rounded-full text-xs font-semibold scroll-animate fade-up delay-400"
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
          Last Updated: January 1, 2026
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
            <div class="lg:sticky lg:top-24 space-y-3">
              <p class="text-xs font-semibold text-brand-teal uppercase tracking-wider mb-4 px-2">
                Quick Navigation
              </p>

              <button
                v-for="section in sections"
                :key="section.id"
                :class="[
                  'w-full group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border border-brand-black text-left',
                  activeSection === section.id
                    ? 'bg-brand-bright shadow-[4px_4px_0px_0px_#1A1A1A] translate-x-0 translate-y-0'
                    : 'bg-brand-bg shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#1A1A1A] hover:bg-brand-bright/30'
                ]"
                @click="scrollToSection(section.id)"
              >
                <!-- Number Badge -->
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 border border-brand-black',
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
                    'flex-1 font-semibold tracking-tight transition-all duration-300',
                    activeSection === section.id ? 'text-brand-black' : 'text-brand-black'
                  ]"
                >
                  {{ section.title }}
                </span>

                <!-- Arrow Icon -->
                <svg
                  :class="[
                    'w-5 h-5 transition-all duration-300',
                    activeSection === section.id
                      ? 'text-brand-black translate-x-0'
                      : 'text-brand-gray -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  ]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>

              <!-- Decorative Card -->
              <div
                class="mt-8 p-6 bg-brand-black text-brand-bg rounded-2xl border border-brand-black shadow-[4px_4px_0px_0px_#2F7A72] hidden lg:block"
              >
                <p class="text-brand-bright font-script text-xl mb-2">Questions?</p>
                <p class="text-sm text-brand-bg/80 mb-4">
                  We're here to help you understand our terms.
                </p>
                <RouterLink
                  to="/help"
                  class="inline-flex items-center gap-2 text-brand-bright text-sm font-semibold hover:underline"
                >
                  Contact Support
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
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
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 01</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Conditions of Use
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    We will provide their services to you, which are subject to the conditions
                    stated below in this document. Every time you visit this website, use its
                    services or make a purchase, you accept the following conditions. This is why we
                    urge you to read them carefully.
                  </p>
                  <p>
                    By accessing and using Stay on Brand's color accessibility validation platform,
                    you acknowledge that you have read, understood, and agree to be bound by these
                    Terms of Service and our Privacy Policy.
                  </p>
                  <div class="mt-6 p-4 rounded-xl bg-brand-bright/20 border border-brand-teal/30">
                    <p class="text-sm text-brand-black">
                      <span class="text-brand-teal font-semibold">Note:</span> Your continued use of
                      our services constitutes acceptance of these terms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 2: Privacy Policy -->
            <section id="privacy" class="scroll-mt-24 scroll-animate fade-up">
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
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <circle cx="12" cy="16" r="1" />
                      <path d="m7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 02</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Privacy Policy
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Before you continue using our website we advise you to read our
                    <RouterLink
                      to="/privacy"
                      class="text-brand-red hover:text-brand-red/80 underline decoration-brand-red/30 underline-offset-4 hover:decoration-brand-red transition-all duration-300 font-semibold"
                    >
                      privacy policy
                    </RouterLink>
                    regarding our user data collection. It will help you better understand our
                    practices.
                  </p>
                  <p>
                    We are committed to protecting your privacy and ensuring the security of your
                    personal information. Our data collection practices are transparent and comply
                    with applicable privacy regulations including GDPR and CCPA.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 3: Copyright -->
            <section id="copyright" class="scroll-mt-24 scroll-animate fade-up">
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
                      Copyright
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Content published on this website (digital downloads, images, texts, graphics,
                    logos) is the property of Stay on Brand and/or its content creators and
                    protected by international copyright laws. The entire compilation of the content
                    found on this website is exclusive property, with copyright authorship for this
                    compilation.
                  </p>
                  <p>
                    Unauthorized reproduction, distribution, or modification of our content is
                    strictly prohibited and may result in legal action.
                  </p>
                  <ul class="list-none space-y-3 mt-6">
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-teal text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >1</span
                      >
                      <span>All trademarks and logos are property of their respective owners</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-red text-brand-bg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >2</span
                      >
                      <span>User-generated content remains property of the user</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <span
                        class="w-6 h-6 rounded-full bg-brand-bright text-brand-black flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        >3</span
                      >
                      <span>Fair use provisions apply to educational and personal use</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 4: Communications -->
            <section id="communications" class="scroll-mt-24 scroll-animate fade-up">
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
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-teal text-sm font-mono font-semibold mb-1">SECTION 04</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Communications
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    The entire communication with us is electronic. Every time you send us an email
                    or visit our website, you are going to be communicating with us. You hereby
                    consent to receive communications from us. If you subscribe to the news on our
                    website, you are going to receive regular emails from us.
                  </p>
                  <p>
                    We will continue to communicate with you by posting news and notices on our
                    website and by sending you emails. You also agree that all notices, disclosures,
                    agreements, and other communications we provide to you electronically meet the
                    legal requirements.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 5: Disputes -->
            <section id="disputes" class="scroll-mt-24 scroll-animate fade-up">
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
                      <path
                        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-brand-red text-sm font-mono font-semibold mb-1">SECTION 05</p>
                    <h2 class="text-2xl md:text-3xl font-display font-bold text-brand-black">
                      Disputes
                    </h2>
                  </div>
                </div>
                <div
                  class="prose-content space-y-4 text-brand-black/80 leading-relaxed text-base md:text-lg"
                >
                  <p>
                    Any dispute related in any way to your visit to this website or to products you
                    purchase from us shall be arbitrated by state or federal court and you consent
                    to exclusive jurisdiction and venue of such courts.
                  </p>
                  <p>
                    We encourage users to contact our support team first to resolve any issues
                    before pursuing formal dispute resolution procedures. Most concerns can be
                    addressed through direct communication.
                  </p>
                  <div class="mt-6 p-4 rounded-xl bg-brand-black text-brand-bg">
                    <p class="text-sm">
                      <span class="text-brand-bright font-semibold">Contact Support:</span> For any
                      questions or concerns, reach out to us at
                      <a
                        href="mailto:support@stayonbrand.com"
                        class="text-brand-bright hover:underline"
                        >support@stayonbrand.com</a
                      >
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Action Buttons -->
            <div class="pt-8 scroll-animate fade-up">
              <div
                class="bg-brand-black text-brand-bg rounded-3xl p-8 md:p-12 border border-brand-black shadow-[6px_6px_0px_0px_#79dcaf]"
              >
                <p class="text-brand-bright font-script text-2xl mb-2">Ready to get started?</p>
                <p class="text-brand-bg/80 text-base mb-8">
                  By continuing to use our services, you agree to these terms.
                </p>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <RouterLink
                    to="/"
                    class="w-full sm:w-auto px-8 py-4 rounded-full border-2 border-brand-bg text-brand-bg font-semibold hover:bg-brand-bg hover:text-brand-black transition-all duration-300 text-center"
                  >
                    Back to Home
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    class="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-bright text-brand-black font-bold tracking-tight border border-brand-black shadow-[4px_4px_0px_0px_#2F7A72] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2F7A72] transition-all duration-300 text-center"
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
              class="text-brand-teal hover:text-brand-teal/80 transition-colors duration-300 font-semibold"
              >Terms</RouterLink
            >
            <a
              href="mailto:support@stayonbrand.com"
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
        class="w-12 h-12 bg-brand-bright rounded-full border border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-brand-black"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
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

  /* Smooth Scrolling */
  html {
    scroll-behavior: smooth;
  }
</style>
