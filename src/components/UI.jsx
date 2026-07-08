import React, { useEffect, useRef, useState } from 'react'

/* ── PageHeader (SaaS Architecture) ───────────────────────── */
export function PageHeader({ title, description, actions, filters }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 24,
      borderBottom: '1px solid var(--bg-border)',
      paddingBottom: 16
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 4
          }}>
            {title}
          </h1>
          {description && (
            <p style={{
              fontSize: 12.5,
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {actions}
          </div>
        )}
      </div>
      {filters && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {filters}
        </div>
      )}
    </div>
  )
}

/* ── EmptyState (Notion/Linear style) ─────────────────────── */
export function EmptyState({ title = "No records found", description = "Try adjusting your filters or search terms.", action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      border: '1px dashed var(--bg-border)',
      borderRadius: 12,
      background: 'var(--bg-surface)',
      animation: 'pageIn 0.3s ease'
    }}>
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18m-18 0-1.125 1.125A2.25 2.25 0 0 0 2.25 18v2.25A2.25 2.25 0 0 0 4.5 22.5h15a2.25 2.25 0 0 0 2.25-2.25V18a2.25 2.25 0 0 0-.676-1.59l-1.125-1.125M2.25 13.5v-3.375A2.25 2.25 0 0 1 4.5 7.875h.75c1.01 0 1.94-.48 2.52-1.29l.885-1.356A2.25 2.25 0 0 1 10.45 4.5h3.1a2.25 2.25 0 0 1 1.795.894l.885 1.356a2.25 2.25 0 0 0 2.52 1.29h.75a2.25 2.25 0 0 1 2.25 3.375V13.5" />
      </svg>
      <h5 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h5>
      <p style={{ fontSize: 11.5, color: 'var(--text-muted)', maxWidth: 320, marginBottom: 16, lineHeight: 1.45 }}>{description}</p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}

/* ── DataNumber ─────────────────────────────────────────── */
export function DataNumber({ value, unit, large = false, color = 'var(--text-primary)' }) {
  const numeric = typeof value === 'number' ? value : parseFloat(value)
  const [display, setDisplay] = useState(Number.isFinite(numeric) ? numeric : 0)
  const frameRef = useRef(null)
  const prevRef  = useRef(display)

  useEffect(() => {
    if (!Number.isFinite(numeric)) return
    cancelAnimationFrame(frameRef.current)
    const start = prevRef.current
    const delta = numeric - start
    const begin = performance.now()
    const animate = now => {
      const p     = Math.min(1, (now - begin) / 480)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(start + delta * eased)
      if (p < 1) frameRef.current = requestAnimationFrame(animate)
      else prevRef.current = numeric
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [numeric])

  const txt = Number.isFinite(numeric)
    ? (Number.isInteger(numeric) ? Math.round(display) : Math.round(display * 10) / 10)
    : value

  return (
    <span className='cy-data' style={{ fontSize: large ? 38 : 22, color, display:'inline-flex', alignItems:'baseline', gap:4 }}>
      {txt}
      {unit && (
        <span style={{
          fontSize: large ? 13 : 11,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          marginLeft: 2
        }}>
          {unit}
        </span>
      )}
    </span>
  )
}

/* ── Card ───────────────────────────────────────────────── */
export function Card({ children, style = {} }) {
  return <div className='cy-panel' style={style}>{children}</div>
}

/* ── CardTitle ──────────────────────────────────────────── */
export function CardTitle({ children, style = {} }) {
  return <div className='cy-title' style={style}>{children}</div>
}

/* ── MetricCard ─────────────────────────────────────────── */
export function MetricCard({ label, value, sub, color = 'var(--text-primary)', barPct, barColor }) {
  return (
    <Card>
      <CardTitle style={{ marginBottom: 6 }}>{label}</CardTitle>
      <DataNumber value={typeof value === 'string' ? parseFloat(value) || value : value} color={color} />
      {sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-sans)' }}>{sub}</div>}
      {barPct !== undefined && <ProgressBar value={barPct} color={barColor} />}
    </Card>
  )
}

/* ── ProgressBar ────────────────────────────────────────── */
export function ProgressBar({ value, color }) {
  const pct = Math.max(0, Math.min(100, value ?? 0))
  const bg = color
    || (pct > 70 ? 'var(--accent-success)'
       : pct > 45 ? 'var(--accent-primary)'
       :            'var(--accent-danger)')
  return (
    <div className='cy-progress'>
      <span style={{ width: `${pct}%`, background: bg }} />
    </div>
  )
}

/* ── AlertRow ───────────────────────────────────────────── */
export function AlertRow({ sev, vehicle, module: mod, msg, detail, time, onClick }) {
  const map = {
    critical: 'var(--accent-danger)',
    warning: 'var(--accent-warning)',
    info: 'var(--accent-primary)'
  }
  const c = map[sev] || map.info
  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '4px 1fr auto',
        gap: 12,
        alignItems: 'center',
        marginBottom: 8,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--bg-border)',
        borderRadius: '6px',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        animation: 'pageIn .25s ease',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--bg-border)';
        e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
      }}
    >
      <div style={{ background: c, height: '100%' }} />
      <div style={{ padding: '8px 0' }}>
        <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{msg}</div>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10, marginTop: 2 }}>
          {vehicle} · {mod} · {detail}
        </div>
      </div>
      <div style={{ paddingRight: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        {time}
      </div>
    </div>
  )
}

/* ── TabBar ─────────────────────────────────────────────── */
export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      marginBottom: 16,
      flexWrap: 'wrap',
      background: 'var(--bg-secondary)',
      padding: '3px',
      borderRadius: '8px',
      width: 'fit-content',
      border: '1px solid var(--bg-border)'
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              border: 'none',
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.15s, background-color 0.15s',
              outline: 'none',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Grid ───────────────────────────────────────────────── */
export function Grid({ cols = 2, gap = 16, children, style = {} }) {
  return (
    <div className='cy-grid' data-cols={cols} style={{ gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap, ...style }}>
      {children}
    </div>
  )
}

/* ── StatusPill ─────────────────────────────────────────── */
export function StatusPill({ children, type = 'green' }) {
  const map = {
    green: 'var(--accent-success)',
    amber: 'var(--accent-warning)',
    red: 'var(--accent-danger)',
    blue: 'var(--accent-primary)',
    gray: 'var(--text-muted)'
  }
  const c = map[type] || map.green
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: `1px solid ${c}30`,
      color: c,
      background: `${c}0c`,
      padding: '3px 8px',
      borderRadius: '4px',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.02em',
    }}>
      <span className='status-ring' style={{ color: c, width: 5, height: 5 }} />
      {children}
    </div>
  )
}

/* ── LiveDot ────────────────────────────────────────────── */
export function LiveDot() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-success)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.05em' }}>
      <span className='status-ring' style={{ color: 'var(--accent-success)', width: 6, height: 6 }} />
      LIVE
    </span>
  )
}

/* ── SectionTitle ───────────────────────────────────────── */
export function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--text-primary)',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }}>
      {children}
    </h3>
  )
}

/* ── SchemaBlock ────────────────────────────────────────── */
export function SchemaBlock({ table }) {
  return (
    <Card style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
          {table.name}
        </div>
        {table.badge && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            padding: '1px 5px',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            color: '#A78BFA',
            background: 'rgba(139, 92, 246, 0.05)',
            borderRadius: '3px',
          }}>
            {table.badge}
          </span>
        )}
      </div>
      {table.fields.map((f, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '95px 1fr 40px',
          padding: '5px 0',
          borderBottom: i < table.fields.length - 1 ? '1px solid var(--bg-border)' : 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          minWidth: 0,
        }}>
          <span style={{ color: '#A78BFA' }}>{f.type}</span>
          <span style={{ color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>{f.name}</span>
          <span style={{ color: 'var(--accent-warning)', fontSize: 9, textAlign: 'right' }}>{f.key || ''}</span>
        </div>
      ))}
    </Card>
  )
}

/* ── ArchLayer ──────────────────────────────────────────── */
export function ArchLayer({ layer }) {
  const colorMap = {
    teal: 'var(--accent-primary)',
    purple: '#A78BFA',
    amber: 'var(--accent-warning)',
    blue: 'var(--accent-primary)',
    red: 'var(--accent-danger)',
    green: 'var(--accent-success)',
    gray: 'var(--text-muted)',
  }
  const c = colorMap[layer.color] || 'var(--accent-primary)'
  return (
    <Card style={{ marginBottom: 0 }}>
      <CardTitle style={{ marginBottom: 8, fontSize: 10, color: 'var(--text-muted)' }}>{layer.label}</CardTitle>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {layer.items.map(item => (
          <span
            key={item}
            style={{
              border: `1px solid var(--bg-border)`,
              background: 'var(--bg-elevated)',
              padding: '4px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-primary)',
              borderRadius: '4px',
              transition: 'border-color 0.15s, background-color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = c;
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--bg-border)';
              e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </Card>
  )
}

/* ── ApiEndpoint ────────────────────────────────────────── */
export function ApiEndpoint({ method, path, desc }) {
  const mc = {
    GET: 'var(--accent-success)',
    POST: 'var(--accent-primary)',
    WS: '#A78BFA',
    DELETE: 'var(--accent-danger)',
    PUT: 'var(--accent-warning)'
  }
  const methodColor = mc[method] || 'var(--accent-primary)'
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '52px 1fr auto',
      gap: 10,
      borderBottom: '1px solid var(--bg-border)',
      padding: '7px 4px',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      alignItems: 'center',
      transition: 'background-color 0.15s',
      minWidth: 0,
    }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <span style={{
        color: methodColor,
        fontWeight: 600,
        fontSize: 9,
        background: `${methodColor}0f`,
        border: `1px solid ${methodColor}20`,
        borderRadius: '3px',
        padding: '1px 4px',
        textAlign: 'center',
        display: 'inline-block',
        width: 'fit-content'
      }}>
        {method}
      </span>
      <span style={{ color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>{path}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 10, textAlign: 'right' }}>{desc}</span>
    </div>
  )
}
