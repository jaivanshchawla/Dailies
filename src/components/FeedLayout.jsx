import React, { useState } from 'react'
import ViewToggle from './ViewToggle'
import StatsBar from './StatsBar'
import CommitFeed from './CommitFeed'
import SummaryFeed from './SummaryFeed'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import { useAllCommits } from '../hooks/useAllCommits'

export default function FeedLayout() {
  const [view, setView] = useState('log')
  const { data: repos = [] } = useGitHubRepos()
  const { commits, isLoading } = useAllCommits(repos)

  const clearToken = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Dailies</h1>
        <button onClick={clearToken} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '18px' }}>⚙</button>
      </div>
      <StatsBar commits={commits} />
      <div style={{ margin: '16px 0' }}>
        <ViewToggle view={view} onToggle={setView} />
      </div>
      {isLoading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '40px', textAlign: 'center' }}>Loading your footage...</p>
      ) : view === 'log' ? (
        <CommitFeed commits={commits} />
      ) : (
        <SummaryFeed commits={commits} />
      )}
    </div>
  )
}
