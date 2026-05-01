// ── Button ────────────────────────────────────────────────────────

export function Button({ children, variant = 'primary', size = 'md', loading, fullWidth, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontFamily: 'var(--font-sans)', fontWeight: 500,
    borderRadius: 'var(--radius-sm)', cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s', border: '1px solid transparent',
    width: fullWidth ? '100%' : undefined,
    opacity: loading ? 0.7 : 1,
  }
  const sizes = {
    sm: { fontSize: 13, padding: '6px 12px' },
    md: { fontSize: 14, padding: '9px 18px' },
    lg: { fontSize: 15, padding: '12px 24px' },
  }
  const variants = {
    primary:   { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
    secondary: { background: 'var(--bg-input)', color: 'var(--text-1)', borderColor: 'var(--border)' },
    danger:    { background: 'rgba(239,68,68,0.12)', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' },
    ghost:     { background: 'transparent', color: 'var(--text-2)', borderColor: 'transparent' },
  }
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant] }} disabled={loading} {...props}>
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────

export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>}
      <input style={{ borderColor: error ? 'var(--danger)' : undefined }} {...props} />
      {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────

export function Select({ label, error, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>}
      <select {...props}>{children}</select>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}

// ── Alert ─────────────────────────────────────────────────────────

export function Alert({ type = 'info', children }) {
  const colors = {
    success: { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  color: 'var(--success)' },
    error:   { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  color: 'var(--danger)' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: 'var(--warning)' },
    info:    { bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.3)', color: 'var(--info)' },
  }
  const c = colors[type]
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
      borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13,
    }}>
      {children}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────

const BADGE_COLORS = {
  TODO:        { bg: 'rgba(132,140,168,0.15)', color: '#848ca8' },
  IN_PROGRESS: { bg: 'rgba(56,189,248,0.12)',  color: 'var(--info)' },
  DONE:        { bg: 'rgba(34,197,94,0.12)',   color: 'var(--success)' },
  LOW:         { bg: 'rgba(132,140,168,0.15)', color: '#848ca8' },
  MEDIUM:      { bg: 'rgba(245,158,11,0.12)',  color: 'var(--warning)' },
  HIGH:        { bg: 'rgba(239,68,68,0.12)',   color: 'var(--danger)' },
}

export function Badge({ value }) {
  const c = BADGE_COLORS[value] ?? { bg: 'var(--bg-input)', color: 'var(--text-2)' }
  const label = value?.replace('_', ' ')
  return (
    <span style={{
      ...c, fontSize: 11, fontWeight: 600, letterSpacing: '0.4px',
      padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase',
    }}>
      {label}
    </span>
  )
}

// ── Spinner ───────────────────────────────────────────────────────

export function Spinner({ size = 20, color = 'var(--accent)' }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: `2px solid rgba(91,109,248,0.2)`,
      borderTopColor: color, borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

// inject keyframe once
if (typeof document !== 'undefined' && !document.getElementById('tf-spin')) {
  const s = document.createElement('style')
  s.id = 'tf-spin'
  s.textContent = '@keyframes spin { to { transform: rotate(360deg) } }'
  document.head.appendChild(s)
}

// ── Modal ─────────────────────────────────────────────────────────

export function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', width: '100%', maxWidth: 480,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', color: 'var(--text-3)', fontSize: 20, lineHeight: 1,
            borderRadius: 4, padding: '0 4px',
          }}>×</button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────

export function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 24px',
      ...style,
    }}>
      {children}
    </div>
  )
}
