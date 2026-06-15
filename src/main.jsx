import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App'
import './index.css'

console.log('[DAILIES] 🚀 App starting...', {
  pathname: window.location.pathname,
  href: window.location.href,
  origin: window.location.origin,
  search: window.location.search,
  hash: window.location.hash,
  timestamp: new Date().toISOString(),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
})

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log('[DAILIES] 🔑 Clerk config:', {
  keyPrefix: PUBLISHABLE_KEY ? PUBLISHABLE_KEY.substring(0, 12) + '...' : 'MISSING',
  keyDefined: !!PUBLISHABLE_KEY,
  envVars: {
    VITE_CLERK_PUBLISHABLE_KEY: PUBLISHABLE_KEY ? 'SET' : 'UNDEFINED',
  },
})

if (!PUBLISHABLE_KEY) {
  console.error('[DAILIES] ❌ CRITICAL: VITE_CLERK_PUBLISHABLE_KEY is undefined! Check .env.local')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      routing="virtual"
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
)

console.log('[DAILIES] ✅ React root rendered')
