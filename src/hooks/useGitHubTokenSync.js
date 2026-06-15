import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'

export const useGitHubTokenSync = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    const sync = async () => {
      try {
        const sessionToken = await getToken()
        const res = await fetch('/api/github-token', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        })
        if (!res.ok) throw new Error('Failed to fetch GitHub token')
        const data = await res.json()

        localStorage.setItem('dailies_pat', data.token)
        if (data.username) localStorage.setItem('dailies_username', data.username)

        setReady(true)
      } catch (err) {
        setError(err.message)
      }
    }

    sync()
  }, [isLoaded, isSignedIn, getToken])

  return { ready, error }
}
