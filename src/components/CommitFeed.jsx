import React, { useMemo } from 'react'
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
  const isToday = date === new Date().toISOString().slice(0, 10)
  const isYesterday = date === new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const d = new Date(date + 'T00:00:00')
  const formatted = isToday ? 'Today' : isYesterday ? 'Yesterday' : d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
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
  const safeCommits = Array.isArray(commits) ? commits : []

  const { grouped, keys, maxDayLOC, allKeys } = useMemo(() => {
    if (safeCommits.length === 0) return { grouped: {}, keys: [], maxDayLOC: 1, allKeys: [] }
    const g = groupByDay(safeCommits)
    const k = sortedDayKeys(g)
    const max = k.length > 0 ? Math.max(
      ...k.map(day =>
        (Array.isArray(g[day]) ? g[day] : [])
          .reduce((s, c) => s + (c?.additions ?? 0) + (c?.deletions ?? 0), 0)
      ),
      1
    ) : 1
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().slice(0, 10)
    })
    const all = [...new Set([...k, ...last7.filter(d => !k.includes(d))])].sort().reverse()
    return { grouped: g, keys: k, maxDayLOC: max, allKeys: all }
  }, [safeCommits])

  if (safeCommits.length === 0) {
    return (
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px', textAlign: 'center' }}>
          No commits found.
        </p>
      </div>
    )
  }

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
