import type { RouteRecordRaw } from 'vue-router'

export const legalRoutes: RouteRecordRaw[] = [
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/legal/TermsPage.vue'),
    meta: {
      layout: 'default',
      title: 'Terms of Service'
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/legal/PrivacyPage.vue'),
    meta: {
      layout: 'legal',
      title: 'Privacy Policy'
    }
  },
  {
    path: '/cookies',
    name: 'CookiePolicy',
    component: () => import('@/views/legal/CookiePolicyPage.vue'),
    meta: {
      layout: 'legal',
      title: 'Cookie Policy'
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/legal/HelpPage.vue'),
    meta: {
      layout: 'legal',
      title: 'Help & FAQ'
    }
  }
]
