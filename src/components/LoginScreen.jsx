import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export default function LoginScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative film-strip accents */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, var(--accent), transparent, var(--accent), transparent, var(--accent))',
        opacity: 0.4
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, var(--accent), transparent, var(--accent), transparent, var(--accent))',
        opacity: 0.4
      }} />

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: '20px', border: '1px solid var(--border)',
          marginBottom: '20px', fontSize: '11px', color: 'var(--text-muted)',
          letterSpacing: '0.05em', textTransform: 'uppercase'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
          Now Reviewing
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Dailies
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Your daily footage, every commit.
        </p>
      </div>

      <SignIn
        routing="virtual"
        appearance={{
          variables: {
            colorPrimary: '#4F8EF7',
            colorBackground: '#111111',
            colorText: '#F0F0F0',
            colorTextSecondary: '#5A5A5A',
            colorInputBackground: '#0A0A0A',
            colorInputText: '#F0F0F0',
            borderRadius: '6px',
            fontFamily: 'Inter, sans-serif',
          },
          elements: {
            card: { boxShadow: 'none', border: '1px solid #1F1F1F' },
            footer: { display: 'none' },
          },
        }}
      />

      <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '24px', maxWidth: '320px', textAlign: 'center', lineHeight: '1.6' }}>
        Connecting with GitHub grants Dailies read access to your commit history, including private repositories, to build your daily log.
      </p>
    </div>
  )
}
