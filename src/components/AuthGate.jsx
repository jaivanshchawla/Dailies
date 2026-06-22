import React from 'react'
import { useGitHubTokenSync } from '../hooks/useGitHubTokenSync'
import FeedLayout from './FeedLayout'

export default function AuthGate() {
  const { ready, error } = useGitHubTokenSync()

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div className="glass-panel" style={{
          padding: '32px',
          textAlign: 'center',
          maxWidth: '360px',
        }}>
          <p style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
            Connection failed
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.5' }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="glass-pill"
            style={{
              padding: '8px 20px',
              cursor: 'pointer',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        gap: '12px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid var(--glass-border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Syncing GitHub data…
        </p>
      </div>
    )
  }

  return <FeedLayout />
}
