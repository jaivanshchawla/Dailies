import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const authHeader = req.headers.authorization || ''
  const sessionToken = authHeader.replace('Bearer ', '')

  if (!sessionToken) {
    return res.status(401).json({ error: 'Missing session token' })
  }

  try {
    const payload = await clerkClient.verifyToken(sessionToken)
    const userId = payload.sub

    const tokens = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_github')
    const githubToken = tokens?.data?.[0]?.token

    if (!githubToken) {
      return res.status(404).json({ error: 'No GitHub token found for this user' })
    }

    const user = await clerkClient.users.getUser(userId)
    const githubAccount = user.externalAccounts.find(a => a.provider === 'oauth_github')

    return res.status(200).json({
      token: githubToken,
      username: githubAccount?.username || githubAccount?.externalId || null,
    })
  } catch (err) {
    return res.status(401).json({ error: 'Invalid session', detail: err.message })
  }
}
