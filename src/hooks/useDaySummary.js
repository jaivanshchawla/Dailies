import { useState, useEffect } from 'react'
import { summarizeDay, getCachedSummary } from '../lib/summarize'

export const useDaySummary = (dayData, enabled = false) => {
  const [summary, setSummary] = useState(() => {
    if (!dayData?.date) return null
    return getCachedSummary(dayData.date)
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!enabled || !dayData?.commits?.length) return
    if (summary) return // already have it

    let cancelled = false
    setIsLoading(true)

    summarizeDay(dayData).then(result => {
      if (!cancelled) {
        setSummary(result)
        setIsLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [enabled, dayData?.date])

  return { summary, isLoading }
}
