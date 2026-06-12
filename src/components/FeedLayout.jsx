import React, { useState, useRef, useEffect } from 'react'
import ViewToggle from './ViewToggle'
import FilterBar from './FilterBar'
import StatsBar from './StatsBar'
import CommitFeed, { SkeletonCard } from './CommitFeed'
import SummaryFeed from './SummaryFeed'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import { useAllCommits } from '../hooks/useAllCommits'
import { runAutoCommit } from '../lib/autoCommit'

export default function FeedLayout() {
  const [view, setView] = useState('log')
  const [activeRepos, setActiveRepos] = useState([])
  const [authorFilter, setAuthorFilter] = useState('all')
  const hasAutoCommitted = useRef(false)

  const { data: repos = [] } = useGitHubRepos()
  const { commits, isLoading } = useAllCommits(repos)

  // Auto-commit on first load
  useEffect(() => {
    if (!isLoading && commits.length > 0 && !hasAutoCommitted.current) {
      hasAutoCommitted.current = true
      runAutoCommit(commits)
    }
  }, [isLoading, commits])

  const clearToken = () => {
    localStorage.clear()
    window.location.reload()
  }

  const onRepoToggle = (repo) => {
    if (repo === 'all') return setActiveRepos([])
    setActiveRepos(prev =>
      prev.includes(repo) ? prev.filter(r => r !== repo) : [...prev, repo]
    )
  }

  const filteredCommits = commits
    .filter(c => activeRepos.length === 0 || activeRepos.includes(c.repo))
    .filter(c => {
      if (authorFilter === 'me') return !c.isAgent
      if (authorFilter === 'agent') return c.isAgent
      return true
    })

  const repoNames = [...new Set(commits.map(c => c.repo))]

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
      <FilterBar
        repos={repoNames}
        activeRepos={activeRepos}
        onRepoToggle={onRepoToggle}
        authorFilter={authorFilter}
        onAuthorFilter={setAuthorFilter}
      />
      {isLoading ? (
        <div>{Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}</div>
      ) : view === 'log' ? (
        <CommitFeed commits={filteredCommits} />
      ) : (
        <SummaryFeed commits={filteredCommits} />
      )}
    </div>
  )
}
