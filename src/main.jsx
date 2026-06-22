import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App'
import './index.css'

const t0 = performance.now()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
})

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error('[Dailies] ❌ VITE_CLERK_PUBLISHABLE_KEY missing — check .env.local')
} else {
  console.log(`[Dailies] 🔑 Clerk key loaded (${PUBLISHABLE_KEY.slice(0, 10)}…)`)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
)

console.log(`[Dailies] ✅ React mounted in ${Math.round(performance.now() - t0)}ms`)
