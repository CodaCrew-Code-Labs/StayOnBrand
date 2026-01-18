<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()

  // Handle subscribe button click
  function handleSubscribeClick(plan: string) {
    router.push({ path: '/confirm-subscription', query: { plan } })
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
      cta: 'Current Plan',
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
  <div class="text-brand-black selection:bg-brand-bright selection:text-brand-black relative">
    <!-- Dashboard Main -->
    <main class="relative z-10 w-full">
      <!-- Header Section -->
      <div class="mb-8 flex items-end justify-between scroll-animate fade-up">
        <div class="relative">
          <div class="inline-block">
            <h1
              class="text-3xl md:text-4xl font-display font-bold text-brand-black tracking-tight section-header-hybrid"
            >
              Pricing Plans
            </h1>
          </div>
          <p class="mt-4 text-brand-black/60 font-script text-xl flex items-center gap-2">
            Choose the plan that fits your needs
            <span class="w-2 h-2 rounded-full bg-brand-bright animate-pulse"></span>
          </p>
        </div>
        <!-- Billing Toggle -->
        <div
          class="hidden md:inline-flex bg-white p-1 rounded-full border-2 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] items-center gap-1"
        >
          <button
            :class="[
              'relative px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all z-10',
              !isYearlyBilling
                ? 'text-brand-black bg-brand-bright border border-brand-black'
                : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
            ]"
            @click="isYearlyBilling = false"
          >
            MONTHLY
          </button>
          <button
            :class="[
              'relative px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all z-10',
              isYearlyBilling
                ? 'text-brand-black bg-brand-bright border border-brand-black'
                : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
            ]"
            @click="isYearlyBilling = true"
          >
            YEARLY
            <span class="ml-1 text-[10px] text-brand-teal font-bold">-20%</span>
          </button>
        </div>
      </div>

      <!-- Mobile Billing Toggle -->
      <div
        class="md:hidden mb-6 bg-white p-1 rounded-full border-2 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A] inline-flex items-center gap-1 scroll-animate fade-up delay-100"
      >
        <button
          :class="[
            'relative px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all z-10',
            !isYearlyBilling
              ? 'text-brand-black bg-brand-bright border border-brand-black'
              : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
          ]"
          @click="isYearlyBilling = false"
        >
          MONTHLY
        </button>
        <button
          :class="[
            'relative px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all z-10',
            isYearlyBilling
              ? 'text-brand-black bg-brand-bright border border-brand-black'
              : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
          ]"
          @click="isYearlyBilling = true"
        >
          YEARLY
          <span class="ml-1 text-[10px] text-brand-teal font-bold">-20%</span>
        </button>
      </div>

      <!-- Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <!-- Card 1: Starter -->
        <div
          class="group relative flex flex-col h-full card-hybrid paper-bg p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden scroll-animate fade-up delay-100 rotate-slight-left"
        >
          <!-- Floating Number -->
          <div
            class="absolute top-5 right-5 font-script text-2xl text-brand-black/20 group-hover:text-brand-teal/50 transition-colors"
          >
            01
          </div>

          <div class="mb-6 relative z-10">
            <div class="badge-hybrid badge-hybrid-outline mb-4">
              <span class="w-2 h-2 rounded-full bg-brand-gray"></span>
              <span class="text-xs font-bold tracking-wider uppercase text-brand-gray"
                >Starter</span
              >
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-display font-bold tracking-tighter text-brand-black"
                >Free</span
              >
            </div>
            <p class="font-script text-brand-black/50 mt-2">Perfect for getting started</p>
          </div>

          <ul class="flex flex-col gap-3 mb-6 flex-grow relative z-10">
            <li
              v-for="feature in pricingPlans.starter.features"
              :key="feature.text"
              class="flex items-center gap-3 text-sm text-brand-black/70"
            >
              <div
                class="w-5 h-5 rounded-md bg-brand-bg border border-brand-black/10 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-brand-gray"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              {{ feature.text }}
            </li>
          </ul>

          <button class="btn-hybrid w-full opacity-50 cursor-not-allowed" disabled>
            Current Plan
          </button>
        </div>

        <!-- Card 2: Pro (Featured) -->
        <div
          class="group relative flex flex-col card-hybrid paper-bg p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden scroll-animate fade-up delay-200 tape-decoration tape-mint"
          style="box-shadow: 4px 4px 0px 0px #2f7a72"
        >
          <!-- Popular Badge -->
          <div
            class="absolute -top-0 left-1/2 -translate-x-1/2 badge-hybrid text-[10px] rounded-t-none"
          >
            Most Popular
          </div>

          <div class="absolute top-5 right-5 font-script text-2xl text-brand-teal">02</div>

          <div class="mb-6 mt-4">
            <div class="badge-hybrid mb-4">
              <span class="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
              <span class="text-xs font-bold tracking-wider uppercase text-brand-black"
                >Professional</span
              >
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-light text-brand-black/40">$</span>
              <span class="text-5xl font-display font-bold tracking-tighter text-brand-black">{{
                isYearlyBilling
                  ? pricingPlans.professional.yearly
                  : pricingPlans.professional.monthly
              }}</span>
            </div>
            <div class="text-xs text-brand-black/50 mt-1 flex items-center gap-2">
              {{ isYearlyBilling ? '/year' : '/month' }}
              <span
                v-if="isYearlyBilling"
                class="text-[10px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full"
              >
                SAVE 20%
              </span>
            </div>
          </div>

          <ul class="flex flex-col gap-3 mb-6 flex-grow">
            <li
              v-for="feature in pricingPlans.professional.features"
              :key="feature.text"
              class="flex items-center gap-3 text-sm"
              :class="feature.highlight ? 'text-brand-black font-medium' : 'text-brand-black/70'"
            >
              <div
                class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                :class="
                  feature.highlight
                    ? 'bg-brand-bright border border-brand-black'
                    : 'bg-brand-teal/10 border border-brand-teal/20'
                "
              >
                <svg
                  v-if="feature.icon === 'star'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="text-brand-black"
                >
                  <path
                    d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-brand-teal"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              {{ feature.text }}
            </li>
          </ul>

          <button
            class="btn-hybrid btn-hybrid-primary w-full"
            @click="handleSubscribeClick('professional')"
          >
            Subscribe Now
          </button>
        </div>

        <!-- Card 3: Business -->
        <div
          class="group relative flex flex-col h-full card-hybrid paper-bg p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden scroll-animate fade-up delay-300 rotate-slight-right corner-fold"
          style="box-shadow: 4px 4px 0px 0px #7a8cff"
        >
          <div
            class="absolute top-5 right-5 font-script text-2xl text-brand-black/20 group-hover:text-brand-purple/50 transition-colors"
          >
            03
          </div>

          <div class="mb-6 relative z-10">
            <div class="badge-hybrid badge-hybrid-outline mb-4">
              <span class="w-2 h-2 rounded-full bg-brand-purple"></span>
              <span class="text-xs font-bold tracking-wider uppercase text-brand-purple"
                >Business</span
              >
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-light text-brand-black/40">$</span>
              <span class="text-5xl font-display font-bold tracking-tighter text-brand-black">{{
                isYearlyBilling ? pricingPlans.business.yearly : pricingPlans.business.monthly
              }}</span>
            </div>
            <div class="text-xs text-brand-black/50 mt-1 flex items-center gap-2">
              {{ isYearlyBilling ? '/year' : '/month' }}
              <span
                v-if="isYearlyBilling"
                class="text-[10px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full"
              >
                SAVE 20%
              </span>
            </div>
          </div>

          <ul class="flex flex-col gap-3 mb-6 flex-grow relative z-10">
            <li
              v-for="feature in pricingPlans.business.features"
              :key="feature.text"
              class="flex items-center gap-3 text-sm"
              :class="feature.highlight ? 'text-brand-black font-medium' : 'text-brand-black/70'"
            >
              <div
                class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                :class="
                  feature.highlight
                    ? 'bg-brand-purple/20 border border-brand-purple/30'
                    : 'bg-brand-bg border border-brand-black/10'
                "
              >
                <svg
                  v-if="feature.icon === 'shield'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-brand-purple"
                >
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                  />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-brand-purple"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              {{ feature.text }}
            </li>
          </ul>

          <button
            class="btn-hybrid w-full hover:bg-brand-purple hover:text-white"
            @click="handleSubscribeClick('business')"
          >
            Subscribe Now
          </button>
        </div>
      </div>

      <!-- Lifetime Deal Card -->
      <div class="mb-10 scroll-animate fade-up delay-400">
        <div
          class="group relative bg-brand-black rounded p-6 md:p-8 border-3 border-brand-teal/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden shadow-[4px_4px_0px_0px_#2F7A72] hover:shadow-[5px_5px_0px_0px_#2F7A72]"
        >
          <!-- Background Effects -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-bright/5 pointer-events-none"
          ></div>

          <!-- Limited Time Badge -->
          <div class="absolute top-0 left-6 badge-hybrid rounded-t-none">Limited Time</div>

          <div
            class="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-8 mt-4"
          >
            <!-- Left Content -->
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="w-12 h-12 bg-brand-teal/20 rounded-2xl flex items-center justify-center border-2 border-brand-teal/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                    class="text-xl md:text-2xl font-display font-bold text-brand-bg uppercase tracking-wide"
                  >
                    Lifetime Deal
                  </h3>
                  <p class="text-brand-teal text-sm font-medium">Pay once, use forever</p>
                </div>
              </div>

              <p class="text-brand-bg/70 text-sm mb-6 max-w-xl leading-relaxed">
                Get unlimited access to all Professional features with no recurring fees. Perfect
                for freelancers, agencies, and teams who want long-term value.
              </p>

              <!-- Features Grid -->
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="feature in [
                    'Unlimited color checks',
                    'Unlimited image validation',
                    'Unlimited brand palettes',
                    'Priority support'
                  ]"
                  :key="feature"
                  class="flex items-center gap-2 text-sm text-brand-bg/90"
                >
                  <div
                    class="w-5 h-5 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      class="text-brand-bright"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  {{ feature }}
                </div>
              </div>
            </div>

            <!-- Right Pricing -->
            <div class="w-full lg:w-auto flex-shrink-0">
              <div
                class="bg-brand-card rounded-2xl p-6 border-2 border-brand-teal/20 text-center lg:min-w-[240px]"
              >
                <div class="text-brand-bg/50 text-xs font-bold tracking-wider uppercase mb-2">
                  One-time payment
                </div>
                <div class="flex items-baseline justify-center gap-2 mb-2">
                  <span class="text-brand-bg/40 text-lg line-through font-medium">$750</span>
                  <span class="text-4xl font-display font-bold text-brand-bright tracking-tight"
                    >$450</span
                  >
                </div>
                <div
                  class="text-brand-black text-xs font-bold bg-brand-bright px-3 py-1 rounded-full mb-4 inline-block"
                >
                  Save 40%
                </div>

                <button
                  class="group flex items-center justify-center gap-2 w-full bg-brand-teal text-brand-bg px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-brand-bright hover:text-brand-black transition-all border-2 border-brand-teal cursor-pointer"
                  @click="handleSubscribeClick('lifetime')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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

                <p class="text-xs text-brand-bg/40 mt-3">Limited spots available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Table Section -->
      <section class="card-hybrid paper-bg p-6 scroll-animate fade-up delay-500 rotate-slight-left">
        <div class="flex items-start gap-3 mb-6">
          <div
            class="w-10 h-10 rounded bg-brand-teal flex items-center justify-center shrink-0 border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-white"
            >
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <div class="flex-1">
            <h2
              class="text-lg font-display font-bold tracking-tight section-header-hybrid inline-block"
            >
              Compare Plans
            </h2>
            <p class="font-script text-brand-black/50 mt-0.5">See what's included in each plan</p>
          </div>
        </div>

        <div class="overflow-x-auto hide-scrollbar">
          <div
            class="min-w-[600px] grid grid-cols-4 text-sm bg-brand-bg rounded border-3 border-brand-black overflow-hidden"
          >
            <!-- Header Row -->
            <div class="p-4 border-r-2 border-b-2 border-brand-black font-bold text-brand-black/60">
              Feature
            </div>
            <div
              class="p-4 border-r-2 border-b-2 border-brand-black text-center font-bold text-brand-gray"
            >
              Starter
            </div>
            <div
              class="p-4 border-r-2 border-b-2 border-brand-black text-center font-bold text-brand-teal bg-brand-teal/5"
            >
              Pro
            </div>
            <div class="p-4 border-b-2 border-brand-black text-center font-bold text-brand-purple">
              Business
            </div>

            <!-- Feature Rows -->
            <template v-for="(feature, index) in comparisonFeatures" :key="feature.name">
              <div
                :class="[
                  'p-4 border-r-2 border-brand-black font-medium text-brand-black/80',
                  index < comparisonFeatures.length - 1 ? 'border-b-2' : ''
                ]"
              >
                {{ feature.name }}
              </div>

              <div
                :class="[
                  'p-4 border-r-2 border-brand-black text-center',
                  index < comparisonFeatures.length - 1 ? 'border-b-2' : '',
                  feature.starter === false ? 'text-brand-black/30' : 'text-brand-black/60'
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
                  class="mx-auto"
                >
                  <path d="M5 12h14" />
                </svg>
                <template v-else>{{ feature.starter }}</template>
              </div>

              <div
                :class="[
                  'p-4 border-r-2 border-brand-black text-center bg-brand-teal/5',
                  index < comparisonFeatures.length - 1 ? 'border-b-2' : '',
                  feature.pro === false ? 'text-brand-black/30' : 'font-medium text-brand-black'
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
                  class="mx-auto"
                >
                  <path d="M5 12h14" />
                </svg>
                <div
                  v-else-if="feature.pro === 'toggle'"
                  class="w-8 h-4 bg-brand-black/20 rounded-full relative mx-auto"
                >
                  <div class="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                </div>
                <template v-else>{{ feature.pro }}</template>
              </div>

              <div
                :class="[
                  'p-4 text-center',
                  index < comparisonFeatures.length - 1 ? 'border-b-2 border-brand-black' : '',
                  feature.business === true
                    ? 'text-brand-purple'
                    : feature.business === false
                      ? 'text-brand-black/30'
                      : 'text-brand-black/60'
                ]"
              >
                <svg
                  v-if="feature.business === true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  class="mx-auto text-brand-purple"
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
                  class="mx-auto"
                >
                  <path d="M5 12h14" />
                </svg>
                <template v-else>{{ feature.business }}</template>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Help Section -->
      <div
        class="mt-8 card-hybrid card-hybrid-red paper-bg p-6 flex flex-col md:flex-row items-center justify-between gap-4 scroll-animate fade-up delay-600 rotate-slight-right"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded bg-brand-bright flex items-center justify-center border-3 border-brand-black shadow-[3px_3px_0px_0px_#1A1A1A]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-brand-black"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <div>
            <h3 class="font-display font-bold text-brand-black">Still have questions?</h3>
            <p class="font-script text-brand-black/60">
              Our team is here to help you find the perfect plan.
            </p>
          </div>
        </div>
        <a href="mailto:support@stayonbrand.com" class="btn-hybrid btn-hybrid-primary">
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
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Contact Us
        </a>
      </div>
    </main>
  </div>
</template>

<style scoped>
  /* Hide scrollbar */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
