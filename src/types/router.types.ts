import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'default' | 'auth' | 'dashboard' | 'legal' | 'error'
    title?: string
    requiresAuth?: boolean
    requiresGuest?: boolean
  }
}
