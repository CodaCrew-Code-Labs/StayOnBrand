import type { RouteRecordRaw } from 'vue-router'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/HomePage.vue'),
    meta: {
      layout: 'default',
      title: 'Home'
    }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('@/views/public/PricingPage.vue'),
    meta: {
      layout: 'default',
      title: 'Pricing'
    }
  }
]
