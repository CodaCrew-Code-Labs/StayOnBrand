<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { RouterLink } from 'vue-router'

  // Feature carousel state
  const activeCardIndex = ref(2)
  let autoPlayInterval: ReturnType<typeof setInterval> | null = null

  // Pricing toggle state
  const isYearlyPricing = ref(false)

  // Pricing plans data
  const pricingPlans = {
    starter: {
      name: 'STARTER',
      subtitle: 'Individual',
      description: 'Perfect for getting started with brand color validation',
      support: 'Email support',
      monthly: 0,
      yearly: 0,
      features: [
        '5 color checks per day',
        'Max 2 Colors per check',
        'Basic WCAG compliance',
        '1 brand palette'
      ],
      cta: 'Get Started Free',
      color: 'teal'
    },
    professional: {
      name: 'PROFESSIONAL',
      subtitle: 'Business',
      description: 'Unlimited validation with team features and integrations',
      support: 'Priority support Mon-Fri',
      monthly: 5,
      yearly: 48, // ~2 months free
      features: [
        'Unlimited color checks',
        'Max 3 colors per check',
        'Full WCAG 2.1 AA + AAA',
        '10 brand palettes',
        '2 Image validations per day'
      ],
      cta: 'Start Free Trial',
      color: 'bright',
      popular: true
    },
    enterprise: {
      name: 'ENTERPRISE',
      subtitle: 'Organization',
      description: 'Custom solutions for large teams and agencies',
      support: '24/7 dedicated support',
      monthly: 20,
      yearly: 192, // ~2 months free
      features: [
        'Everything in Pro',
        'Unlimited palettes',
        'Max 5 colors per check',
        'Unlimited Image Validation',
        'White-label reports'
      ],
      cta: 'Contact Sales',
      color: 'red'
    }
  }

  // Scroll animation observer
  let scrollObserver: IntersectionObserver | null = null

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
          // Optionally unobserve after animation
          // scrollObserver?.unobserve(entry.target)
        }
      })
    }, options)

    // Observe all elements with scroll-animate class
    nextTick(() => {
      document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver?.observe(el)
      })

      // Also observe stagger-children containers
      document.querySelectorAll('.stagger-children').forEach(el => {
        scrollObserver?.observe(el)
      })
    })
  }

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll('.counter-value')
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0')
      const duration = 2000
      const startTime = performance.now()
      const startValue = 0

      function updateCounter(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart)
        counter.textContent = currentValue.toLocaleString()

        if (progress < 1) {
          requestAnimationFrame(updateCounter)
        }
      }

      requestAnimationFrame(updateCounter)
    })
  }

  const featureCards = [
    {
      id: 0,
      number: '01',
      title: 'WCAG COMPLIANCE',
      expandedTitle: 'Batch Color Compliance',
      icon: 'palette',
      description:
        'Check up to 5 brand colors at once for WCAG compliance. Get instant accessibility scores and recommendations.',
      accentColor: 'brand-teal'
    },
    {
      id: 1,
      number: '02',
      title: 'BRAND VALIDATION',
      expandedTitle: 'Brand Color Validation',
      icon: 'image',
      description:
        'Upload your social post images and validate them against your brand color palette. Ensure every post stays on brand.',
      accentColor: 'brand-bright'
    },
    {
      id: 2,
      number: '03',
      title: 'IMAGE ACCESSIBILITY',
      expandedTitle: 'Image WCAG Check',
      icon: 'shield',
      description:
        'Validate your social media images against WCAG accessibility standards. Ensure your content is accessible to everyone.',
      accentColor: 'brand-teal'
    }
  ]

  // Animated title text
  const animatedText = "ACCESSIBILITY SHOULDN'T BE AN AFTERTHOUGHT"
  const animatedChars = ref<Array<{ char: string; delay: string }>>([])

  function updateActiveCard(index: number) {
    activeCardIndex.value = index
    resetAutoPlay()
  }

  function nextCard(e?: Event) {
    if (e) e.stopPropagation()
    const nextIndex = (activeCardIndex.value + 1) % featureCards.length
    updateActiveCard(nextIndex)
  }

  function prevCard(e?: Event) {
    if (e) e.stopPropagation()
    const prevIndex = (activeCardIndex.value - 1 + featureCards.length) % featureCards.length
    updateActiveCard(prevIndex)
  }

  function resetAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
    }
    autoPlayInterval = setInterval(() => {
      nextCard()
    }, 6000)
  }

  onMounted(() => {
    // Initialize animated characters
    animatedChars.value = animatedText.split('').map((char, index) => ({
      char,
      delay: `${index * 0.03}s`
    }))

    // Start autoplay for carousel
    resetAutoPlay()

    // Initialize scroll animations
    initScrollAnimations()

    // Initialize counter animations when stats section is visible
    const statsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters()
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )

    nextTick(() => {
      const statsSection = document.querySelector('.stats-section')
      if (statsSection) {
        statsObserver.observe(statsSection)
      }
    })
  })

  onUnmounted(() => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
    }
    if (scrollObserver) {
      scrollObserver.disconnect()
    }
  })
</script>

<template>
  <div class="bg-brand-bg text-brand-black relative flex flex-col font-sans">
    <!-- === HERO SECTION === -->
    <div class="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
      <!-- Background Grid -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.15] bg-grid z-0"></div>
      <!-- Dotted Line Grid with Beam -->
      <div class="absolute inset-0 pointer-events-none bg-grid-lines z-0">
        <div
          class="absolute inset-0 bg-linear-to-b from-transparent via-brand-teal/5 to-transparent h-[50vh] animate-scan-vertical blur-md"
        ></div>
      </div>

      <!-- Noodle SVGs -->
      <svg
        class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50% 80 Q 20% 150 25% 300"
          fill="none"
          stroke="#2F7A72"
          stroke-width="1.5"
          class="opacity-30 noodle-path"
        />
        <path
          d="M 75% 500 Q 80% 600 50% 750"
          fill="none"
          stroke="#C92216"
          stroke-width="1.5"
          class="opacity-30 noodle-path"
          style="animation-delay: 0.5s"
        />
        <path
          d="M 50% 800 C 50% 900, 50% 950, 50% 1100"
          fill="none"
          stroke="#1A1A1A"
          stroke-width="1.5"
          stroke-dasharray="4 4"
          class="opacity-20 noodle-path"
          style="animation-delay: 1s"
        />
        <circle r="4" fill="#C92216">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 50% 80 Q 20% 150 25% 300" />
        </circle>
        <circle r="4" fill="#2F7A72">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            begin="1s"
            path="M 75% 500 Q 80% 600 50% 750"
          />
        </circle>
      </svg>

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
              to="/affiliates"
              class="group relative bg-brand-bg text-brand-black px-5 py-2 rounded-full border border-brand-black font-semibold text-xs tracking-wide shadow-[3px_3px_0px_0px_#1A1A1A] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover-beam overflow-hidden hover:bg-brand-bright hidden md:flex"
            >
              <span class="z-10 relative">AFFILIATES</span>
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

      <!-- Main Hero Content -->
      <main
        class="flex-grow flex flex-col z-10 text-center w-full max-w-screen-2xl mr-auto ml-auto px-4 relative items-center justify-center"
      >
        <!-- Script Header -->
        <div class="relative mb-6 scroll-animate fade-up">
          <span
            class="md:text-3xl text-brand-teal block transform hover:rotate-0 transition-transform cursor-default text-2xl font-medium font-script rotate-[-3deg] wiggle-hover"
          >
            #StayOnBrand
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
        <div class="leading-none flex flex-col max-w-7xl mr-auto ml-auto relative items-center">
          <div class="relative scroll-animate fade-up delay-100">
            <div
              class="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 bg-brand-bg text-brand-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-medium text-xs border border-brand-black animate-float shadow-[2px_2px_0px_0px_#C92216] pulse-glow"
            >
              01
            </div>
            <h1
              class="md:text-7xl lg:text-8xl xl:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              Every great brand
            </h1>
          </div>
          <div class="relative scroll-animate fade-up delay-200">
            <h1
              class="md:text-7xl lg:text-8xl xl:text-8xl uppercase text-brand-red leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              start with
            </h1>
            <svg
              class="absolute -bottom-1 left-0 w-full h-3 md:h-5 text-brand-bright opacity-90"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
          </div>
          <div class="relative scroll-animate fade-up delay-300">
            <h1
              class="md:text-7xl lg:text-8xl xl:text-8xl uppercase text-brand-black leading-[0.9] select-none text-5xl font-semibold tracking-tight font-display"
            >
              iconic colors
            </h1>
            <div
              class="absolute -right-2 md:-right-10 top-0 bg-brand-bright text-brand-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-medium text-xs border border-brand-black shadow-[2px_2px_0px_0px_#2F7A72] animate-float-delayed pulse-glow"
            >
              02
            </div>
          </div>
          <div class="relative mt-2 md:mt-4 scroll-animate fade-up delay-400">
            <h3
              class="uppercase text-brand-teal leading-[0.9] select-none lg:text-5xl xl:text-6xl md:text-4xl text-3xl font-semibold tracking-tight font-display"
            >
              THAT ARE ACCESSIBLE TO EVERYONE
            </h3>
            <div
              class="absolute bottom-2 left-0 bg-brand-bg text-brand-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-medium text-xs border border-brand-black shadow-[2px_2px_0px_0px_#1A1A1A] animate-float-slow"
            >
              03
            </div>
          </div>
        </div>

        <!-- Floating Shapes -->
        <div
          class="absolute top-1/4 left-10 opacity-60 hidden lg:block animate-float scroll-animate fade-left delay-600"
          style="animation-duration: 8s"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-brand-teal rotate-12"
          >
            <path d="M5 3a2 2 0 0 0-2 2" />
            <path d="M19 3a2 2 0 0 1 2 2" />
            <path d="M21 19a2 2 0 0 1-2 2" />
            <path d="M5 21a2 2 0 0 1-2-2" />
            <path d="M9 3h1" />
            <path d="M9 21h1" />
            <path d="M14 3h1" />
            <path d="M14 21h1" />
            <path d="M3 9v1" />
            <path d="M21 9v1" />
            <path d="M3 14v1" />
            <path d="M21 14v1" />
          </svg>
        </div>
        <div
          class="absolute bottom-1/4 right-10 opacity-60 hidden lg:block animate-float-delayed scroll-animate fade-right delay-700"
          style="animation-duration: 7s"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-brand-red -rotate-12"
          >
            <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
            <path d="M14 3v4a2 2 0 0 0 2 2h4" />
            <path d="M8 13h.01" />
            <path d="M16 13h.01" />
            <path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" />
          </svg>
        </div>

        <!-- CTA Section -->
        <div
          class="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 items-center relative z-20 scroll-animate fade-up delay-500"
        >
          <RouterLink
            to="/signup"
            class="group relative flex items-center gap-3 bg-brand-black text-brand-bg border border-brand-black rounded-full px-6 py-2.5 shadow-[5px_5px_0px_0px_#C92216] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] overflow-hidden btn-animate"
          >
            <div
              class="hover-beam group-hover:opacity-100 transition-opacity opacity-0 border-transparent border-2 rounded-full absolute top-0 right-0 bottom-0 left-0"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
            <div class="leading-tight text-left">
              <div class="text-[0.6rem] uppercase font-semibold tracking-wide opacity-80">
                validate your brand color
              </div>
              <div class="text-base font-semibold tracking-tight font-display">FREE</div>
            </div>
          </RouterLink>
          <RouterLink
            to="/signup"
            class="group flex items-center gap-3 text-brand-black border-brand-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2F7A72] overflow-hidden border rounded-full pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-[5px_5px_0px_0px_#2F7A72]"
          >
            <div
              class="hover-beam group-hover:opacity-100 transition-opacity opacity-0 border-transparent border-2 rounded-full absolute top-0 right-0 bottom-0 left-0"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
            <div class="leading-tight text-left">
              <div class="text-[0.6rem] uppercase font-semibold tracking-wide opacity-80">
                Wanna Do more ???
              </div>
              <div class="text-base font-semibold tracking-tight font-display">SIGN-UP</div>
            </div>
          </RouterLink>
        </div>
      </main>

      <!-- Hero Footer -->
      <div
        class="relative w-full z-10 px-6 pb-6 md:px-12 flex justify-between items-end scroll-animate fade-up delay-600"
      >
        <div class="items-center gap-2 mb-2 hidden md:flex">
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-bright opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-brand-teal"></span>
          </span>
          <span class="text-brand-black/60 text-xs font-semibold tracking-tight"
            >System Operational</span
          >
        </div>
        <div class="flex gap-4 mb-2">
          <a
            href="#"
            class="text-brand-black hover:text-brand-red transition-colors hover:scale-110 transform duration-200 wiggle-hover"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            class="text-brand-black hover:text-brand-red transition-colors hover:scale-110 transform duration-200 wiggle-hover"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            class="text-brand-black hover:text-brand-red transition-colors hover:scale-110 transform duration-200 wiggle-hover"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
        </div>
      </div>
    </div>

    <!-- === FEATURE SECTION === -->
    <section
      class="relative w-full min-h-screen bg-brand-bright text-brand-black flex flex-col items-center py-24 px-4 overflow-hidden z-20"
    >
      <!-- Connecting Noodle from above -->
      <svg
        class="absolute top-0 left-0 w-full h-[300px] pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50% -100 L 50% 100"
          fill="none"
          stroke="#2F7A72"
          stroke-width="2"
          class="opacity-20 noodle-path"
        />
        <circle r="4" fill="#1A1A1A">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 50% -100 L 50% 100" />
        </circle>
      </svg>

      <!-- Use Dark Grids for Light Background -->
      <div class="absolute inset-0 bg-grid opacity-[0.10] pointer-events-none z-0"></div>
      <div class="absolute inset-0 bg-grid-lines pointer-events-none z-0"></div>

      <!-- Section Header -->
      <div class="z-10 flex flex-col items-center text-center max-w-5xl mx-auto mb-16 space-y-8">
        <!-- Pill Button -->
        <button
          class="group relative px-6 py-2 rounded-full bg-brand-black border border-brand-bg/20 text-xs font-semibold tracking-wide backdrop-blur-sm overflow-hidden hover:border-brand-bg/50 transition-colors shadow-xl scroll-animate fade-down"
        >
          <div
            class="hover-beam-light group-hover:opacity-100 transition-opacity opacity-0 border-transparent border-2 rounded-full absolute top-0 right-0 bottom-0 left-0"
          ></div>
          <div class="flex items-center gap-2">
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
              class="text-brand-bright"
            >
              <rect width="16" height="16" x="4" y="4" rx="2" />
              <rect width="6" height="6" x="9" y="9" rx="1" />
              <path d="M15 2v2" />
              <path d="M15 20v2" />
              <path d="M2 15h2" />
              <path d="M2 9h2" />
              <path d="M20 15h2" />
              <path d="M20 9h2" />
              <path d="M9 2v2" />
              <path d="M9 20v2" />
            </svg>
            <span class="text-brand-bg">What We Do</span>
          </div>
        </button>

        <!-- Animated Title -->
        <h2
          class="text-4xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight uppercase leading-[0.95] text-brand-black scroll-animate scale-in delay-200"
        >
          <template v-for="(item, index) in animatedChars" :key="index">
            <span v-if="item.char === ' '" class="inline-block" style="width: 0.4em"></span>
            <span v-else class="char-reveal" :style="{ animationDelay: item.delay }">{{
              item.char
            }}</span>
          </template>
        </h2>

        <!-- Subtitle -->
        <p
          class="text-brand-black/80 text-lg md:text-xl font-sans max-w-2xl font-light scroll-animate fade-up delay-400"
        >
          Your brand color guidelines. Your WCAG standards. Our APP handles both.
        </p>
      </div>

      <!-- Interactive Carousel / Accordion -->
      <div
        class="z-10 w-full max-w-7xl mx-auto h-[600px] flex flex-col md:flex-row gap-4 md:gap-6 relative px-4 scroll-animate fade-up delay-500"
      >
        <!-- Controls (Mobile Only Visible top) -->
        <div class="absolute -top-12 right-4 flex gap-2 md:hidden">
          <button
            class="w-10 h-10 rounded-full border border-brand-black/20 flex items-center justify-center hover:bg-brand-black hover:text-brand-bright transition-colors text-brand-black"
            @click="prevCard"
          >
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
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            class="w-10 h-10 rounded-full border border-brand-black/20 flex items-center justify-center hover:bg-brand-black hover:text-brand-bright transition-colors text-brand-black"
            @click="nextCard"
          >
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
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Card 01: WCAG Compliance -->
        <div
          :class="[
            'feature-card group relative bg-brand-black border border-brand-bg/10 rounded-3xl overflow-hidden cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-brand-teal/50 shadow-2xl',
            activeCardIndex === 0 ? 'active-card' : 'flex-[1]'
          ]"
          @click="updateActiveCard(0)"
        >
          <div class="card-beam"></div>
          <!-- Collapsed View -->
          <div
            :class="[
              'collapsed-content absolute inset-0 flex flex-col items-center pt-8 transition-opacity duration-300',
              activeCardIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            ]"
          >
            <span class="text-brand-bg/40 font-mono text-sm mb-4">01</span>
            <h3
              class="vertical-text text-xl font-display font-bold tracking-widest uppercase text-brand-bg/80 whitespace-nowrap"
            >
              WCAG COMPLIANCE
            </h3>
            <div class="mt-auto mb-8 text-brand-teal animate-pulse">
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
          <!-- Expanded View -->
          <div
            :class="[
              'expanded-content absolute inset-0 p-8 flex flex-col transition-opacity duration-500 delay-100',
              activeCardIndex === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            ]"
          >
            <div class="flex justify-between items-start mb-6">
              <span class="text-brand-teal font-mono text-xl">01</span>
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
                class="text-brand-teal"
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
            <h3 class="text-4xl font-display font-semibold tracking-tight mb-4 text-brand-bg">
              Batch Color Compliance
            </h3>
            <p class="text-brand-bg/60 text-lg mb-8 leading-relaxed">
              Check up to 5 brand colors at once for WCAG compliance. Get instant accessibility
              scores and recommendations.
            </p>
            <!-- UI Mockup Area -->
            <div
              class="flex-grow bg-[#050505] rounded-xl border border-brand-bg/10 relative overflow-hidden flex flex-col shadow-inner"
            >
              <div
                class="w-full h-8 border-b flex items-center px-4 gap-2 bg-[#141414] border-white/10"
              >
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div class="p-4 flex-grow flex flex-col gap-3">
                <!-- Color swatches with compliance scores -->
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#2F7A72]"></div>
                  <div class="flex-grow h-2 bg-brand-bg/10 rounded-full overflow-hidden">
                    <div class="h-full w-[95%] bg-green-500 rounded-full"></div>
                  </div>
                  <span class="text-green-500 text-xs font-mono">AAA</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#C92216]"></div>
                  <div class="flex-grow h-2 bg-brand-bg/10 rounded-full overflow-hidden">
                    <div class="h-full w-[85%] bg-green-500 rounded-full"></div>
                  </div>
                  <span class="text-green-500 text-xs font-mono">AA</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#F5A623]"></div>
                  <div class="flex-grow h-2 bg-brand-bg/10 rounded-full overflow-hidden">
                    <div class="h-full w-[60%] bg-yellow-500 rounded-full"></div>
                  </div>
                  <span class="text-yellow-500 text-xs font-mono">AA</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#1A1A1A]"></div>
                  <div class="flex-grow h-2 bg-brand-bg/10 rounded-full overflow-hidden">
                    <div class="h-full w-[100%] bg-green-500 rounded-full"></div>
                  </div>
                  <span class="text-green-500 text-xs font-mono">AAA</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-[#F8F3E8]"></div>
                  <div class="flex-grow h-2 bg-brand-bg/10 rounded-full overflow-hidden">
                    <div class="h-full w-[92%] bg-green-500 rounded-full"></div>
                  </div>
                  <span class="text-green-500 text-xs font-mono">AAA</span>
                </div>
                <div class="mt-auto text-center text-brand-bg/50 text-xs font-mono">
                  5 colors analyzed • 4 pass AAA
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 02: Brand Validation -->
        <div
          :class="[
            'feature-card group relative bg-brand-black border border-brand-bg/10 rounded-3xl overflow-hidden cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-brand-bright/50 shadow-2xl',
            activeCardIndex === 1 ? 'active-card' : 'flex-[1]'
          ]"
          @click="updateActiveCard(1)"
        >
          <div class="card-beam"></div>
          <!-- Collapsed -->
          <div
            :class="[
              'collapsed-content absolute inset-0 flex flex-col items-center pt-8 transition-opacity duration-300',
              activeCardIndex === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            ]"
          >
            <span class="text-brand-bg/40 font-mono text-sm mb-4">02</span>
            <h3
              class="vertical-text text-xl font-display font-bold tracking-widest uppercase text-brand-bg/80 whitespace-nowrap"
            >
              BRAND VALIDATION
            </h3>
            <div class="mt-auto mb-8 text-brand-bright animate-pulse">
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
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
          </div>
          <!-- Expanded -->
          <div
            :class="[
              'expanded-content absolute inset-0 p-8 flex flex-col transition-opacity duration-500 delay-100',
              activeCardIndex === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            ]"
          >
            <div class="flex justify-between items-start mb-6">
              <span class="text-brand-bright font-mono text-xl">02</span>
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
                class="text-brand-bright"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <h3 class="text-4xl font-display font-semibold tracking-tight mb-4 text-brand-bg">
              Brand Color Validation
            </h3>
            <p class="text-brand-bg/60 text-lg mb-8 leading-relaxed">
              Upload your social post images and validate them against your brand color palette.
              Ensure every post stays on brand.
            </p>
            <div
              class="flex-grow bg-[#111] rounded-xl border border-brand-bg/10 relative overflow-hidden flex items-center justify-center shadow-inner p-4"
            >
              <div class="absolute inset-0 bg-grid opacity-20"></div>
              <div class="relative w-full h-full flex gap-4">
                <!-- Image preview area -->
                <div
                  class="flex-1 border border-dashed border-brand-bg/20 rounded-lg flex flex-col items-center justify-center bg-brand-black/50"
                >
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
                    class="text-brand-bg/30 mb-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <span class="text-brand-bg/40 text-xs">Upload Image</span>
                </div>
                <!-- Brand palette check -->
                <div class="w-32 flex flex-col gap-2">
                  <div class="text-brand-bg/50 text-[10px] font-mono uppercase mb-1">
                    Brand Palette
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded bg-[#2F7A72]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="text-green-500"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span class="text-green-500 text-[10px]">Found</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded bg-[#C92216]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="text-green-500"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span class="text-green-500 text-[10px]">Found</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded bg-[#F5A623]"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="text-brand-bg/30"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span class="text-brand-bg/40 text-[10px]">Missing</span>
                  </div>
                  <div class="mt-auto pt-2 border-t border-brand-bg/10">
                    <div class="text-brand-bright text-xs font-semibold">87% On Brand</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 03: Image Accessibility -->
        <div
          :class="[
            'feature-card group relative bg-brand-black border border-brand-bg/10 rounded-3xl overflow-hidden cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-brand-teal/50 shadow-2xl',
            activeCardIndex === 2 ? 'active-card' : 'flex-[1]'
          ]"
          @click="updateActiveCard(2)"
        >
          <div class="card-beam"></div>
          <!-- Collapsed -->
          <div
            :class="[
              'collapsed-content absolute inset-0 flex flex-col items-center pt-8 transition-opacity duration-300',
              activeCardIndex === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            ]"
          >
            <span class="text-brand-bg/40 font-mono text-sm mb-4">03</span>
            <h3
              class="vertical-text text-xl font-display font-bold tracking-widest uppercase text-brand-bg/80 whitespace-nowrap"
            >
              IMAGE ACCESSIBILITY
            </h3>
            <div class="mt-auto mb-8 text-brand-teal animate-pulse">
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
                <path
                  d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </div>
          <!-- Expanded -->
          <div
            :class="[
              'expanded-content absolute inset-0 p-8 flex flex-col transition-opacity duration-500 delay-100',
              activeCardIndex === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            ]"
          >
            <div class="flex flex-col md:flex-row gap-8 h-full">
              <!-- Text Content -->
              <div class="md:w-1/3 flex flex-col">
                <div class="flex justify-between items-start mb-6">
                  <span class="text-brand-teal font-mono text-xl">03</span>
                </div>
                <h3 class="text-4xl font-display font-semibold tracking-tight mb-6 text-brand-bg">
                  Image WCAG Check
                </h3>
                <ul class="space-y-6 text-brand-bg/70 text-lg leading-relaxed">
                  <li class="flex gap-3">
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2.5 flex-shrink-0"
                    ></span>
                    <span
                      >Analyze color contrast in your social media images against WCAG
                      standards.</span
                    >
                  </li>
                  <li class="flex gap-3">
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2.5 flex-shrink-0"
                    ></span>
                    <span
                      >Ensure text overlays and graphics meet accessibility requirements for all
                      users.</span
                    >
                  </li>
                </ul>

                <div class="mt-auto pt-8 flex gap-2">
                  <button
                    class="w-10 h-10 rounded-full border border-brand-bg/20 text-brand-bg flex items-center justify-center hover:bg-brand-bg hover:text-brand-black transition-colors"
                    @click="prevCard"
                  >
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
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    class="w-10 h-10 rounded-full border border-brand-bg/20 text-brand-bg flex items-center justify-center hover:bg-brand-bg hover:text-brand-black transition-colors"
                    @click="nextCard"
                  >
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
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- UI Mockup - Accessibility Analysis -->
              <div
                class="md:w-2/3 bg-brand-bg rounded-2xl border border-brand-bg/5 overflow-hidden flex flex-col relative shadow-lg"
              >
                <!-- Header -->
                <div class="border-b border-brand-black/5 p-4 flex gap-4 items-center bg-white">
                  <span
                    class="bg-brand-teal/10 text-brand-teal px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider"
                  >
                    WCAG Analysis
                  </span>
                  <span
                    class="text-brand-black/40 text-xs font-medium cursor-pointer hover:text-brand-black transition-colors"
                  >
                    Contrast Check
                  </span>
                  <span
                    class="text-brand-black/40 text-xs font-medium cursor-pointer hover:text-brand-black transition-colors"
                  >
                    Color Blindness
                  </span>
                </div>

                <!-- Analysis Results -->
                <div class="flex-grow p-6 bg-white">
                  <div class="grid grid-cols-2 gap-4 h-full">
                    <!-- Image Preview -->
                    <div
                      class="bg-gradient-to-br from-brand-teal/20 to-brand-bright/20 rounded-xl flex items-center justify-center relative overflow-hidden"
                    >
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center p-4">
                          <div
                            class="w-16 h-16 mx-auto mb-2 rounded-lg bg-brand-black/80 flex items-center justify-center"
                          >
                            <span class="text-brand-bg text-xs font-bold">SALE</span>
                          </div>
                          <div class="text-brand-black/60 text-[10px]">Sample social post</div>
                        </div>
                      </div>
                      <!-- Scan overlay -->
                      <div
                        class="absolute inset-0 border-2 border-dashed border-brand-teal/30 rounded-xl m-2"
                      ></div>
                    </div>
                    <!-- Results Panel -->
                    <div class="flex flex-col gap-3">
                      <div class="text-[10px] font-mono uppercase text-brand-black/50 mb-1">
                        Analysis Results
                      </div>

                      <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div class="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-green-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <span class="text-green-700 text-xs font-semibold"
                            >Text Contrast: AAA</span
                          >
                        </div>
                        <div class="text-green-600/70 text-[10px] mt-1">Ratio: 12.5:1</div>
                      </div>

                      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div class="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-yellow-600"
                          >
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                          </svg>
                          <span class="text-yellow-700 text-xs font-semibold">Graphics: AA</span>
                        </div>
                        <div class="text-yellow-600/70 text-[10px] mt-1">Ratio: 4.2:1</div>
                      </div>

                      <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div class="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="text-green-600"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <span class="text-green-700 text-xs font-semibold">Color Blind Safe</span>
                        </div>
                        <div class="text-green-600/70 text-[10px] mt-1">All types pass</div>
                      </div>

                      <div class="mt-auto pt-2 border-t border-brand-black/5">
                        <div class="text-brand-teal text-sm font-semibold">
                          Overall: WCAG 2.1 AA Compliant
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- === BENTO GRID SECTION === -->
    <section
      class="stats-section relative w-full min-h-screen bg-brand-teal flex flex-col items-center justify-center py-24 px-4 overflow-hidden z-20"
    >
      <!-- Background Elements -->
      <div
        class="absolute inset-0 bg-[radial-gradient(#f8f3e8_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-10 pointer-events-none"
      ></div>

      <!-- Connecting Noodle -->
      <svg
        class="absolute -top-32 left-0 w-full h-[300px] pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50% 0 L 50% 150"
          fill="none"
          stroke="#f8f3e8"
          stroke-width="2"
          class="opacity-20 noodle-path"
        />
        <circle r="4" fill="#f8f3e8">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 50% 0 L 50% 150" />
        </circle>
      </svg>

      <!-- Header -->
      <div class="mb-12 text-center max-w-4xl z-10">
        <button
          class="group relative px-6 py-2 rounded-full bg-brand-black/20 border border-brand-bg/20 text-xs font-semibold tracking-wide backdrop-blur-sm overflow-hidden hover:border-brand-bg/50 transition-colors shadow-xl text-brand-bg mb-6 scroll-animate fade-down"
        >
          <div
            class="hover-beam-light group-hover:opacity-100 transition-opacity opacity-0 border-transparent border-2 rounded-full absolute top-0 right-0 bottom-0 left-0"
          ></div>
          <div class="flex items-center gap-2">
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
              class="text-brand-bright"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <span>THE NUMBERS DON'T LIE</span>
          </div>
        </button>
        <h2
          class="text-4xl md:text-6xl font-display font-semibold text-brand-bg uppercase tracking-tight scroll-animate scale-in delay-200"
        >
          <span class="block">What You're</span>
          <span class="block text-brand-bright">Missing Out On</span>
        </h2>
      </div>

      <!-- Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-6 lg:grid-rows-2 gap-4 w-full max-w-7xl h-auto lg:h-[700px] relative z-10"
      >
        <!-- Card 1: Brand Recognition -->
        <div
          class="group relative bg-brand-bg rounded-3xl p-6 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-500 shadow-2xl md:col-span-1 scroll-animate fade-up delay-100 card-lift"
        >
          <div class="card-beam"></div>
          <div class="flex justify-between items-start mb-4">
            <div
              class="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-bg"
            >
              <span class="font-mono text-xs">01</span>
            </div>
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
              class="text-brand-teal"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div class="flex-grow flex flex-col justify-center">
            <div class="text-6xl font-display font-bold text-brand-black tracking-tighter mb-2">
              80<span class="text-3xl">%</span>
            </div>
            <h3 class="text-xl font-display font-bold text-brand-black leading-tight mb-2">
              Brand Recognition Boost
            </h3>
            <p class="text-sm text-brand-black/60">
              Consistent color usage increases brand recognition by up to 80%. Your colors are your
              identity.
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-brand-black/10">
            <div class="text-xs text-brand-black/40 font-mono">
              Source: University of Loyola, Maryland
            </div>
          </div>
        </div>

        <!-- Card 2: Excluded Audience -->
        <div
          class="group relative bg-brand-black rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-transform hover:-translate-y-1 duration-500 shadow-2xl md:col-span-1 scroll-animate fade-up delay-200 card-lift"
        >
          <div class="card-beam"></div>
          <div class="flex justify-between items-start">
            <div
              class="w-10 h-10 rounded-full bg-brand-bg/10 flex items-center justify-center text-brand-bg"
            >
              <span class="font-mono text-xs">02</span>
            </div>
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
              class="text-brand-red"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="17" x2="22" y1="8" y2="13" />
              <line x1="22" x2="17" y1="8" y2="13" />
            </svg>
          </div>
          <div class="my-auto text-center py-6">
            <div class="text-6xl font-display font-bold text-brand-bg tracking-tighter">
              1.3<span class="text-3xl">B</span>
            </div>
            <div class="text-brand-bg/70 font-medium text-lg mt-2">
              People With Visual Impairments
            </div>
            <p class="text-brand-bg/50 text-sm mt-3 max-w-xs mx-auto">
              Poor contrast excludes 1 in 6 potential customers from engaging with your content.
            </p>
          </div>
          <div class="pt-4 border-t border-brand-bg/10">
            <div class="text-xs text-brand-bg/40 font-mono">Source: World Health Organization</div>
          </div>
        </div>

        <!-- Card 3: Compliance Gap -->
        <div
          class="group relative bg-brand-red rounded-3xl p-6 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-500 shadow-2xl md:col-span-1 scroll-animate fade-up delay-300 card-lift"
        >
          <div class="card-beam"></div>
          <div
            class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]"
          ></div>
          <div class="flex justify-between items-start z-10">
            <div
              class="w-10 h-10 rounded-full bg-brand-bg/20 flex items-center justify-center text-brand-bg"
            >
              <span class="font-mono text-xs">03</span>
            </div>
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
              class="text-brand-bg"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <div class="flex-grow flex flex-col justify-center z-10 py-4">
            <div class="text-6xl font-display font-bold text-brand-bg tracking-tighter mb-2">
              67<span class="text-3xl">%</span>
            </div>
            <h3 class="text-xl font-display font-bold text-brand-bg leading-tight mb-2">
              Brand Posts Fail WCAG
            </h3>
            <p class="text-brand-bg/80 text-sm">
              2 out of 3 brands are losing engagement due to basic accessibility failures.
            </p>
          </div>
          <div class="pt-4 border-t border-brand-bg/20 z-10">
            <div class="text-xs text-brand-bg/60 font-mono">Source: WebAIM Analysis</div>
          </div>
        </div>

        <!-- Card 4: Revenue Impact -->
        <div
          class="group relative bg-brand-bright rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-transform hover:-translate-y-1 duration-500 shadow-2xl md:col-span-1 scroll-animate fade-up delay-400 card-lift"
        >
          <div class="card-beam"></div>
          <div class="flex justify-between items-start">
            <div
              class="w-10 h-10 rounded-full bg-brand-black/10 flex items-center justify-center text-brand-black"
            >
              <span class="font-mono text-xs">04</span>
            </div>
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
              class="text-brand-black"
            >
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div class="my-auto text-center py-4">
            <div class="text-5xl font-display font-bold text-brand-black tracking-tighter">
              $13<span class="text-2xl">T</span>
            </div>
            <div class="text-brand-black/70 font-medium text-lg mt-2">Disposable Income</div>
            <p class="text-brand-black/60 text-sm mt-2">
              Global purchasing power of people with disabilities you could be reaching.
            </p>
          </div>
          <div class="pt-4 border-t border-brand-black/10">
            <div class="flex items-center justify-between">
              <div class="text-xs text-brand-black/50 font-mono">+23% revenue with consistency</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-green-600"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 5: Legal Risk -->
        <div
          class="group relative bg-brand-bg rounded-3xl p-6 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-500 shadow-2xl md:col-span-1 scroll-animate fade-up delay-500 card-lift"
        >
          <div class="card-beam"></div>
          <div class="flex justify-between items-start mb-4">
            <div
              class="w-10 h-10 rounded-full bg-brand-black flex items-center justify-center text-brand-bg"
            >
              <span class="font-mono text-xs">05</span>
            </div>
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
              class="text-brand-red"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <div class="flex-grow flex flex-col justify-center">
            <div class="text-5xl font-display font-bold text-brand-black tracking-tighter mb-2">
              4,000<span class="text-2xl">+</span>
            </div>
            <h3 class="text-xl font-display font-bold text-brand-black leading-tight mb-2">
              Lawsuits Per Year
            </h3>
            <p class="text-sm text-brand-black/60">
              ADA accessibility lawsuits are growing. Average settlement: $20K-$50K per case.
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-brand-black/10">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <div class="text-xs text-brand-black/60">98% preventable with WCAG compliance</div>
            </div>
          </div>
        </div>

        <!-- Card 6: Engagement Boost -->
        <div
          class="group relative bg-brand-black rounded-3xl p-6 flex flex-col justify-between overflow-hidden transition-transform hover:-translate-y-1 duration-500 shadow-2xl md:col-span-1 scroll-animate fade-up delay-600 card-lift"
        >
          <div class="card-beam"></div>
          <div class="flex justify-between items-start">
            <div
              class="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal"
            >
              <span class="font-mono text-xs">06</span>
            </div>
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
              class="text-brand-teal"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div class="my-auto py-4">
            <div class="flex items-baseline gap-2 mb-3">
              <div class="text-6xl font-display font-bold text-brand-bg tracking-tighter">3x</div>
              <div class="text-brand-teal text-xl font-bold">MORE</div>
            </div>
            <h3 class="text-xl font-display font-bold text-brand-bg leading-tight mb-2">
              Shares On Brand Posts
            </h3>
            <p class="text-brand-bg/60 text-sm">
              Brand-consistent posts get 42% more clicks and 3x more shares than off-brand content.
            </p>
          </div>
          <div class="pt-4 border-t border-brand-bg/10">
            <RouterLink
              to="/signup"
              class="w-full flex items-center justify-center gap-2 bg-brand-teal text-brand-bg py-3 rounded-full font-semibold text-sm hover:bg-brand-bright hover:text-brand-black transition-colors btn-animate group"
            >
              Start Validating Free
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
                class="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- === PRICING SECTION === -->
    <section
      class="relative w-full min-h-screen bg-brand-bg flex flex-col items-center justify-center py-24 px-4 overflow-hidden z-20"
    >
      <!-- Background Elements -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.15] bg-grid z-0"></div>
      <div class="absolute inset-0 pointer-events-none bg-grid-lines z-0"></div>

      <!-- Connecting Noodle -->
      <svg
        class="absolute -top-32 left-0 w-full h-[300px] pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 50% 0 L 50% 150"
          fill="none"
          stroke="#2F7A72"
          stroke-width="2"
          class="opacity-20 noodle-path"
        />
        <circle r="4" fill="#2F7A72">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 50% 0 L 50% 150" />
        </circle>
      </svg>

      <!-- Header -->
      <div class="mb-16 text-center max-w-4xl z-10">
        <button
          class="group relative px-6 py-2 rounded-full bg-brand-black border border-brand-black/20 text-xs font-semibold tracking-wide backdrop-blur-sm overflow-hidden hover:border-brand-teal/50 transition-colors shadow-xl text-brand-bg mb-6 scroll-animate fade-down"
        >
          <div
            class="hover-beam-light group-hover:opacity-100 transition-opacity opacity-0 border-transparent border-2 rounded-full absolute top-0 right-0 bottom-0 left-0"
          ></div>
          <div class="flex items-center gap-2">
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
              class="text-brand-bright"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>SIMPLE PRICING</span>
          </div>
        </button>
        <h2
          class="text-4xl md:text-6xl font-display font-semibold text-brand-black uppercase tracking-tight scroll-animate scale-in delay-200"
        >
          <span class="block">Choose Your</span>
          <span class="block text-brand-teal">Perfect Plan</span>
        </h2>
        <p
          class="text-brand-black/60 text-lg mt-6 max-w-2xl mx-auto scroll-animate fade-up delay-300"
        >
          Start free and scale as you grow. All plans include core accessibility features.
        </p>

        <!-- Pricing Toggle -->
        <div class="mt-8 flex items-center justify-center gap-4 scroll-animate fade-up delay-400">
          <span
            :class="[
              'text-sm font-semibold transition-colors',
              !isYearlyPricing ? 'text-brand-black' : 'text-brand-black/40'
            ]"
          >
            Monthly
          </span>
          <button
            class="relative w-16 h-8 bg-brand-black rounded-full p-1 transition-colors shadow-[3px_3px_0px_0px_#2F7A72] hover:shadow-[2px_2px_0px_0px_#2F7A72] hover:translate-x-[1px] hover:translate-y-[1px]"
            @click="isYearlyPricing = !isYearlyPricing"
          >
            <div
              :class="[
                'w-6 h-6 bg-brand-bright rounded-full transition-transform duration-300 ease-out',
                isYearlyPricing ? 'translate-x-8' : 'translate-x-0'
              ]"
            ></div>
          </button>
          <span
            :class="[
              'text-sm font-semibold transition-colors',
              isYearlyPricing ? 'text-brand-black' : 'text-brand-black/40'
            ]"
          >
            Yearly
          </span>
          <span
            v-if="isYearlyPricing"
            class="ml-2 bg-brand-teal text-brand-bg text-xs font-bold px-3 py-1 rounded-full animate-pulse"
          >
            Save 20%
          </span>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl z-10 px-4">
        <!-- Basic Plan -->
        <div
          class="group relative bg-brand-bg rounded-3xl p-8 flex flex-col items-center text-center border-2 border-brand-black/10 shadow-xl scroll-animate fade-up delay-100 stat-card stat-card-light"
        >
          <!-- Character/Icon Area -->
          <div class="relative w-32 h-32 mb-6 flex items-center justify-center">
            <div class="absolute inset-0 bg-brand-teal/10 rounded-full"></div>
            <div
              class="relative z-10 w-24 h-24 bg-brand-black rounded-full flex items-center justify-center stat-badge"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-brand-bright stat-icon"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          <!-- Plan Name -->
          <h3
            class="text-2xl font-display font-bold text-brand-black uppercase tracking-wide stat-number"
          >
            STARTER
          </h3>
          <span class="text-brand-teal text-sm font-medium mb-4">Individual</span>

          <!-- Description -->
          <p class="text-brand-black/60 text-sm mb-2 stat-content">
            Perfect for getting started with brand color validation
          </p>
          <p class="text-brand-black/50 text-xs mb-6">Email support</p>

          <!-- Price -->
          <div class="mb-6 stat-number relative">
            <span class="text-brand-black/60 text-lg align-top">$</span>
            <span
              class="text-5xl font-display font-bold text-brand-black transition-all duration-300"
            >
              {{ isYearlyPricing ? pricingPlans.starter.yearly : pricingPlans.starter.monthly }}
            </span>
            <span class="text-brand-black/60 text-sm">{{
              isYearlyPricing ? '/Year' : '/Month'
            }}</span>
          </div>

          <!-- Features -->
          <ul class="text-left w-full space-y-3 mb-8 stat-content">
            <li
              v-for="feature in pricingPlans.starter.features"
              :key="feature"
              class="flex items-center gap-2 text-sm text-brand-black/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-brand-teal flex-shrink-0"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {{ feature }}
            </li>
          </ul>

          <!-- CTA Button -->
          <RouterLink
            to="/signup"
            class="w-full py-3 rounded-full bg-brand-black text-brand-bg font-semibold text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_#2F7A72] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2F7A72] transition-all btn-animate stat-footer"
          >
            {{ pricingPlans.starter.cta }}
          </RouterLink>
        </div>

        <!-- Premium Plan (Featured) -->
        <div
          class="group relative bg-brand-black rounded-3xl p-8 flex flex-col items-center text-center border-2 border-brand-teal shadow-2xl md:-mt-4 md:mb-4 scroll-animate fade-up delay-200 stat-card stat-card-dark"
        >
          <!-- Popular Badge -->
          <div
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-red text-brand-bg px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
          >
            Most Popular
          </div>

          <!-- Character/Icon Area -->
          <div class="relative w-32 h-32 mb-6 flex items-center justify-center mt-4">
            <div class="absolute inset-0 bg-brand-teal/20 rounded-full"></div>
            <div
              class="relative z-10 w-24 h-24 bg-brand-bright rounded-full flex items-center justify-center stat-badge"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-brand-black stat-icon"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>

          <!-- Plan Name -->
          <h3
            class="text-2xl font-display font-bold text-brand-bg uppercase tracking-wide stat-number"
          >
            PROFESSIONAL
          </h3>
          <span class="text-brand-bright text-sm font-medium mb-4">Business</span>

          <!-- Description -->
          <p class="text-brand-bg/70 text-sm mb-2 stat-content">
            Unlimited validation with team features and integrations
          </p>
          <p class="text-brand-bg/50 text-xs mb-6">Priority support Mon-Fri</p>

          <!-- Price -->
          <div class="mb-6 stat-number relative">
            <span class="text-brand-bg/60 text-lg align-top">$</span>
            <span class="text-5xl font-display font-bold text-brand-bg transition-all duration-300">
              {{
                isYearlyPricing
                  ? pricingPlans.professional.yearly
                  : pricingPlans.professional.monthly
              }}
            </span>
            <span class="text-brand-bg/60 text-sm">{{ isYearlyPricing ? '/Year' : '/Month' }}</span>
            <span
              v-if="isYearlyPricing"
              class="absolute -top-2 -right-2 bg-brand-red text-brand-bg text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              -20%
            </span>
          </div>

          <!-- Features -->
          <ul class="text-left w-full space-y-3 mb-8 stat-content">
            <li
              v-for="feature in pricingPlans.professional.features"
              :key="feature"
              class="flex items-center gap-2 text-sm text-brand-bg/80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-brand-bright shrink-0"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {{ feature }}
            </li>
          </ul>

          <!-- CTA Button -->
          <RouterLink
            to="/signup"
            class="w-full py-3 rounded-full bg-brand-bright text-brand-black font-semibold text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_#C92216] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] transition-all btn-animate stat-footer"
          >
            {{ pricingPlans.professional.cta }}
          </RouterLink>
        </div>

        <!-- Enterprise Plan -->
        <div
          class="group relative bg-brand-bg rounded-3xl p-8 flex flex-col items-center text-center border-2 border-brand-black/10 shadow-xl scroll-animate fade-up delay-300 stat-card stat-card-light"
        >
          <!-- Character/Icon Area -->
          <div class="relative w-32 h-32 mb-6 flex items-center justify-center">
            <div class="absolute inset-0 bg-brand-red/10 rounded-full"></div>
            <div
              class="relative z-10 w-24 h-24 bg-brand-red rounded-full flex items-center justify-center stat-badge"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-brand-bg stat-icon"
              >
                <path
                  d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
                />
              </svg>
            </div>
          </div>

          <!-- Plan Name -->
          <h3
            class="text-2xl font-display font-bold text-brand-black uppercase tracking-wide stat-number"
          >
            ENTERPRISE
          </h3>
          <span class="text-brand-red text-sm font-medium mb-4">Organization</span>

          <!-- Description -->
          <p class="text-brand-black/60 text-sm mb-2 stat-content">
            Custom Image Validation solutions for large teams and agencies
          </p>
          <p class="text-brand-black/50 text-xs mb-6">Priority support Mon-Fri</p>

          <!-- Price -->
          <div class="mb-6 stat-number relative">
            <span class="text-brand-black/60 text-lg align-top">$</span>
            <span
              class="text-5xl font-display font-bold text-brand-black transition-all duration-300"
            >
              {{
                isYearlyPricing ? pricingPlans.enterprise.yearly : pricingPlans.enterprise.monthly
              }}
            </span>
            <span class="text-brand-black/60 text-sm">{{
              isYearlyPricing ? '/Year' : '/Month'
            }}</span>
            <span
              v-if="isYearlyPricing"
              class="absolute -top-2 -right-2 bg-brand-teal text-brand-bg text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              -20%
            </span>
          </div>

          <!-- Features -->
          <ul class="text-left w-full space-y-3 mb-8 stat-content">
            <li
              v-for="feature in pricingPlans.enterprise.features"
              :key="feature"
              class="flex items-center gap-2 text-sm text-brand-black/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-brand-red shrink-0"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {{ feature }}
            </li>
          </ul>

          <!-- CTA Button -->
          <RouterLink
            to="/signup"
            class="w-full py-3 rounded-full bg-brand-black text-brand-bg font-semibold text-sm uppercase tracking-wide shadow-[4px_4px_0px_0px_#C92216] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#C92216] transition-all btn-animate stat-footer"
          >
            {{ pricingPlans.enterprise.cta }}
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- === CTA SECTION === -->
    <section class="relative w-full bg-brand-black py-20 px-4 overflow-hidden z-20">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5 pointer-events-none">
        <div
          class="absolute inset-0 bg-[radial-gradient(#f8f3e8_1px,transparent_1px)] [background-size:30px_30px]"
        ></div>
      </div>

      <!-- Decorative Lines -->
      <svg
        class="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="100" y1="0" x2="60" y2="100" stroke="#f8f3e8" stroke-width="0.5" />
        <line x1="100" y1="20" x2="80" y2="100" stroke="#f8f3e8" stroke-width="0.5" />
        <line x1="100" y1="40" x2="95" y2="100" stroke="#f8f3e8" stroke-width="0.5" />
      </svg>

      <div class="max-w-6xl mx-auto relative z-10">
        <div
          class="relative bg-brand-red rounded-3xl p-8 md:p-12 lg:p-16 border border-brand-bg/10 shadow-2xl overflow-hidden scroll-animate fade-up"
        >
          <!-- Inner glow effect -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
          ></div>

          <!-- Content Grid -->
          <div
            class="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12"
          >
            <!-- Text Content -->
            <div class="flex-1 text-center lg:text-left">
              <h2
                class="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-brand-bg leading-tight tracking-tight mb-4"
              >
                Convinced already?
              </h2>
              <p class="text-brand-bg/80 text-lg md:text-xl max-w-xl mb-8">
                Start validating your brand colors today with Stay on Brand!
                <br class="hidden md:block" />
                Ensure accessibility and consistency in minutes.
              </p>

              <!-- CTA Button -->
              <RouterLink
                to="/signup"
                class="group inline-flex items-center gap-3 bg-brand-bright text-brand-black px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wide shadow-[5px_5px_0px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#1A1A1A] transition-all btn-animate"
              >
                Get Started
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
                  class="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </RouterLink>
            </div>

            <!-- Logo/Icon Area -->
            <div class="relative flex-shrink-0">
              <div class="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                <!-- Glow effect behind -->
                <div class="absolute inset-0 bg-brand-bright/20 rounded-3xl blur-2xl"></div>
                <!-- Main logo container -->
                <div
                  class="relative w-full h-full bg-brand-bright rounded-3xl flex items-center justify-center shadow-2xl stat-card"
                >
                  <div class="text-brand-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="md:w-20 md:h-20 lg:w-24 lg:h-24 stat-icon"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

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

    <!-- Interactive Corner Sonar -->
    <div class="fixed bottom-6 left-6 z-50 group cursor-pointer md:block hidden">
      <div class="absolute inset-0 bg-brand-black rounded-full opacity-20 animate-sonar-slow"></div>
      <div
        class="relative w-12 h-12 bg-brand-black rounded-full flex items-center justify-center text-brand-bg transition-transform hover:scale-105 shadow-xl"
      >
        <div class="flex flex-col gap-[3px]">
          <div class="w-1 h-1 bg-brand-bg rounded-full"></div>
          <div class="w-1 h-1 bg-brand-bg rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
