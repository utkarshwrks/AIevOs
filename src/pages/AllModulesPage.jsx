import React, { useState } from 'react'
import { VEHICLES } from '../data/mockData'
import { FleetGlobe3D } from '../components/ThreeVisuals'
import { Card, ProgressBar } from '../components/UI'

export default function AllModulesPage() {
  const [expanded, setExpanded] = useState(null)
  return (
    <div className='cy-grid' style={{ gridTemplateColumns: '2fr 3fr' }}>
      <FleetGlobe3D vehicles={VEHICLES} />
      <Card>
        <div className='cy-title'>Fleet Vehicles</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {VEHICLES.map(v => {
            const c = v.health > 85 ? 'var(--accent-green)' : v.health > 70 ? 'var(--accent-amber)' : 'var(--accent-red)'
            return <div key={v.id} style={{ border: '1px solid var(--border-dim)', padding: 8, cursor: 'pointer' }} onClick={() => setExpanded(expanded === v.id ? null : v.id)}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 70px 1fr 1fr 80px', gap: 8, alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 11 }}><span>{v.id}</span><span style={{ color: c }}>{v.status}</span><ProgressBar value={v.soc} /><span>{v.model}</span><span>{Math.floor(Math.random() * 60)}s</span></div>
              {expanded === v.id && <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 10 }}>Health {v.health}% · Location Sector-{(v.id.slice(-2))} · Last ping now</div>}
            </div>
          })}
        </div>
      </Card>
    </div>
  )
}
