import { useState } from 'react';
import StatsBar from './StatsBar';
import ViewToggle from './ViewToggle';
import FilterBar from './FilterBar';
import CommitFeed from './CommitFeed';
import SummaryFeed from './SummaryFeed';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { useAllCommits } from '../hooks/useAllCommits';

export default function FeedLayout() {
  const [view, setView] = useState('log');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [activeRepos, setActiveRepos] = useState([]);

  const { data: repos = [] } = useGitHubRepos();
  const { commits, isLoading } = useAllCommits(repos);

  const filteredCommits = commits.filter((c) => {
    if (activeRepos.length > 0 && !activeRepos.includes(c.repo)) return false;
    if (authorFilter === 'me' && c.isAgent) return false;
    if (authorFilter === 'agent' && !c.isAgent) return false;
    return true;
  });

  const handleRepoToggle = (name) => {
    setActiveRepos((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    );
  };

  const handleSettings = () => {
    localStorage.removeItem('dailies_pat');
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dailies</h1>
        <button
          onClick={handleSettings}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
          title="Settings"
        >
          ⚙
        </button>
      </div>

      {/* Stats */}
      <div style={{ marginBottom: '16px' }}>
        <StatsBar commits={commits} />
      </div>

      {/* View toggle */}
      <div style={{ marginBottom: '12px' }}>
        <ViewToggle view={view} onToggle={setView} />
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <FilterBar
          repos={repos}
          activeRepos={activeRepos}
          onRepoToggle={handleRepoToggle}
          authorFilter={authorFilter}
          onAuthorFilter={setAuthorFilter}
        />
      </div>

      {/* Feed */}
      {isLoading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
          Loading commits...
        </p>
      ) : view === 'log' ? (
        <CommitFeed commits={filteredCommits} />
      ) : (
        <SummaryFeed commits={filteredCommits} />
      )}
    </div>
  );
}
