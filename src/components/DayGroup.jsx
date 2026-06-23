import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import CommitCard from './CommitCard'

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function DayGroup({ date, commits }) {
  const cardsRef = useRef(null)

  useEffect(() => {
    if (!cardsRef.current) return
    const cards = cardsRef.current.querySelectorAll('.commit-card')
    const tween = gsap.from(cards, {
      opacity: 0,
      y: 16,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.05,
      clearProps: 'all',
    })
    return () => tween.kill()
  }, [])

  const additions = commits.reduce((s, c) => s + c.additions, 0)
  const deletions = commits.reduce((s, c) => s + c.deletions, 0)

  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="glass-pill" style={{
        display: 'flex', alignItems: 'baseline', gap: '12px',
        padding: '8px 16px', marginBottom: '8px',
        position: 'sticky', top: '0', zIndex: 1,
        borderRadius: 'var(--radius)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>{formatDate(date)}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {commits.length} commit{commits.length !== 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--accent)' }}>+{additions}</span>
        <span style={{ fontSize: '12px', color: 'var(--danger)' }}>-{deletions}</span>
      </div>
      <div ref={cardsRef}>
      {commits.map((c) => <CommitCard key={c.sha} commit={c} />)}
      </div>
    </div>
  )
}
