<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'

  // Form state
  const email = ref('')
  const isLoading = ref(false)
  const isSubmitted = ref(false)

  // Animation state
  const isVisible = ref(false)

  onMounted(() => {
    setTimeout(() => {
      isVisible.value = true
    }, 100)

    // Setup flashlight effect for cards
    setupFlashlightEffect()

    // Setup intersection observer for reveal animations
    setupRevealObserver()
  })

  const setupFlashlightEffect = () => {
    const cards = document.querySelectorAll('.flashlight-card')
    cards.forEach(card => {
      card.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = mouseEvent.clientX - rect.left
        const y = mouseEvent.clientY - rect.top
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    })
  }

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

    document.querySelectorAll('.reveal-element, .dash-draw').forEach(el => {
      observer.observe(el)
    })
  }

  const handleSubmit = () => {
    if (!email.value) return
    isLoading.value = true
    // TODO: Implement forgot password logic
    setTimeout(() => {
      isLoading.value = false
      isSubmitted.value = true
    }, 1500)
  }

  // Troubleshooting tips data
  const troubleshootingTips = [
    {
      icon: 'inbox',
      title: 'Check Spam Folder',
      description: 'Sometimes our emails like to hide in Junk or Promotions tabs.',
      color: 'bg-brand-teal/20'
    },
    {
      icon: 'timer',
      title: 'Wait 5 Minutes',
      description: 'Email delivery can occasionally be delayed by your provider.',
      color: 'bg-brand-bright/20'
    },
    {
      icon: 'lifebuoy',
      title: 'Contact Support',
      description: 'Still nothing? Our team is ready to help you manually.',
      color: 'bg-brand-red/20'
    },
    {
      icon: 'globe',
      title: 'SSO Login',
      description: "If you used Google or Apple to sign up, you don't have a password.",
      color: 'bg-brand-teal/30'
    }
  ]

  // Duplicate tips for seamless marquee
  const allTips = [...troubleshootingTips, ...troubleshootingTips]
</script>

<template>
  <div
    class="min-h-screen flex flex-col relative selection:bg-brand-teal selection:text-white bg-brand-bg text-brand-black overflow-x-hidden"
  >
    <!-- Background Grid -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid opacity-30"></div>
      <!-- Vertical Container Lines -->
      <div class="max-w-7xl mx-auto w-full h-full border-x border-brand-black/5 relative">
        <div class="absolute left-1/4 top-0 bottom-0 w-px bg-brand-black/5 hidden lg:block"></div>
        <div class="absolute right-1/4 top-0 bottom-0 w-px bg-brand-black/5 hidden lg:block"></div>
      </div>
    </div>

    <!-- Connecting Noodles (SVG Layer) -->
    <svg
      class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Line from Headline to Form -->
      <path
        d="M 30% 200 C 20% 250, 10% 400, 25% 450"
        fill="none"
        stroke="#2F7A72"
        stroke-width="2"
        class="opacity-40 dash-draw reveal-element hidden lg:block"
      />
      <!-- Line from Form to Cards -->
      <path
        d="M 40% 500 C 50% 500, 60% 300, 75% 350"
        fill="none"
        stroke="#79dcaf"
        stroke-width="2"
        stroke-dasharray="8,8"
        class="opacity-40 dash-draw reveal-element hidden lg:block"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Login</span>
        </RouterLink>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="relative min-h-screen w-full flex flex-col pt-32 pb-20 overflow-hidden">
      <!-- Hero Section -->
      <section
        class="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <!-- Left Column: Copy & Form -->
        <div class="flex flex-col items-start text-left relative">
          <!-- Badge -->
          <div class="reveal-element mb-8 relative">
            <div
              class="absolute -left-12 top-1 w-8 h-8 rounded-full border border-brand-black flex items-center justify-center text-xs font-bold bg-white shadow-hard-sm z-20 hidden xl:flex"
            >
              01
            </div>
            <div
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-bright border border-brand-black shadow-hard-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span class="text-xs font-bold uppercase tracking-wide">Secure Recovery</span>
            </div>
          </div>

          <!-- Heading -->
          <h1
            class="reveal-element delay-100 text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] text-brand-black mb-8 relative tracking-tight"
          >
            Forgot your
            <br />
            <span class="relative inline-block mt-2 transform -rotate-1">
              <span
                class="absolute inset-0 bg-brand-teal border border-brand-black shadow-hard transform rotate-1 rounded-sm"
              ></span>
              <span class="relative px-3 z-10 text-white">password ?</span>
            </span>
          </h1>

          <p
            class="reveal-element delay-200 text-lg md:text-xl text-brand-black/70 font-medium max-w-lg leading-relaxed mb-10"
          >
            Don't worry, it happens. Enter the email address associated with your account and we'll
            send you a magic link to regain access.
          </p>

          <!-- Input Form -->
          <div
            v-if="!isSubmitted"
            class="reveal-element delay-300 w-full max-w-md bg-white border border-brand-black p-2 rounded-xl shadow-hard relative group"
          >
            <form
              class="flex flex-col sm:flex-row gap-2 relative z-10"
              @submit.prevent="handleSubmit"
            >
              <div class="flex-grow relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-black/40"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="name@example.com"
                  class="w-full h-full pl-10 pr-4 py-3 bg-brand-black/5 rounded-lg border-none focus:ring-2 focus:ring-brand-teal/30 focus:bg-white transition-all text-brand-black placeholder:text-brand-black/40 font-medium"
                  required
                />
              </div>
              <button
                type="submit"
                :disabled="isLoading"
                class="bg-brand-black text-white px-6 py-3 rounded-lg font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading" class="relative z-10">Sending...</span>
                <template v-else>
                  <span class="relative z-10">Send Link</span>
                  <svg
                    class="relative z-10 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </template>
                <!-- Beam Animation -->
                <div
                  class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-lg"
                >
                  <div
                    class="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-beam-button"
                  ></div>
                </div>
              </button>
            </form>
          </div>

          <!-- Success Message -->
          <div
            v-else
            class="reveal-element w-full max-w-md bg-brand-bright/20 border border-brand-black rounded-xl p-6 text-center shadow-hard-sm"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-bright border border-brand-black flex items-center justify-center shadow-hard-sm"
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
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-brand-black mb-2">Check your inbox!</h3>
            <p class="text-brand-black/60 text-sm">
              We've sent a password reset link to
              <span class="font-semibold text-brand-teal">{{ email }}</span>
            </p>
          </div>
        </div>

        <!-- Right Column: Illustrations -->
        <div
          class="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center lg:justify-end reveal-element delay-300"
        >
          <!-- 02 Badge -->
          <div
            class="absolute right-0 top-0 w-8 h-8 rounded-full border border-brand-black flex items-center justify-center text-xs font-bold bg-white shadow-hard-sm z-20 animate-bounce hidden xl:flex"
          >
            02
          </div>

          <!-- Red Card (Back) -->
          <div
            class="illustration-card absolute top-10 right-0 w-56 lg:w-64 h-52 lg:h-60 bg-brand-red border-2 border-brand-black rounded-2xl transform rotate-6 shadow-hard flex flex-col items-center justify-center p-4 z-0"
          >
            <div
              class="w-16 lg:w-20 h-16 lg:h-20 bg-white border-2 border-brand-black rounded-full overflow-hidden mb-3 relative flex items-center justify-center"
            >
              <svg
                class="w-8 lg:w-10 h-8 lg:h-10 text-brand-black"
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
            <h3 class="font-bold text-white">Encrypted</h3>
            <div
              class="mt-2 bg-white border border-brand-black px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
            >
              End-to-End
            </div>
          </div>

          <!-- Bright Card (Front) -->
          <div
            class="illustration-card absolute top-24 lg:top-32 right-16 sm:right-24 lg:right-32 w-56 lg:w-64 h-56 lg:h-64 bg-brand-bright border-2 border-brand-black rounded-2xl transform -rotate-3 shadow-hard flex flex-col items-center justify-center p-4 z-10 group cursor-default"
          >
            <!-- Sonar effect behind icon -->
            <div
              class="absolute top-[25%] left-[50%] -translate-x-1/2 w-20 h-20 bg-white rounded-full animate-sonar-slow opacity-50"
            ></div>

            <div
              class="w-20 lg:w-24 h-20 lg:h-24 bg-white border-2 border-brand-black rounded-full overflow-hidden mb-3 relative z-10 flex items-center justify-center"
            >
              <svg
                class="w-10 lg:w-12 h-10 lg:h-12 text-brand-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
            </div>
            <h3 class="font-bold text-lg text-brand-black">Check Inbox</h3>
            <div
              class="mt-2 bg-white border border-brand-black px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider group-hover:bg-brand-black group-hover:text-white transition-colors"
            >
              Instructions Sent
            </div>
          </div>

          <!-- Toast Notification -->
          <div
            class="absolute -bottom-4 right-6 lg:right-10 bg-brand-black text-white px-5 py-3 rounded-xl border border-white/20 shadow-xl flex items-center gap-3 animate-float z-20 max-w-xs"
          >
            <div
              class="w-6 h-6 rounded-full bg-brand-bright text-brand-black flex items-center justify-center shrink-0"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p class="text-xs font-bold leading-tight">Link expires in 60 minutes for security.</p>
          </div>
        </div>
      </section>

      <!-- Marquee Section (Troubleshooting) -->
      <section class="mt-32 w-full relative z-10 flex flex-col gap-8 reveal-element">
        <div class="text-center relative max-w-7xl mx-auto w-full px-6">
          <!-- 03 Badge -->
          <div
            class="absolute left-1/2 -top-16 -translate-x-1/2 w-8 h-8 rounded-full border border-brand-black flex items-center justify-center text-xs font-bold bg-brand-teal text-white shadow-hard-sm z-20 hidden md:flex"
          >
            03
          </div>

          <h2 class="text-3xl font-display font-bold text-brand-black mb-2">Troubleshooting</h2>
          <div class="h-1 w-20 bg-brand-black mx-auto rounded-full"></div>
        </div>

        <!-- Marquee Container -->
        <div class="w-full overflow-hidden relative py-10">
          <!-- Fade Masks -->
          <div
            class="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-brand-bg to-transparent z-20 pointer-events-none"
          ></div>
          <div
            class="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-brand-bg to-transparent z-20 pointer-events-none"
          ></div>

          <div
            class="flex w-max animate-marquee hover:[animation-play-state:paused] items-stretch gap-6 pl-6"
          >
            <div
              v-for="(tip, index) in allTips"
              :key="index"
              class="flashlight-card relative group w-[280px] lg:w-[300px] bg-white border border-brand-black rounded-xl p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-hard transition-shadow overflow-hidden shrink-0"
            >
              <div class="flashlight-border absolute inset-0 pointer-events-none rounded-xl"></div>
              <div
                class="w-12 h-12 rounded-lg border border-brand-black flex items-center justify-center"
                :class="tip.color"
              >
                <!-- Inbox Icon -->
                <svg
                  v-if="tip.icon === 'inbox'"
                  class="w-6 h-6 text-brand-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <!-- Timer Icon -->
                <svg
                  v-else-if="tip.icon === 'timer'"
                  class="w-6 h-6 text-brand-bright"
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
                <!-- Lifebuoy Icon -->
                <svg
                  v-else-if="tip.icon === 'lifebuoy'"
                  class="w-6 h-6 text-brand-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <!-- Globe Icon -->
                <svg
                  v-else-if="tip.icon === 'globe'"
                  class="w-6 h-6 text-brand-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg text-brand-black mb-1">{{ tip.title }}</h3>
                <p class="text-sm text-brand-black/60 leading-relaxed font-medium">
                  {{ tip.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full border-t border-brand-black/10 bg-white relative z-10 py-12 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></div>
          <span class="text-xs font-semibold text-brand-black/50">System Operational</span>
        </div>

        <div class="flex gap-8">
          <RouterLink
            to="/help"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors"
          >
            Support Center
          </RouterLink>
          <RouterLink
            to="/login"
            class="text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors"
          >
            Login Help
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

  /* Marquee animation */
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    animation: marquee 30s linear infinite;
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

  /* Flashlight Effect */
  .flashlight-card {
    --mouse-x: 0px;
    --mouse-y: 0px;
  }

  .flashlight-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      400px circle at var(--mouse-x) var(--mouse-y),
      rgba(255, 255, 255, 0.4),
      transparent 40%
    );
    z-index: 2;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
    border-radius: inherit;
  }

  .flashlight-card:hover::before {
    opacity: 1;
  }

  .flashlight-border::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(
      300px circle at var(--mouse-x) var(--mouse-y),
      rgba(26, 26, 26, 0.8),
      transparent 40%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  .flashlight-card:hover .flashlight-border::after {
    opacity: 1;
  }

  /* Reveal visible class */
  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Illustration Card Swap Animation */
  .illustration-card {
    transition:
      transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
      z-index 0s,
      box-shadow 0.4s ease,
      filter 0.4s ease;
    cursor: pointer;
    will-change: transform, z-index;
  }

  .illustration-card:hover {
    z-index: 30 !important;
    transform: scale(1.08) rotate(0deg) translateY(-10px) !important;
    box-shadow:
      8px 8px 0px 0px #1a1a1a,
      0 25px 50px -12px rgba(0, 0, 0, 0.25);
    filter: brightness(1.05);
  }

  .illustration-card:not(:hover) {
    transition:
      transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
      z-index 0.3s step-end,
      box-shadow 0.4s ease,
      filter 0.4s ease;
  }

  /* When one card is hovered, dim the other slightly */
  .illustration-card:hover ~ .illustration-card,
  .illustration-card:has(~ .illustration-card:hover) {
    filter: brightness(0.95);
    transform: scale(0.98);
  }
</style>
