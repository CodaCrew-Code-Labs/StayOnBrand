import type { RouteRecordRaw } from 'vue-router'

export const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/confirm-plan',
    name: 'ConfirmPlan',
    component: () => import('@/views/public/ConfirmSubscriptionPage.vue'),
    meta: {
      layout: 'default',
      title: 'Confirm Plan',
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardPage.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/dashboard/SettingsPage.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Settings',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/dashboard/ProfilePage.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Profile',
      requiresAuth: true
    }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import('@/views/dashboard/BillingPage.vue'),
    meta: {
      layout: 'dashboard',
      title: 'Billing & Subscription',
      requiresAuth: true
    }
  }
]
