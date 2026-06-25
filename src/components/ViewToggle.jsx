import React, { memo } from 'react'

const ToggleBtn = memo(function ToggleBtn({ label, val, active, onClick }) {
  return (
    <button
      className={active ? 'glass-pill active' : ''}
      style={{
        padding: '6px 18px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.15s',
        background: active ? 'var(--glass-bg-strong)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-muted)',
      }}
      onClick={() => onClick(val)}
    >
      {label}
    </button>
  )
})

export default memo(function ViewToggle({ view, onToggle }) {
  return (
    <div className="glass-pill" style={{
      display: 'inline-flex', padding: '3px'
    }}>
      <ToggleBtn label="Log" val="log" active={view === 'log'} onClick={onToggle} />
      <ToggleBtn label="Summary" val="summary" active={view === 'summary'} onClick={onToggle} />
    </div>
  )
})
