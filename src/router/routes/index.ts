import type { RouteRecordRaw } from 'vue-router'
import { publicRoutes } from './public.routes'
import { authRoutes } from './auth.routes'
import { protectedRoutes } from './protected.routes'
import { legalRoutes } from './legal.routes'
import { errorRoutes } from './error.routes'

export const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  ...legalRoutes,
  ...errorRoutes
]
