import React, { useState, useRef, useEffect } from 'react'
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
  const [showSuccess, setShowSuccess] = useState(false)

  const handleGitHubLogin = async () => {
    if (!isLoaded || loading) return
    setLoading(true)
    setError('')

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_github',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (err) {
      setError('Failed to start GitHub authentication. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen w-screen flex flex-col">
      <style>{`
        @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
        @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
        .glass-button-wrap { --anim-time: 400ms; --anim-ease: cubic-bezier(0.25, 1, 0.5, 1); --border-width: clamp(1px, 0.0625em, 4px); position: relative; z-index: 2; transform-style: preserve-3d; transition: transform var(--anim-time) var(--anim-ease); }
        .glass-button-wrap:has(.glass-button:active) { transform: rotateX(25deg); }
        .glass-button-shadow { --shadow-cutoff-fix: 2em; position: absolute; width: calc(100% + var(--shadow-cutoff-fix)); height: calc(100% + var(--shadow-cutoff-fix)); top: calc(0% - var(--shadow-cutoff-fix) / 2); left: calc(0% - var(--shadow-cutoff-fix) / 2); filter: blur(clamp(2px, 0.125em, 12px)); transition: filter var(--anim-time) var(--anim-ease); pointer-events: none; z-index: 0; }
        .glass-button-shadow::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: linear-gradient(180deg, oklch(from var(--text-primary) l c h / 20%), oklch(from var(--text-primary) l c h / 10%)); width: calc(100% - var(--shadow-cutoff-fix) - 0.25em); height: calc(100% - var(--shadow-cutoff-fix) - 0.25em); top: calc(var(--shadow-cutoff-fix) - 0.5em); left: calc(var(--shadow-cutoff-fix) - 0.875em); padding: 0.125em; box-sizing: border-box; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease); opacity: 1; }
        .glass-button { -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all var(--anim-time) var(--anim-ease); background: linear-gradient(-75deg, oklch(from var(--bg) l c h / 5%), oklch(from var(--bg) l c h / 20%), oklch(from var(--bg) l c h / 5%)); box-shadow: inset 0 0.125em 0.125em oklch(from var(--text-primary) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--bg) l c h / 50%), 0 0.25em 0.125em -0.125em oklch(from var(--text-primary) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--bg) l c h / 20%), 0 0 0 0 oklch(from var(--bg) l c h); }
        .glass-button:hover { transform: scale(0.975); backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em oklch(from var(--text-primary) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--bg) l c h / 50%), 0 0.15em 0.05em -0.1em oklch(from var(--text-primary) l c h / 25%), 0 0 0.05em 0.1em inset oklch(from var(--bg) l c h / 50%), 0 0 0 0 oklch(from var(--bg) l c h); }
        .glass-button-text { color: oklch(from var(--text-primary) l c h / 90%); text-shadow: 0em 0.25em 0.05em oklch(from var(--text-primary) l c h / 10%); transition: all var(--anim-time) var(--anim-ease); }
        .glass-button:hover .glass-button-text { text-shadow: 0.025em 0.025em 0.025em oklch(from var(--text-primary) l c h / 12%); }
        .glass-button-text::after { content: ""; display: block; position: absolute; width: calc(100% - var(--border-width)); height: calc(100% - var(--border-width)); top: calc(0% + var(--border-width) / 2); left: calc(0% + var(--border-width) / 2); box-sizing: border-box; border-radius: 9999px; overflow: clip; background: linear-gradient(var(--angle-2), transparent 0%, oklch(from var(--bg) l c h / 50%) 40% 50%, transparent 55%); z-index: 3; mix-blend-mode: screen; pointer-events: none; background-size: 200% 200%; background-position: 0% 50%; transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease); }
        .glass-button:hover .glass-button-text::after { background-position: 25% 50%; }
        .glass-button:active .glass-button-text::after { background-position: 50% 15%; --angle-2: -15deg; }
        .glass-button::after { content: ""; position: absolute; z-index: 1; inset: 0; border-radius: 9999px; width: calc(100% + var(--border-width)); height: calc(100% + var(--border-width)); top: calc(0% - var(--border-width) / 2); left: calc(0% - var(--border-width) / 2); padding: var(--border-width); box-sizing: border-box; background: conic-gradient(from var(--angle-1) at 50% 50%, oklch(from var(--text-primary) l c h / 50%) 0%, transparent 5% 40%, oklch(from var(--text-primary) l c h / 50%) 50%, transparent 60% 95%, oklch(from var(--text-primary) l c h / 50%) 100%), linear-gradient(180deg, oklch(from var(--bg) l c h / 50%), oklch(from var(--bg) l c h / 50%)); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease), --angle-1 500ms ease; box-shadow: inset 0 0 0 calc(var(--border-width) / 2) oklch(from var(--bg) l c h / 50%); pointer-events: none; }
        .glass-button:hover::after { --angle-1: -125deg; }
        .glass-button:active::after { --angle-1: -75deg; }
        .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow { filter: blur(clamp(2px, 0.0625em, 6px)); }
        .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.875em); opacity: 1; }
        .glass-button-wrap:has(.glass-button:active) .glass-button-shadow { filter: blur(clamp(2px, 0.125em, 12px)); }
        .glass-button-wrap:has(.glass-button:active) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.5em); opacity: 0.75; }
        .glass-button-wrap:has(.glass-button:active) .glass-button-text { text-shadow: 0.025em 0.25em 0.05em oklch(from var(--text-primary) l c h / 12%); }
        .glass-button-wrap:has(.glass-button:active) .glass-button { box-shadow: inset 0 0.125em 0.125em oklch(from var(--text-primary) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--bg) l c h / 50%), 0 0.125em 0.125em -0.125em oklch(from var(--text-primary) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--bg) l c h / 20%), 0 0.225em 0.05em 0 oklch(from var(--text-primary) l c h / 5%), 0 0.25em 0 0 oklch(from var(--bg) l c h / 75%), inset 0 0.25em 0.05em 0 oklch(from var(--text-primary) l c h / 15%); }
        @media (hover: none) and (pointer: coarse) { .glass-button::after, .glass-button:hover::after, .glass-button:active::after { --angle-1: -75deg; } .glass-button .glass-button-text::after, .glass-button:active .glass-button-text::after { --angle-2: -45deg; } }
      `}</style>

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
            {!loading && !showSuccess && (
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
                <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Connecting to GitHub...</p>
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
