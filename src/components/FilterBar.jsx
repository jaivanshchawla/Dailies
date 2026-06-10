export default function FilterBar({
  repos,
  activeRepos,
  onRepoToggle,
  authorFilter,
  onAuthorFilter,
}) {
  const authorOptions = [
    { key: 'all', label: 'All' },
    { key: 'me', label: 'Me' },
    { key: 'agent', label: 'Second Unit' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Repo chips */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        {repos.map((repo) => {
          const active = activeRepos.includes(repo.name);
          return (
            <button
              key={repo.name}
              onClick={() => onRepoToggle(repo.name)}
              style={{
                flexShrink: 0,
                padding: '4px 12px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: active ? 'var(--accent)' : 'var(--border)',
                color: active ? '#fff' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {repo.name}
            </button>
          );
        })}
      </div>

      {/* Author filter */}
      <div style={{
        display: 'inline-flex',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '3px',
        gap: '2px',
        width: 'fit-content',
      }}>
        {authorOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onAuthorFilter(opt.key)}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: authorFilter === opt.key ? 'var(--border)' : 'transparent',
              color: authorFilter === opt.key ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
