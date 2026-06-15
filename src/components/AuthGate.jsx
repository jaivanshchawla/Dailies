import React from 'react'
import { useGitHubTokenSync } from '../hooks/useGitHubTokenSync'
import FeedLayout from './FeedLayout'

export default function AuthGate() {
  const { ready, error } = useGitHubTokenSync()

  console.log('[DAILIES] 🚧 AuthGate rendered:', { ready, error })

  if (error) {
    console.error('[DAILIES] 🚧 AuthGate showing ERROR state:', error)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <p style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '12px' }}>Connection failed: {error}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Check the console for details and try signing in again.</p>
        </div>
      </div>
    )
  }

  if (!ready) {
    console.log('[DAILIES] 🚧 AuthGate showing LOADING state (waiting for GitHub token sync)')
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Connecting to GitHub...</p>
      </div>
    )
  }

  console.log('[DAILIES] 🚧 AuthGate READY — rendering FeedLayout')
  return <FeedLayout />
}
