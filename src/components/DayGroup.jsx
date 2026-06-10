import { motion } from 'framer-motion';
import CommitCard from './CommitCard';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function DayGroup({ date, commits }) {
  const totalCommits = commits.length;
  const netLOC = commits.reduce((s, c) => s + c.additions - c.deletions, 0);
  const sign = netLOC >= 0 ? '+' : '';

  return (
    <div>
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        padding: '12px 0 8px',
        zIndex: 1,
        borderBottom: '1px solid var(--border)',
        marginBottom: '8px',
      }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          {formatDate(date)}
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {totalCommits} commits · {sign}{netLOC} LOC
        </p>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
      >
        {commits.map((commit) => (
          <motion.div key={commit.sha} variants={item}>
            <CommitCard commit={commit} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
