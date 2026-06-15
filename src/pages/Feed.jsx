import React from 'react'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import LoginScreen from '../components/LoginScreen'
import AuthGate from '../components/AuthGate'

export default function Feed() {
  return (
    <>
      <SignedOut>
        <LoginScreen />
      </SignedOut>
      <SignedIn>
        <AuthGate />
      </SignedIn>
    </>
  )
}
