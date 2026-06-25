import React, { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import CommitCard from './CommitCard'

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  const isToday = dateStr === new Date().toISOString().slice(0, 10)
  const isYesterday = dateStr === new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default memo(function DayGroup({ date, commits, maxDayLOC = 1 }) {
  const cardsRef = useRef(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (!cardsRef.current || animatedRef.current) return
    const cards = cardsRef.current.querySelectorAll('.commit-card')
    if (!cards.length) return
    animatedRef.current = true
    const tween = gsap.from(cards, {
      opacity: 0,
      y: 12,
      duration: 0.35,
      ease: 'power2.out',
      stagger: 0.04,
      clearProps: 'all',
    })
    return () => tween.kill()
  }, [commits.length])

  const additions = commits.reduce((s, c) => s + (c.additions ?? 0), 0)
  const deletions = commits.reduce((s, c) => s + (c.deletions ?? 0), 0)
  const totalLOC = additions + deletions
  const locBarWidth = Math.max(4, Math.round((totalLOC / maxDayLOC) * 100))
  const isEmpty = commits.length === 0

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Sticky day header */}
      <div style={{
        position: 'sticky', top: '0', zIndex: 2,
        padding: '8px 0 10px', marginBottom: '8px',
        background: 'transparent',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '6px'
        }}>
          <span style={{
            fontSize: '13px', fontWeight: '600',
            letterSpacing: '-0.01em',
            opacity: isEmpty ? 0.4 : 1
          }}>
            {formatDate(date)}
          </span>
          {!isEmpty && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {commits.length} commit{commits.length !== 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                +{additions}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--danger)', fontFamily: 'JetBrains Mono, monospace' }}>
                -{deletions}
              </span>
            </div>
          )}
        </div>

        {/* LOC activity bar */}
        <div style={{
          height: '2px', borderRadius: '1px',
          background: 'var(--glass-border)', overflow: 'hidden'
        }}>
          {!isEmpty && (
            <div style={{
              height: '100%', borderRadius: '1px',
              width: `${locBarWidth}%`,
              background: `linear-gradient(90deg, var(--accent), var(--danger))`,
              opacity: 0.7,
              transition: 'width 0.6s ease',
            }} />
          )}
        </div>
      </div>

      {/* Commit cards or empty state */}
      {isEmpty ? (
        <p style={{
          fontSize: '12px', color: 'var(--text-muted)',
          opacity: 0.4, paddingLeft: '2px'
        }}>
          No footage.
        </p>
      ) : (
        <div ref={cardsRef} className="commit-cards-container">
          {commits.map(c => <CommitCard key={c.sha} commit={c} />)}
        </div>
      )}
    </div>
  )
})
