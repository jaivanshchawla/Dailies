import React from 'react'

export default function StatsBar({ commits }) {
  const now = new Date()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = commits.filter((c) => new Date(c.date) >= weekAgo)
  const additions = thisWeek.reduce((s, c) => s + c.additions, 0)
  const deletions = thisWeek.reduce((s, c) => s + c.deletions, 0)

  const stat = (label, value) => (
    <span key={label}>
      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{label} </span>
      <span style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600' }}>{value}</span>
    </span>
  )

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '12px 0', flexWrap: 'wrap' }}>
      {stat('commits this week', thisWeek.length)}
      <span style={{ color: 'var(--border)' }}>·</span>
      {stat('added', `+${additions.toLocaleString()}`)}
      <span style={{ color: 'var(--border)' }}>·</span>
      {stat('removed', `-${deletions.toLocaleString()}`)}
    </div>
  )
}
