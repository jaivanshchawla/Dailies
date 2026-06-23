import React from 'react'
import { QUOTES } from '../data/quotes'
import { useDaySummary } from '../hooks/useDaySummary'

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const getQuote = (dateStr) => {
  const sum = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return QUOTES[sum % QUOTES.length]
}

const SourceBadge = ({ source }) => {
  if (!source || source === 'empty' || source === 'logic') return (
    <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
      ≈ generated
    </span>
  )
  return (
    <span style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.04em' }}>
      ✦ AI
    </span>
  )
}

export default function SummaryCard({ dayData, isEmpty, isVisible }) {
  const { date, totalCommits, totalAdditions, totalDeletions, repos = [], commits = [] } = dayData
  const { summary, isLoading } = useDaySummary(dayData, isVisible && !isEmpty)

  if (isEmpty) {
    return (
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '10px', opacity: 0.45 }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {formatDate(date)}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          No footage today.
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.5' }}>
          {getQuote(date)}
        </p>
      </div>
    )
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(date)}</p>
        {summary && <SourceBadge source={summary.source} />}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {totalCommits} commit{totalCommits !== 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--accent)' }}>+{totalAdditions?.toLocaleString()}</span>
        <span style={{ fontSize: '12px', color: 'var(--danger)' }}>-{totalDeletions?.toLocaleString()}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {repos.length} repo{repos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '12px', height: '12px', borderRadius: '50%',
            border: '1.5px solid var(--accent)', borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite', flexShrink: 0
          }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Generating summary...
          </p>
        </div>
      )}

      {!isLoading && summary?.text && (
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.65' }}>
          {summary.text}
        </p>
      )}

      {!isLoading && !summary && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Summary unavailable.
        </p>
      )}
    </div>
  )
}
