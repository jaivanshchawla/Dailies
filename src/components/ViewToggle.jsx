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
    background: view === val ? 'var(--glass-bg-strong)' : 'transparent',
    color: view === val ? 'var(--accent)' : 'var(--text-muted)',
  })

  return (
    <div className="glass-pill" style={{
      display: 'inline-flex', padding: '3px'
    }}>
      <button className={view === 'log' ? 'glass-pill active' : ''} style={btn('Log', 'log')} onClick={() => onToggle('log')}>Log</button>
      <button className={view === 'summary' ? 'glass-pill active' : ''} style={btn('Summary', 'summary')} onClick={() => onToggle('summary')}>Summary</button>
    </div>
  )
}
