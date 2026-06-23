import React from 'react'
import DayGroup from './DayGroup'
import { groupByDay, sortedDayKeys } from '../lib/groupByDay'

const SkeletonCard = () => (
  <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
    <div style={{ width: '80px', height: '10px', background: 'var(--surface)', borderRadius: '4px', marginBottom: '10px' }} />
    <div style={{ width: '60%', height: '14px', background: 'var(--surface)', borderRadius: '4px', marginBottom: '10px' }} />
    <div style={{ width: '120px', height: '10px', background: 'var(--surface)', borderRadius: '4px' }} />
  </div>
)

const EmptyDay = ({ date }) => {
  const d = new Date(date)
  const formatted = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: '12px',
        padding: '8px 0', borderBottom: '1px solid var(--border)',
        marginBottom: '4px', position: 'sticky', top: '0', background: 'var(--bg)', zIndex: 1
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>{formatted}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No footage.</span>
      </div>
    </div>
  )
}

export default function CommitFeed({ commits }) {
  if (commits.length === 0) {
    return (
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px', textAlign: 'center' }}>
          No commits found.
        </p>
      </div>
    )
  }

  const grouped = groupByDay(commits)
  const keys = sortedDayKeys(grouped)

  // Compute busiest day's LOC for relative activity bars
  const maxDayLOC = Math.max(
    ...keys.map(day =>
      grouped[day].reduce((s, c) => s + (c.additions ?? 0) + (c.deletions ?? 0), 0)
    ),
    1
  )

  // Generate last 7 days for empty day fill
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })

  const allKeys = [...new Set([...keys, ...last7Days.filter(d => !keys.includes(d))])].sort().reverse()

  return (
    <div>
      {allKeys.map((day) =>
        grouped[day] ? (
          <DayGroup key={day} date={day} commits={grouped[day]} maxDayLOC={maxDayLOC} />
        ) : (
          <EmptyDay key={day} date={day} />
        )
      )}
    </div>
  )
}

export { SkeletonCard }
