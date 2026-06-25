import React, { useEffect, useRef, useMemo, memo } from 'react'
import { gsap } from 'gsap'

const Sparkline = memo(function Sparkline({ commits }) {
  // Build 14-day buckets
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return d.toISOString().slice(0, 10)
  })

  const buckets = days.map(day =>
    commits.filter(c => c.date?.slice(0, 10) === day).length
  )

  const max = Math.max(...buckets, 1)
  const barWidth = 6
  const barGap = 3
  const height = 28
  const totalWidth = days.length * (barWidth + barGap) - barGap

  return (
    <svg width={totalWidth} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {buckets.map((count, i) => {
        const barH = Math.max(count === 0 ? 2 : 4, Math.round((count / max) * height))
        const x = i * (barWidth + barGap)
        const y = height - barH
        const isToday = i === 13
        return (
          <rect
            key={i}
            x={x} y={y}
            width={barWidth} height={barH}
            rx={2}
            fill={count === 0
              ? 'var(--glass-border)'
              : isToday
                ? 'var(--accent)'
                : 'rgba(79,142,247,0.45)'
            }
          />
        )
      })}
    </svg>
  )
})

const AnimatedNumber = ({ value, style }) => {
  const ref = useRef(null)
  const prev = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const obj = { val: prev.current }
    const tween = gsap.to(obj, {
      val: value,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate() {
        if (ref.current) ref.current.textContent = Math.round(obj.val).toLocaleString()
      },
    })
    prev.current = value
    return () => tween.kill()
  }, [value])

  return <span ref={ref} style={style}>{value.toLocaleString()}</span>
}

export default function StatsBar({ commits }) {
  const safeCommits = useMemo(() => Array.isArray(commits) ? commits : [], [commits])

  const thisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000
    return safeCommits.filter(c => new Date(c.date).getTime() >= weekAgo)
  }, [safeCommits])

  const additions = useMemo(() => thisWeek.reduce((s, c) => s + (c.additions ?? 0), 0), [thisWeek])
  const deletions = useMemo(() => thisWeek.reduce((s, c) => s + (c.deletions ?? 0), 0), [thisWeek])

  // Streak — consecutive days with commits up to today (memoized)
  const streak = useMemo(() => {
    const daySet = new Set(safeCommits.map(c => c.date?.slice(0, 10)))
    let count = 0
    const cursor = new Date()
    cursor.setHours(0, 0, 0, 0)
    const y = cursor.getFullYear()
    const m = cursor.getMonth()
    const d = cursor.getDate()
    for (let i = 0; i < 90; i++) {
      const ts = new Date(y, m, d - i)
      const dateStr = ts.getFullYear() + '-' + String(ts.getMonth() + 1).padStart(2, '0') + '-' + String(ts.getDate()).padStart(2, '0')
      if (daySet.has(dateStr)) {
        count++
      } else if (i > 0) {
        break
      }
    }
    return count
  }, [safeCommits])

  const monoStyle = { fontFamily: 'JetBrains Mono, monospace' }

  return (
    <div className="glass-panel" style={{
      padding: '14px 16px', marginBottom: '12px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Left — streak */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {streak}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          day streak
        </span>
      </div>

      {/* Center — sparkline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Sparkline commits={safeCommits} />
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
          14 days
        </span>
      </div>

      {/* Right — LOC this week */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AnimatedNumber
            value={additions}
            style={{ fontSize: '12px', color: 'var(--accent)', ...monoStyle, fontWeight: '600' }}
          />
          <AnimatedNumber
            value={deletions}
            style={{ fontSize: '12px', color: 'var(--danger)', ...monoStyle, fontWeight: '600' }}
          />
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          this week · {thisWeek.length} commits
        </span>
      </div>
    </div>
  )
}
