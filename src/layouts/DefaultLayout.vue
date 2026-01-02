<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <RouterLink to="/" class="text-xl font-bold text-gray-900"> Stay on Brand </RouterLink>
          <div class="flex items-center space-x-4">
            <RouterLink to="/pricing" class="text-gray-600 hover:text-gray-900">
              Pricing
            </RouterLink>
            <RouterLink to="/login" class="text-gray-600 hover:text-gray-900"> Login </RouterLink>
            <RouterLink
              to="/signup"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </RouterLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-semibold mb-4">Product</h3>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/pricing" class="hover:text-white"> Pricing </RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Support</h3>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/help" class="hover:text-white"> Help & FAQ </RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Legal</h3>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/terms" class="hover:text-white"> Terms </RouterLink>
              </li>
              <li>
                <RouterLink to="/privacy" class="hover:text-white"> Privacy </RouterLink>
              </li>
              <li>
                <RouterLink to="/cookies" class="hover:text-white"> Cookies </RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {{ new Date().getFullYear() }} Stay on Brand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
