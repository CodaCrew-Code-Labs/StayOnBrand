<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'

  // Form state
  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const isLoading = ref(false)

  // Animation state - check if coming from signup page (skip entry animation for smooth transition)
  const isVisible = ref(false)
  const skipEntryAnimation = ref(false)

  onMounted(() => {
    // Check if navigating from signup page
    const fromSignup = window.history.state?.back?.includes('/signup')
    skipEntryAnimation.value = fromSignup

    // If from signup, show immediately; otherwise animate in
    if (fromSignup) {
      isVisible.value = true
    } else {
      setTimeout(() => {
        isVisible.value = true
      }, 100)
    }
  })

  const handleSubmit = () => {
    isLoading.value = true
    // TODO: Implement login logic
    setTimeout(() => {
      isLoading.value = false
    }, 1500)
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
  }
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-teal selection:text-white bg-brand-dark overflow-x-hidden"
  >
    <!-- Ambient Background Lighting (Mirrored from signup) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Top Right Glow (mirrored) -->
      <div
        class="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-brand-teal/10 rounded-full blur-[120px]"
      ></div>
      <!-- Bottom Left Glow (mirrored) -->
      <div
        class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-bright/5 rounded-full blur-[100px]"
      ></div>
      <!-- Center Subtle Glow -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-brand-black/40 rounded-full blur-[120px]"
      ></div>

      <!-- Connecting Line (mirrored direction) -->
      <svg class="absolute w-full h-full" preserveAspectRatio="none">
        <path
          d="M1000 450 C 900 450, 800 300, 400 200"
          stroke="rgba(255,255,255,0.03)"
          stroke-width="2"
          fill="none"
          class="hidden lg:block"
        />
        <path
          d="M1000 450 C 900 450, 800 300, 400 200"
          stroke="url(#gradient-line-login)"
          stroke-width="1.5"
          fill="none"
          class="hidden lg:block noodle-path"
          stroke-linecap="round"
        />
        <defs>
          <linearGradient id="gradient-line-login" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#2F7A72" />
            <stop offset="50%" stop-color="#79dcaf" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Subtle Grid -->
      <div class="absolute inset-0 bg-grid-light opacity-5"></div>
    </div>

    <!-- Navigation -->
    <nav
      class="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between"
      :class="{ 'reveal-visible': isVisible }"
    >
      <RouterLink to="/" class="flex items-center gap-2 group">
        <div
          class="w-8 h-8 bg-brand-bg rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300"
        >
          <span class="font-display font-bold text-sm text-brand-black">S.</span>
        </div>
        <span
          class="text-xl font-bold tracking-tight text-brand-bg group-hover:text-brand-bright transition-colors"
        >
          Stay on Brand
        </span>
      </RouterLink>
      <div class="hidden md:flex gap-2">
        <div
          class="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-brand-bg/40 flex items-center gap-2"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>
          SECURE CONNECTION
        </div>
      </div>
    </nav>

    <!-- Main Content (Mirrored Layout: Form Left, Text Right) -->
    <main
      class="flex-grow flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 py-8 relative z-10 gap-12 lg:gap-24"
    >
      <!-- Left Column: Login Card -->
      <div
        class="w-full lg:w-[480px] relative group"
        :class="{ 'animate-reveal-card-right': isVisible && !skipEntryAnimation }"
      >
        <!-- Card Glow Behind -->
        <div
          class="absolute -inset-1 bg-gradient-to-tl from-brand-bright via-brand-teal to-brand-bright rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"
        ></div>

        <div class="relative bg-brand-bg rounded-2xl p-8 md:p-10 shadow-2xl text-brand-black">
          <!-- Decorative Top Detail -->
          <div class="absolute top-4 left-4 flex gap-1">
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Email -->
            <div class="space-y-1.5">
              <label
                for="login-email"
                class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
              >
                E-mail address
              </label>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <input
                  id="login-email"
                  v-model="email"
                  type="email"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm font-medium placeholder:text-brand-black/30 bg-transparent"
                  placeholder="name@company.com"
                  required
                />
                <svg
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40 w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <div class="flex justify-between items-center">
                <label
                  for="login-password"
                  class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
                >
                  Password
                </label>
                <RouterLink
                  to="/forgot-password"
                  class="text-[10px] font-semibold text-brand-teal hover:text-brand-black transition-colors"
                >
                  Forgot password?
                </RouterLink>
              </div>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <input
                  id="login-password"
                  v-model="password"
                  type="password"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm font-medium placeholder:text-brand-black/30 bg-transparent"
                  placeholder="Enter your password"
                  required
                />
                <svg
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40 w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="rememberMe" type="checkbox" class="sr-only peer" />
                <div
                  class="w-9 h-5 bg-brand-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal"
                ></div>
              </label>
              <span class="text-xs font-medium text-brand-black/60">Remember me for 30 days</span>
            </div>

            <!-- Sign In Button -->
            <div class="pt-2 border-beam-container rounded-full">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-brand-black hover:bg-brand-dark text-brand-bg font-bold py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 btn-beam relative z-10 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading">Signing in...</span>
                <template v-else>
                  Sign in
                  <svg
                    class="w-[18px] h-[18px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </template>
              </button>
            </div>

            <!-- Divider -->
            <div class="relative flex items-center py-2">
              <div class="flex-grow border-t border-brand-black/10"></div>
              <span class="flex-shrink-0 mx-4 text-xs text-brand-black/40 font-medium">or</span>
              <div class="flex-grow border-t border-brand-black/10"></div>
            </div>

            <!-- Google Button -->
            <button
              type="button"
              class="w-full bg-white border border-brand-black/10 text-brand-black font-bold py-3.5 rounded-full transition-all duration-300 hover:bg-brand-black/5 hover:border-brand-black/20 flex items-center justify-center gap-3 relative overflow-hidden"
              @click="handleGoogleLogin"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span class="text-sm">Continue with Google</span>
            </button>

            <!-- Footer Links -->
            <div class="text-center space-y-4 pt-2">
              <p class="text-[10px] text-brand-black/40 leading-relaxed max-w-xs mx-auto">
                By continuing, you agree to Stay on Brand's
                <RouterLink
                  to="/terms"
                  class="underline decoration-brand-black/30 hover:text-brand-black"
                >
                  Terms of Service </RouterLink
                >,
                <RouterLink
                  to="/privacy"
                  class="underline decoration-brand-black/30 hover:text-brand-black"
                >
                  Privacy Policy
                </RouterLink>
                and Cookie Use.
              </p>

              <div class="text-xs font-semibold text-brand-black/60">
                Don't have an account?
                <RouterLink
                  to="/signup"
                  class="text-brand-teal hover:text-brand-black hover:underline transition-colors"
                >
                  Sign up
                </RouterLink>
              </div>
            </div>
          </form>
        </div>

        <!-- Number Detail Decoration around card -->
        <div
          class="absolute -left-8 top-20 hidden xl:block text-white/10 font-mono text-xs -rotate-90 origin-right"
        >
          01 // AUTHENTICATION
        </div>
        <div
          class="absolute -right-10 bottom-20 hidden xl:block text-white/10 font-mono text-xs rotate-90 origin-left"
        >
          02 // SESSION
        </div>
      </div>

      <!-- Right Column: Branding & Welcome Back Text -->
      <div class="w-full lg:w-1/2 flex flex-col gap-8 lg:pl-12">
        <div
          class="relative"
          :class="{ 'animate-reveal-text-left': isVisible && !skipEntryAnimation }"
        >
          <h1
            class="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-brand-bg mb-2 font-display"
          >
            Welcome <br />
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-brand-bright via-brand-teal to-brand-bright inline-block relative pb-2"
            >
              Back
              <!-- Underline decoration -->
              <svg
                class="absolute bottom-0 left-0 w-full h-3 text-brand-bright/50"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2" fill="none" />
              </svg>
            </span>
          </h1>
          <p class="text-lg text-brand-bg/60 mt-6 max-w-md leading-relaxed font-medium">
            Sign in to continue managing your brand colors and accessibility compliance.
          </p>
        </div>

        <!-- Security Indicators -->
        <div class="flex items-center gap-4 mt-4 relative" :class="{ 'reveal-visible': isVisible }">
          <!-- Security Badge -->
          <div class="relative sonar-circle">
            <div
              class="w-10 h-10 rounded-full bg-brand-bright text-brand-black flex items-center justify-center font-bold text-sm z-10 relative shadow-[0_0_25px_rgba(121,220,175,0.5)]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span
              class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-brand-bright/60 tracking-widest"
            >
              SECURE
            </span>
          </div>

          <!-- Status Dots -->
          <div class="flex gap-3">
            <div class="w-2.5 h-2.5 rounded-full bg-brand-bright/40 animate-pulse"></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-brand-teal/40 animate-pulse"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-brand-bright/40 animate-pulse"
              style="animation-delay: 0.4s"
            ></div>
          </div>
        </div>

        <!-- Decorative technical numbers -->
        <div class="mt-auto pt-12 hidden lg:flex gap-12 text-[10px] font-mono text-brand-bg/30">
          <div class="flex flex-col gap-1">
            <span class="text-brand-bright">SESSION:</span>
            <span>ACTIVE</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-brand-teal">ENCRYPT:</span>
            <span>AES-256</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-brand-red">2FA:</span>
            <span>ENABLED</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="relative z-10 w-full border-t border-white/5 bg-brand-dark/50 backdrop-blur-sm mt-auto"
    >
      <div
        class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <!-- Left Text -->
        <div
          class="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-brand-bg/40 font-medium"
        >
          <span>&copy; {{ new Date().getFullYear() }} Stay on Brand</span>
          <div class="flex gap-6">
            <RouterLink to="/terms" class="hover:text-brand-bg transition-colors"
              >Terms &amp; Conditions</RouterLink
            >
            <RouterLink to="/privacy" class="hover:text-brand-bg transition-colors"
              >Privacy Policy</RouterLink
            >
            <RouterLink to="/help" class="hover:text-brand-bg transition-colors">FAQ</RouterLink>
          </div>
        </div>

        <!-- Status indicator -->
        <div class="flex items-center gap-2 text-brand-bg/30 text-xs font-medium">
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
          </span>
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  /* --- Clip Path Reveal Animation (Mirrored for Login) --- */
  @keyframes reveal-left {
    0% {
      clip-path: inset(0 0 0 100%);
    }
    100% {
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes reveal-up-right {
    0% {
      clip-path: inset(100% 0 0 0);
      transform: translateY(20px) translateX(-20px);
    }
    100% {
      clip-path: inset(0 0 0 0);
      transform: translateY(0) translateX(0);
    }
  }

  .animate-reveal-text-left {
    animation: reveal-left 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-reveal-card-right {
    animation: reveal-up-right 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  }

  /* --- Noodle / Line Drawing Animation --- */
  .noodle-path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* --- Sonar Animation --- */
  @keyframes sonar {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }

  .sonar-circle::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 1px solid #79dcaf;
    animation: sonar 2s infinite ease-out;
    z-index: -1;
  }

  /* --- Button Border Beam --- */
  .btn-beam {
    position: relative;
    overflow: hidden;
  }

  .btn-beam::before {
    content: '';
    position: absolute;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: right 0.5s;
    z-index: 10;
    pointer-events: none;
  }

  .btn-beam:hover::before {
    right: 100%;
    transition: right 0.5s;
  }

  /* Border Beam Container */
  .border-beam-container {
    position: relative;
  }

  .border-beam-container::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 9999px;
    background: linear-gradient(270deg, #79dcaf, #2f7a72, #79dcaf);
    background-size: 200% 100%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: border-animate-reverse 2s linear infinite;
  }

  .border-beam-container:hover::after {
    opacity: 1;
  }

  @keyframes border-animate-reverse {
    0% {
      background-position: 200% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  /* Custom Input Styling */
  .custom-input:focus-within {
    border-color: #2f7a72;
    box-shadow: 0 0 0 3px rgba(47, 122, 114, 0.1);
  }

  /* Reveal animation classes */
  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
</style>
