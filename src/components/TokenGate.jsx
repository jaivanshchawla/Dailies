import { useState } from 'react';

export default function TokenGate({ onSuccess }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Token required.');
      return;
    }
    localStorage.setItem('dailies_pat', token.trim());
    onSuccess();
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 400, width: '100%' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 600,
          marginBottom: '2rem',
          color: 'var(--text-primary)',
        }}>
          Dailies
        </h1>
        <form onSubmit={handleSubmit}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem',
            textAlign: 'left',
          }}>
            GitHub Personal Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => { setToken(e.target.value); setError(''); }}
            placeholder="ghp_..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'var(--surface)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              marginBottom: '0.5rem',
            }}
          />
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'left' }}>
              {error}
            </p>
          )}
          {!error && <div style={{ marginBottom: '1rem' }} />}
          <button type="submit" style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
