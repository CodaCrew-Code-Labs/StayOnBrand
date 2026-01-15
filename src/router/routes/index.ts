import type { RouteRecordRaw } from 'vue-router'
import { publicRoutes } from './public.routes'
import { authRoutes } from './auth.routes'
import { protectedRoutes } from './protected.routes'
import { legalRoutes } from './legal.routes'
import { errorRoutes } from './error.routes'

const isLaunched = import.meta.env.VITE_LAUNCHED === 'true'

// Pre-launch routes: only Story page (as index) and 404
const preLaunchRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/StoryListPage.vue'),
    meta: {
      layout: 'default',
      title: 'Join the Story'
    }
  },
  {
    path: '/story',
    redirect: '/'
  },
  ...errorRoutes
]

// Full routes when launched
const fullRoutes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  ...legalRoutes,
  ...errorRoutes
]

export const routes: RouteRecordRaw[] = isLaunched ? fullRoutes : preLaunchRoutes
