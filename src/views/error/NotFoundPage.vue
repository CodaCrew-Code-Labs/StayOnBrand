<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'

  // Typewriter effect state
  const showTypewriter = ref(false)
  const showCursor = ref(true)

  onMounted(() => {
    // Trigger typewriter animation after mount
    setTimeout(() => {
      showTypewriter.value = true
    }, 100)
  })
</script>

<template>
  <div
    class="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-teal selection:text-white overflow-hidden relative flex flex-col"
  >
    <!-- Background Decoration -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.08] bg-grid z-0"></div>
    <div
      class="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-brand-teal to-brand-bright z-50"
    ></div>

    <!-- Animated Aurora Blob -->
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/20 rounded-full aurora-blob pointer-events-none z-0"
    ></div>

    <!-- Navigation -->
    <header class="w-full max-w-screen-2xl mx-auto px-6 py-5 relative z-40">
      <nav class="flex items-center justify-between border-b border-brand-black/10 pb-5">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div
            class="w-8 h-8 bg-brand-black rounded-full flex items-center justify-center text-brand-bright transform group-hover:rotate-12 transition-transform duration-300 shadow-lg"
          >
            <span class="font-display font-bold text-sm">S.</span>
          </div>
          <span
            class="font-display font-bold text-xl tracking-tight group-hover:text-brand-teal transition-colors"
          >
            Stay on Brand
          </span>
        </RouterLink>

        <!-- Right Action -->
        <RouterLink
          to="/login"
          class="text-sm font-bold border border-brand-black/20 px-5 py-2 rounded-full hover:bg-brand-black hover:text-brand-bg transition-all duration-300"
        >
          Sign in
        </RouterLink>
      </nav>
    </header>

    <!-- Main Content -->
    <main
      class="flex-grow flex w-full z-10 pt-12 pr-4 pb-12 pl-4 relative items-center justify-center"
    >
      <!-- Terminal Container -->
      <div class="relative w-full max-w-4xl mx-auto group perspective-[1000px]">
        <!-- Glow Effect behind the terminal -->
        <div
          class="absolute -inset-2 bg-gradient-to-r from-brand-teal/20 via-brand-bright/20 to-brand-red/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        ></div>

        <!-- The Terminal Card -->
        <div
          class="relative bg-brand-black rounded-xl overflow-hidden shadow-2xl border border-brand-black w-full transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        >
          <!-- CRT Overlay Effect (Scanlines) -->
          <div class="absolute inset-0 crt-overlay opacity-20 pointer-events-none"></div>

          <!-- Terminal Header Bar -->
          <div
            class="bg-brand-dark/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between relative z-30"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full bg-brand-red/80 hover:bg-brand-red transition-colors shadow-[0_0_10px_rgba(201,34,22,0.5)]"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-[#eab308]/80 hover:bg-[#eab308] transition-colors"
              ></div>
              <div
                class="w-3 h-3 rounded-full bg-brand-teal/80 hover:bg-brand-teal transition-colors"
              ></div>
            </div>
            <div class="font-mono text-xs text-brand-bg/40 tracking-wider flex items-center gap-2">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              bash — 80x24
            </div>
          </div>

          <!-- Terminal Content -->
          <div class="p-8 md:p-16 flex flex-col items-center text-center relative z-20">
            <!-- Command Line with Typewriter -->
            <div class="w-full text-left mb-12 border-b border-white/10 pb-4 flex items-center">
              <span class="font-mono text-brand-teal text-lg md:text-xl font-bold mr-3 select-none"
                >$</span
              >
              <div
                class="font-mono text-brand-bg text-lg md:text-xl overflow-hidden whitespace-nowrap"
                :class="{ 'typewriter-text': showTypewriter }"
              >
                curl <span class="text-brand-red">https://stayonbrand.in/404</span>
              </div>
              <span
                v-if="showCursor"
                class="inline-block w-2.5 h-5 bg-brand-teal ml-1 align-middle cursor-blink shadow-[0_0_8px_rgba(47,122,114,0.8)]"
              ></span>
            </div>

            <!-- Error Code Glitch -->
            <div class="flex items-center gap-3 mb-6">
              <span
                class="text-[10px] font-bold tracking-[0.2em] text-brand-bg/30 uppercase border border-brand-bg/20 px-2 py-1 rounded"
              >
                Error Code
              </span>
              <span class="font-mono text-sm text-brand-red tracking-widest glitch-static">
                404_NOT_FOUND
              </span>
            </div>

            <!-- Main Headline -->
            <h1
              class="text-4xl md:text-6xl font-display font-bold text-brand-bg tracking-tight mb-4 glitch-effect cursor-default"
            >
              Well, this is
              <span class="text-brand-bright italic font-script font-light relative">
                awkward...
                <svg
                  class="absolute -bottom-2 w-full h-2 text-brand-teal opacity-60"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2" fill="none" />
                </svg>
              </span>
            </h1>

            <!-- Kaomoji with Float -->
            <div
              class="text-5xl md:text-7xl text-brand-teal font-mono font-bold my-8 animate-float drop-shadow-[0_0_15px_rgba(47,122,114,0.4)]"
            >
              ¯\_(ツ)_/¯
            </div>

            <p class="text-brand-bg/60 max-w-md mx-auto mb-12 text-lg font-medium leading-relaxed">
              The page you are looking for has drifted into the digital void or never existed in
              this timeline.
            </p>

            <!-- Action Buttons with Shine -->
            <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <!-- 01: Return Home (Shine Animation) -->
              <RouterLink
                to="/"
                class="btn-shine w-full sm:w-auto px-8 py-3.5 bg-brand-bg text-brand-black rounded-full font-bold text-sm tracking-wide hover:bg-white transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden shadow-[0_0_20px_rgba(248,243,232,0.2)]"
              >
                <span
                  class="text-[10px] font-mono opacity-50 absolute left-3 top-1/2 -translate-y-1/2"
                >
                  01
                </span>
                <span>RETURN HOME</span>
              </RouterLink>

              <!-- 02: Help & FAQ -->
              <RouterLink
                to="/help"
                class="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-brand-bg/20 text-brand-bg rounded-full font-bold text-sm tracking-wide hover:border-brand-bg/50 hover:bg-brand-bg/5 transition-all flex items-center justify-center gap-2 relative group/outline"
              >
                <span
                  class="text-[10px] font-mono opacity-50 absolute left-3 top-1/2 -translate-y-1/2 group-hover/outline:text-brand-teal transition-colors"
                >
                  02
                </span>
                <span>HELP & FAQ</span>
              </RouterLink>
            </div>
          </div>

          <!-- Footer in Terminal -->
          <div
            class="bg-brand-dark/50 border-t border-white/5 px-6 py-3 flex justify-between items-center text-[10px] text-brand-bg/30 font-mono uppercase tracking-wider"
          >
            <span class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
              System Status: Critical
            </span>
            <span>ID: #8392-XJ</span>
          </div>
        </div>

        <!-- Decorative Elements outside terminal -->
        <div
          class="absolute -right-16 top-10 text-brand-red opacity-20 hidden xl:block animate-float-delayed"
        >
          <svg class="w-16 h-16 rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <div
          class="absolute -left-16 bottom-20 text-brand-teal opacity-20 hidden xl:block animate-float-slow"
        >
          <svg class="w-20 h-20 -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="w-full py-8 border-t border-brand-black/5 relative z-10 bg-brand-bg/50 backdrop-blur-sm"
    >
      <div
        class="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div class="flex items-center gap-2 text-brand-black/50 text-xs font-semibold">
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
          </span>
          <span>All systems operational</span>
        </div>

        <!-- Quick Links -->
        <div class="flex items-center gap-6 text-brand-black/40 text-xs">
          <RouterLink to="/terms" class="hover:text-brand-black transition-colors"
            >Terms</RouterLink
          >
          <RouterLink to="/privacy" class="hover:text-brand-black transition-colors"
            >Privacy</RouterLink
          >
          <RouterLink to="/help" class="hover:text-brand-black transition-colors">Help</RouterLink>
        </div>

        <p class="text-[10px] font-mono text-brand-black/40">
          &copy; {{ new Date().getFullYear() }} Stay on Brand.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  /* --- Animation: Cursor Blink --- */
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .cursor-blink {
    animation: blink 1s step-end infinite;
  }

  /* --- Animation: Typewriter --- */
  @keyframes type {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  .typewriter-text {
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    animation: type 2s steps(40, end);
    vertical-align: bottom;
  }

  /* --- Animation: CRT Scanline --- */
  @keyframes scanline {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 0% 100%;
    }
  }

  .crt-overlay {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.1)
    );
    background-size: 100% 4px;
    animation: scanline 0.15s linear infinite;
    pointer-events: none;
    z-index: 20;
  }

  /* --- Animation: RGB Glitch --- */
  @keyframes glitch {
    0% {
      text-shadow:
        2px 0 rgba(201, 34, 22, 0.8),
        -2px 0 rgba(47, 122, 114, 0.8);
    }
    25% {
      text-shadow:
        -2px 0 rgba(201, 34, 22, 0.8),
        2px 0 rgba(47, 122, 114, 0.8);
    }
    50% {
      text-shadow:
        2px 0 rgba(201, 34, 22, 0.8),
        -2px 0 rgba(47, 122, 114, 0.8);
    }
    75% {
      text-shadow:
        -2px 0 rgba(201, 34, 22, 0.8),
        2px 0 rgba(47, 122, 114, 0.8);
    }
    100% {
      text-shadow:
        2px 0 rgba(201, 34, 22, 0.8),
        -2px 0 rgba(47, 122, 114, 0.8);
    }
  }

  .glitch-effect:hover {
    animation: glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  }

  .glitch-static {
    animation: glitch 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
    animation-delay: 2s;
    animation-direction: alternate;
  }

  /* --- Animation: Aurora Background Blob --- */
  @keyframes aurora-move {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.4;
    }
    33% {
      transform: translate(calc(-50% + 30px), calc(-50% - 50px)) scale(1.1);
      opacity: 0.6;
    }
    66% {
      transform: translate(calc(-50% - 20px), calc(-50% + 20px)) scale(0.9);
      opacity: 0.4;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.4;
    }
  }

  .aurora-blob {
    filter: blur(80px);
    animation: aurora-move 10s infinite ease-in-out;
  }

  /* --- Animation: Button Spotlight --- */
  .btn-shine {
    position: relative;
    overflow: hidden;
  }

  .btn-shine::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    animation: shine 6s infinite;
  }

  @keyframes shine {
    0% {
      left: -100%;
    }
    20% {
      left: 200%;
    }
    100% {
      left: 200%;
    }
  }

  /* Font for mono */
  .font-mono {
    font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;
  }
</style>
