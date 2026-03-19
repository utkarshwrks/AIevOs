import React, { useMemo, useState } from 'react'

const colorByTemp = t => (t < 25 ? '#00ff9d' : t <= 40 ? '#00d4ff' : t <= 55 ? '#ffb800' : '#ff2d55')

export default function BatteryPackVisualization3D() {
  const [hover, setHover] = useState(null)
  const cells = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({ id: `C-${i + 1}`, t: +(20 + Math.random() * 45).toFixed(1), v: +(3.7 + Math.random() * 0.4).toFixed(3) })),
    []
  )

  return (
    <div className='cy-panel hologram-panel' style={{ minHeight: 320, position: 'relative', overflow: 'hidden' }}>
      <div className='cy-title'>Battery Pack Matrix</div>
      <div className='holo-scan' />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, transform: 'perspective(800px) rotateX(56deg) rotateZ(-24deg)', marginTop: 36, animation: 'floatY 4s ease-in-out infinite' }}>
        {cells.map(cell => (
          <div
            key={cell.id}
            onMouseEnter={() => setHover(cell)}
            onMouseLeave={() => setHover(null)}
            style={{
              height: 22,
              background: colorByTemp(cell.t),
              border: '1px solid rgba(255,255,255,.25)',
              boxShadow: '0 0 10px rgba(0,212,255,.25)',
              transform: hover?.id === cell.id ? 'scale(1.2)' : 'scale(1)',
              transition: '.2s',
            }}
          />
        ))}
      </div>
      {hover && (
        <div className='holo-tooltip'>
          {hover.id} · {hover.v}V · {hover.t}°C
        </div>
      )}
    </div>
  )
}
