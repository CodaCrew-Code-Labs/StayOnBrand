<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useAuthStore } from '@/stores/auth.store'
  import { userService, type Payment } from '@/services/user.service'

  // Auth store
  const authStore = useAuthStore()

  // Transaction history state
  const payments = ref<Payment[]>([])
  const isLoadingPayments = ref(false)

  // Fetch payments when transactions section is active
  const fetchPayments = async () => {
    if (!authStore.email) return
    isLoadingPayments.value = true
    try {
      const response = await userService.getPayments(authStore.email)
      payments.value = response.payments
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      isLoadingPayments.value = false
    }
  }

  // Format member since date
  const formattedMemberSince = computed(() => {
    if (!authStore.memberSince) return 'N/A'
    const date = new Date(authStore.memberSince)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  })

  // Format tier expiry date
  const formattedTierExpiry = computed(() => {
    if (!authStore.tierExpiresAt) return 'N/A'
    const date = new Date(authStore.tierExpiresAt)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  })

  // Format subscription status for display
  const subscriptionStatusDisplay = computed(() => {
    const status = authStore.subscriptionStatus
    if (!status)
      return { label: 'No Subscription', color: 'bg-gray-200 text-gray-600 border-gray-300' }

    const statusMap: Record<string, { label: string; color: string }> = {
      ACTIVE: { label: 'Active', color: 'bg-brand-bright/30 text-brand-teal border-brand-teal/30' },
      ON_HOLD: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      FAILED: { label: 'Failed', color: 'bg-red-100 text-red-600 border-red-300' },
      CANCELLED: { label: 'Cancelled', color: 'bg-gray-200 text-gray-600 border-gray-300' },
      EXPIRED: { label: 'Expired', color: 'bg-red-100 text-red-600 border-red-300' },
      GRACE: { label: 'Grace Period', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' }
    }

    return (
      statusMap[status] || { label: status, color: 'bg-gray-200 text-gray-600 border-gray-300' }
    )
  })

  // Format active length for display
  const formattedActiveLength = computed(() => {
    const length = authStore.activeLength
    if (!length) return 'N/A'
    return length.charAt(0).toUpperCase() + length.slice(1).toLowerCase()
  })

  // Active section
  const activeSection = ref('general')

  // Watch for section changes to fetch payments
  watch(activeSection, newSection => {
    if (newSection === 'transactions' && payments.value.length === 0) {
      fetchPayments()
    }
  })

  // Format payment date
  const formatPaymentDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Format amount from cents
  const formatAmount = (amountCents: number, currency: string) => {
    const amount = amountCents / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Get status badge styling
  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      COMPLETED: 'bg-brand-bright/40 border-brand-black',
      PENDING: 'bg-yellow-100 border-yellow-600',
      FAILED: 'bg-red-100 border-red-600',
      REFUNDED: 'bg-gray-200 border-gray-600'
    }
    return styles[status] || 'bg-gray-200 border-gray-600'
  }

  // Get tier badge styling
  const getTierStyle = (tier: string) => {
    const styles: Record<string, string> = {
      STARTER: 'bg-gray-100 text-gray-700',
      PROFESSIONAL: 'bg-brand-teal/20 text-brand-teal',
      ENTERPRISE: 'bg-brand-red/20 text-brand-red'
    }
    return styles[tier] || 'bg-gray-100 text-gray-700'
  }

  // Download invoice (placeholder - implement actual download logic)
  const downloadInvoice = (payment: Payment) => {
    // TODO: Implement actual invoice download
    console.log('Downloading invoice for payment:', payment.id)
    alert(`Invoice download for payment ${payment.dodoPaymentId} - Feature coming soon!`)
  }

  // Navigation sections
  const sections = [
    {
      id: 'general',
      name: 'General',
      number: '01',
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
    },
    {
      id: 'referrals',
      name: 'Referrals',
      number: '02',
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      id: 'transactions',
      name: 'Transaction History',
      number: '03',
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`
    },
    {
      id: 'password',
      name: 'Password',
      number: '04',
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
    },
    {
      id: 'payment',
      name: 'Payment Methods',
      number: '05',
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
    },
    {
      id: 'invite',
      name: 'Invite Your Friends',
      number: '06',
      icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
    }
  ]
</script>

<template>
  <div class="w-full">
    <!-- Page Header -->
    <div class="mb-8 relative">
      <div class="inline-block">
        <h1
          class="text-3xl md:text-4xl font-display font-bold text-brand-black tracking-tight section-header-hybrid"
        >
          Profile
        </h1>
      </div>
      <p class="mt-4 text-brand-black/60 font-script text-xl">
        Manage your account settings and preferences
      </p>
    </div>

    <!-- Main Grid with Sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Sidebar Navigation -->
      <aside class="lg:col-span-4">
        <nav class="space-y-2">
          <button
            v-for="section in sections"
            :key="section.id"
            :class="[
              'w-full group flex items-center gap-3 p-3 text-left relative transition-all duration-200',
              activeSection === section.id ? 'nav-item-hybrid-active' : 'nav-item-hybrid'
            ]"
            @click="activeSection = section.id"
          >
            <!-- Tape decoration for active item -->
            <div
              v-if="activeSection === section.id"
              class="absolute -top-2 left-6 w-10 h-4 bg-brand-bright/70 border border-brand-black transform -rotate-3 z-10"
            ></div>

            <!-- Hand-written number -->
            <div
              :class="[
                'w-8 text-center font-script text-xl shrink-0 transition-colors',
                activeSection === section.id
                  ? 'text-brand-black'
                  : 'text-brand-black/30 group-hover:text-brand-black/50'
              ]"
            >
              {{ section.number }}
            </div>

            <!-- Icon container -->
            <div
              :class="[
                'w-9 h-9 flex items-center justify-center shrink-0 transition-all duration-200 border-2 rounded',
                activeSection === section.id
                  ? 'bg-brand-black text-brand-bg border-brand-black'
                  : 'bg-brand-bg border-brand-black/20 text-brand-black group-hover:bg-brand-black group-hover:text-brand-bg group-hover:border-brand-black'
              ]"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="section.icon"></span>
            </div>

            <!-- Section name -->
            <div class="flex-1">
              <div
                :class="[
                  'font-semibold text-sm tracking-tight',
                  activeSection === section.id ? 'text-brand-black' : 'text-brand-black/70'
                ]"
              >
                {{ section.name }}
              </div>
            </div>

            <!-- Arrow indicator -->
            <svg
              :class="[
                'w-5 h-5 transition-all duration-200 shrink-0',
                activeSection === section.id
                  ? 'text-brand-black opacity-100'
                  : 'text-brand-black/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              ]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <section class="lg:col-span-8">
        <!-- General Section -->
        <div v-if="activeSection === 'general'">
          <!-- Profile Card -->
          <div
            class="card-hybrid paper-bg p-6 md:p-8 mb-8 rotate-slight-left tape-decoration corner-fold"
          >
            <!-- User Header -->
            <div
              class="flex items-start gap-5 mb-6 pb-6 border-b-2 border-dashed border-brand-black/15"
            >
              <!-- Avatar with sketchy circle -->
              <div class="relative shrink-0 sketchy-circle">
                <div
                  class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-brand-teal to-brand-bright flex items-center justify-center border-3 border-brand-black rounded"
                >
                  <span class="text-2xl md:text-3xl font-display font-bold text-white">
                    {{ (authStore.username || 'U')[0].toUpperCase() }}
                  </span>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <span class="font-script text-lg text-brand-black/50 block">hello, I'm</span>
                <h2
                  class="text-xl md:text-2xl font-display font-bold text-brand-black truncate -mt-1"
                >
                  {{ authStore.username || 'User' }}
                </h2>
                <div class="flex flex-wrap items-center gap-3 mt-3">
                  <!-- Status badge -->
                  <span class="badge-hybrid">
                    <svg
                      class="w-4 h-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    >
                      <path d="M3 8 L6 11 L13 4" />
                    </svg>
                    {{ subscriptionStatusDisplay.label }}
                  </span>
                  <span class="text-brand-black/50 font-script text-lg">
                    since {{ formattedMemberSince }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Email -->
              <div class="space-y-2">
                <label class="block font-script text-lg text-brand-black/60"> Email Address </label>
                <div class="input-hybrid flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-brand-red shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span class="text-brand-black font-medium truncate">{{
                    authStore.email || 'N/A'
                  }}</span>
                </div>
              </div>

              <!-- Active Tier -->
              <div class="space-y-2">
                <label class="block font-script text-lg text-brand-black/60"> Active Tier </label>
                <div class="input-hybrid flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-brand-bright shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M12 2 L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"
                    />
                  </svg>
                  <span class="text-brand-black font-medium">{{
                    authStore.currentTier || 'N/A'
                  }}</span>
                </div>
              </div>

              <!-- Payment Frequency -->
              <div class="space-y-2">
                <label class="block font-script text-lg text-brand-black/60">
                  Payment Frequency
                </label>
                <div class="input-hybrid flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-brand-red shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span class="text-brand-black font-medium">{{ formattedActiveLength }}</span>
                </div>
              </div>

              <!-- Tier Expiry Date -->
              <div class="space-y-2">
                <label class="block font-script text-lg text-brand-black/60">
                  Tier Expiry Date
                </label>
                <div class="input-hybrid flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-brand-teal shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span class="text-brand-black font-medium">{{ formattedTierExpiry }}</span>
                </div>
              </div>
            </div>

            <!-- Doodle decoration -->
            <svg
              class="doodle-corner"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M8 24 Q16 8, 24 20" stroke-linecap="round" />
              <circle cx="24" cy="20" r="2" fill="currentColor" />
            </svg>
          </div>

          <!-- Account Stats Card -->
          <div class="card-hybrid card-hybrid-red paper-bg p-6 md:p-8 rotate-slight-right relative">
            <!-- Pin decoration -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <div class="w-4 h-4 bg-brand-red border-2 border-brand-black rounded-full"></div>
              <div class="w-0.5 h-4 bg-brand-black mx-auto -mt-0.5"></div>
            </div>

            <h3 class="text-lg font-display font-bold text-brand-black mb-1 inline-block">
              Account Overview
            </h3>
            <span class="font-script text-lg text-brand-black/50 ml-2">your stats</span>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <!-- Stories Created - Highlighted -->
              <div class="stat-hybrid-highlight rotate-slight-left">
                <div class="relative inline-block">
                  <p class="text-3xl font-bold text-brand-black font-display marker-subtle">12</p>
                </div>
                <p class="font-script text-lg text-brand-black/60 mt-1">Stories</p>
              </div>

              <!-- Reports Generated -->
              <div class="stat-hybrid rotate-slight-right">
                <p class="text-3xl font-bold text-brand-black font-display">48</p>
                <p class="font-script text-lg text-brand-black/60 mt-1">Reports</p>
              </div>

              <!-- Pages Analyzed -->
              <div class="stat-hybrid rotate-slight-left">
                <p class="text-3xl font-bold text-brand-black font-display">156</p>
                <p class="font-script text-lg text-brand-black/60 mt-1">Pages</p>
              </div>

              <!-- Current Plan -->
              <div class="stat-hybrid-highlight bg-brand-teal! text-white rotate-slight-right">
                <p class="text-3xl font-bold font-display">Pro</p>
                <p class="font-script text-lg text-white/80 mt-1">Plan</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Referrals Section -->
        <div v-else-if="activeSection === 'referrals'">
          <div
            class="card-hybrid paper-bg p-6 md:p-8 rotate-slight-right tape-decoration tape-mint"
          >
            <h3 class="text-xl font-display font-bold text-brand-black mb-1 inline-block">
              Referrals
            </h3>
            <span class="font-script text-lg text-brand-black/50 ml-2">share the love</span>
            <p class="text-brand-black/60 mb-6 font-script text-lg">
              Earn rewards by referring friends to Stay On Brand
            </p>

            <div class="empty-state-hybrid">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-brand-black/20"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="32" cy="32" r="28" stroke-dasharray="8 4" />
                <path d="M20 32 Q32 20, 44 32 Q32 44, 20 32" />
              </svg>
              <p class="text-brand-black/50 font-display font-bold text-lg">Coming soon</p>
              <p class="font-script text-xl text-brand-black/40 mt-1">stay tuned!</p>
            </div>
          </div>
        </div>

        <!-- Transaction History Section -->
        <div v-else-if="activeSection === 'transactions'">
          <div class="card-hybrid paper-bg p-6 md:p-8 rotate-slight-left tape-decoration">
            <h3 class="text-xl font-display font-bold text-brand-black mb-1 inline-block">
              Transaction History
            </h3>
            <span class="font-script text-lg text-brand-black/50 ml-2">your receipts</span>
            <p class="text-brand-black/60 mb-6 font-script text-lg">
              View your billing history and invoices
            </p>

            <!-- Loading State -->
            <div v-if="isLoadingPayments" class="table-hybrid">
              <div class="table-hybrid-header">
                <div class="grid grid-cols-6 gap-4">
                  <div v-for="i in 6" :key="i" class="h-4 skeleton-hybrid"></div>
                </div>
              </div>
              <div>
                <div v-for="row in 5" :key="row" class="table-hybrid-row">
                  <div class="grid grid-cols-6 gap-4 items-center">
                    <div
                      v-for="col in 6"
                      :key="col"
                      class="h-4 skeleton-hybrid"
                      :style="{ animationDelay: `${(row * 6 + col) * 50}ms` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="payments.length === 0" class="empty-state-hybrid">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-brand-teal/40"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <rect x="8" y="8" width="48" height="48" rx="4" stroke-dasharray="6 4" />
                <path d="M20 32 L28 40 L44 24" />
              </svg>
              <p class="text-brand-black/50 font-display font-bold">No transactions yet</p>
              <p class="font-script text-xl text-brand-black/40 mt-1">
                Your payment history will appear here
              </p>
            </div>

            <!-- Transactions Table -->
            <div v-else class="table-hybrid">
              <!-- Table Header -->
              <div class="table-hybrid-header hidden md:block">
                <div class="grid grid-cols-6 gap-4 font-script text-base text-brand-black/60">
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Currency</div>
                  <div>Tier</div>
                  <div>Status</div>
                  <div class="text-center">Invoice</div>
                </div>
              </div>

              <!-- Table Body -->
              <div>
                <div
                  v-for="(payment, index) in payments"
                  :key="payment.id"
                  class="table-hybrid-row animate-[fadeSlideIn_0.4s_ease-out_forwards] opacity-0"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <!-- Desktop View -->
                  <div class="hidden md:grid grid-cols-6 gap-4 items-center">
                    <div class="text-sm font-medium text-brand-black">
                      {{ formatPaymentDate(payment.paidAt) }}
                    </div>
                    <div class="text-sm font-bold text-brand-black font-display">
                      {{ formatAmount(payment.amountCents, payment.currency) }}
                    </div>
                    <div class="text-sm text-brand-black/70 font-script text-lg">
                      {{ payment.currency }}
                    </div>
                    <div>
                      <span
                        :class="[
                          'inline-flex px-2.5 py-1 text-xs font-bold capitalize border-2 rounded',
                          getTierStyle(payment.tier)
                        ]"
                      >
                        {{ payment.tier.toLowerCase() }}
                      </span>
                    </div>
                    <div>
                      <span :class="['badge-hybrid text-xs', getStatusStyle(payment.status)]">
                        <svg
                          v-if="payment.status === 'COMPLETED'"
                          class="w-3.5 h-3.5"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                        >
                          <path d="M2 7 L5 10 L12 3" />
                        </svg>
                        {{ payment.status.toLowerCase() }}
                      </span>
                    </div>
                    <div class="text-center">
                      <button
                        class="icon-btn-hybrid"
                        title="Download Invoice"
                        @click="downloadInvoice(payment)"
                      >
                        <svg
                          class="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Mobile View -->
                  <div class="md:hidden space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-brand-black">
                        {{ formatPaymentDate(payment.paidAt) }}
                      </span>
                      <span :class="['badge-hybrid text-xs', getStatusStyle(payment.status)]">
                        {{ payment.status.toLowerCase() }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="text-xl font-bold text-brand-black font-display">
                          {{ formatAmount(payment.amountCents, payment.currency) }}
                        </span>
                        <span class="font-script text-lg text-brand-black/50 ml-1">{{
                          payment.currency
                        }}</span>
                      </div>
                      <span
                        :class="[
                          'inline-flex px-2.5 py-1 text-xs font-bold capitalize border-2 rounded',
                          getTierStyle(payment.tier)
                        ]"
                      >
                        {{ payment.tier.toLowerCase() }}
                      </span>
                    </div>
                    <button
                      class="btn-hybrid btn-hybrid-sm w-full"
                      @click="downloadInvoice(payment)"
                    >
                      <svg
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Password Section -->
        <div v-else-if="activeSection === 'password'">
          <div
            class="card-hybrid card-hybrid-red paper-bg p-6 md:p-8 rotate-slight-right tape-decoration tape-red"
          >
            <h3 class="text-xl font-display font-bold text-brand-black mb-1 inline-block">
              Password
            </h3>
            <span class="font-script text-lg text-brand-black/50 ml-2">keep it secret</span>
            <p class="text-brand-black/60 mb-6 font-script text-lg">
              Update your password and security settings
            </p>

            <div class="empty-state-hybrid">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-brand-red/30"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <rect x="12" y="28" width="40" height="28" rx="4" stroke-dasharray="6 4" />
                <path d="M20 28 L20 20 Q20 8, 32 8 Q44 8, 44 20 L44 28" />
                <circle cx="32" cy="42" r="4" />
                <line x1="32" y1="46" x2="32" y2="50" />
              </svg>
              <p class="text-brand-black/50 font-display font-bold text-lg">Coming soon</p>
              <p class="font-script text-xl text-brand-black/40 mt-1">enhanced security!</p>
            </div>
          </div>
        </div>

        <!-- Payment Methods Section -->
        <div v-else-if="activeSection === 'payment'">
          <div
            class="card-hybrid paper-bg p-6 md:p-8 rotate-slight-left tape-decoration tape-mint corner-fold"
          >
            <h3 class="text-xl font-display font-bold text-brand-black mb-1 inline-block">
              Payment Methods
            </h3>
            <span class="font-script text-lg text-brand-black/50 ml-2">your cards</span>
            <p class="text-brand-black/60 mb-6 font-script text-lg">
              Manage your payment methods and billing info
            </p>

            <div class="empty-state-hybrid">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-brand-teal/30"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <rect x="6" y="16" width="52" height="32" rx="4" stroke-dasharray="6 4" />
                <line x1="6" y1="28" x2="58" y2="28" />
                <rect x="12" y="36" width="16" height="6" rx="1" opacity="0.5" />
              </svg>
              <p class="text-brand-black/50 font-display font-bold text-lg">Coming soon</p>
              <p class="font-script text-xl text-brand-black/40 mt-1">manage your payments!</p>
            </div>
          </div>
        </div>

        <!-- Invite Friends Section -->
        <div v-else-if="activeSection === 'invite'">
          <div class="card-hybrid paper-bg p-6 md:p-8 rotate-slight-right tape-decoration relative">
            <!-- Pin decoration -->
            <div class="absolute -top-3 left-1/3 z-10">
              <div class="w-4 h-4 bg-brand-teal border-2 border-brand-black rounded-full"></div>
              <div class="w-0.5 h-4 bg-brand-black mx-auto -mt-0.5"></div>
            </div>

            <h3 class="text-xl font-display font-bold text-brand-black mb-1 inline-block">
              Invite Your Friends
            </h3>
            <span class="font-script text-lg text-brand-black/50 ml-2">spread the word</span>
            <p class="text-brand-black/60 mb-6 font-script text-lg">
              Share Stay On Brand with your colleagues
            </p>

            <div class="empty-state-hybrid">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-brand-black/20"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <rect x="8" y="12" width="48" height="40" rx="4" stroke-dasharray="6 4" />
                <path d="M8 20 L32 36 L56 20" />
                <circle cx="48" cy="16" r="8" fill="#79dcaf" stroke="#1a1a1a" stroke-width="2" />
                <path d="M48 12 L48 20 M44 16 L52 16" stroke="#1a1a1a" stroke-width="2" />
              </svg>
              <p class="text-brand-black/50 font-display font-bold text-lg">Coming soon</p>
              <p class="font-script text-xl text-brand-black/40 mt-1">invite your team!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
