import React from 'react'
import SummaryCard from './SummaryCard'
import { groupByDay } from '../lib/groupByDay'

export default function SummaryFeed({ commits }) {
  const grouped = groupByDay(commits)

  // Generate last 30 days
  const allDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })

  return (
    <div>
      {allDays.map((day) => {
        const dayCommits = grouped[day] ?? []
        const isEmpty = dayCommits.length === 0

        const dayData = {
          date: day,
          commits: dayCommits,
          totalCommits: dayCommits.length,
          totalAdditions: dayCommits.reduce((s, c) => s + (c.additions ?? 0), 0),
          totalDeletions: dayCommits.reduce((s, c) => s + (c.deletions ?? 0), 0),
          repos: [...new Set(dayCommits.map(c => c.repo))],
        }

        return (
          <SummaryCard
            key={day}
            dayData={dayData}
            isEmpty={isEmpty}
            isVisible={true}
          />
        )
      })}
    </div>
  )
}
