<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth.store'
  import { AuthService } from '@/services/auth'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const sidebarExpanded = ref(false)
  const mobileSidebarOpen = ref(false)

  const navigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
    },
    {
      name: 'Pricing',
      to: '/pricing',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    {
      name: 'Billing',
      to: '/billing',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
    },
    {
      name: 'Profile',
      to: '/profile',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
    },
    {
      name: 'Settings',
      to: '/settings',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
    }
  ]

  const isActive = (path: string) => route.path === path

  const handleSignOut = () => {
    AuthService.logout()
    authStore.logout()
    router.push('/login')
  }
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6]">
    <!-- Desktop Sidebar -->
    <aside
      class="fixed top-4 bottom-4 left-4 z-50 hidden lg:flex flex-col bg-brand-dark rounded-3xl transition-all duration-300 ease-in-out shadow-xl"
      :class="sidebarExpanded ? 'w-52' : 'w-[68px]'"
      @mouseenter="sidebarExpanded = true"
      @mouseleave="sidebarExpanded = false"
    >
      <!-- Logo -->
      <div class="flex items-center h-16 px-4 mt-2">
        <RouterLink to="/dashboard" class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-brand-bright flex items-center justify-center flex-shrink-0"
          >
            <span class="font-display font-bold text-brand-dark text-sm">S.</span>
          </div>
          <span
            class="text-brand-bg font-display font-bold text-base whitespace-nowrap overflow-hidden transition-all duration-300"
            :class="sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'"
          >
            Stay on Brand
          </span>
        </RouterLink>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2.5 py-4 space-y-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-200"
          :class="
            isActive(item.to)
              ? 'bg-brand-bright text-brand-dark'
              : 'text-brand-bg/50 hover:text-brand-bg hover:bg-white/5'
          "
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span class="flex-shrink-0" v-html="item.icon"></span>
          <span
            class="whitespace-nowrap overflow-hidden transition-all duration-300 text-sm font-medium"
            :class="sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'"
          >
            {{ item.name }}
          </span>
        </RouterLink>
      </nav>

      <!-- Logout Button -->
      <div class="p-2.5 mt-auto mb-2">
        <button
          class="flex items-center gap-3 w-full px-2.5 py-2.5 rounded-xl text-brand-bg/50 hover:text-brand-red hover:bg-white/5 transition-all duration-200"
          @click="handleSignOut"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="flex-shrink-0"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span
            class="whitespace-nowrap overflow-hidden transition-all duration-300 text-sm font-medium"
            :class="sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'"
          >
            Logout
          </span>
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header
      class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-dark h-14 flex items-center px-4"
    >
      <button
        type="button"
        class="text-brand-bg/70 hover:text-brand-bg p-2"
        @click="mobileSidebarOpen = !mobileSidebarOpen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <RouterLink to="/dashboard" class="flex items-center gap-2 ml-3">
        <div class="w-7 h-7 rounded-lg bg-brand-bright flex items-center justify-center">
          <span class="font-display font-bold text-brand-dark text-xs">S.</span>
        </div>
        <span class="text-brand-bg font-display font-bold text-sm">Stay on Brand</span>
      </RouterLink>
    </header>

    <!-- Mobile Sidebar -->
    <aside
      class="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark transform transition-transform duration-300 ease-in-out"
      :class="mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full pt-16">
        <!-- Navigation -->
        <nav class="flex-1 px-3 py-6 space-y-1">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive(item.to)
                ? 'bg-brand-bright text-brand-dark'
                : 'text-brand-bg/50 hover:text-brand-bg hover:bg-white/5'
            "
            @click="mobileSidebarOpen = false"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="flex-shrink-0" v-html="item.icon"></span>
            <span class="text-sm font-medium">{{ item.name }}</span>
          </RouterLink>
        </nav>

        <!-- Logout Button -->
        <div class="p-3 mt-auto mb-4">
          <button
            class="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-brand-bg/50 hover:text-brand-red hover:bg-white/5 transition-all duration-200"
            @click="handleSignOut"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span class="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="mobileSidebarOpen"
      class="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="mobileSidebarOpen = false"
    />

    <!-- Main Content -->
    <div
      class="pt-14 lg:pt-0 min-h-screen transition-all duration-300 ease-in-out"
      :class="sidebarExpanded ? 'lg:pl-[220px]' : 'lg:pl-[84px]'"
    >
      <!-- Page Content -->
      <main class="p-5 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
