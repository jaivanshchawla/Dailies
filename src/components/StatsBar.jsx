export default function StatsBar({ commits }) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Commit streak: consecutive days with commits up to today
  const daySet = new Set(
    commits.map((c) => c.date.split('T')[0])
  );
  let streak = 0;
  const d = new Date(now);
  while (daySet.has(d.toISOString().split('T')[0])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  // This week stats
  const weekCommits = commits.filter(
    (c) => new Date(c.date) >= weekAgo
  );
  const weekAdditions = weekCommits.reduce((s, c) => s + c.additions, 0);
  const weekDeletions = weekCommits.reduce((s, c) => s + c.deletions, 0);
  const weekCount = weekCommits.length;

  const stats = [
    { label: 'Streak', value: `${streak}d` },
    { label: 'Added', value: `+${weekAdditions}` },
    { label: 'Removed', value: `-${weekDeletions}` },
    { label: 'Commits', value: weekCount },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      fontSize: '0.8rem',
    }}>
      {stats.map((s) => (
        <span key={s.label}>
          <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>{' '}
          <span style={{ fontWeight: 600 }}>{s.value}</span>
        </span>
      ))}
    </div>
  );
}
