import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/HomePage.vue'),
    beforeEnter: () => {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        return { name: 'Dashboard' }
      }
    },
    meta: {
      layout: 'default',
      title: 'Home'
    }
  },
  {
    path: '/story',
    name: 'StoryList',
    component: () => import('@/views/public/StoryListPage.vue'),
    meta: {
      layout: 'default',
      title: 'Join the Story'
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
  },
  {
    path: '/confirm-subscription',
    name: 'ConfirmSubscriptionPublic',
    component: () => import('@/views/public/ConfirmSubscriptionPage.vue'),
    meta: {
      layout: 'default',
      title: 'Confirm Subscription'
    }
  }
]
