<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Minimal Header -->
    <header class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="text-xl font-bold text-gray-900"> Stay on Brand </RouterLink>
      </div>
    </header>

    <!-- Centered Error Content -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-lg w-full text-center">
        <RouterView />
      </div>
    </main>

    <!-- Minimal Footer -->
    <footer class="py-6 text-center text-gray-500 text-sm">
      <RouterLink to="/" class="hover:text-gray-900"> Return to Home </RouterLink>
    </footer>
  </div>
</template>
