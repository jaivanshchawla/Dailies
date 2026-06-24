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
      console.debug('[useDaySummary]', dayData.date, '→', result.source)
      if (!cancelled) {
        setSummary(result)
        setIsLoading(false)
      }
    }).catch(err => {
      console.error('[useDaySummary] summarizeDay failed:', err.message)
      if (!cancelled) setIsLoading(false)
    })

    return () => { cancelled = true }
  }, [enabled, dayData?.date])

  return { summary, isLoading }
}
