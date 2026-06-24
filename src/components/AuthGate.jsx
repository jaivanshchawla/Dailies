import React, { useState, useCallback } from 'react'
import { useGitHubTokenSync } from '../hooks/useGitHubTokenSync'
import FeedLayout from './FeedLayout'
import Preloader from './Preloader'

export default function AuthGate() {
  const { ready, error } = useGitHubTokenSync()
  const [dataLoaded, setDataLoaded] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)

  const handleDataLoaded = useCallback(() => {
    console.debug('[AuthGate] data loaded, preloader can dismiss')
    setDataLoaded(true)
  }, [])

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

  return (
    <>
      {/* Preloader overlays on top — z-index 9999 */}
      {!preloaderDone && (
        <Preloader
          isComplete={ready}
          dataReady={dataLoaded}
          onDone={() => setPreloaderDone(true)}
        />
      )}
      {/* FeedLayout always mounts so data hooks fire immediately */}
      <FeedLayout onDataLoaded={handleDataLoaded} />
    </>
  )
}
