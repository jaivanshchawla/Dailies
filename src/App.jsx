import React from 'react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import Feed from './pages/Feed'

console.log('[DAILIES] 📱 App.jsx loaded at:', window.location.pathname)

export default function App() {
  const path = window.location.pathname

  if (path === '/sso-callback') {
    console.log('[DAILIES] 🔄 SSO callback detected — rendering AuthenticateWithRedirectCallback')
    return <AuthenticateWithRedirectCallback />
  }

  return (
    <>
      <div className="app-background">
        <div className="blob-3" />
      </div>
      <Feed />
    </>
  )
}
