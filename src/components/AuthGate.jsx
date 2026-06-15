import React from 'react'
import { useGitHubTokenSync } from '../hooks/useGitHubTokenSync'
import FeedLayout from './FeedLayout'

export default function AuthGate() {
  const { ready, error } = useGitHubTokenSync()

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--danger)', fontSize: '14px' }}>Connection failed: {error}</p>
      </div>
    )
  }

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Connecting to GitHub...</p>
      </div>
    )
  }

  return <FeedLayout />
}
