import React from 'react'

export default function VehicleOverview3D({ onSelectModule }) {
  const hotspots = [
    { label: 'Battery', key: 'battery', x: 224, y: 110 },
    { label: 'Motor', key: 'motor', x: 354, y: 110 },
    { label: 'Controller', key: 'controller', x: 278, y: 78 },
    { label: 'Wheels', key: 'wheels', x: 162, y: 166 },
    { label: 'Cooling', key: 'cooling', x: 420, y: 95 },
  ]

  return (
    <div className='cy-panel hologram-panel' style={{ minHeight: 260, overflow: 'hidden' }}>
      <div className='cy-title'>Vehicle Overview</div>
      <svg viewBox='0 0 600 220' style={{ width: '100%', height: 220 }}>
        <rect x='80' y='80' width='400' height='80' fill='#0a1520' stroke='#00d4ff' strokeOpacity='.55' />
        <rect x='180' y='52' width='220' height='52' fill='#0f1f2e' stroke='#00d4ff' strokeOpacity='.4' />
        <circle cx='170' cy='170' r='28' fill='#060d14' stroke='#00d4ff' />
        <circle cx='420' cy='170' r='28' fill='#060d14' stroke='#00d4ff' />

        {hotspots.map(h => (
          <g key={h.key} onClick={() => onSelectModule?.(h.key)} style={{ cursor: 'pointer' }}>
            <circle cx={h.x} cy={h.y} r='7' fill='#00d4ff'>
              <animate attributeName='r' values='6;10;6' dur='1.6s' repeatCount='indefinite' />
            </circle>
            <text x={h.x} y={h.y - 12} fill='#8fc8d8' fontSize='10' textAnchor='middle'>
              {h.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
