import React from 'react'

export default function FleetGlobe3D({ vehicles = [] }) {
  return (
    <div className='cy-panel hologram-panel' style={{ minHeight: 300 }}>
      <div className='cy-title'>Fleet Globe</div>
      <div style={{ height: 250, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: 210, height: 210, borderRadius: '50%', border: '1px solid var(--accent-cyan)', position: 'relative', boxShadow: 'var(--glow-cyan)', animation: 'floatY 4s ease-in-out infinite', overflow: 'hidden' }}>
          <div className='holo-scan' />
          <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px dashed rgba(0,212,255,.35)' }} />
          {vehicles.slice(0, 12).map((v, i) => (
            <span
              key={v.id}
              title={`${v.id} · ${v.status}`}
              style={{
                position: 'absolute',
                left: `${14 + (i * 17) % 78}%`,
                top: `${10 + (i * 23) % 78}%`,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: v.health > 85 ? '#00ff9d' : v.health > 70 ? '#ffb800' : '#ff2d55',
                boxShadow: '0 0 8px currentColor',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
