<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { DefaultLayout, AuthLayout, DashboardLayout, LegalLayout, ErrorLayout } from '@/layouts'

  const route = useRoute()

  const layoutComponents = {
    default: DefaultLayout,
    auth: AuthLayout,
    dashboard: DashboardLayout,
    legal: LegalLayout,
    error: ErrorLayout
  }

  const currentLayout = computed(() => {
    const layout = route.meta.layout || 'default'
    return layoutComponents[layout as keyof typeof layoutComponents] || DefaultLayout
  })
</script>

<template>
  <component :is="currentLayout" />
</template>
