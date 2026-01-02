import type { RouteRecordRaw } from 'vue-router'

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/error/MaintenancePage.vue'),
    meta: {
      layout: 'error',
      title: 'Under Maintenance'
    }
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('@/views/error/ServerErrorPage.vue'),
    meta: {
      layout: 'error',
      title: 'Server Error'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundPage.vue'),
    meta: {
      layout: 'error',
      title: 'Page Not Found'
    }
  }
]
