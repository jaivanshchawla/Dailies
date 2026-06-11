import React from 'react'
import { QUOTES } from '../data/quotes'

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const getQuote = (dateStr) => {
  const sum = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return QUOTES[sum % QUOTES.length]
}

export default function SummaryCard({ date, commits, isEmpty }) {
  const additions = commits.reduce((s, c) => s + c.additions, 0)
  const deletions = commits.reduce((s, c) => s + c.deletions, 0)
  const repos = [...new Set(commits.map((c) => c.repo))]

  return (
    <div style={{
      padding: '20px', marginBottom: '12px',
      background: isEmpty ? 'transparent' : 'var(--surface)',
      border: `1px solid var(--border)`,
      borderRadius: 'var(--radius)', opacity: isEmpty ? 0.5 : 1
    }}>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{formatDate(date)}</p>
      {isEmpty ? (
        <>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>No footage today.</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>{getQuote(date)}</p>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{commits.length} commits</span>
            <span style={{ fontSize: '12px', color: 'var(--accent)' }}>+{additions}</span>
            <span style={{ fontSize: '12px', color: 'var(--danger)' }}>-{deletions}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{repos.length} repo{repos.length !== 1 ? 's' : ''}</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            AI summary coming soon.
          </p>
        </>
      )}
    </div>
  )
}
