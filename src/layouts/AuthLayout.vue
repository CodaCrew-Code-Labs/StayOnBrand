<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router'
  import { ref, watch } from 'vue'

  const route = useRoute()

  // Track navigation direction for transitions
  const slideDirection = ref('auth-fade')

  // Watch for route changes to determine direction
  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (newPath === '/login' && oldPath === '/signup') {
        // Going from signup to login - slide left
        slideDirection.value = 'auth-slide-left'
      } else if (newPath === '/signup' && oldPath === '/login') {
        // Going from login to signup - slide right
        slideDirection.value = 'auth-slide-right'
      } else {
        // Default - use subtle fade
        slideDirection.value = 'auth-fade'
      }
    }
  )
</script>

<template>
  <!-- Auth pages are full-page experiences with their own navigation -->
  <!-- Shared dark background to prevent white flash -->
  <div class="auth-layout-wrapper bg-brand-dark min-h-screen">
    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition :name="slideDirection">
        <component :is="Component" :key="currentRoute.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
  /* Wrapper ensures dark background is always visible */
  .auth-layout-wrapper {
    position: relative;
    overflow: hidden;
  }

  /* Auth Slide Left (Signup -> Login) - Crossfade with slide */
  .auth-slide-left-enter-active {
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 10;
  }

  .auth-slide-left-leave-active {
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }

  .auth-slide-left-enter-from {
    opacity: 0;
    transform: translateX(80px);
  }

  .auth-slide-left-leave-to {
    opacity: 0;
    transform: translateX(-80px);
  }

  /* Auth Slide Right (Login -> Signup) - Crossfade with slide */
  .auth-slide-right-enter-active {
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 10;
  }

  .auth-slide-right-leave-active {
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }

  .auth-slide-right-enter-from {
    opacity: 0;
    transform: translateX(-80px);
  }

  .auth-slide-right-leave-to {
    opacity: 0;
    transform: translateX(80px);
  }

  /* Auth Fade (for non-login/signup transitions) - Crossfade */
  .auth-fade-enter-active {
    transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 10;
  }

  .auth-fade-leave-active {
    transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }

  .auth-fade-enter-from,
  .auth-fade-leave-to {
    opacity: 0;
  }
</style>
