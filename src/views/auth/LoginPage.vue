<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink, useRouter, useRoute } from 'vue-router'
  import { AuthService } from '@/services/auth'
  import { useAuthStore } from '@/stores/auth.store'
  import { LOGO_VIEWBOX, LOGO_PATH, LOGO_TRANSFORM } from '@/constants/logo'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  // Get redirect URL from query params
  const redirectUrl = route.query.redirect as string | undefined

  // Form state
  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const isLoading = ref(false)
  const error = ref('')
  const showPassword = ref(false)
  const isPasswordTransitioning = ref(false)

  const togglePasswordVisibility = () => {
    isPasswordTransitioning.value = true
    showPassword.value = !showPassword.value
    setTimeout(() => {
      isPasswordTransitioning.value = false
    }, 400)
  }

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

  const handleSubmit = async () => {
    if (!email.value || !password.value) return

    isLoading.value = true
    error.value = ''

    try {
      const result = await AuthService.login(email.value, password.value, rememberMe.value)

      // Store auth data
      const token = result.accessToken || result.token || ''
      authStore.setToken(token)
      const userData = {
        id: result.user?.id || 'user',
        email: email.value,
        username:
          (result as { preferredUsername?: string }).preferredUsername || email.value.split('@')[0]
      }
      authStore.setUser(userData)

      // Always persist auth data to localStorage for session persistence across refreshes
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)
      localStorage.setItem('authExpiry', expiryDate.toISOString())
      localStorage.setItem('rememberMe', 'true')
      localStorage.setItem('accessToken', token)
      localStorage.setItem('userData', JSON.stringify(userData))

      // Navigate to redirect URL or dashboard
      router.push(redirectUrl || '/dashboard')
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Login failed'
    } finally {
      isLoading.value = false
    }
  }

  const handleGoogleLogin = async () => {
    try {
      error.value = ''
      const url = await AuthService.getGoogleAuthUrl()
      // Store auth flow type for callback page messaging
      sessionStorage.setItem('authFlow', 'login')
      // Store redirect URL for after authentication
      if (redirectUrl) {
        sessionStorage.setItem('authRedirect', redirectUrl)
      }
      // Force account selection by adding prompt parameter
      const finalUrl = url.includes('?')
        ? `${url}&prompt=select_account`
        : `${url}?prompt=select_account`
      window.location.href = finalUrl
    } catch (err: unknown) {
      console.error('Failed to get Google auth URL:', err)
      error.value = (err as Error).message || 'Failed to connect with Google'
    }
  }
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-teal selection:text-white bg-brand-bg overflow-x-hidden"
  >
    <!-- Background Grid Pattern -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Subtle Grid -->
      <div class="absolute inset-0 bg-grid opacity-[0.08]"></div>

      <!-- Decorative Noodle SVGs -->
      <svg class="absolute w-full h-full" preserveAspectRatio="none">
        <path
          d="M1000 450 C 900 450, 800 300, 400 200"
          stroke="#2F7A72"
          stroke-width="1.5"
          fill="none"
          class="hidden lg:block noodle-path opacity-20"
          stroke-linecap="round"
        />
        <path
          d="M100 100 Q 200 300 150 500"
          stroke="#C92216"
          stroke-width="1.5"
          fill="none"
          class="hidden lg:block noodle-path opacity-20"
          style="animation-delay: 0.5s"
        />
      </svg>
    </div>

    <!-- Navigation -->
    <nav
      class="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between"
      :class="{ 'reveal-visible': isVisible }"
    >
      <RouterLink
        :to="authStore.isAuthenticated ? '/dashboard' : '/'"
        class="cursor-pointer flex items-center gap-3"
      >
        <div class="group relative">
          <!-- Sonar Effect -->
          <div
            class="absolute inset-0 bg-brand-bright rounded-full animate-sonar group-hover:!hidden"
          ></div>
          <!-- Main Logo -->
          <div
            class="relative w-12 h-12 bg-brand-black rounded-full flex items-center justify-center text-brand-bg transition-all duration-300 hover:scale-105 border-2 border-brand-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(47,122,114,0.4)] hover:shadow-[3px_3px_0px_0px_rgba(201,34,22,0.6)]"
          >
            <svg :viewBox="LOGO_VIEWBOX" class="w-7 h-7 transition-colors" fill="currentColor">
              <path
                :d="LOGO_PATH"
                class="text-brand-bright group-hover:text-brand-bg transition-colors"
                :transform="LOGO_TRANSFORM"
              />
            </svg>
          </div>
        </div>
        <!-- Brand Name -->
        <span class="font-display font-bold text-brand-black text-lg hidden md:inline-block"
          >Stay on Brand</span
        >
      </RouterLink>
      <div class="hidden md:flex gap-2">
        <div class="badge-hybrid">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>
          <span class="text-[10px] font-mono text-brand-black/60 uppercase tracking-wider"
            >Secure Connection</span
          >
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
        <div
          class="relative card-hybrid paper-bg p-8 md:p-10 text-brand-black rotate-slight-left tape-decoration overflow-hidden"
        >
          <!-- Decorative Number -->
          <div class="absolute top-5 right-5 font-script text-3xl text-brand-black/10">01</div>

          <!-- Header -->
          <div class="mb-6">
            <h2
              class="text-2xl font-display font-bold text-brand-black section-header-hybrid inline-block"
            >
              Sign In
            </h2>
            <p class="font-script text-lg text-brand-black/50 mt-1">Welcome back!</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Email -->
            <div class="space-y-1.5">
              <label for="login-email" class="font-script text-lg text-brand-black/70">
                E-mail address
              </label>
              <div class="relative">
                <input
                  id="login-email"
                  v-model="email"
                  type="email"
                  class="input-hybrid w-full"
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
                <label for="login-password" class="font-script text-lg text-brand-black/70">
                  Password
                </label>
                <RouterLink
                  to="/forgot-password"
                  class="text-xs font-semibold text-brand-teal hover:text-brand-black transition-colors underline decoration-dashed underline-offset-2"
                >
                  Forgot password?
                </RouterLink>
              </div>
              <div class="relative">
                <div class="password-input-wrapper">
                  <input
                    id="login-password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="input-hybrid w-full pr-12"
                    :class="{ 'password-transitioning': isPasswordTransitioning }"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <!-- Toggle Password Visibility Button -->
                <button
                  type="button"
                  class="password-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-brand-black/5 transition-colors group"
                  @click="togglePasswordVisibility"
                >
                  <div class="eye-icon-container" :class="{ showing: showPassword }">
                    <!-- Eye Open Icon -->
                    <svg
                      class="eye-icon eye-open w-[18px] h-[18px] text-brand-black/40 group-hover:text-brand-teal transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <!-- Eye Closed Icon -->
                    <svg
                      class="eye-icon eye-closed w-[18px] h-[18px] text-brand-black/40 group-hover:text-brand-teal transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="rememberMe" type="checkbox" class="sr-only peer" />
                <div
                  class="w-9 h-5 bg-brand-black/10 peer-focus:outline-none rounded-md peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-black after:border-2 after:rounded-sm after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal border-2 border-brand-black"
                ></div>
              </label>
              <span class="font-script text-base text-brand-black/60">Remember me for 30 days</span>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-3 bg-brand-red/10 border-3 border-brand-red rounded-lg">
              <p class="text-sm text-brand-red font-medium">{{ error }}</p>
            </div>

            <!-- Sign In Button -->
            <div class="pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="btn-hybrid btn-hybrid-primary w-full"
                :class="{ 'opacity-70': isLoading }"
              >
                <span v-if="isLoading" class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Signing in...
                </span>
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
              <div class="flex-grow border-t-2 border-dashed border-brand-black/20"></div>
              <span class="shrink-0 mx-4 font-script text-lg text-brand-black/40">or</span>
              <div class="flex-grow border-t-2 border-dashed border-brand-black/20"></div>
            </div>

            <!-- Google Button -->
            <button type="button" class="btn-hybrid w-full" @click="handleGoogleLogin">
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
              <p class="text-xs text-brand-black/50 leading-relaxed max-w-xs mx-auto">
                By continuing, you agree to Stay on Brand's
                <RouterLink
                  to="/terms"
                  class="text-brand-teal underline decoration-dashed underline-offset-2 hover:text-brand-black"
                >
                  Terms of Service</RouterLink
                >,
                <RouterLink
                  to="/privacy"
                  class="text-brand-teal underline decoration-dashed underline-offset-2 hover:text-brand-black"
                >
                  Privacy Policy
                </RouterLink>
                and Cookie Use.
              </p>

              <div class="font-script text-lg text-brand-black/60">
                Don't have an account?
                <RouterLink
                  to="/signup"
                  class="text-brand-teal hover:text-brand-black underline decoration-wavy underline-offset-4 transition-colors"
                >
                  Sign up
                </RouterLink>
              </div>
            </div>
          </form>
        </div>

        <!-- Decorative floating elements -->
        <div class="absolute -left-12 top-20 hidden xl:block animate-float">
          <div class="w-8 h-8 rounded-full border-2 border-dashed border-brand-teal/30"></div>
        </div>
        <div class="absolute -right-8 bottom-20 hidden xl:block animate-float-delayed">
          <div class="w-6 h-6 bg-brand-bright/20 rotate-45 border-2 border-brand-bright/40"></div>
        </div>
      </div>

      <!-- Right Column: Branding & Welcome Back Text -->
      <div class="w-full lg:w-1/2 flex flex-col gap-8 lg:pl-12">
        <div
          class="relative"
          :class="{ 'animate-reveal-text-left': isVisible && !skipEntryAnimation }"
        >
          <span class="font-script text-2xl text-brand-teal -rotate-3 inline-block mb-2"
            >#WelcomeBack</span
          >
          <h1
            class="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-brand-black mb-2 font-display"
          >
            Welcome <br />
            <span class="text-brand-red inline-block relative pb-2">
              Back
              <!-- Underline decoration -->
              <svg
                class="absolute bottom-0 left-0 w-full h-3 text-brand-bright"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="3" fill="none" />
              </svg>
            </span>
          </h1>
          <p class="text-lg text-brand-black/60 mt-6 max-w-md leading-relaxed font-medium">
            Sign in to continue managing your brand colors and accessibility compliance.
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="flex flex-col gap-4 mt-4" :class="{ 'reveal-visible': isVisible }">
          <!-- Security Card -->
          <div class="card-hybrid p-4 rotate-slight-right inline-flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-brand-teal text-brand-bg flex items-center justify-center border-2 border-brand-black"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p class="font-display font-bold text-brand-black">Secure Login</p>
              <p class="font-script text-brand-black/50">Your data is encrypted</p>
            </div>
          </div>

          <!-- Quick Access Card -->
          <div class="card-hybrid p-4 rotate-slight-left inline-flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-brand-bright text-brand-black flex items-center justify-center border-2 border-brand-black"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p class="font-display font-bold text-brand-black">Quick Access</p>
              <p class="font-script text-brand-black/50">Get back to your dashboard</p>
            </div>
          </div>
        </div>

        <!-- Decorative badges -->
        <div class="mt-auto pt-12 hidden lg:flex gap-4 flex-wrap">
          <div class="badge-hybrid">
            <span class="w-2 h-2 rounded-full bg-brand-teal"></span>
            <span class="text-xs font-bold">AES-256</span>
          </div>
          <div class="badge-hybrid">
            <span class="w-2 h-2 rounded-full bg-brand-bright"></span>
            <span class="text-xs font-bold">2FA Ready</span>
          </div>
          <div class="badge-hybrid">
            <span class="w-2 h-2 rounded-full bg-brand-red"></span>
            <span class="text-xs font-bold">GDPR</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 w-full border-t-3 border-brand-black/10 bg-brand-bg mt-auto">
      <div
        class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <!-- Left Text -->
        <div
          class="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-brand-black/50 font-medium"
        >
          <span class="font-script text-base"
            >&copy; {{ new Date().getFullYear() }} Stay on Brand</span
          >
          <div class="flex gap-6">
            <RouterLink
              to="/terms"
              class="hover:text-brand-black transition-colors underline decoration-dashed underline-offset-2"
              >Terms &amp; Conditions</RouterLink
            >
            <RouterLink
              to="/privacy"
              class="hover:text-brand-black transition-colors underline decoration-dashed underline-offset-2"
              >Privacy Policy</RouterLink
            >
            <RouterLink
              to="/help"
              class="hover:text-brand-black transition-colors underline decoration-dashed underline-offset-2"
              >FAQ</RouterLink
            >
          </div>
        </div>

        <!-- Status indicator -->
        <div class="badge-hybrid">
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
          </span>
          <span class="text-xs font-medium">All systems operational</span>
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

  /* Password Visibility Toggle Styles */
  .password-input-wrapper {
    position: relative;
    overflow: hidden;
  }

  .password-transitioning {
    animation: password-morph 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes password-morph {
    0% {
      filter: blur(0px);
      opacity: 1;
    }
    30% {
      filter: blur(4px);
      opacity: 0.7;
      transform: scale(0.98);
    }
    70% {
      filter: blur(4px);
      opacity: 0.7;
      transform: scale(0.98);
    }
    100% {
      filter: blur(0px);
      opacity: 1;
      transform: scale(1);
    }
  }

  .password-toggle {
    z-index: 10;
  }

  .eye-icon-container {
    position: relative;
    width: 18px;
    height: 18px;
  }

  .eye-icon {
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Default state: eye-closed visible, eye-open hidden */
  .eye-closed {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  .eye-open {
    opacity: 0;
    transform: scale(0.5) rotate(-90deg);
  }

  /* Showing state: eye-open visible, eye-closed hidden */
  .eye-icon-container.showing .eye-open {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  .eye-icon-container.showing .eye-closed {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }

  /* Click ripple effect on toggle button */
  .password-toggle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(47, 122, 114, 0.2);
    transform: translate(-50%, -50%);
    transition:
      width 0.3s,
      height 0.3s,
      opacity 0.3s;
    opacity: 0;
  }

  .password-toggle:active::after {
    width: 40px;
    height: 40px;
    opacity: 1;
    transition:
      width 0s,
      height 0s,
      opacity 0s;
  }

  /* Sonar animation override - make it continuous */
  .animate-sonar {
    animation: sonar 1.5s ease-out infinite;
  }

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
</style>
