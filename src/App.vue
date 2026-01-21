<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSeoMeta } from '@unhead/vue'
  import { DefaultLayout, AuthLayout, DashboardLayout, LegalLayout, ErrorLayout } from '@/layouts'
  import ToastContainer from '@/components/ToastContainer.vue'

  const route = useRoute()

  // Default SEO meta tags for the entire app
  useSeoMeta({
    title: 'Stay on Brand',
    description:
      'Create stunning, on-brand color palettes for your designs. AI-powered color studio for designers and marketers.',
    ogTitle: 'Stay on Brand',
    ogDescription:
      'Create stunning, on-brand color palettes for your designs. AI-powered color studio for designers and marketers.',
    ogImage: 'https://www.stayonbrand.in/site.png',
    ogType: 'website',
    ogSiteName: 'Stay on Brand',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Stay on Brand',
    twitterDescription:
      'Create stunning, on-brand color palettes for your designs. AI-powered color studio for designers and marketers.',
    twitterImage: 'https://www.stayonbrand.in/site.png'
  })

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
  <ToastContainer />
</template>
