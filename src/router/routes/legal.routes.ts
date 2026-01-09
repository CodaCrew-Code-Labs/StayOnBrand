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
    path: '/terms-and-conditions',
    name: 'TermsAndConditions',
    component: () => import('@/views/legal/TermsAndConditionsPage.vue'),
    meta: {
      layout: 'default',
      title: 'Terms and Conditions'
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/legal/PrivacyPage.vue'),
    meta: {
      layout: 'default',
      title: 'Privacy Policy'
    }
  },
  {
    path: '/refund-policy',
    name: 'RefundPolicy',
    component: () => import('@/views/legal/RefundPolicyPage.vue'),
    meta: {
      layout: 'default',
      title: 'Refund Policy'
    }
  },
  {
    path: '/ltd-disclosure',
    name: 'LifetimeDealDisclosure',
    component: () => import('@/views/legal/LifetimeDealDisclosurePage.vue'),
    meta: {
      layout: 'default',
      title: 'Lifetime Deal Disclosure'
    }
  },
  {
    path: '/aup',
    name: 'AcceptableUsePolicy',
    component: () => import('@/views/legal/AcceptableUsePolicyPage.vue'),
    meta: {
      layout: 'default',
      title: 'Acceptable Use Policy'
    }
  },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    component: () => import('@/views/legal/CookiePolicyPage.vue'),
    meta: {
      layout: 'default',
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
