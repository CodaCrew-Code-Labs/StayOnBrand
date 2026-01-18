<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'

  const authStore = useAuthStore()

  // Check if app is launched
  const isLaunched = import.meta.env.VITE_LAUNCHED === 'true'

  // Home link - dashboard for logged in users when launched, otherwise always root
  const homeLink = computed(() => (isLaunched && authStore.isAuthenticated ? '/dashboard' : '/'))

  // Animation state
  const isVisible = ref(false)

  onMounted(() => {
    setTimeout(() => {
      isVisible.value = true
    }, 100)
  })
</script>

<template>
  <div
    class="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-teal selection:text-white overflow-hidden relative flex flex-col"
  >
    <!-- Background Decoration -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.08] bg-grid z-0"></div>

    <!-- Decorative Noodle SVGs -->
    <svg class="fixed inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
      <path
        d="M100 100 Q 200 300 150 500"
        stroke="#2F7A72"
        stroke-width="1.5"
        fill="none"
        class="noodle-path opacity-20"
      />
      <path
        d="M900 50 Q 800 250 850 450"
        stroke="#C92216"
        stroke-width="1.5"
        fill="none"
        class="noodle-path opacity-20"
        style="animation-delay: 0.5s"
      />
    </svg>

    <!-- Navigation -->
    <nav class="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <RouterLink :to="homeLink" class="flex items-center gap-2 group">
        <div
          class="w-8 h-8 bg-brand-black rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 border-2 border-brand-black"
        >
          <span class="font-display font-bold text-sm text-brand-bright">S.</span>
        </div>
        <span
          class="text-xl font-bold tracking-tight text-brand-black group-hover:text-brand-teal transition-colors"
        >
          Stay on Brand
        </span>
      </RouterLink>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow flex w-full z-10 pt-8 px-4 pb-12 relative items-center justify-center">
      <!-- Error Card Container -->
      <div class="relative w-full max-w-3xl mx-auto">
        <!-- Main Error Card -->
        <div
          class="card-hybrid paper-bg p-8 md:p-16 text-center rotate-slight-left tape-decoration overflow-hidden"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-4': !isVisible }"
          style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        >
          <!-- Decorative Number -->
          <div class="absolute top-5 right-5 font-script text-4xl text-brand-black/10">404</div>

          <!-- Error Badge -->
          <div class="flex justify-center mb-6">
            <div class="badge-hybrid bg-brand-red/10">
              <span class="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
              <span class="text-xs font-bold text-brand-red uppercase tracking-wider"
                >Page Not Found</span
              >
            </div>
          </div>

          <!-- Script Header -->
          <span class="font-script text-2xl text-brand-teal -rotate-3 inline-block mb-4"
            >#Oops</span
          >

          <!-- Main Headline -->
          <h1
            class="text-4xl md:text-6xl font-display font-bold text-brand-black tracking-tight mb-4"
          >
            Well, this is
            <span class="text-brand-red italic font-script font-normal relative inline-block">
              awkward...
              <svg
                class="absolute -bottom-1 left-0 w-full h-3 text-brand-bright"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="3" fill="none" />
              </svg>
            </span>
          </h1>

          <!-- Kaomoji -->
          <div class="text-5xl md:text-7xl text-brand-teal font-mono font-bold my-8 animate-float">
            ¯\_(ツ)_/¯
          </div>

          <p class="text-brand-black/60 max-w-md mx-auto mb-10 text-lg font-medium leading-relaxed">
            The page you are looking for has drifted into the digital void or never existed in this
            timeline.
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RouterLink :to="homeLink" class="btn-hybrid btn-hybrid-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return Home
            </RouterLink>

            <RouterLink v-if="isLaunched" to="/help" class="btn-hybrid">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Help & FAQ
            </RouterLink>
          </div>
        </div>

        <!-- Decorative Side Cards -->
        <div class="absolute -right-8 md:-right-16 top-1/4 hidden lg:block animate-float-delayed">
          <div class="card-hybrid p-4 rotate-12">
            <div
              class="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center border-2 border-brand-red/30"
            >
              <svg
                class="w-6 h-6 text-brand-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="absolute -left-8 md:-left-16 bottom-1/4 hidden lg:block animate-float-slow">
          <div class="card-hybrid p-4 -rotate-12">
            <div
              class="w-12 h-12 bg-brand-teal/20 rounded-lg flex items-center justify-center border-2 border-brand-teal/30"
            >
              <svg
                class="w-6 h-6 text-brand-teal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-8 border-t-3 border-brand-black/10 relative z-10 bg-brand-bg">
      <div
        class="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div class="badge-hybrid">
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
          </span>
          <span class="text-xs font-medium">All systems operational</span>
        </div>

        <!-- Quick Links (only shown when launched) -->
        <div v-if="isLaunched" class="flex items-center gap-6 text-brand-black/50 text-xs">
          <RouterLink
            to="/terms"
            class="hover:text-brand-black transition-colors underline decoration-dashed underline-offset-2"
            >Terms</RouterLink
          >
          <RouterLink
            to="/privacy"
            class="hover:text-brand-black transition-colors underline decoration-dashed underline-offset-2"
            >Privacy</RouterLink
          >
          <RouterLink
            to="/help"
            class="hover:text-brand-black transition-colors underline decoration-dashed underline-offset-2"
            >Help</RouterLink
          >
        </div>

        <p class="font-script text-base text-brand-black/50">
          &copy; {{ new Date().getFullYear() }} Stay on Brand.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  /* Noodle Path Animation */
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
</style>
