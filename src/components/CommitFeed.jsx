import React from 'react'
import DayGroup from './DayGroup'
import { groupByDay, sortedDayKeys } from '../lib/groupByDay'

export default function CommitFeed({ commits }) {
  if (!commits.length) return (
    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px', textAlign: 'center' }}>
      No commits found.
    </p>
  )

  const grouped = groupByDay(commits)
  const keys = sortedDayKeys(grouped)

  return (
    <div>
      {keys.map((day) => (
        <DayGroup key={day} date={day} commits={grouped[day]} />
      ))}
    </div>
  )
}
