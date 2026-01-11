import 'dotenv/config'
import { createSubscriptionBackend } from 'keycard-subscription-backend'

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'DODO_PAYMENTS_API_KEY']
const missingVars = requiredEnvVars.filter(key => !process.env[key])

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars)
  process.exit(1)
}

// Debug: Log the config being passed
console.log('DodoPayments config:', {
  apiKey: process.env.DODO_PAYMENTS_API_KEY?.substring(0, 10) + '...',
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode',
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY?.substring(0, 10) + '...'
})

// Initialize subscription backend
await createSubscriptionBackend({
  port: 3002,
  database: {
    url: process.env.DATABASE_URL
  },
  payment: {
    provider: 'dodo_payments',
    config: {
      apiKey: process.env.DODO_PAYMENTS_API_KEY,
      environment: process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode',
      webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY
    }
  },
  auth: {
    validateRequest: async _req => ({
      userId: 'user-id',
      tenantId: 'tenant-id',
      isValid: true
    })
  },
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
})

console.log('Subscription backend running on port 3002')
