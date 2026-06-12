import React from 'react'

export default function FilterBar({ repos, activeRepos, onRepoToggle, authorFilter, onAuthorFilter }) {
  const chip = (label, val) => {
    const active = val === 'all' ? activeRepos.length === 0 : activeRepos.includes(val)
    return (
      <button
        key={val}
        onClick={() => onRepoToggle(val)}
        style={{
          padding: '4px 12px',
          borderRadius: '20px',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          background: 'transparent',
          color: active ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '12px',
          cursor: 'pointer',
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
        style={{
          padding: '6px 18px',
          borderRadius: '20px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.15s',
          background: active ? 'var(--surface)' : 'transparent',
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
      <div style={{
        display: 'inline-flex',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
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
