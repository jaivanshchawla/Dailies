import React, { useState } from 'react'
import TokenGate from '../components/TokenGate'
import FeedLayout from '../components/FeedLayout'

export default function Feed() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('dailies_pat'))
  return authed ? <FeedLayout /> : <TokenGate onSuccess={() => setAuthed(true)} />
}
