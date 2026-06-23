import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const buttonRef = useRef(null)

  useEffect(() => {
    return () => gsap.killTweensOf(buttonRef.current)
  }, [])

  const handleToggle = () => {
    gsap.killTweensOf(buttonRef.current)
    gsap.to(buttonRef.current, {
      rotate: 180,
      scale: 0.7,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        toggleTheme()
        gsap.fromTo(
          buttonRef.current,
          { rotate: -180, scale: 0.7, opacity: 0 },
          { rotate: 0, scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.7)' }
        )
      },
    })
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="glass-pill"
      style={{
        width: '36px', height: '36px', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', border: 'none', color: 'var(--text-primary)'
      }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
