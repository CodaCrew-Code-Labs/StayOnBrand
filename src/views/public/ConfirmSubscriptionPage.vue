<template>
  <div class="min-h-screen w-full bg-brand-bg text-brand-black">
    <!-- Background Elements -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- Dot Grid -->
      <div class="absolute inset-0 bg-grid opacity-[0.12]"></div>
    </div>

    <!-- Header -->
    <header
      class="relative z-50 flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-screen-2xl mx-auto"
    >
      <RouterLink
        to="/pricing"
        class="flex items-center gap-2 text-sm font-medium text-brand-black/60 hover:text-brand-teal transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Pricing
      </RouterLink>
      <button
        class="w-8 h-8 rounded-full border border-brand-black/10 flex items-center justify-center hover:bg-brand-black hover:text-brand-bg transition-all hover:scale-105 active:scale-95"
        @click="handleClose"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m18 6-12 12" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex flex-col items-center px-4 w-full max-w-4xl mx-auto py-8">
      <!-- ==================== LIFETIME DEAL LAYOUT ==================== -->
      <template v-if="isLifetime">
        <!-- Lifetime Header -->
        <div class="text-center mb-10">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-brand-bright/20 rounded-full mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-brand-bright"
            >
              <path
                d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
              />
            </svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-display font-bold text-brand-black mb-3">
            Confirm Lifetime Access
          </h1>
          <p class="text-brand-black/60 text-lg max-w-lg mx-auto">
            You're getting <span class="font-bold text-brand-teal">lifetime access</span> to all Pro
            features. Pay once, use forever.
          </p>
        </div>

        <!-- User Info Card -->
        <div class="w-full max-w-lg mx-auto mb-8">
          <div
            class="bg-white border border-brand-black/10 rounded-2xl px-6 py-4 shadow-[4px_4px_0px_0px_#79dcaf]"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-brand-bright rounded-full flex items-center justify-center">
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-brand-black font-bold">{{ userEmail }}</div>
                <div class="text-sm text-brand-black/60">
                  Current plan: <span class="text-brand-black font-medium">Free</span>
                  <span class="mx-2">→</span>
                  <span class="text-brand-bright font-bold">Lifetime Pro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lifetime Deal Card -->
        <div class="w-full max-w-lg mx-auto mb-8">
          <div
            class="bg-brand-black text-white rounded-3xl p-8 border border-brand-bright/30 shadow-[8px_8px_0px_0px_#79dcaf] relative overflow-hidden"
          >
            <!-- Star decoration -->
            <div class="absolute top-4 right-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-brand-bright/30"
              >
                <path
                  d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
                />
              </svg>
            </div>

            <!-- Plan Header -->
            <div class="flex items-start justify-between mb-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-brand-bright"
                  >
                    <path
                      d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
                    />
                  </svg>
                  <h3 class="text-lg font-bold tracking-tight text-brand-bright">Lifetime Deal</h3>
                </div>
                <p class="text-white/60 text-sm">Pay once, use forever</p>
              </div>
              <div class="text-right">
                <div class="text-white/40 text-sm line-through mb-1">$750</div>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-light text-white/50">$</span>
                  <span class="text-5xl font-display font-bold text-brand-bright">450</span>
                </div>
                <div
                  class="inline-block bg-brand-bright text-brand-black text-xs font-bold px-3 py-1 rounded-full mt-2"
                >
                  Save 40%
                </div>
              </div>
            </div>

            <!-- Features Grid -->
            <div class="border-t border-white/10 pt-6">
              <h4 class="text-xs font-bold tracking-wider uppercase text-white/50 mb-4">
                What's included forever
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(feature, index) in lifetimePlan.features"
                  :key="index"
                  class="flex items-center gap-3 text-sm"
                >
                  <div
                    class="w-5 h-5 rounded-full bg-brand-bright/20 flex items-center justify-center shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      class="text-brand-bright"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span class="text-white/80">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- One-time payment badge -->
            <div class="mt-6 bg-brand-teal/20 border border-brand-teal/30 rounded-xl p-4">
              <div class="flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-brand-bright"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <div class="text-center">
                  <div class="text-brand-bright font-bold text-sm">One-time payment</div>
                  <div class="text-white/50 text-xs">No recurring charges, ever</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- What you get section -->
        <div class="w-full max-w-lg mx-auto mb-8">
          <div class="bg-white border border-brand-black/10 rounded-2xl p-6">
            <h4 class="text-sm font-bold text-brand-black mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-brand-teal"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Why Lifetime?
            </h4>
            <ul class="space-y-3 text-sm text-brand-black/70">
              <li class="flex items-start gap-3">
                <span class="text-brand-teal font-bold">•</span>
                <span
                  ><strong class="text-brand-black">No subscriptions</strong> — Pay once and own it
                  forever</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-brand-teal font-bold">•</span>
                <span
                  ><strong class="text-brand-black">All future updates</strong> — Get new features
                  as we build them</span
                >
              </li>
              <li class="flex items-start gap-3">
                <span class="text-brand-teal font-bold">•</span>
                <span
                  ><strong class="text-brand-black">Priority support</strong> — Get help when you
                  need it</span
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="w-full max-w-lg mx-auto">
          <button
            class="group relative w-full bg-brand-bright text-brand-black rounded-xl py-4 px-8 font-bold text-sm uppercase tracking-wide hover:bg-brand-teal hover:text-white transition-all shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5"
            @click="handleContinue"
          >
            <div class="flex items-center justify-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
                />
              </svg>
              <span>Get Lifetime Access — $450</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            class="w-full text-center py-4 text-sm font-medium text-brand-black/50 hover:text-brand-black transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
        </div>

        <!-- License Note -->
        <div class="mt-6 text-center text-xs text-brand-black/40 max-w-md">
          <p>
            Lifetime license for personal and commercial use. Non-transferable. Subject to
            <RouterLink to="/terms" class="text-brand-teal hover:underline"
              >Terms of Service</RouterLink
            >.
          </p>
        </div>
      </template>

      <!-- ==================== SUBSCRIPTION LAYOUT (Pro/Business) ==================== -->
      <template v-else>
        <!-- Confirmation Header -->
        <div class="text-center mb-10">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-brand-teal/10 rounded-full mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-brand-teal"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h1 class="text-3xl md:text-4xl font-display font-bold text-brand-black mb-3">
            Confirm Your Subscription
          </h1>
          <p class="text-brand-black/60 text-lg max-w-md mx-auto">
            You're upgrading to <span class="font-bold text-brand-teal">{{ currentPlan.name }}</span
            >. Choose your billing cycle below.
          </p>
        </div>

        <!-- User Info Card -->
        <div class="w-full max-w-md mx-auto mb-8">
          <div
            class="bg-white border border-brand-black/10 rounded-2xl px-6 py-4 shadow-[4px_4px_0px_0px_#2F7A72]"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-white"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-brand-black font-bold">{{ userEmail }}</div>
                <div class="text-sm text-brand-black/60">
                  Current plan: <span class="text-brand-black font-medium">Free</span>
                  <span class="mx-2">→</span>
                  <span class="text-brand-teal font-bold">{{ currentPlan.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Toggle -->
        <div class="mb-8">
          <div
            class="bg-white p-1.5 rounded-full border border-brand-black/10 shadow-[4px_4px_0px_0px_#1A1A1A] inline-flex items-center gap-1"
          >
            <button
              :class="[
                'relative px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all',
                selectedBilling === 'monthly'
                  ? 'text-brand-black bg-brand-bright border border-brand-black/10'
                  : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
              ]"
              @click="selectedBilling = 'monthly'"
            >
              MONTHLY
            </button>
            <button
              :class="[
                'relative px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all',
                selectedBilling === 'yearly'
                  ? 'text-brand-black bg-brand-bright border border-brand-black/10'
                  : 'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/5'
              ]"
              @click="selectedBilling = 'yearly'"
            >
              YEARLY
              <span class="ml-1 text-[10px] text-brand-teal">(Save 20%)</span>
            </button>
          </div>
        </div>

        <!-- Selected Plan Card -->
        <div class="w-full max-w-md mx-auto mb-8">
          <div
            class="bg-brand-black text-white rounded-3xl p-8 border border-brand-teal/30 shadow-[8px_8px_0px_0px_#2F7A72]"
          >
            <!-- Plan Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xs font-bold tracking-[0.2em] uppercase text-brand-teal mb-2">
                  {{ currentPlan.name }}
                </h3>
                <p class="text-white/60 text-sm">{{ currentPlan.description }}</p>
              </div>
              <div class="text-right">
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-light text-white/50">$</span>
                  <span class="text-4xl font-display font-bold text-brand-bright">
                    {{ selectedBilling === 'yearly' ? currentPlan.yearly : currentPlan.monthly }}
                  </span>
                </div>
                <div class="text-xs text-white/50">
                  {{ selectedBilling === 'yearly' ? '/year' : '/month' }}
                </div>
              </div>
            </div>

            <!-- Features -->
            <div class="border-t border-white/10 pt-6">
              <h4 class="text-xs font-bold tracking-wider uppercase text-white/50 mb-4">
                What's included
              </h4>
              <ul class="space-y-3">
                <li
                  v-for="(feature, index) in currentPlan.features"
                  :key="index"
                  class="flex items-center gap-3 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-brand-teal shrink-0"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  <span :class="feature.highlight ? 'text-white font-medium' : 'text-white/70'">
                    {{ feature.text }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Yearly Savings Badge -->
            <div
              v-if="selectedBilling === 'yearly'"
              class="mt-6 bg-brand-teal/20 border border-brand-teal/30 rounded-xl p-4 text-center"
            >
              <div class="text-brand-bright font-bold text-sm">
                You save ${{ currentPlan.monthly * 12 - currentPlan.yearly }} per year
              </div>
              <div class="text-white/50 text-xs mt-1">
                That's
                {{ Math.round((1 - currentPlan.yearly / (currentPlan.monthly * 12)) * 100) }}% off
                the monthly price
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="w-full max-w-md mx-auto">
          <button
            class="group relative w-full bg-brand-teal text-white rounded-xl py-4 px-8 font-bold text-sm uppercase tracking-wide hover:bg-brand-bright hover:text-brand-black transition-all shadow-[4px_4px_0px_0px_#1A1A1A] hover:shadow-[2px_2px_0px_0px_#1A1A1A] hover:translate-x-0.5 hover:translate-y-0.5"
            @click="handleContinue"
          >
            <div class="flex items-center justify-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span>Continue to Payment</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            class="w-full text-center py-4 text-sm font-medium text-brand-black/50 hover:text-brand-black transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
        </div>
      </template>

      <!-- Footer Note (shared) -->
      <div class="mt-8 flex items-center gap-2 text-brand-black/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <p class="text-xs">
          Secure payment powered by <span class="font-bold text-brand-black/70">DodoPayments</span>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter, useRoute, RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  // import { tierService } from '@/services/user.service'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  // Billing cycle selection (for subscription plans)
  const selectedBilling = ref<'monthly' | 'yearly'>('yearly')

  // Get user email from auth store
  const userEmail = computed(() => authStore.user?.email || 'user@example.com')

  // Check if this is a lifetime deal
  const isLifetime = computed(() => route.query.plan === 'lifetime')

  // Lifetime plan data
  const lifetimePlan = {
    name: 'Lifetime Deal',
    price: 450,
    originalPrice: 750,
    features: [
      'Unlimited color checks',
      'Unlimited image validation',
      'Unlimited brand palettes',
      'Priority support',
      'Future updates included',
      'White-label branding'
    ]
  }

  // Subscription plan data matching the pricing page
  const plans = {
    professional: {
      name: 'Pro',
      description: 'Unlimited validation with team features',
      monthly: 5,
      yearly: 48,
      features: [
        { text: 'Unlimited color checks', highlight: true },
        { text: 'Max 3 colors per check', highlight: false },
        { text: 'Full WCAG 2.1 AA + AAA', highlight: false },
        { text: '10 brand palettes', highlight: false },
        { text: '2 Image validations per day', highlight: false },
        { text: '7-day free trial', highlight: false }
      ]
    },
    business: {
      name: 'Business',
      description: 'Custom solutions for large teams',
      monthly: 20,
      yearly: 192,
      features: [
        { text: 'Everything in Pro', highlight: true },
        { text: 'Unlimited palettes', highlight: false },
        { text: 'Max 5 colors per check', highlight: false },
        { text: 'Unlimited Image Validation', highlight: false },
        { text: 'White-label reports', highlight: false },
        { text: '30-day free trial', highlight: false }
      ]
    }
  }

  // Get current plan from route query (for subscription plans)
  const currentPlan = computed(() => {
    const planParam = route.query.plan as string
    if (planParam === 'business') {
      return plans.business
    }
    return plans.professional
  })

  const handleClose = () => {
    router.push('/pricing')
  }

  const handleContinue = async () => {
    const planType = route.query.plan || 'professional'
    let mappingKey = ''

    if (isLifetime.value) {
      mappingKey = 'lifetime'
      console.log('Selected plan key:', mappingKey)
    } else {
      // Frame the key based on plan and billing cycle
      const planName = planType === 'business' ? 'Business' : 'Professional'
      const billingCycle = selectedBilling.value === 'yearly' ? 'Yearly' : 'Monthly'
      mappingKey = `${planName}/${billingCycle}`

      // Get tier mapping from environment
      const tierMapping = JSON.parse(import.meta.env.VITE_TEST_TIER_MAPPING || '{}')
      const productId = tierMapping[mappingKey] || mappingKey

      console.log('Selected plan key:', mappingKey)
      console.log('Mapped product ID:', productId)

      try {
        // Call DodoPayments subscribe API
        const response = await fetch('http://localhost:3002/api/v1/dodopayments/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_id: productId,
            customer_email: userEmail.value
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('DodoPayments response:', data)

        // Store session ID in global variable
        if (data.session_id) {
          authStore.lastSessionId = data.session_id
          console.log('Stored session ID:', data.session_id)
        }

        // Redirect to payment URL
        if (data.session_url) {
          window.location.href = data.session_url
          return
        }
      } catch (error) {
        console.error('Failed to create subscription:', error)
        // TODO: Show error message to user
      }
    }

    // Fallback redirect
    router.push('/dashboard')
  }
</script>

<style scoped>
  /* Background Grid Pattern */
  .bg-grid {
    background-image: radial-gradient(#1a1a1a 1px, transparent 1px);
    background-size: 24px 24px;
    background-attachment: fixed;
  }

  .font-display {
    font-family: 'Montserrat', sans-serif;
  }
</style>
