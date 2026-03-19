import React, { useMemo, useState } from 'react'

const colorByTemp = t => t < 25 ? '#00ff9d' : t <= 40 ? '#00d4ff' : t <= 55 ? '#ffb800' : '#ff2d55'

export function BatteryPackVisualization3D() {
  const [hover, setHover] = useState(null)
  const cells = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ id: `C-${i + 1}`, t: +(20 + Math.random() * 45).toFixed(1), v: +(3.7 + Math.random() * .4).toFixed(3) })), [])

  return (
    <div className='cy-panel' style={{ minHeight: 320, position: 'relative', overflow: 'hidden' }}>
      <div className='cy-title'>BatteryPackVisualization3D</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 6, transform: 'perspective(800px) rotateX(50deg) rotateZ(-24deg)', marginTop: 40, animation: 'floatY 4s ease-in-out infinite' }}>
        {cells.map(cell => <div key={cell.id} onMouseEnter={() => setHover(cell)} onMouseLeave={() => setHover(null)} style={{ height: 22, background: colorByTemp(cell.t), border: '1px solid rgba(255,255,255,.25)', boxShadow: '0 0 10px rgba(0,0,0,.3)', transform: hover?.id === cell.id ? 'scale(1.2)' : 'scale(1)', transition: '.15s' }} />)}
      </div>
      {hover && <div style={{ position: 'absolute', right: 10, top: 10, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-primary)', border: '1px solid var(--accent-cyan)', background: 'rgba(2,4,8,.85)', padding: 8 }}>{hover.id} · {hover.v}V · {hover.t}°C</div>}
    </div>
  )
}

export function VehicleOverview3D({ onSelectModule }) {
  const hotspots = ['Battery', 'Motor', 'Wheels', 'Chassis']
  return (
    <div className='cy-panel' style={{ minHeight: 260 }}>
      <div className='cy-title'>VehicleOverview3D</div>
      <svg viewBox='0 0 600 220' style={{ width: '100%', height: 220 }}>
        <rect x='80' y='80' width='400' height='80' fill='#0a1520' stroke='#00d4ff' strokeOpacity='.6' />
        <rect x='180' y='50' width='220' height='50' fill='#0f1f2e' stroke='#00d4ff' strokeOpacity='.4' />
        <circle cx='170' cy='170' r='28' fill='#060d14' stroke='#00d4ff' />
        <circle cx='420' cy='170' r='28' fill='#060d14' stroke='#00d4ff' />
        {hotspots.map((h, i) => <g key={h} onClick={() => onSelectModule?.(h.toLowerCase())} style={{ cursor: 'pointer' }}>
          <circle cx={120 + i * 120} cy={45} r='8' fill='#00d4ff'><animate attributeName='r' values='7;10;7' dur='1.2s' repeatCount='indefinite' /></circle>
          <text x={120 + i * 120} y={28} fill='#5a7a8a' fontSize='10' textAnchor='middle'>{h}</text>
        </g>)}
      </svg>
    </div>
  )
}

export function FleetGlobe3D({ vehicles = [] }) {
  return (
    <div className='cy-panel' style={{ minHeight: 340 }}>
      <div className='cy-title'>FleetGlobe3D</div>
      <div style={{ height: 300, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: 220, height: 220, borderRadius: '50%', border: '1px solid var(--accent-cyan)', position: 'relative', boxShadow: 'var(--glow-cyan)', animation: 'floatY 4s ease-in-out infinite' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px dashed rgba(0,212,255,.35)' }} />
          {vehicles.slice(0, 12).map((v, i) => <span key={v.id} title={`${v.id} · ${v.status}`} style={{ position: 'absolute', left: `${15 + (i * 17) % 80}%`, top: `${10 + (i * 23) % 80}%`, width: 7, height: 7, borderRadius: '50%', background: v.health > 85 ? '#00ff9d' : v.health > 70 ? '#ffb800' : '#ff2d55', boxShadow: '0 0 8px currentColor' }} />)}
        </div>
      </div>
    </div>
  )
}
