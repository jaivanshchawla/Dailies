export default function ViewToggle({ view, onToggle }) {
  const options = ['log', 'summary'];
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      padding: '3px',
      gap: '2px',
    }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          style={{
            padding: '6px 16px',
            borderRadius: 'var(--radius)',
            border: 'none',
            background: view === opt ? 'var(--border)' : 'transparent',
            color: view === opt ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            textTransform: 'capitalize',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
