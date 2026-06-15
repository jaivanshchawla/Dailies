import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
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
