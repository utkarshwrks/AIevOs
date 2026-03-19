import React, { useEffect, useMemo, useState } from 'react'

export function DataNumber({ value, unit, large = false, color = 'var(--accent-cyan)' }) {
  const numeric = typeof value === 'number' ? value : parseFloat(value)
  const [display, setDisplay] = useState(Number.isFinite(numeric) ? numeric : 0)

  useEffect(() => {
    if (!Number.isFinite(numeric)) return
    const start = display
    const delta = numeric - start
    let frame
    const begin = performance.now()
    const animate = now => {
      const p = Math.min(1, (now - begin) / 450)
      setDisplay(start + delta * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [numeric])

  const txt = Number.isFinite(numeric) ? Math.round(display * 100) / 100 : value
  return <span className='cy-data' style={{ fontSize: large ? 48 : 28, color }}>{txt}{unit && <span style={{ fontSize: large ? 16 : 12, color: 'var(--text-secondary)', marginLeft: 4 }}>{unit}</span>}</span>
}

export function Card({ children, style = {} }) { return <div className='cy-panel' style={style}>{children}</div> }
export function CardTitle({ children }) { return <div className='cy-title'>{children}</div> }

export function MetricCard({ label, value, sub, color = 'var(--accent-cyan)', barPct }) {
  return <Card><CardTitle>{label}</CardTitle><div><DataNumber value={typeof value === 'string' ? Number(value) || value : value} color={color} /></div>{sub && <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{sub}</div>}{barPct !== undefined && <ProgressBar value={barPct} />}</Card>
}

export function SectionTitle({ children }) { return <h3 style={{ fontFamily: 'Orbitron', fontSize: 16, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>{children}</h3> }

export function StatusPill({ children, type = 'green' }) {
  const map = { green: 'var(--accent-green)', amber: 'var(--accent-amber)', red: 'var(--accent-red)', blue: 'var(--accent-cyan)' }
  const c = map[type] || map.green
  return <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${c}`, color: c, background: 'rgba(0,0,0,.2)', padding: '3px 8px', fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '.08em' }}><span className='status-ring' style={{ color: c }} />{children}</div>
}

export function LiveDot() { return <span className='status-ring' style={{ color: 'var(--accent-green)' }} /> }

export function Grid({ cols = 4, gap = 10, children, style = {} }) {
  return <div className='cy-grid' style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap, ...style }}>{children}</div>
}

export function ProgressBar({ value }) {
  return <div className='cy-progress' style={{ marginTop: 8 }}><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
}

export function AlertRow({ sev, vehicle, module: mod, msg, detail, time }) {
  const map = { critical: 'var(--accent-red)', warning: 'var(--accent-amber)', info: 'var(--accent-cyan)' }
  const c = map[sev] || map.info
  return <div style={{ display: 'grid', gridTemplateColumns: '4px 1fr auto', gap: 10, alignItems: 'center', marginBottom: 6, background: 'rgba(255,255,255,.01)', border: '1px solid var(--border-dim)', animation: 'pageIn .3s ease' }}><div style={{ background: c, height: '100%' }} /><div style={{ padding: '8px 0' }}><div style={{ color: c, fontSize: 13 }}>{msg}</div><div style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 10 }}>{vehicle} · {mod} · {detail}</div></div><div style={{ paddingRight: 8, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 10 }}>{time}</div></div>
}

export function TabBar({ tabs, active, onChange }) {
  return <div style={{ display: 'grid', gridAutoFlow: 'column', gap: 6, marginBottom: 10 }}>{tabs.map(tab => <button className='cy-btn' key={tab.id} onClick={() => onChange(tab.id)} style={{ background: active === tab.id ? 'var(--accent-cyan)' : 'transparent', color: active === tab.id ? 'var(--bg-void)' : 'var(--accent-cyan)' }}>{tab.label}</button>)}</div>
}

export function SchemaBlock({ table }) { return <Card style={{ marginBottom: 8 }}><CardTitle>{table.name}</CardTitle>{table.fields.map((f, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 10 }}><span style={{ color: 'var(--accent-purple)' }}>{f.type}</span><span>{f.name}</span><span>{f.key || ''}</span></div>)}</Card> }

export function ArchLayer({ layer }) { return <Card style={{ marginBottom: 8 }}><CardTitle>{layer.label}</CardTitle><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{layer.items.map(item => <span key={item} style={{ border: '1px solid var(--border-dim)', padding: '4px 8px', fontFamily: 'JetBrains Mono', fontSize: 11 }}>{item}</span>)}</div></Card> }

export function ApiEndpoint({ method, path, desc }) { return <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr auto', gap: 10, borderBottom: '1px solid var(--border-dim)', padding: '6px 0', fontFamily: 'JetBrains Mono', fontSize: 11 }}><span style={{ color: 'var(--accent-cyan)' }}>{method}</span><span>{path}</span><span style={{ color: 'var(--text-secondary)' }}>{desc}</span></div> }
