import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import TokenGate from '../components/TokenGate';
import FeedLayout from '../components/FeedLayout';
import { getToken } from '../lib/github';

export default function RepoFeed() {
  const [hasToken, setHasToken] = useState(() => !!getToken());
  const { name } = useParams();

  if (!hasToken) {
    return <TokenGate onSuccess={() => setHasToken(true)} />;
  }

  return <FeedLayout preFilterRepo={name} />;
}
