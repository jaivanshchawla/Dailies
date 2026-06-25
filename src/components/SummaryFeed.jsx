import React, { useMemo } from 'react'
import SummaryCard from './SummaryCard'
import { groupByDay } from '../lib/groupByDay'

export default function SummaryFeed({ commits }) {
  const safeCommits = useMemo(() => Array.isArray(commits) ? commits : [], [commits])

  const { grouped, allDays } = useMemo(() => {
    const g = groupByDay(safeCommits)
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().slice(0, 10)
    })
    return { grouped: g, allDays: days }
  }, [safeCommits])

  const dayEntries = useMemo(() => {
    return allDays.map(day => {
      const dayCommits = grouped[day] ?? []
      return {
        day,
        isEmpty: dayCommits.length === 0,
        dayData: {
          date: day,
          commits: dayCommits,
          totalCommits: dayCommits.length,
          totalAdditions: dayCommits.reduce((s, c) => s + (c.additions ?? 0), 0),
          totalDeletions: dayCommits.reduce((s, c) => s + (c.deletions ?? 0), 0),
          repos: [...new Set(dayCommits.map(c => c.repo))],
        },
      }
    })
  }, [grouped, allDays])

  return (
    <div>
      {dayEntries.map(({ day, isEmpty, dayData }) => (
        <SummaryCard
          key={day}
          dayData={dayData}
          isEmpty={isEmpty}
          isVisible={true}
        />
      ))}
    </div>
  )
}
