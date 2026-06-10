export default function CommitCard({ commit }) {
  const relativeTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div style={{
      padding: '12px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {commit.repo}
          {commit.repoPrivate && ' 🔒'}
        </span>
        <span style={{
          padding: '2px 8px',
          borderRadius: 'var(--radius)',
          fontSize: '0.7rem',
          fontWeight: 500,
          background: commit.isAgent ? 'rgba(247, 111, 111, 0.15)' : 'rgba(79, 142, 247, 0.15)',
          color: commit.isAgent ? 'var(--danger)' : 'var(--accent)',
        }}>
          {commit.isAgent ? 'Second unit' : 'You'}
        </span>
      </div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '6px', lineHeight: 1.4 }}>
        {commit.message.split('\n')[0]}
      </p>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.8rem' }}>
        <a
          href={`https://github.com/${commit.repo}/commit/${commit.sha}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mono"
          style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          {commit.shortSha}
        </a>
        <span>
          <span style={{ color: 'var(--accent)' }}>+{commit.additions}</span>
          {' '}
          <span style={{ color: 'var(--danger)' }}>-{commit.deletions}</span>
        </span>
        <span style={{ color: 'var(--text-muted)' }}>
          {relativeTime(commit.date)}
        </span>
      </div>
    </div>
  );
}
