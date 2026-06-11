import React from 'react'
import CommitCard from './CommitCard'

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function DayGroup({ date, commits }) {
  const additions = commits.reduce((s, c) => s + c.additions, 0)
  const deletions = commits.reduce((s, c) => s + c.deletions, 0)

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: '12px',
        padding: '8px 0', borderBottom: '1px solid var(--border)',
        marginBottom: '4px', position: 'sticky', top: '0', background: 'var(--bg)', zIndex: 1
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>{formatDate(date)}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {commits.length} commit{commits.length !== 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--accent)' }}>+{additions}</span>
        <span style={{ fontSize: '12px', color: 'var(--danger)' }}>-{deletions}</span>
      </div>
      {commits.map((c) => <CommitCard key={c.sha} commit={c} />)}
    </div>
  )
}
