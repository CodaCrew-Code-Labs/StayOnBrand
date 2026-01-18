const KEYCARD_PORT = import.meta.env.VITE_KEYCARD_PORT || '3002'
const KEYCARD_API_URL = `http://localhost:${KEYCARD_PORT}/api/v1`

export interface UserData {
  user_uuid: string
  email: string
  dodo_customer_id?: string | null
  active_tier?: string
  active_length?: string
  tier_expires_at?: string
  subscription_status?: string
  created_at?: string
}

export interface Payment {
  id: string
  dodoPaymentId: string
  status: string
  amountCents: number
  currency: string
  tier: string
  paidAt: string
  createdAt: string
}

export interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

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

    return user
  }

  async getPayments(email: string): Promise<PaymentsResponse> {
    try {
      const response = await fetch(
        `${KEYCARD_API_URL}/user/${encodeURIComponent(email)}/payments`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getAuthToken()}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to get payments: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting payments:', error)
      return { payments: [], pagination: { total: 0, limit: 10, offset: 0, hasMore: false } }
    }
  }
}

export const userService = new UserService()
