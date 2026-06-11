import React, { useState } from 'react'
import { githubFetch } from '../lib/github'

export default function TokenGate({ onSuccess }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!token.trim()) return setError('Token required.')
    setLoading(true)
    setError('')
    try {
      localStorage.setItem('dailies_pat', token.trim())
      const user = await githubFetch('/user')
      localStorage.setItem('dailies_username', user.login)
      onSuccess()
    } catch {
      setError('Invalid token. Check your PAT and try again.')
      localStorage.removeItem('dailies_pat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      background: 'var(--bg)'
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
        Dailies
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
        Your daily footage, every commit.
      </p>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          GitHub Personal Access Token
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="ghp_xxxxxxxxxxxx"
          style={{
            width: '100%', padding: '12px 14px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            color: 'var(--text-primary)', fontSize: '14px', marginBottom: '8px',
            fontFamily: 'JetBrains Mono, monospace', outline: 'none'
          }}
        />
        {error && <p style={{ color: 'var(--danger)', fontSize: '12px', marginBottom: '8px' }}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', background: 'var(--accent)',
            border: 'none', borderRadius: 'var(--radius)', color: '#fff',
            fontSize: '14px', fontWeight: '500', cursor: 'pointer'
          }}
        >
          {loading ? 'Verifying...' : 'Connect GitHub'}
        </button>
      </div>
    </div>
  )
}
