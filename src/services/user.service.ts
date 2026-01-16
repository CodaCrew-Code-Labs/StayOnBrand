const KEYCARD_PORT = import.meta.env.VITE_KEYCARD_PORT || '3002'
const KEYCARD_API_URL = `http://localhost:${KEYCARD_PORT}/api/v1`

export interface UserData {
  email: string
  sob_id: string // userUuid from keycard
  dodo_customer_id?: string // dodoCustomerId from keycard
  current_tier?: string // user tier
}

// Tier mapping configuration
class TierService {
  private tierMapping: Record<string, string> = {}

  constructor() {
    this.loadTierMapping()
  }

  private loadTierMapping() {
    try {
      const env = import.meta.env.VITE_ENV || 'test'
      const mappingKey = env === 'prod' ? 'VITE_PROD_TIER_MAPPING' : 'VITE_TEST_TIER_MAPPING'
      const mapping = import.meta.env[mappingKey]

      if (mapping) {
        this.tierMapping = JSON.parse(mapping)
      }
    } catch (error) {
      console.warn('Failed to load tier mapping:', error)
      this.tierMapping = { default: 'free' }
    }
  }

  getTier(sobId: string): string {
    return this.tierMapping[sobId] || this.tierMapping['default'] || 'free'
  }

  getAllTiers(): Record<string, string> {
    return { ...this.tierMapping }
  }
}

export const tierService = new TierService()

export class UserService {
  private getAuthToken(): string {
    // TODO: Get actual auth token from your auth system
    return 'test-token'
  }

  async getUser(email: string): Promise<UserData | null> {
    try {
      const response = await fetch(`${KEYCARD_API_URL}/user/${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`
        }
      })

      if (response.ok) {
        return await response.json()
      }

      if (response.status === 404) {
        return null // User not found
      }

      throw new Error(`Failed to get user: ${response.statusText}`)
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  async createUser(email: string): Promise<UserData> {
    const response = await fetch(`${KEYCARD_API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`)
    }

    return await response.json()
  }

  async getOrCreateUser(email: string): Promise<UserData> {
    let user = await this.getUser(email)

    if (!user) {
      user = await this.createUser(email)
    }

    // Add tier information
    user.current_tier = tierService.getTier(user.sob_id)

    return user
  }
}

export const userService = new UserService()
