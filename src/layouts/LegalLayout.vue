<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <RouterLink to="/" class="text-xl font-bold text-gray-900"> Stay on Brand </RouterLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RouterView />
      </article>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-wrap justify-center space-x-6 text-sm text-gray-500">
          <RouterLink to="/terms" class="hover:text-gray-900"> Terms </RouterLink>
          <RouterLink to="/privacy" class="hover:text-gray-900"> Privacy </RouterLink>
          <RouterLink to="/cookies" class="hover:text-gray-900"> Cookies </RouterLink>
          <RouterLink to="/help" class="hover:text-gray-900"> Help </RouterLink>
        </div>
        <p class="mt-4 text-center text-sm text-gray-400">
          &copy; {{ new Date().getFullYear() }} Stay on Brand
        </p>
      </div>
    </footer>
  </div>
</template>
