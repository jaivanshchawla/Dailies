import React, { useState } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassButton } from '@/components/ui/GlassButton'
import BlurFade from '@/components/ui/BlurFade'
import GradientBackground from '@/components/ui/GradientBackground'

const GitHubIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-5 h-5">
    <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

export default function LoginScreen() {
  const { signIn, isLoaded } = useSignIn()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGitHubLogin = async () => {
    if (!isLoaded || loading) return

    setLoading(true)
    setError('')

    try {
      const callbackUrl = window.location.origin + '/sso-callback'
      console.log(`[Dailies] 🔵 OAuth redirect → ${callbackUrl}`)

      await signIn.authenticateWithRedirect({
        strategy: 'oauth_github',
        redirectUrl: callbackUrl,
        redirectUrlComplete: window.location.origin + '/',
      })
    } catch (err) {
      console.error('[Dailies] ❌ OAuth redirect failed:', err.message)
      setError('Failed to start GitHub authentication. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen w-screen flex flex-col">
      <div className="fixed top-4 left-4 z-20 flex items-center gap-2 md:left-1/2 md:-translate-x-1/2">
        <div className="glass-pill" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Dailies</h1>
        </div>
      </div>

      <div className={cn("flex w-full flex-1 h-full items-center justify-center", "relative overflow-hidden")}>
        <div className="absolute inset-0 z-0"><GradientBackground /></div>

        <div className="relative z-10 flex flex-col items-center gap-8 w-[320px] mx-auto p-4">
          <AnimatePresence mode="wait">
            {!loading && (
              <motion.div
                key="login-content"
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full flex flex-col items-center gap-4"
              >
                <BlurFade delay={0.25 * 1} className="w-full">
                  <div className="text-center">
                    <p className="font-serif font-light text-4xl sm:text-5xl tracking-tight whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                      Your daily footage
                    </p>
                  </div>
                </BlurFade>

                <BlurFade delay={0.25 * 2}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    every commit, reviewed.
                  </p>
                </BlurFade>

                <BlurFade delay={0.25 * 3}>
                  <div className="flex flex-col items-center gap-3 w-full mt-4">
                    <GlassButton
                      onClick={handleGitHubLogin}
                      size="sm"
                      contentClassName="flex items-center justify-center gap-2"
                    >
                      <GitHubIcon />
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Continue with GitHub</span>
                    </GlassButton>
                  </div>
                </BlurFade>

                {error && (
                  <BlurFade delay={0}>
                    <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
                  </BlurFade>
                )}
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }} />
                <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Connecting to GitHub…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center" style={{ color: 'var(--text-muted)', fontSize: '11px', maxWidth: '320px', lineHeight: '1.6' }}>
        Connecting with GitHub grants Dailies read access to your commit history, including private repositories, to build your daily log.
      </p>
    </div>
  )
}
