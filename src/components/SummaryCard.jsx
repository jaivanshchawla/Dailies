import { QUOTES } from '../data/quotes';

export default function SummaryCard({
  date,
  summaryText,
  totalAdditions,
  totalDeletions,
  commitCount,
  repoCount,
  isEmpty,
  onViewDay,
}) {
  function getQuoteIndex(dateStr) {
    let sum = 0;
    for (const ch of dateStr) sum += ch.charCodeAt(0);
    return sum % QUOTES.length;
  }

  function formatDate(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div style={{
      padding: '16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
    }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
        {formatDate(date)}
      </h3>
      {isEmpty ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          No footage today.<br />
          <span style={{ opacity: 0.7 }}>\"{QUOTES[getQuoteIndex(date)]}\"</span>
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span>{commitCount} commits</span>
            <span>
              <span style={{ color: 'var(--accent)' }}>+{totalAdditions}</span>
              {' / '}
              <span style={{ color: 'var(--danger)' }}>-{totalDeletions}</span>
            </span>
            <span>{repoCount} repos</span>
          </div>
          {summaryText && (
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '8px' }}>
              {summaryText}
            </p>
          )}
        </>
      )}
      {!isEmpty && (
        <button
          onClick={() => onViewDay(date)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          View commits →
        </button>
      )}
    </div>
  );
}
