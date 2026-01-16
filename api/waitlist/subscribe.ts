import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Clean the email
    let cleanEmail = email.toString().trim().toLowerCase()
    if (cleanEmail.startsWith('mailto:')) {
      cleanEmail = cleanEmail.replace('mailto:', '')
    }

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const apiKey = process.env.MAILJET_API_KEY
    const secretKey = process.env.MAILJET_SECRET_KEY
    const listId = process.env.MAILJET_LIST_ID

    if (!apiKey || !secretKey || !listId) {
      console.error('Mailjet configuration missing')
      return res.status(500).json({ error: 'Email service not configured' })
    }

    // Use managecontact endpoint - simpler, handles both create and subscribe
    const response = await fetch(
      `https://api.mailjet.com/v3/REST/contactslist/${listId}/managecontact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + Buffer.from(`${apiKey}:${secretKey}`).toString('base64')
        },
        body: JSON.stringify({
          Email: cleanEmail,
          Action: 'addnoforce'
        })
      }
    )

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed to the waitlist!'
      })
    }

    const errorData = await response.json()
    console.error('Mailjet error:', errorData)

    // Check if already subscribed
    if (response.status === 400) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed!'
      })
    }

    return res.status(500).json({ error: 'Failed to subscribe' })
  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({ error: 'An unexpected error occurred' })
  }
}
