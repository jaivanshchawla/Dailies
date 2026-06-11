import React from 'react'
import SummaryCard from './SummaryCard'
import { groupByDay, sortedDayKeys } from '../lib/groupByDay'

export default function SummaryFeed({ commits }) {
  const grouped = groupByDay(commits)
  const keys = sortedDayKeys(grouped)

  if (!keys.length) return (
    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px', textAlign: 'center' }}>
      No data yet.
    </p>
  )

  return (
    <div>
      {keys.map((day) => (
        <SummaryCard key={day} date={day} commits={grouped[day]} isEmpty={grouped[day].length === 0} />
      ))}
    </div>
  )
}
