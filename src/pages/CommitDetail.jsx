import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { githubFetch, getToken } from '../lib/github';

export default function CommitDetail() {
  const [hasToken] = useState(() => !!getToken());
  const { sha } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['commit', sha],
    queryFn: () => githubFetch(`/repos/jaivanshchawla/commits/${sha}`),
    enabled: hasToken,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '40px 16px', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading commit...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '40px 16px', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Commit not found.</p>
        <a href="/" style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>← Back to feed</a>
      </div>
    );
  }

  const stats = data.stats || {};

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      <a href="/" style={{ color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '16px', display: 'inline-block' }}>
        ← Back to feed
      </a>

      <div style={{
        padding: '16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {data.repository?.full_name || ''}
        </p>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '12px', lineHeight: 1.4 }}>
          {data.commit?.message?.split('\n')[0] || ''}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>SHA: </span>
            <span className="mono">{data.sha}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Author: </span>
            <span>{data.commit?.author?.name || 'Unknown'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Date: </span>
            <span>{new Date(data.commit?.author?.date).toLocaleString()}</span>
          </div>
          <div>
            <span style={{ color: 'var(--accent)' }}>+{stats.additions || 0}</span>
            {' '}
            <span style={{ color: 'var(--danger)' }}>-{stats.deletions || 0}</span>
            {' '}
            <span style={{ color: 'var(--text-muted)' }}>{stats.total || 0} changes</span>
          </div>
        </div>

        <a
          href={data.html_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '16px',
            padding: '6px 12px',
            background: 'var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            textDecoration: 'none',
          }}
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
