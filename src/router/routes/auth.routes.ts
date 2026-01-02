import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Login',
      requiresGuest: true
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/auth/SignupPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Sign Up',
      requiresGuest: true
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Forgot Password',
      requiresGuest: true
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPasswordPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Reset Password',
      requiresGuest: true
    }
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('@/views/auth/VerifyEmailPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Verify Email'
    }
  },
  {
    path: '/check-email',
    name: 'CheckEmail',
    component: () => import('@/views/auth/CheckEmailPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Check Your Email'
    }
  },
  {
    path: '/link-expired',
    name: 'LinkExpired',
    component: () => import('@/views/auth/LinkExpiredPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Link Expired'
    }
  },
  {
    path: '/resend-verification',
    name: 'ResendVerification',
    component: () => import('@/views/auth/ResendVerificationPage.vue'),
    meta: {
      layout: 'auth',
      title: 'Resend Verification'
    }
  }
]
