<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Dashboard</h1>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">User Information</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p class="text-gray-900">{{ authStore.email || 'Not available' }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded">
          <label class="block text-sm font-medium text-gray-700 mb-1">SOB ID</label>
          <p class="text-gray-900 font-mono text-sm">{{ authStore.sobId || 'Not available' }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded">
          <label class="block text-sm font-medium text-gray-700 mb-1">Dodo ID</label>
          <p class="text-gray-900 font-mono text-sm">{{ authStore.dodoId || 'Not assigned' }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded">
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Tier</label>
          <p class="text-gray-900 font-semibold">{{ authStore.currentTier || 'Not assigned' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth.store'

  const authStore = useAuthStore()
</script>
