import React from 'react'

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function CommitCard({ commit }) {
  return (
    <div style={{
      padding: '14px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {commit.repo} {commit.repoPrivate ? '🔒' : ''}
        </span>
        <span style={{
          fontSize: '11px', padding: '2px 7px', borderRadius: '10px',
          background: commit.isAgent ? '#2a1515' : '#0f1f2e',
          color: commit.isAgent ? 'var(--danger)' : 'var(--accent)'
        }}>
          {commit.isAgent ? 'Second unit' : 'You'}
        </span>
      </div>
      <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', lineHeight: '1.4' }}>
        {commit.message}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <a
          href={commit.url}
          target="_blank"
          rel="noreferrer"
          className="mono"
          style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          {commit.shortSha}
        </a>
        <span style={{ fontSize: '12px', color: 'var(--accent)' }}>+{commit.additions}</span>
        <span style={{ fontSize: '12px', color: 'var(--danger)' }}>-{commit.deletions}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{timeAgo(commit.date)}</span>
      </div>
    </div>
  )
}
