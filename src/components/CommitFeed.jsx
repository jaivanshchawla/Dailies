import DayGroup from './DayGroup';
import { groupByDay, sortedDayKeys } from '../lib/groupByDay';

export default function CommitFeed({ commits }) {
  const grouped = groupByDay(commits);
  const days = sortedDayKeys(grouped);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {days.map((date) => (
        <DayGroup key={date} date={date} commits={grouped[date]} />
      ))}
    </div>
  );
}
