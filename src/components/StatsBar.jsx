import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Sparkline = ({ commits }) => {
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
}

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
  const safeCommits = Array.isArray(commits) ? commits : []
  const now = new Date()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = safeCommits.filter(c => new Date(c.date) >= weekAgo)
  const additions = thisWeek.reduce((s, c) => s + (c.additions ?? 0), 0)
  const deletions = thisWeek.reduce((s, c) => s + (c.deletions ?? 0), 0)

  // Streak — consecutive days with commits up to today
  const daySet = new Set(safeCommits.map(c => c.date?.slice(0, 10)))
  let streak = 0
  let cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  for (let i = 0; i < 90; i++) {
    const y = cursor.getFullYear()
    const m = String(cursor.getMonth() + 1).padStart(2, '0')
    const d = String(cursor.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    if (daySet.has(dateStr)) {
      streak++
    } else if (i > 0) {
      break
    }
    cursor.setDate(cursor.getDate() - 1)
  }

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
