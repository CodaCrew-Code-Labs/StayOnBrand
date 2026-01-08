import express from 'express'
import cors from 'cors'
import csrf from 'csrf'
import { CognitoAuthManager, loadConfigFromEnv } from 'gateway-cognito-auth'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.AUTH_PORT || 3001

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
)
app.use(express.json())

// Initialize CSRF protection
const csrfTokens = new csrf()
const secret = csrfTokens.secretSync()

// CSRF middleware
const csrfProtection = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next()
  }

  const token = req.headers['x-csrf-token'] as string
  if (!token || !csrfTokens.verify(secret, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' })
  }
  next()
}

// Get CSRF token endpoint
app.get('/csrf-token', (req, res) => {
  const token = csrfTokens.create(secret)
  res.json({ csrfToken: token })
})

// Initialize Cognito Auth Manager
let authManager: CognitoAuthManager

try {
  const config = loadConfigFromEnv()
  console.log('Loaded config:', config)

  // Manually add domain and redirectUri if missing
  const fullConfig = {
    ...config,
    domain: config.domain || process.env.COGNITO_DOMAIN || process.env.COGNITO_OAUTH_DOMAIN,
    redirectUri:
      config.redirectUri ||
      process.env.COGNITO_REDIRECT_URI ||
      process.env.COGNITO_OAUTH_REDIRECT_URI,
    scopes: config.scopes || process.env.COGNITO_OAUTH_SCOPES?.split(' ') || ['openid'],
    oauthDomain: process.env.COGNITO_OAUTH_DOMAIN,
    oauthRedirectUri: process.env.COGNITO_OAUTH_REDIRECT_URI
  }

  console.log('Full config with domain/redirectUri:', fullConfig)
  authManager = new CognitoAuthManager(fullConfig)
  console.log('CognitoAuthManager initialized successfully')
} catch (error) {
  console.error('Failed to initialize CognitoAuthManager:', error)
  // We don't exit here to allow the server to start even if config is missing,
  // but auth routes will likely fail.
}

app.get('/', (req, res) => {
  res.send('StayOnBrand Auth Server Running')
})

// Example Auth Routes (to be expanded)
app.post('/auth/signup-username', csrfProtection, async (req, res) => {
  console.log('Signup request:', {
    email: req.body.email,
    emailType: typeof req.body.email,
    emailLength: req.body.email?.length,
    hasPassword: !!req.body.password,
    username: req.body.username
  })

  if (!authManager) {
    return res.status(500).json({ error: 'Auth manager not initialized' })
  }
  try {
    const { email, password, username } = req.body

    // Clean the email - remove any potential prefixes and trim
    let cleanEmail = email.toString().trim()
    if (cleanEmail.startsWith('mailto:')) {
      cleanEmail = cleanEmail.replace('mailto:', '')
    }

    console.log('Original email:', email?.toString().replace(/[\r\n]/g, ''))
    console.log('Cleaned email:', cleanEmail)

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const result = await authManager.signupWithUsername(username, cleanEmail, password)
    console.log('Signup successful')
    res.json(result)
  } catch (error: unknown) {
    console.error('Signup error:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      fullError: error
    })
    res.status(400).json({ error: (error as Error).message })
  }
})

app.post('/auth/login', csrfProtection, async (req, res) => {
  if (!authManager) {
    return res.status(500).json({ error: 'Auth manager not initialized' })
  }
  try {
    const { email, password } = req.body
    const result = await authManager.login(email, password)
    res.json(result)
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// Get Google OAuth URL - redirects user to Google sign-in via Cognito
app.get('/auth/google/url', async (req, res) => {
  if (!authManager) {
    return res.status(500).json({ error: 'Auth manager not initialized' })
  }
  try {
    console.log('Attempting to get Google auth URL...')
    const url = authManager.getGoogleAuthUrl()
    console.log('Successfully got Google auth URL:', url)
    res.json({ url })
  } catch (error: unknown) {
    console.error('Google auth URL error:', {
      message: (error as Error).message,
      name: (error as Error).constructor.name,
      code: (error as { code?: string }).code
    })
    res.status(400).json({ error: (error as Error).message })
  }
})

// Exchange authorization code for tokens - called after Google OAuth redirect
app.get('/auth/google/callback', async (req, res) => {
  if (!authManager) {
    return res.status(500).json({ error: 'Auth manager not initialized' })
  }
  try {
    const code = req.query.code as string
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' })
    }
    const tokens = await authManager.exchangeCodeForTokens(code)
    res.json(tokens)
  } catch (error: unknown) {
    console.error('Google callback error:', error)
    res.status(400).json({ error: (error as Error).message })
  }
})

// Forgot password - sends reset email
app.post('/auth/forgot-password', csrfProtection, async (req, res) => {
  console.log('=== FORGOT PASSWORD ENDPOINT HIT ===')
  console.log('Request body:', req.body)

  if (!authManager) {
    console.error('Auth manager not initialized')
    return res.status(500).json({ error: 'Auth manager not initialized' })
  }
  try {
    const { email } = req.body
    console.log('Original email:', email)

    // Clean email like in signup
    let cleanEmail = email.toString().trim()
    if (cleanEmail.startsWith('mailto:')) {
      cleanEmail = cleanEmail.replace('mailto:', '')
    }
    console.log('Cleaned email:', cleanEmail)

    console.log('Calling authManager.forgotPassword...')
    await authManager.forgotPassword(cleanEmail)
    console.log('Forgot password email sent successfully')
    res.json({ message: 'Password reset email sent' })
  } catch (error: unknown) {
    console.error('Forgot password error:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    })
    res.status(400).json({ error: (error as Error).message })
  }
})

// Reset password - confirms new password with code
app.post('/auth/reset-password', csrfProtection, async (req, res) => {
  console.log('=== RESET PASSWORD ENDPOINT HIT ===')
  console.log('Request body:', { ...req.body, newPassword: '***' })

  if (!authManager) {
    console.error('Auth manager not initialized')
    return res.status(500).json({ error: 'Auth manager not initialized' })
  }
  try {
    const { email, code, newPassword } = req.body
    console.log('Original email:', email)
    console.log('Original code:', `"${code}"`)

    // Clean email like in signup
    let cleanEmail = email.toString().trim()
    if (cleanEmail.startsWith('mailto:')) {
      cleanEmail = cleanEmail.replace('mailto:', '')
    }

    // Clean code - remove any whitespace
    const cleanCode = code.toString().trim()

    console.log('Cleaned email:', cleanEmail)
    console.log('Cleaned code:', `"${cleanCode}"`)
    console.log('Code length:', cleanCode.length)

    console.log('Calling authManager.confirmForgotPassword...')
    await authManager.confirmForgotPassword(cleanEmail, cleanCode, newPassword)
    console.log('Password reset successful')
    res.json({ message: 'Password reset successful' })
  } catch (error: unknown) {
    console.error('Reset password error:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    })
    res.status(400).json({ error: (error as Error).message })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
