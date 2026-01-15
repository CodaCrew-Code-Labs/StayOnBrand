<script setup lang="ts">
  import { useToast } from '@/composables/useToast'

  const { toasts, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item pointer-events-auto"
          :class="[
            'relative flex items-start gap-3 p-4 pr-12 rounded-2xl border-2 min-w-[320px] max-w-[420px]',
            'shadow-[4px_4px_0px_0px_#1A1A1A] backdrop-blur-sm',
            {
              'bg-brand-bg border-brand-teal': toast.type === 'success',
              'bg-brand-bg border-brand-red': toast.type === 'error',
              'bg-brand-bg border-brand-black': toast.type === 'info'
            }
          ]"
        >
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2"
            :class="{
              'bg-brand-teal/10 border-brand-teal text-brand-teal': toast.type === 'success',
              'bg-brand-red/10 border-brand-red text-brand-red': toast.type === 'error',
              'bg-brand-black/10 border-brand-black text-brand-black': toast.type === 'info'
            }"
          >
            <!-- Success Icon -->
            <svg
              v-if="toast.type === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="animate-draw-check"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>

            <!-- Error Icon -->
            <svg
              v-else-if="toast.type === 'error'"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="animate-shake-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <!-- Info Icon -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pt-0.5">
            <h4
              class="font-display font-semibold text-sm tracking-wide"
              :class="{
                'text-brand-teal': toast.type === 'success',
                'text-brand-red': toast.type === 'error',
                'text-brand-black': toast.type === 'info'
              }"
            >
              {{ toast.title }}
            </h4>
            <p v-if="toast.message" class="text-brand-black/70 text-sm mt-0.5 leading-relaxed">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            :class="{
              'text-brand-teal/50 hover:text-brand-teal hover:bg-brand-teal/10':
                toast.type === 'success',
              'text-brand-red/50 hover:text-brand-red hover:bg-brand-red/10':
                toast.type === 'error',
              'text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10':
                toast.type === 'info'
            }"
            @click="dismiss(toast.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <!-- Progress Bar -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl"
          >
            <div
              class="h-full animate-progress-shrink"
              :class="{
                'bg-brand-teal': toast.type === 'success',
                'bg-brand-red': toast.type === 'error',
                'bg-brand-black': toast.type === 'info'
              }"
              :style="{ animationDuration: `${toast.duration}ms` }"
            ></div>
          </div>

          <!-- Decorative Elements -->
          <div
            class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 bg-brand-bg"
            :class="{
              'border-brand-teal': toast.type === 'success',
              'border-brand-red': toast.type === 'error',
              'border-brand-black': toast.type === 'info'
            }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
  /* Toast enter/leave transitions */
  .toast-enter-active {
    animation: toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .toast-leave-active {
    animation: toast-out 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast-move {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes toast-in {
    0% {
      opacity: 0;
      transform: translateX(100%) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes toast-out {
    0% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(100%) scale(0.8);
    }
  }

  /* Progress bar animation */
  @keyframes progress-shrink {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }

  .animate-progress-shrink {
    animation: progress-shrink linear forwards;
  }

  /* Check icon draw animation */
  @keyframes draw-check {
    0% {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  .animate-draw-check {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: draw-check 0.5s ease-out 0.2s forwards;
  }

  /* Error icon shake animation */
  @keyframes shake-icon {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-2px);
    }
    40%,
    80% {
      transform: translateX(2px);
    }
  }

  .animate-shake-icon {
    animation: shake-icon 0.4s ease-out;
  }

  /* Hover effect on toast */
  .toast-item {
    transition:
      transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast-item:hover {
    transform: translateX(-4px);
    box-shadow: 6px 6px 0px 0px #1a1a1a;
  }
</style>
