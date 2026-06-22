import React from 'react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import Feed from './pages/Feed'

const spinKeyframes = `@keyframes spin { to { transform: rotate(360deg); } }`

export default function App() {
  const path = window.location.pathname

  if (path === '/sso-callback') {
    return (
      <>
        <style>{spinKeyframes}</style>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          gap: '16px',
        }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--glass-border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        }}>
          Completing sign-in…
        </p>
        <AuthenticateWithRedirectCallback />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="app-background">
        <div className="blob-3" />
      </div>
      <Feed />
    </>
  )
}
