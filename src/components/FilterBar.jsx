import React from 'react'

export default function FilterBar({ repos, activeRepos, onRepoToggle, authorFilter, onAuthorFilter }) {
  const chip = (label, val) => {
    const active = val === 'all' ? activeRepos.length === 0 : activeRepos.includes(val)
    return (
      <button
        key={val}
        onClick={() => onRepoToggle(val)}
        className={`glass-pill${active ? ' active' : ''}`}
        style={{
          padding: '4px 12px',
          cursor: 'pointer',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    )
  }

  const authorBtn = (label, val) => {
    const active = authorFilter === val
    return (
      <button
        key={val}
        onClick={() => onAuthorFilter(val)}
        className={`glass-pill${active ? ' active' : ''}`}
        style={{
          padding: '6px 18px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.15s',
          background: active ? 'var(--glass-bg-strong)' : 'transparent',
          color: active ? 'var(--accent)' : 'var(--text-muted)',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {chip('All repos', 'all')}
        {repos.map((r) => chip(r, r))}
      </div>
      <div className="glass-pill" style={{
        display: 'inline-flex',
        padding: '3px',
        marginTop: '8px',
      }}>
        {authorBtn('Me', 'me')}
        {authorBtn('Second Unit', 'agent')}
        {authorBtn('All', 'all')}
      </div>
    </div>
  )
}
