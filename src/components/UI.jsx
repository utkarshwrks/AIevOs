import React, { useEffect, useRef, useState } from 'react'

/* ── DataNumber ─────────────────────────────────────────── */
export function DataNumber({ value, unit, large = false, color = 'var(--accent-cyan)' }) {
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
    <span className='cy-data' style={{ fontSize: large ? 48 : 28, color, display:'inline-flex', alignItems:'baseline', gap:4 }}>
      {txt}
      {unit && <span style={{ fontSize: large ? 16 : 12, color:'var(--text-secondary)', fontFamily:'Rajdhani', fontWeight:600 }}>{unit}</span>}
    </span>
  )
}

/* ── Card ───────────────────────────────────────────────── */
export function Card({ children, style = {} }) {
  return <div className='cy-panel' style={style}>{children}</div>
}

/* ── CardTitle ──────────────────────────────────────────── */
export function CardTitle({ children }) {
  return <div className='cy-title'>{children}</div>
}

/* ── MetricCard ─────────────────────────────────────────── */
export function MetricCard({ label, value, sub, color = 'var(--accent-cyan)', barPct, barColor }) {
  return (
    <Card>
      <CardTitle>{label}</CardTitle>
      <DataNumber value={typeof value === 'string' ? parseFloat(value) || value : value} color={color} />
      {sub && <div style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>{sub}</div>}
      {barPct !== undefined && <ProgressBar value={barPct} color={barColor} />}
    </Card>
  )
}

/* ── ProgressBar ────────────────────────────────────────── */
export function ProgressBar({ value, color }) {
  const pct = Math.max(0, Math.min(100, value ?? 0))
  const bg = color
    || (pct > 70 ? 'linear-gradient(90deg,var(--accent-cyan),var(--accent-green))'
       : pct > 40 ? 'linear-gradient(90deg,var(--accent-amber),var(--accent-cyan))'
       :            'linear-gradient(90deg,var(--accent-red),var(--accent-amber))')
  return (
    <div className='cy-progress'>
      <span style={{ width:`${pct}%`, background: bg }} />
    </div>
  )
}

/* ── AlertRow ───────────────────────────────────────────── */
export function AlertRow({ sev, vehicle, module: mod, msg, detail, time }) {
  const map = { critical:'var(--accent-red)', warning:'var(--accent-amber)', info:'var(--accent-cyan)' }
  const c = map[sev] || map.info
  return (
    <div
      style={{
        display:'grid', gridTemplateColumns:'4px 1fr auto',
        gap:10, alignItems:'center', marginBottom:6,
        background:'rgba(255,255,255,.012)',
        border:'1px solid var(--border-dim)',
        animation:'pageIn .3s ease',
        transition:'border-color .2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-dim)'}
    >
      <div style={{ background:c, height:'100%', boxShadow:`0 0 8px ${c}` }} />
      <div style={{ padding:'8px 0' }}>
        <div style={{ color:c, fontSize:13, fontWeight:600 }}>{msg}</div>
        <div style={{ color:'var(--text-secondary)', fontFamily:'JetBrains Mono', fontSize:10, marginTop:2 }}>
          {vehicle} · {mod} · {detail}
        </div>
      </div>
      <div style={{ paddingRight:10, color:'var(--text-secondary)', fontFamily:'JetBrains Mono', fontSize:10 }}>{time}</div>
    </div>
  )
}

/* ── TabBar ─────────────────────────────────────────────── */
export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className='cy-btn'
          onClick={() => onChange(tab.id)}
          style={{
            background: active === tab.id ? 'var(--accent-cyan)' : 'transparent',
            color:      active === tab.id ? 'var(--bg-void)'     : 'var(--accent-cyan)',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/* ── Grid ───────────────────────────────────────────────── */
export function Grid({ cols = 2, gap = 10, children, style = {} }) {
  return (
    <div className='cy-grid' style={{ gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`, gap, ...style }}>
      {children}
    </div>
  )
}

/* ── StatusPill ─────────────────────────────────────────── */
export function StatusPill({ children, type = 'green' }) {
  const map = { green:'var(--accent-green)', amber:'var(--accent-amber)', red:'var(--accent-red)', blue:'var(--accent-cyan)' }
  const c = map[type] || map.green
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:8,
      border:`1px solid ${c}`, color:c,
      background:'rgba(0,0,0,.25)', padding:'3px 10px',
      fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:'.08em',
    }}>
      <span className='status-ring' style={{ color:c }} />
      {children}
    </div>
  )
}

/* ── LiveDot ────────────────────────────────────────────── */
export function LiveDot() {
  return <span className='status-ring' style={{ color:'var(--accent-green)' }} />
}

/* ── SectionTitle ───────────────────────────────────────── */
export function SectionTitle({ children }) {
  return (
    <h3 style={{ fontFamily:'Orbitron', fontSize:15, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>
      {children}
    </h3>
  )
}

/* ── SchemaBlock ────────────────────────────────────────── */
export function SchemaBlock({ table }) {
  return (
    <Card style={{ marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
        <CardTitle style={{ margin:0 }}>{table.name}</CardTitle>
        {table.badge && (
          <span style={{
            fontFamily:'JetBrains Mono', fontSize:9, padding:'2px 8px',
            border:'1px solid var(--accent-purple)', color:'var(--accent-purple)',
          }}>{table.badge}</span>
        )}
      </div>
      {table.fields.map((f, i) => (
        <div key={i} style={{
          display:'grid', gridTemplateColumns:'90px 1fr 36px',
          padding:'4px 0', borderBottom:'1px solid var(--border-dim)',
          fontFamily:'JetBrains Mono', fontSize:10,
        }}>
          <span style={{ color:'var(--accent-purple)' }}>{f.type}</span>
          <span style={{ color:'var(--text-primary)' }}>{f.name}</span>
          <span style={{ color:'var(--accent-amber)', fontSize:9 }}>{f.key || ''}</span>
        </div>
      ))}
    </Card>
  )
}

/* ── ArchLayer ──────────────────────────────────────────── */
export function ArchLayer({ layer }) {
  const colorMap = {
    teal:'var(--accent-cyan)', purple:'var(--accent-purple)', amber:'var(--accent-amber)',
    blue:'var(--accent-cyan)', red:'var(--accent-red)', green:'var(--accent-green)', gray:'var(--text-secondary)',
  }
  const c = colorMap[layer.color] || 'var(--accent-cyan)'
  return (
    <Card style={{ marginBottom:8 }}>
      <CardTitle>{layer.label}</CardTitle>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {layer.items.map(item => (
          <span key={item} style={{
            border:`1px solid ${c}22`,
            padding:'4px 10px',
            fontFamily:'JetBrains Mono', fontSize:11,
            color:c, opacity:.85,
            clipPath:'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))',
            transition:'all .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.borderColor = c }}
            onMouseLeave={e => { e.currentTarget.style.opacity = .85; e.currentTarget.style.borderColor = `${c}22` }}
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
  const mc = { GET:'var(--accent-green)', POST:'var(--accent-cyan)', WS:'var(--accent-purple)', DELETE:'var(--accent-red)', PUT:'var(--accent-amber)' }
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'52px 1fr auto',
      gap:10, borderBottom:'1px solid var(--border-dim)',
      padding:'7px 4px', fontFamily:'JetBrains Mono', fontSize:11,
      alignItems:'center', transition:'background .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color:mc[method] || 'var(--accent-cyan)', fontWeight:600, fontSize:10 }}>{method}</span>
      <span style={{ color:'var(--text-primary)' }}>{path}</span>
      <span style={{ color:'var(--text-secondary)', fontSize:10 }}>{desc}</span>
    </div>
  )
}