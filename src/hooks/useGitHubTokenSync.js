import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'

export const useGitHubTokenSync = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  console.log('[DAILIES] 🔄 useGitHubTokenSync state:', { isLoaded, isSignedIn, ready, error })

  useEffect(() => {
    console.log('[DAILIES] 🔄 useGitHubTokenSync effect triggered:', { isLoaded, isSignedIn })

    if (!isLoaded) {
      console.log('[DAILIES] ⏳ Clerk not loaded yet, waiting...')
      return
    }
    if (!isSignedIn) {
      console.log('[DAILIES] 🔒 User not signed in, skipping token sync')
      return
    }

    console.log('[DAILIES] ✅ User is signed in, starting GitHub token sync')

    const sync = async () => {
      try {
        console.log('[DAILIES] 🔑 Getting Clerk session token...')
        const sessionToken = await getToken()
        console.log('[DAILIES] 🔑 Session token obtained:', {
          exists: !!sessionToken,
          length: sessionToken?.length,
          prefix: sessionToken ? sessionToken.substring(0, 20) + '...' : 'NONE',
        })

        if (!sessionToken) {
          throw new Error('Session token is null/undefined')
        }

        console.log('[DAILIES] 🌐 Fetching /api/github-token...')
        const res = await fetch('/api/github-token', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        })

        console.log('[DAILIES] 🌐 /api/github-token response:', {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          headers: Object.fromEntries(res.headers.entries()),
        })

        if (!res.ok) {
          const errorBody = await res.text()
          console.error('[DAILIES] ❌ /api/github-token error body:', errorBody)
          throw new Error(`Failed to fetch GitHub token: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        console.log('[DAILIES] ✅ GitHub token data received:', {
          hasToken: !!data.token,
          tokenLength: data.token?.length,
          username: data.username,
          keys: Object.keys(data),
        })

        localStorage.setItem('dailies_pat', data.token)
        if (data.username) localStorage.setItem('dailies_username', data.username)

        console.log('[DAILIES] ✅ localStorage updated:', {
          dailies_pat: localStorage.getItem('dailies_pat') ? 'SET (' + localStorage.getItem('dailies_pat').length + ' chars)' : 'MISSING',
          dailies_username: localStorage.getItem('dailies_username'),
        })

        setReady(true)
        console.log('[DAILIES] 🎉 Token sync COMPLETE')
      } catch (err) {
        console.error('[DAILIES] ❌ Token sync FAILED:', {
          message: err.message,
          stack: err.stack,
          name: err.name,
        })
        setError(err.message)
      }
    }

    sync()
  }, [isLoaded, isSignedIn, getToken])

  return { ready, error }
}
