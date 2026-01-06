<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { RouterLink } from 'vue-router'

  // Form state
  const newPassword = ref('')
  const confirmPassword = ref('')
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const showNewPassword = ref(false)
  const showConfirmPassword = ref(false)

  // Animation state
  const isVisible = ref(false)

  // Password validation
  const passwordsMatch = computed(() => {
    return newPassword.value === confirmPassword.value
  })

  const passwordStrength = computed(() => {
    const password = newPassword.value
    if (!password) return { level: 0, text: '', color: '' }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: strength, text: 'Weak', color: 'bg-brand-red' }
    if (strength <= 3) return { level: strength, text: 'Medium', color: 'bg-yellow-500' }
    return { level: strength, text: 'Strong', color: 'bg-brand-bright' }
  })

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

  const handleSubmit = () => {
    if (!newPassword.value || !confirmPassword.value || !passwordsMatch.value) return
    isLoading.value = true
    // TODO: Implement reset password logic
    setTimeout(() => {
      isLoading.value = false
      isSuccess.value = true
    }, 1500)
  }
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-teal selection:text-white bg-brand-bg text-brand-black overflow-x-hidden"
  >
    <!-- Background Grid -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid opacity-30"></div>
      <!-- Diagonal Lines -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute top-0 left-1/4 w-px h-full bg-brand-black/5 transform -rotate-12 origin-top"
        ></div>
        <div
          class="absolute top-0 right-1/4 w-px h-full bg-brand-black/5 transform rotate-12 origin-top"
        ></div>
      </div>
    </div>

    <!-- Decorative SVG Elements -->
    <svg
      class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Curved line top -->
      <path
        d="M 0 300 Q 400 200, 800 350 T 1600 300"
        fill="none"
        stroke="#2F7A72"
        stroke-width="2"
        class="opacity-30 dash-draw reveal-element hidden lg:block"
      />
      <!-- Curved line bottom -->
      <path
        d="M 0 600 Q 300 500, 600 600 T 1200 550"
        fill="none"
        stroke="#79dcaf"
        stroke-width="2"
        stroke-dasharray="6,6"
        class="opacity-30 dash-draw reveal-element hidden lg:block"
        style="transition-delay: 0.3s"
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

    <!-- Main Content - Centered Layout -->
    <main class="relative min-h-screen w-full flex items-center justify-center pt-24 pb-20 px-6">
      <div
        class="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        <!-- Left Decorative Card -->
        <div class="hidden lg:flex lg:col-span-3 justify-end reveal-element delay-200">
          <div
            class="illustration-card w-48 h-48 bg-brand-red border-2 border-brand-black rounded-2xl transform -rotate-6 shadow-hard flex flex-col items-center justify-center p-4"
          >
            <div
              class="w-16 h-16 bg-white border-2 border-brand-black rounded-full flex items-center justify-center mb-3"
            >
              <svg
                class="w-8 h-8 text-brand-black"
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
            <span class="text-white font-bold text-sm">Secure</span>
            <span class="text-white/70 text-xs mt-1">256-bit SSL</span>
          </div>
        </div>

        <!-- Center Form Section -->
        <div class="lg:col-span-6 flex flex-col items-center text-center">
          <!-- Badge -->
          <div class="reveal-element mb-6">
            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-teal border border-brand-black shadow-hard-sm"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span class="text-xs font-bold uppercase tracking-wide text-white"
                >Create New Password</span
              >
            </div>
          </div>

          <!-- Heading -->
          <h1
            class="reveal-element delay-100 text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.95] text-brand-black mb-6 relative tracking-tight"
          >
            Set a new
            <br />
            <span class="relative inline-block mt-2">
              <span
                class="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-bright to-brand-teal"
              >
                password
              </span>
            </span>
          </h1>

          <p
            class="reveal-element delay-200 text-lg text-brand-black/70 font-medium max-w-md leading-relaxed mb-8"
          >
            Choose a strong password that you haven't used before. Make it memorable but hard to
            guess.
          </p>

          <!-- Form Card -->
          <div
            v-if="!isSuccess"
            class="reveal-element delay-300 w-full max-w-md bg-white border border-brand-black rounded-2xl shadow-hard p-6 md:p-8 relative"
          >
            <!-- Decorative corner -->
            <div
              class="absolute -top-3 -right-3 w-6 h-6 bg-brand-bright border border-brand-black rounded-full shadow-hard-sm"
            ></div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
              <!-- New Password -->
              <div class="text-left">
                <label
                  class="block text-xs font-bold text-brand-black/60 uppercase tracking-wide mb-2"
                >
                  New Password
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-black/40"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="Enter new password"
                    class="w-full pl-12 pr-12 py-3.5 bg-brand-black/5 rounded-xl border border-brand-black/10 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 focus:bg-white transition-all text-brand-black placeholder:text-brand-black/40 font-medium"
                    required
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/40 hover:text-brand-black transition-colors"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <svg
                      v-if="showNewPassword"
                      class="w-5 h-5"
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
                    <svg
                      v-else
                      class="w-5 h-5"
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
                  </button>
                </div>

                <!-- Password Strength Indicator -->
                <div v-if="newPassword" class="mt-3">
                  <div class="flex items-center gap-2 mb-1.5">
                    <div
                      class="flex-1 h-1.5 bg-brand-black/10 rounded-full overflow-hidden flex gap-1"
                    >
                      <div
                        v-for="i in 5"
                        :key="i"
                        class="flex-1 rounded-full transition-all duration-300"
                        :class="
                          i <= passwordStrength.level ? passwordStrength.color : 'bg-transparent'
                        "
                      ></div>
                    </div>
                    <span
                      class="text-xs font-bold"
                      :class="passwordStrength.color.replace('bg-', 'text-')"
                    >
                      {{ passwordStrength.text }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="text-left">
                <label
                  class="block text-xs font-bold text-brand-black/60 uppercase tracking-wide mb-2"
                >
                  Confirm Password
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-black/40"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm new password"
                    class="w-full pl-12 pr-12 py-3.5 bg-brand-black/5 rounded-xl border border-brand-black/10 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 focus:bg-white transition-all text-brand-black placeholder:text-brand-black/40 font-medium"
                    :class="{
                      'border-brand-red/50 focus:border-brand-red focus:ring-brand-red/20':
                        confirmPassword && !passwordsMatch,
                      'border-brand-bright/50 focus:border-brand-bright focus:ring-brand-bright/20':
                        confirmPassword && passwordsMatch
                    }"
                    required
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-black/40 hover:text-brand-black transition-colors"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <svg
                      v-if="showConfirmPassword"
                      class="w-5 h-5"
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
                    <svg
                      v-else
                      class="w-5 h-5"
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
                  </button>
                </div>

                <!-- Match indicator -->
                <div v-if="confirmPassword" class="mt-2 flex items-center gap-2">
                  <svg
                    v-if="passwordsMatch"
                    class="w-4 h-4 text-brand-bright"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span
                    class="text-xs font-medium"
                    :class="passwordsMatch ? 'text-brand-bright' : 'text-brand-red'"
                  >
                    {{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}
                  </span>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading || !passwordsMatch || !newPassword || !confirmPassword"
                class="w-full bg-brand-black text-white py-4 rounded-xl font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
              >
                <span v-if="isLoading" class="relative z-10">Updating Password...</span>
                <template v-else>
                  <span class="relative z-10">Change Password</span>
                  <svg
                    class="relative z-10 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </template>
                <!-- Beam Animation -->
                <div
                  class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-xl"
                >
                  <div
                    class="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-beam-button"
                  ></div>
                </div>
              </button>
            </form>

            <!-- Password Requirements -->
            <div class="mt-6 pt-5 border-t border-brand-black/10">
              <p class="text-xs text-brand-black/50 font-medium mb-3">Password must contain:</p>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div
                  class="flex items-center gap-2"
                  :class="newPassword.length >= 8 ? 'text-brand-bright' : 'text-brand-black/40'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>8+ characters</span>
                </div>
                <div
                  class="flex items-center gap-2"
                  :class="/[A-Z]/.test(newPassword) ? 'text-brand-bright' : 'text-brand-black/40'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Uppercase letter</span>
                </div>
                <div
                  class="flex items-center gap-2"
                  :class="/[0-9]/.test(newPassword) ? 'text-brand-bright' : 'text-brand-black/40'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Number</span>
                </div>
                <div
                  class="flex items-center gap-2"
                  :class="
                    /[^A-Za-z0-9]/.test(newPassword) ? 'text-brand-bright' : 'text-brand-black/40'
                  "
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Special character</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Success State -->
          <div
            v-else
            class="reveal-element w-full max-w-md bg-white border border-brand-black rounded-2xl shadow-hard p-8 text-center"
          >
            <div
              class="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-bright border-2 border-brand-black flex items-center justify-center shadow-hard animate-bounce-slow"
            >
              <svg
                class="w-10 h-10 text-brand-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-brand-black mb-3">Password Updated!</h3>
            <p class="text-brand-black/60 mb-6">
              Your password has been changed successfully. You can now sign in with your new
              password.
            </p>
            <RouterLink
              to="/login"
              class="inline-flex items-center gap-2 bg-brand-black text-white px-6 py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Continue to Sign In</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </RouterLink>
          </div>
        </div>

        <!-- Right Decorative Card -->
        <div class="hidden lg:flex lg:col-span-3 justify-start reveal-element delay-300">
          <div
            class="illustration-card w-48 h-48 bg-brand-bright border-2 border-brand-black rounded-2xl transform rotate-6 shadow-hard flex flex-col items-center justify-center p-4"
          >
            <div
              class="w-16 h-16 bg-white border-2 border-brand-black rounded-full flex items-center justify-center mb-3"
            >
              <svg
                class="w-8 h-8 text-brand-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span class="text-brand-black font-bold text-sm">Protected</span>
            <span class="text-brand-black/70 text-xs mt-1">End-to-End</span>
          </div>
        </div>
      </div>

      <!-- Floating decorative elements -->
      <div class="hidden xl:block absolute bottom-20 left-20 animate-float">
        <div
          class="w-12 h-12 bg-brand-teal/20 border border-brand-teal/30 rounded-xl transform rotate-12"
        ></div>
      </div>
      <div class="hidden xl:block absolute top-40 right-20 animate-float-delayed">
        <div
          class="w-8 h-8 bg-brand-red/20 border border-brand-red/30 rounded-lg transform -rotate-12"
        ></div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full border-t border-brand-black/10 bg-white relative z-10 py-8 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></div>
          <span class="text-xs font-semibold text-brand-black/50">Secure Connection Active</span>
        </div>

        <div class="flex gap-6">
          <RouterLink
            to="/help"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors"
          >
            Help Center
          </RouterLink>
          <RouterLink
            to="/privacy"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors"
          >
            Privacy
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

  /* Hard Shadow Utilities */
  .shadow-hard {
    box-shadow: 4px 4px 0px 0px #1a1a1a;
  }

  .shadow-hard-sm {
    box-shadow: 2px 2px 0px 0px #1a1a1a;
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

  /* Noodle/Dash Draw Animation */
  .dash-draw {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw 2.5s ease-out forwards;
  }

  .dash-draw.in-view {
    animation-play-state: running;
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Button beam animation */
  @keyframes beam-button {
    0% {
      left: -100%;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      left: 200%;
      opacity: 0;
    }
  }

  .animate-beam-button {
    animation: beam-button 2s linear infinite;
  }

  /* Float animations */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(12deg);
    }
    50% {
      transform: translateY(-10px) rotate(12deg);
    }
  }

  @keyframes float-delayed {
    0%,
    100% {
      transform: translateY(0) rotate(-12deg);
    }
    50% {
      transform: translateY(-8px) rotate(-12deg);
    }
  }

  .animate-float {
    animation: float 4s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 5s ease-in-out infinite 1s;
  }

  @keyframes bounce-slow {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }

  /* Reveal visible class */
  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Illustration Card Animation */
  .illustration-card {
    transition:
      transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.4s ease;
    cursor: pointer;
  }

  .illustration-card:hover {
    transform: scale(1.05) rotate(0deg) translateY(-5px);
    box-shadow: 6px 6px 0px 0px #1a1a1a;
  }
</style>
