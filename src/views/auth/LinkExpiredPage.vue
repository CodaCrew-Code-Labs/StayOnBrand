<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'

  // Animation state
  const isVisible = ref(false)

  onMounted(() => {
    setTimeout(() => {
      isVisible.value = true
    }, 100)

    setupRevealObserver()
  })

  const setupRevealObserver = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    document.querySelectorAll('.reveal-element').forEach(el => {
      observer.observe(el)
    })
  }
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-teal selection:text-white bg-brand-bg text-brand-black overflow-x-hidden"
  >
    <!-- Background Pattern -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid opacity-30"></div>
      <!-- Radial gradient overlay -->
      <div class="absolute inset-0 bg-radial-fade"></div>
    </div>

    <!-- Decorative broken chain SVG -->
    <svg
      class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Broken chain link left -->
      <path
        d="M 200 400 Q 300 350 350 400 Q 400 450 350 500"
        fill="none"
        stroke="#E85C4A"
        stroke-width="3"
        stroke-linecap="round"
        class="dash-draw reveal-element hidden lg:block"
      />
      <!-- Broken chain link right (separated) -->
      <path
        d="M 450 380 Q 500 350 550 400 Q 600 450 650 400"
        fill="none"
        stroke="#E85C4A"
        stroke-width="3"
        stroke-linecap="round"
        class="dash-draw reveal-element hidden lg:block"
        style="transition-delay: 0.2s"
      />
      <!-- Scattered dots -->
      <circle cx="380" cy="420" r="4" fill="#E85C4A" class="animate-pulse-slow hidden lg:block" />
      <circle
        cx="420"
        cy="380"
        r="3"
        fill="#E85C4A"
        class="animate-pulse-slow hidden lg:block"
        style="animation-delay: 0.5s"
      />
      <circle
        cx="400"
        cy="450"
        r="2"
        fill="#E85C4A"
        class="animate-pulse-slow hidden lg:block"
        style="animation-delay: 1s"
      />
    </svg>

    <!-- Navigation -->
    <header class="fixed top-0 w-full z-50 px-6 pt-6 transition-all duration-300">
      <nav
        class="max-w-7xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-md border border-brand-black rounded-full px-6 py-3 shadow-hard-sm"
        :class="{ 'reveal-visible': isVisible }"
      >
        <RouterLink to="/" class="flex items-center gap-2 group cursor-pointer">
          <div
            class="w-8 h-8 flex items-center justify-center bg-brand-teal border border-brand-black rounded-full shadow-hard-sm"
          >
            <span class="font-display font-bold text-sm text-white">S.</span>
          </div>
          <span class="font-bold tracking-tight text-lg">Stay on Brand</span>
        </RouterLink>

        <RouterLink
          to="/login"
          class="hidden md:flex items-center gap-2 text-sm font-bold border border-brand-black bg-white text-brand-black px-4 py-2 rounded-full hover:bg-brand-black hover:text-brand-bg transition-all duration-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          <span>Sign In</span>
        </RouterLink>
      </nav>
    </header>

    <!-- Main Content - Vertically Centered -->
    <main class="relative flex-1 w-full flex items-center justify-center px-6 py-24">
      <div class="w-full max-w-2xl mx-auto text-center">
        <!-- Expired Icon with Animation -->
        <div class="reveal-element mb-8 relative inline-block">
          <!-- Pulsing ring behind -->
          <div
            class="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-brand-red/20 animate-ping-slow"
          ></div>

          <div
            class="relative w-32 h-32 mx-auto bg-brand-red border-2 border-brand-black rounded-full shadow-hard flex items-center justify-center"
          >
            <!-- Clock with X -->
            <div class="relative">
              <svg
                class="w-14 h-14 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <!-- X overlay -->
              <div
                class="absolute -top-1 -right-1 w-6 h-6 bg-white border border-brand-black rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-3.5 h-3.5 text-brand-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Badge -->
        <div class="reveal-element delay-100 mb-6">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/30"
          >
            <svg
              class="w-4 h-4 text-brand-red"
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
            <span class="text-xs font-bold uppercase tracking-wide text-brand-red"
              >Link Expired</span
            >
          </div>
        </div>

        <!-- Heading -->
        <h1
          class="reveal-element delay-200 text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.95] text-brand-black mb-6 relative tracking-tight"
        >
          Oops! This link
          <br />
          <span class="relative inline-block mt-2 transform rotate-1">
            <span
              class="absolute inset-0 bg-brand-red border border-brand-black shadow-hard transform -rotate-1 rounded-sm"
            ></span>
            <span class="relative px-4 z-10 text-white">has expired</span>
          </span>
        </h1>

        <p
          class="reveal-element delay-300 text-lg md:text-xl text-brand-black/70 font-medium max-w-lg mx-auto leading-relaxed mb-10"
        >
          Password reset links are only valid for 60 minutes for security reasons. Don't worry
          though — you can request a new one.
        </p>

        <!-- Action Cards -->
        <div
          class="reveal-element delay-400 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-12"
        >
          <!-- Request New Link Card -->
          <RouterLink
            to="/forgot-password"
            class="group bg-white border border-brand-black rounded-xl p-5 shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div
              class="w-12 h-12 bg-brand-teal border border-brand-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h3 class="font-bold text-brand-black mb-1">Request New Link</h3>
            <p class="text-sm text-brand-black/60">
              Get a fresh password reset link sent to your email.
            </p>
          </RouterLink>

          <!-- Back to Login Card -->
          <RouterLink
            to="/login"
            class="group bg-white border border-brand-black rounded-xl p-5 shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div
              class="w-12 h-12 bg-brand-bright border border-brand-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-brand-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h3 class="font-bold text-brand-black mb-1">Back to Login</h3>
            <p class="text-sm text-brand-black/60">
              Remember your password? Sign in to your account.
            </p>
          </RouterLink>
        </div>

        <!-- Info Banner -->
        <div class="reveal-element delay-500 max-w-lg mx-auto">
          <div
            class="bg-brand-black/5 border border-brand-black/10 rounded-xl p-4 flex items-start gap-3"
          >
            <div
              class="w-8 h-8 bg-brand-teal/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            >
              <svg
                class="w-4 h-4 text-brand-teal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-sm text-brand-black/70 font-medium">
                <span class="font-bold text-brand-black">Why do links expire?</span>
                <br />
                For your security, password reset links are time-limited to prevent unauthorized
                access to your account.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative floating elements -->
      <div class="hidden xl:block absolute top-32 left-20 animate-float">
        <div
          class="w-16 h-16 bg-brand-red/10 border border-brand-red/20 rounded-2xl transform rotate-12 flex items-center justify-center"
        >
          <svg
            class="w-6 h-6 text-brand-red/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div class="hidden xl:block absolute bottom-32 right-20 animate-float-delayed">
        <div
          class="w-12 h-12 bg-brand-teal/10 border border-brand-teal/20 rounded-xl transform -rotate-12 flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-brand-teal/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
      </div>

      <div class="hidden xl:block absolute top-1/2 right-32 animate-bounce-slow">
        <div
          class="w-8 h-8 bg-brand-bright/20 border border-brand-bright/30 rounded-lg transform rotate-45"
        ></div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full border-t border-brand-black/10 bg-white relative z-10 py-8 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></div>
          <span class="text-xs font-semibold text-brand-black/50">Security Active</span>
        </div>

        <div class="flex gap-6">
          <RouterLink
            to="/help"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors"
          >
            Help Center
          </RouterLink>
          <RouterLink
            to="/contact"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors"
          >
            Contact Support
          </RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  /* Background Grid */
  .bg-grid {
    background-image:
      linear-gradient(to right, rgba(26, 26, 26, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(26, 26, 26, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* Radial fade for focus effect */
  .bg-radial-fade {
    background: radial-gradient(ellipse at center, transparent 0%, rgba(250, 249, 246, 0.8) 70%);
  }

  /* Hard Shadow Utilities */
  .shadow-hard {
    box-shadow: 4px 4px 0px 0px #1a1a1a;
  }

  .shadow-hard-sm {
    box-shadow: 2px 2px 0px 0px #1a1a1a;
  }

  .shadow-hard-lg {
    box-shadow: 6px 6px 0px 0px #1a1a1a;
  }

  /* Reveal animations */
  .reveal-element {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(10px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal-element.in-view {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }

  .delay-100 {
    transition-delay: 100ms;
  }
  .delay-200 {
    transition-delay: 200ms;
  }
  .delay-300 {
    transition-delay: 300ms;
  }
  .delay-400 {
    transition-delay: 400ms;
  }
  .delay-500 {
    transition-delay: 500ms;
  }

  /* Dash Draw Animation */
  .dash-draw {
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: draw 2s ease-out forwards;
  }

  .dash-draw.in-view {
    animation-play-state: running;
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Ping slow animation */
  @keyframes ping-slow {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    75%,
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  /* Pulse slow animation */
  @keyframes pulse-slow {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.8;
    }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }

  /* Float animations */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(12deg);
    }
    50% {
      transform: translateY(-15px) rotate(12deg);
    }
  }

  @keyframes float-delayed {
    0%,
    100% {
      transform: translateY(0) rotate(-12deg);
    }
    50% {
      transform: translateY(-10px) rotate(-12deg);
    }
  }

  .animate-float {
    animation: float 5s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 6s ease-in-out infinite 1s;
  }

  @keyframes bounce-slow {
    0%,
    100% {
      transform: translateY(0) rotate(45deg);
    }
    50% {
      transform: translateY(-8px) rotate(45deg);
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }

  /* Reveal visible class */
  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
