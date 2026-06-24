import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import { useClerk } from '@clerk/clerk-react'
import ThemeToggle from './ThemeToggle'
import ViewToggle from './ViewToggle'
import StatsBar from './StatsBar'
import CommitFeed from './CommitFeed'
import SummaryFeed from './SummaryFeed'
import FilterBar from './FilterBar'
import { SkeletonCard } from './CommitFeed'
import { useGitHubRepos } from '../hooks/useGitHubRepos'
import { useAllCommits } from '../hooks/useAllCommits'
import { runAutoCommit } from '../lib/autoCommit'

export default function FeedLayout({ onDataLoaded }) {
  const [view, setView] = useState('log')
  const [activeRepos, setActiveRepos] = useState([])
  const [authorFilter, setAuthorFilter] = useState('all')
  const { signOut } = useClerk()
  const { data: repos = [] } = useGitHubRepos()
  const { commits, isLoading } = useAllCommits(repos)
  const hasAutoCommitted = useRef(false)
  const hasReportedLoaded = useRef(false)
  const headerRef = useRef(null)
  const statsRef = useRef(null)
  const controlsRef = useRef(null)
  const feedRef = useRef(null)

  useEffect(() => {
    if (!isLoading && repos.length > 0 && !hasReportedLoaded.current) {
      hasReportedLoaded.current = true
      console.debug('[FeedLayout] data loaded, reporting to AuthGate')
      onDataLoaded?.()
    }
  }, [isLoading, repos.length])

  useEffect(() => {
    if (!isLoading && commits.length > 0 && !hasAutoCommitted.current) {
      hasAutoCommitted.current = true
      runAutoCommit(commits)
    }
  }, [isLoading, commits])

  useEffect(() => {
    if (isLoading) return

    const sections = [headerRef.current, statsRef.current, controlsRef.current, feedRef.current].filter(Boolean)
    if (!sections.length) return

    gsap.set(sections, { opacity: 0, y: 24 })
    const tween = gsap.to(sections, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.08,
    })

    return () => {
      console.debug('[FeedLayout] killing entrance animations on unmount')
      tween.kill()
    }
  }, [isLoading])

  const filteredCommits = useMemo(() => {
    const safe = Array.isArray(commits) ? commits : []
    return safe
      .filter(c => activeRepos.length === 0 || activeRepos.includes(c.repo))
      .filter(c => {
        if (authorFilter === 'me') return !c.isAgent
        if (authorFilter === 'agent') return c.isAgent
        return true
      })
  }, [commits, activeRepos, authorFilter])

  const repoNames = useMemo(() => {
    const safe = Array.isArray(commits) ? commits : []
    return [...new Set(safe.map(c => c.repo))]
  }, [commits])

  const onRepoToggle = useCallback((repo) => {
    if (repo === 'all') return setActiveRepos([])
    setActiveRepos(prev =>
      prev.includes(repo) ? prev.filter(r => r !== repo) : [...prev, repo]
    )
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('dailies_pat')
    localStorage.removeItem('dailies_username')
    signOut()
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px' }}>
      <div ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Dailies</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ThemeToggle />
          <button onClick={handleSignOut} className="glass-pill" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', color: 'var(--text-primary)', fontSize: '18px' }}>⚙</button>
        </div>
      </div>
      <div ref={statsRef}><StatsBar commits={filteredCommits} /></div>
      <div ref={controlsRef}>
      {repoNames.length > 1 && (
        <FilterBar
          repos={repoNames}
          activeRepos={activeRepos}
          onRepoToggle={onRepoToggle}
          authorFilter={authorFilter}
          onAuthorFilter={setAuthorFilter}
        />
      )}
      <div style={{ margin: '16px 0' }}>
        <ViewToggle view={view} onToggle={setView} />
      </div>
      </div>
      <div ref={feedRef}>
      {isLoading && filteredCommits.length === 0 ? (
        <div>
          {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {isLoading && filteredCommits.length > 0 && (
            <div style={{
              padding: '8px 12px', marginBottom: '12px',
              borderRadius: '8px', background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              fontSize: '12px', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                border: '1.5px solid var(--accent)', borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite', flexShrink: 0
              }} />
              Loading more repos…
            </div>
          )}
          {view === 'log' ? (
            <CommitFeed commits={filteredCommits} />
          ) : (
            <SummaryFeed commits={filteredCommits} />
          )}
        </>
      )}
      </div>
    </div>
  )
}
