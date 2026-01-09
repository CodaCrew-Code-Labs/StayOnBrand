<script setup lang="ts">
  import { computed } from 'vue'
  import { RouterLink, RouterView, useRoute } from 'vue-router'

  const route = useRoute()

  // Check if we're on pages that have their own full-page layout with navigation
  const hasOwnLayout = computed(
    () =>
      route.name === 'Home' ||
      route.name === 'Pricing' ||
      route.name === 'Terms' ||
      route.name === 'Privacy' ||
      route.name === 'RefundPolicy'
  )
</script>

<template>
  <!-- Pages with their own layout render directly without wrapper -->
  <RouterView v-if="hasOwnLayout" />

  <!-- Other pages use the standard layout with header/footer -->
  <div v-else class="min-h-screen flex flex-col bg-brand-bg font-sans">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-black/10"
    >
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <RouterLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-brand-black rounded-full flex items-center justify-center">
              <span class="font-display font-bold text-sm text-brand-bright">S.</span>
            </div>
            <span class="text-lg font-display font-bold text-brand-black">Stay on Brand</span>
          </RouterLink>
          <div class="flex items-center space-x-4">
            <RouterLink
              to="/pricing"
              class="text-brand-black/70 hover:text-brand-black transition-colors font-medium text-sm"
            >
              Pricing
            </RouterLink>
            <RouterLink
              to="/login"
              class="text-brand-black/70 hover:text-brand-black transition-colors font-medium text-sm"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              class="bg-brand-black text-brand-bg px-4 py-2 rounded-full font-semibold text-sm hover:bg-brand-black/90 transition-colors shadow-[3px_3px_0px_0px_#2F7A72]"
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
    <footer class="bg-brand-black text-brand-bg/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-brand-bg font-display font-semibold mb-4">Product</h3>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/pricing" class="hover:text-brand-bg transition-colors">
                  Pricing
                </RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-brand-bg font-display font-semibold mb-4">Support</h3>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/help" class="hover:text-brand-bg transition-colors">
                  Help & FAQ
                </RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-brand-bg font-display font-semibold mb-4">Legal</h3>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/terms" class="hover:text-brand-bg transition-colors">
                  Terms
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/privacy" class="hover:text-brand-bg transition-colors">
                  Privacy
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/cookies" class="hover:text-brand-bg transition-colors">
                  Cookies
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-brand-bg/10 mt-8 pt-8 text-center">
          <p>&copy; {{ new Date().getFullYear() }} Stay on Brand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
