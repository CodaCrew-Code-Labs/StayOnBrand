const API_URL = (() => {
  const url = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001'
  try {
    new URL(url)
    return url
  } catch {
    console.error('Invalid API URL configuration')
    return 'http://localhost:3001'
  }
})()

export class AuthService {
  // Get CSRF token from backend
  static async getCsrfToken(): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/csrf-token`)
      if (!response.ok) {
        throw new Error('Failed to get CSRF token')
      }
      const { csrfToken } = await response.json()
      return csrfToken
    } catch (error) {
      console.warn('CSRF token fetch failed:', error)
      return '' // Return empty string if CSRF fails
    }
  }
  // Get Google OAuth URL from backend
  static async getGoogleAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/auth/google/url?prompt=select_account`)

      if (!response.ok) {
        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Auth server is not running or endpoint not found')
        }

        const error = await response.json().catch(() => ({ error: 'Server error' }))
        throw new Error(error.error || 'Failed to get Google auth URL')
      }

      const { url } = await response.json()
      return url
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to auth server. Please ensure the backend is running.')
      }
      throw error
    }
  }

  // Exchange authorization code for tokens
  static async exchangeGoogleCode(code: string): Promise<{
    accessToken?: string
    idToken?: string
    user?: { id: string; email: string }
    sub?: string
    email?: string
  }> {
    try {
      const response = await fetch(
        `${API_URL}/auth/google/callback?code=${encodeURIComponent(code)}`
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Server error' }))
        throw new Error(error.error || 'Failed to exchange authorization code')
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to auth server. Please ensure the backend is running.')
      }
      throw error
    }
  }

  static async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ accessToken?: string; token?: string; user?: { id: string; email: string } }> {
    const csrfToken = await this.getCsrfToken()

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken })
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const result = await response.json()

    // Store tokens and remember me preference
    if (rememberMe) {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)
      localStorage.setItem('authExpiry', expiryDate.toISOString())
      localStorage.setItem('rememberMe', 'true')
      localStorage.setItem('accessToken', result.accessToken || result.token)
      if (result.user) {
        localStorage.setItem('userData', JSON.stringify(result.user))
      }
    }

    return result
  }

  static async signup(
    email: string,
    password: string,
    username: string
  ): Promise<{ message?: string; user?: { id: string; email: string } }> {
    const url = `${API_URL}/auth/signup-username`
    const csrfToken = await this.getCsrfToken()

    // Sanitize input strings
    const sanitizeInput = (str: string) => {
      return str.replace(/[<>"'&/\\(){}[\]]/g, match => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;',
          '/': '&#x2F;',
          '\\': '&#x5C;',
          '(': '&#x28;',
          ')': '&#x29;',
          '{': '&#x7B;',
          '}': '&#x7D;',
          '[': '&#x5B;',
          ']': '&#x5D;'
        }
        return entities[match] || match
      })
    }

    const payload = {
      email: sanitizeInput(email),
      password: sanitizeInput(password),
      username: sanitizeInput(username)
    }

    console.log('=== AUTH SERVICE SIGNUP ===')
    console.log('API URL configured')
    console.log('Request URL prepared')
    console.log('Payload prepared')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken })
      },
      body: JSON.stringify(payload)
    })

    console.log('HTTP response received')
    console.log('Response status available')

    if (!response.ok) {
      const error = await response.json()
      console.error('Response error occurred')

      // Extract clean error message
      let errorMsg = (error.error || error.message || 'Signup failed').replace(/[\r\n]/g, '')

      // Remove technical prefix if present
      if (errorMsg.includes(': ')) {
        errorMsg =
          errorMsg
            .split(': ')
            .pop()
            ?.replace(/[\r\n]/g, '') || 'Signup failed'
      }

      // Replace generic "User already exists" with more specific message
      if (errorMsg === 'User already exists') {
        errorMsg = 'Email already exists'
      }

      throw new Error(`Sign up failed: ${errorMsg}`)
    }

    const result = await response.json()
    console.log('Signup response received successfully')
    return result
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    console.log('=== FORGOT PASSWORD REQUEST ===')
    console.log('Email:', email)

    const csrfToken = await this.getCsrfToken()
    console.log('CSRF token obtained:', !!csrfToken)

    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken })
      },
      body: JSON.stringify({ email })
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      const error = await response.json()
      console.error('Forgot password error:', error)
      throw new Error(error.error || 'Failed to send reset email')
    }

    const result = await response.json()
    console.log('Forgot password success:', result)
    return result
  }

  static async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ message: string }> {
    console.log('=== RESET PASSWORD REQUEST ===')
    console.log('Email:', email)
    console.log('Code:', code)
    console.log('Has new password:', !!newPassword)

    const csrfToken = await this.getCsrfToken()
    console.log('CSRF token obtained:', !!csrfToken)

    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken })
      },
      body: JSON.stringify({ email, code, newPassword })
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      const error = await response.json()
      console.error('Reset password error:', error)
      throw new Error(error.error || 'Failed to reset password')
    }

    const result = await response.json()
    console.log('Reset password success:', result)
    return result
  }

  static logout(): void {
    // Clear any stored tokens/session data
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authExpiry')
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('userData')
    try {
      sessionStorage.clear()
    } catch {
      // Ignore sessionStorage errors
    }
  }

  static isAuthExpired(): boolean {
    const expiry = localStorage.getItem('authExpiry')
    if (!expiry) return false
    try {
      return new Date() > new Date(expiry)
    } catch {
      return true
    }
  }
}
