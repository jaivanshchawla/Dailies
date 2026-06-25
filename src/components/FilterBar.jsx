import React, { memo } from 'react'

const Chip = memo(function Chip({ label, val, active, onClick }) {
  return (
    <button
      onClick={() => onClick(val)}
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
})

const AuthorBtn = memo(function AuthorBtn({ label, val, active, onClick }) {
  return (
    <button
      onClick={() => onClick(val)}
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
})

export default memo(function FilterBar({ repos, activeRepos, onRepoToggle, authorFilter, onAuthorFilter }) {
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
        <Chip label="All repos" val="all" active={activeRepos.length === 0} onClick={onRepoToggle} />
        {repos.map((r) => (
          <Chip key={r} label={r} val={r} active={activeRepos.includes(r)} onClick={onRepoToggle} />
        ))}
      </div>
      <div className="glass-pill" style={{
        display: 'inline-flex',
        padding: '3px',
        marginTop: '8px',
      }}>
        <AuthorBtn label="Me" val="me" active={authorFilter === 'me'} onClick={onAuthorFilter} />
        <AuthorBtn label="Second Unit" val="agent" active={authorFilter === 'agent'} onClick={onAuthorFilter} />
        <AuthorBtn label="All" val="all" active={authorFilter === 'all'} onClick={onAuthorFilter} />
      </div>
    </div>
  )
})
