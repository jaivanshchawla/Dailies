import React from 'react'

export default function ViewToggle({ view, onToggle }) {
  const btn = (label, val) => ({
    padding: '6px 18px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.15s',
    background: view === val ? 'var(--surface)' : 'transparent',
    color: view === val ? 'var(--accent)' : 'var(--text-muted)',
  })

  return (
    <div style={{
      display: 'inline-flex', background: 'var(--bg)',
      border: '1px solid var(--border)', borderRadius: '24px', padding: '3px'
    }}>
      <button style={btn('Log', 'log')} onClick={() => onToggle('log')}>Log</button>
      <button style={btn('Summary', 'summary')} onClick={() => onToggle('summary')}>Summary</button>
    </div>
  )
}
