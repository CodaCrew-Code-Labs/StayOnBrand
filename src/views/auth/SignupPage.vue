<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'

  // Form state
  const email = ref('')
  const password = ref('')
  const username = ref('')
  const isLoading = ref(false)

  // Animation state - check if coming from login page (skip entry animation for smooth transition)
  const isVisible = ref(false)
  const skipEntryAnimation = ref(false)

  onMounted(() => {
    // Check if navigating from login page
    const fromLogin = window.history.state?.back?.includes('/login')
    skipEntryAnimation.value = fromLogin

    // If from login, show immediately; otherwise animate in
    if (fromLogin) {
      isVisible.value = true
    } else {
      setTimeout(() => {
        isVisible.value = true
      }, 100)
    }
  })

  const handleSubmit = () => {
    isLoading.value = true
    // TODO: Implement signup logic
    setTimeout(() => {
      isLoading.value = false
    }, 1500)
  }

  const handleGoogleSignup = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/callback`
    const scope = 'openid email profile'

    console.log('Redirect URI being sent:', redirectUri)
    console.log('Client ID:', clientId)

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`

    console.log('Full Google Auth URL:', googleAuthUrl)
    window.location.href = googleAuthUrl
  }
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-teal selection:text-white bg-brand-dark overflow-x-hidden"
  >
    <!-- Ambient Background Lighting -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Top Left Glow -->
      <div
        class="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-teal/10 rounded-full blur-[120px]"
      ></div>
      <!-- Bottom Right Glow -->
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-bright/5 rounded-full blur-[100px]"
      ></div>
      <!-- Center Subtle Glow -->
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-brand-black/40 rounded-full blur-[120px]"
      ></div>

      <!-- Connecting Line -->
      <svg class="absolute w-full h-full" preserveAspectRatio="none">
        <path
          d="M200 450 C 300 450, 400 300, 800 200"
          stroke="rgba(255,255,255,0.03)"
          stroke-width="2"
          fill="none"
          class="hidden lg:block"
        />
        <path
          d="M200 450 C 300 450, 400 300, 800 200"
          stroke="url(#gradient-line)"
          stroke-width="1.5"
          fill="none"
          class="hidden lg:block noodle-path"
          stroke-linecap="round"
        />
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
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

    <!-- Main Content -->
    <main
      class="flex-grow flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 py-8 relative z-10 gap-12 lg:gap-24"
    >
      <!-- Left Column: Branding & Steps -->
      <div class="w-full lg:w-1/2 flex flex-col gap-8 lg:pr-12">
        <div class="relative" :class="{ 'animate-reveal-text': isVisible && !skipEntryAnimation }">
          <h1
            class="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-brand-bg mb-2 font-display"
          >
            Welcome to <br />
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-bright to-brand-teal inline-block relative pb-2"
            >
              Stay on Brand
              <!-- Underline decoration -->
              <svg
                class="absolute bottom-0 left-0 w-full h-3 text-brand-teal/50"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2" fill="none" />
              </svg>
            </span>
          </h1>
          <p class="text-lg text-brand-bg/60 mt-6 max-w-md leading-relaxed font-medium">
            Create your account to start validating your brand colors and ensuring accessibility
            compliance.
          </p>
        </div>

        <!-- Stepper Indicators -->
        <div class="flex items-center gap-4 mt-4 relative" :class="{ 'reveal-visible': isVisible }">
          <!-- Step 1 (Active) -->
          <div class="relative sonar-circle">
            <div
              class="w-10 h-10 rounded-full bg-brand-teal text-brand-black flex items-center justify-center font-bold text-sm z-10 relative shadow-[0_0_25px_rgba(47,122,114,0.5)]"
            >
              1
            </div>
            <span
              class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-brand-teal/60 tracking-widest"
            >
              01
            </span>
          </div>

          <!-- Spacer Dots -->
          <div class="flex gap-3">
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-colors relative group"
            >
              <span
                class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                04
              </span>
            </div>
          </div>
        </div>

        <!-- Decorative technical numbers -->
        <div class="mt-auto pt-12 hidden lg:flex gap-12 text-[10px] font-mono text-brand-bg/30">
          <div class="flex flex-col gap-1">
            <span class="text-brand-teal">REF:</span>
            <span>8921-X</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-brand-bright">LATENCY:</span>
            <span>12ms</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-brand-red">SECURE:</span>
            <span>TLS 1.3</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Sign Up Card -->
      <div
        class="w-full lg:w-[480px] relative group"
        :class="{ 'animate-reveal-card': isVisible && !skipEntryAnimation }"
      >
        <!-- Card Glow Behind -->
        <div
          class="absolute -inset-1 bg-gradient-to-tr from-brand-teal via-brand-bright to-brand-teal rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"
        ></div>

        <div class="relative bg-brand-bg rounded-2xl p-8 md:p-10 shadow-2xl text-brand-black">
          <!-- Decorative Top Detail -->
          <div class="absolute top-4 right-4 flex gap-1">
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
            <div class="w-1 h-1 bg-brand-black/20 rounded-full"></div>
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Email -->
            <div class="space-y-1.5">
              <label
                for="email"
                class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
              >
                E-mail address
              </label>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <input
                  id="email"
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
              <label
                for="password"
                class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
              >
                Password
              </label>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm font-medium placeholder:text-brand-black/30 bg-transparent"
                  placeholder="At least 8 characters"
                  required
                  minlength="8"
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

            <!-- Username -->
            <div class="space-y-1.5">
              <label
                for="username"
                class="block text-xs font-bold text-brand-black/50 uppercase tracking-wide"
              >
                Username
              </label>
              <div
                class="relative custom-input rounded-lg border border-brand-black/10 transition-colors bg-white"
              >
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg outline-none text-sm font-medium placeholder:text-brand-black/30 bg-transparent"
                  placeholder="Choose a username"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <!-- Sign Up Button -->
            <div class="pt-2 border-beam-container rounded-full">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-brand-black hover:bg-brand-dark text-brand-bg font-bold py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 btn-beam relative z-10 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading">Creating account...</span>
                <template v-else>
                  Sign up
                  <svg
                    class="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform"
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
              @click="handleGoogleSignup"
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
                Already a member?
                <RouterLink to="/login" class="text-brand-black hover:underline">Log in</RouterLink>
              </div>

              <div class="text-xs font-semibold text-brand-black/60">
                Forgot your password?
                <RouterLink to="/forgot-password" class="text-brand-black hover:underline"
                  >Recover</RouterLink
                >
              </div>
            </div>
          </form>
        </div>

        <!-- Number Detail Decoration around card -->
        <div
          class="absolute -right-8 top-20 hidden xl:block text-white/10 font-mono text-xs rotate-90 origin-left"
        >
          02 // ENCRYPTION
        </div>
        <div
          class="absolute -left-10 bottom-20 hidden xl:block text-white/10 font-mono text-xs -rotate-90 origin-right"
        >
          03 // VERIFICATION
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
  /* --- Clip Path Reveal Animation --- */
  @keyframes reveal-right {
    0% {
      clip-path: inset(0 100% 0 0);
    }
    100% {
      clip-path: inset(0 0 0 0);
    }
  }

  @keyframes reveal-up {
    0% {
      clip-path: inset(100% 0 0 0);
      transform: translateY(20px);
    }
    100% {
      clip-path: inset(0 0 0 0);
      transform: translateY(0);
    }
  }

  .animate-reveal-text {
    animation: reveal-right 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-reveal-card {
    animation: reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
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
    border: 1px solid #2f7a72;
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
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
    z-index: 10;
    pointer-events: none;
  }

  .btn-beam:hover::before {
    left: 100%;
    transition: left 0.5s;
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
    background: linear-gradient(90deg, #2f7a72, #79dcaf, #2f7a72);
    background-size: 200% 100%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: border-animate 2s linear infinite;
  }

  .border-beam-container:hover::after {
    opacity: 1;
  }

  @keyframes border-animate {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
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
