import React, { useMemo, useState } from 'react'

const MODULES = [
  { name: 'Battery Pack', key: 'battery', x: 230, y: 124, color: '#00ff9d' },
  { name: 'Motor', key: 'motor', x: 360, y: 124, color: '#00d4ff' },
  { name: 'Controller', key: 'controller', x: 300, y: 88, color: '#7b2fff' },
  { name: 'Wheels', key: 'wheels', x: 158, y: 180, color: '#00d4ff' },
  { name: 'Cooling System', key: 'cooling', x: 420, y: 95, color: '#ff2d55' },
]

export default function EVCarHologram3D({ vehicleData, onSelectModule, selectedModule }) {
  const [hovered, setHovered] = useState(null)
  const stats = useMemo(() => ({
    id: vehicleData?.id || 'EV-007',
    status: vehicleData?.status || 'ACTIVE',
    health: vehicleData?.health || 90,
  }), [vehicleData])

  return (
    <div className='cy-panel hologram-panel' style={{ minHeight: 420, position: 'relative', overflow: 'hidden' }}>
      <div className='cy-title'>EVCarHologram3D · {stats.id}</div>
      <div className='holo-scan' />
      <svg viewBox='0 0 700 360' style={{ width: '100%', height: 340, filter: 'drop-shadow(0 0 10px rgba(0,212,255,.35))' }}>
        <g transform='translate(20,18)'>
          <path d='M66 208 L120 156 L220 136 L430 136 L520 154 L590 190 L602 214 L590 230 L548 234 L530 206 L152 206 L130 235 L80 234 L58 222 Z' fill='rgba(0,212,255,.05)' stroke='#00d4ff' strokeWidth='2.2' />
          <path d='M202 138 L256 88 L394 88 L446 138 Z' fill='rgba(0,212,255,.04)' stroke='#00d4ff' strokeWidth='1.4' />
          <ellipse cx='170' cy='220' rx='36' ry='34' fill='rgba(10,21,32,.5)' stroke='#00d4ff' />
          <ellipse cx='500' cy='220' rx='36' ry='34' fill='rgba(10,21,32,.5)' stroke='#00d4ff' />

          <rect x='224' y='156' width='136' height='38' fill='rgba(0,255,157,.08)' stroke='#00ff9d' strokeDasharray='4 3' />
          <rect x='364' y='156' width='74' height='32' fill='rgba(0,212,255,.08)' stroke='#00d4ff' />
          <rect x='282' y='120' width='60' height='26' fill='rgba(123,47,255,.09)' stroke='#7b2fff' />
          <line x1='356' y1='172' x2='500' y2='202' stroke='#ff2d55' strokeDasharray='3 3' />

          {MODULES.map(module => {
            const active = selectedModule === module.key || hovered?.key === module.key
            return (
              <g
                key={module.key}
                onClick={() => onSelectModule?.(module.key)}
                onMouseEnter={() => setHovered(module)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={module.x} cy={module.y} r={active ? 11 : 8} fill={module.color} opacity={active ? 1 : .85} />
                <circle cx={module.x} cy={module.y} r={active ? 20 : 16} fill='transparent' stroke={module.color} strokeOpacity='.6'>
                  <animate attributeName='r' values='14;20;14' dur='1.4s' repeatCount='indefinite' />
                </circle>
                <text x={module.x + 14} y={module.y - 10} fill={module.color} fontSize='10' fontFamily='JetBrains Mono'>
                  {module.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {(hovered || selectedModule) && (
        <div className='holo-tooltip' style={{ left: 12, right: 'auto' }}>
          {hovered?.name || MODULES.find(m => m.key === selectedModule)?.name || 'Module'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-secondary)' }}>
        <span>STATUS: {stats.status}</span>
        <span>HEALTH: {stats.health}%</span>
        <span>VIEW: TOP+SIDE HYBRID</span>
      </div>
    </div>
  )
}
