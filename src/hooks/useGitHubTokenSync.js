import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'

export const useGitHubTokenSync = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const hasSynced = useRef(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasSynced.current) return

    const sync = async () => {
      const t0 = performance.now()
      try {
        const sessionToken = await getToken()
        if (!sessionToken) throw new Error('No session token')

        const res = await fetch('/api/github-token', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        })

        if (!res.ok) {
          const body = await res.text()
          throw new Error(`GitHub token fetch failed (${res.status}): ${body}`)
        }

        const data = await res.json()
        localStorage.setItem('dailies_pat', data.token)
        if (data.username) localStorage.setItem('dailies_username', data.username)

        const ms = Math.round(performance.now() - t0)
        console.log(`[Dailies] ✅ GitHub token synced in ${ms}ms`)
        hasSynced.current = true
        setReady(true)
      } catch (err) {
        const ms = Math.round(performance.now() - t0)
        console.error(`[Dailies] ❌ Token sync failed after ${ms}ms:`, err.message)
        setError(err.message)
      }
    }

    sync()
  }, [isLoaded, isSignedIn, getToken])

  return { ready, error }
}
