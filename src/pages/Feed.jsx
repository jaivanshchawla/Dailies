import React from 'react'
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import LoginScreen from '../components/LoginScreen'
import AuthGate from '../components/AuthGate'

export default function Feed() {
  const { isLoaded, isSignedIn } = useAuth()
  console.log('[DAILIES] 📄 Feed rendered:', { isLoaded, isSignedIn })
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
