import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Layout component to use for this route */
    layout?: 'default' | 'auth' | 'dashboard' | 'legal' | 'error'
    /** Page title for browser tab and SEO */
    title?: string
    /** Whether route requires authentication */
    requiresAuth?: boolean
    /** Whether route requires user to be logged out */
    requiresGuest?: boolean
  }
}
