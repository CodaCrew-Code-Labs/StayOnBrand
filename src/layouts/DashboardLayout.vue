<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  import { AuthService } from '@/services/auth'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const sidebarOpen = ref(false)

  const navigation = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Settings', to: '/settings' },
    { name: 'Profile', to: '/profile' },
    { name: 'Billing', to: '/billing' }
  ]

  const isActive = (path: string) => route.path === path

  const handleSignOut = () => {
    AuthService.logout()
    authStore.logout()
    router.push('/login')
  }
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center h-16 px-6 border-b border-gray-200">
          <RouterLink to="/" class="text-xl font-bold text-gray-900"> Stay on Brand </RouterLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-4 py-2 rounded-lg"
            :class="
              isActive(item.to) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            "
          >
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- User Menu -->
        <div class="p-4 border-t border-gray-200">
          <button
            class="block w-full px-4 py-2 text-center text-gray-600 hover:text-gray-900"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            class="lg:hidden text-gray-500 hover:text-gray-600"
            @click="sidebarOpen = !sidebarOpen"
          >
            <span class="sr-only">Toggle sidebar</span>
            Menu
          </button>
          <div class="flex items-center space-x-4">
            <RouterLink to="/help" class="text-gray-500 hover:text-gray-600"> Help </RouterLink>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6 lg:p-8">
        <RouterView />
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>
