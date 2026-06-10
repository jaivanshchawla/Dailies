import SummaryCard from './SummaryCard';
import { groupByDay, sortedDayKeys } from '../lib/groupByDay';

export default function SummaryFeed({ commits, onViewDay }) {
  const grouped = groupByDay(commits);
  const days = sortedDayKeys(grouped);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {days.map((date) => {
        const dayCommits = grouped[date];
        const additions = dayCommits.reduce((s, c) => s + c.additions, 0);
        const deletions = dayCommits.reduce((s, c) => s + c.deletions, 0);
        const repos = new Set(dayCommits.map((c) => c.repo));

        return (
          <SummaryCard
            key={date}
            date={date}
            summaryText=""
            totalAdditions={additions}
            totalDeletions={deletions}
            commitCount={dayCommits.length}
            repoCount={repos.size}
            isEmpty={false}
            onViewDay={onViewDay}
          />
        );
      })}
    </div>
  );
}
