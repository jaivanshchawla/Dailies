import { useState } from 'react';
import TokenGate from '../components/TokenGate';
import FeedLayout from '../components/FeedLayout';
import { getToken } from '../lib/github';

export default function Feed() {
  const [hasToken, setHasToken] = useState(() => !!getToken());

  if (!hasToken) {
    return <TokenGate onSuccess={() => setHasToken(true)} />;
  }

  return <FeedLayout />;
}
