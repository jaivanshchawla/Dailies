import React from 'react'
import SummaryCard from './SummaryCard'
import { groupByDay, sortedDayKeys } from '../lib/groupByDay'

export default function SummaryFeed({ commits }) {
  const grouped = groupByDay(commits)
  const keys = sortedDayKeys(grouped)

  // Generate last 30 days
  const allDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })

  if (!allDays.length) return (
    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px', textAlign: 'center' }}>
      No data yet.
    </p>
  )

  return (
    <div>
      {allDays.map((day) => (
        <SummaryCard
          key={day}
          date={day}
          commits={grouped[day] || []}
          isEmpty={!grouped[day] || grouped[day].length === 0}
        />
      ))}
    </div>
  )
}
