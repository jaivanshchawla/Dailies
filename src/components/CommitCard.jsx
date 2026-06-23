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

const LOCBar = ({ additions, deletions }) => {
  const total = additions + deletions
  if (total === 0) return null
  const addPct = Math.round((additions / total) * 100)
  const delPct = 100 - addPct

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px'
    }}>
      <div style={{
        display: 'flex', height: '3px', borderRadius: '2px',
        overflow: 'hidden', width: '48px', flexShrink: 0
      }}>
        <div style={{ width: `${addPct}%`, background: 'var(--accent)', opacity: 0.8 }} />
        <div style={{ width: `${delPct}%`, background: 'var(--danger)', opacity: 0.8 }} />
      </div>
      <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
        +{additions}
      </span>
      <span style={{ fontSize: '11px', color: 'var(--danger)', fontFamily: 'JetBrains Mono, monospace' }}>
        -{deletions}
      </span>
    </div>
  )
}

export default function CommitCard({ commit }) {
  return (
    <div
      className="commit-card glass-panel"
      style={{
        padding: '14px 16px',
        marginBottom: '8px',
        borderLeft: commit.isAgent ? '2px solid rgba(247, 111, 111, 0.35)' : '2px solid transparent',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row — repo + author pill */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '7px'
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {commit.repoPrivate ? '🔒' : ''}
          {commit.repo}
        </span>
        <span style={{
          fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
          background: commit.isAgent ? 'rgba(247,111,111,0.1)' : 'rgba(79,142,247,0.1)',
          color: commit.isAgent ? 'var(--danger)' : 'var(--accent)',
          letterSpacing: '0.03em',
        }}>
          {commit.isAgent ? 'Second unit' : 'You'}
        </span>
      </div>

      {/* Commit message — dominant */}
      <p style={{
        fontSize: '15px', fontWeight: '600',
        lineHeight: '1.4', marginBottom: '10px',
        color: 'var(--text-primary)', letterSpacing: '-0.01em',
      }}>
        {commit.message}
      </p>

      {/* Bottom row — SHA + LOC bar + timestamp */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '12px', flexWrap: 'wrap'
      }}>
        <a
          href={commit.url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '11px', color: 'var(--text-muted)',
            textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace',
            opacity: 0.7,
          }}
          onClick={e => e.stopPropagation()}
        >
          {commit.shortSha}
        </a>
        <LOCBar additions={commit.additions ?? 0} deletions={commit.deletions ?? 0} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {timeAgo(commit.date)}
        </span>
      </div>
    </div>
  )
}
