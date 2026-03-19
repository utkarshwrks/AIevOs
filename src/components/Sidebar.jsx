import React, { useState } from 'react'
import { BatteryCharging, Cable, Cpu, Frame, Gauge, Grid2x2, Scale, Settings2, Siren, CarFront } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Grid2x2 },
  { id: 'vehicles', label: 'Vehicles', icon: CarFront },
  { id: 'telemetry', label: 'Telemetry', icon: Gauge },
  { id: 'alerts', label: 'Alerts', icon: Siren },
  { id: 'cybomain', label: 'CyboLion', icon: BatteryCharging },
  { id: 'cybodrive', label: 'CyboDrive', icon: Settings2 },
  { id: 'cybomodules', label: 'CyboWire', icon: Cable },
  { id: 'aimodels', label: 'CyboControl', icon: Cpu },
  { id: 'architecture', label: 'CyboBalance', icon: Scale },
  { id: 'database', label: 'CyboFrame', icon: Frame },
  { id: 'api', label: 'API', icon: Cpu },
]

export default function Sidebar({ active, onNavigate }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <aside style={{ width: expanded ? 240 : 72, transition: 'width .35s cubic-bezier(.2,.9,.2,1)', borderRight: '1px solid var(--border-dim)', background: 'linear-gradient(180deg,#030912,#020408)', display: 'grid', gridTemplateRows: '72px 1fr 46px' }}>
      <button onClick={() => setExpanded(v => !v)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textAlign: 'left', padding: '14px 12px' }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: 20, textShadow: 'var(--glow-cyan)' }}>AiEVOS</div>
      </button>

      <nav style={{ overflowY: 'auto', padding: 6, display: 'grid', gap: 4 }}>
        {NAV.map(item => {
          const Icon = item.icon
          const isActive = item.id === active
          return <button key={item.id} title={item.label} onClick={() => onNavigate(item.id)} style={{ display: 'grid', gridTemplateColumns: expanded ? '20px 1fr' : '1fr', gap: 10, alignItems: 'center', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '9px 8px', color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)', background: isActive ? 'var(--bg-elevated)' : 'transparent', borderLeft: isActive ? '4px solid var(--accent-cyan)' : '4px solid transparent', boxShadow: isActive ? 'var(--glow-cyan)' : 'none' }}><Icon size={16} />{expanded && <span style={{ fontFamily: 'Rajdhani', letterSpacing: '.08em', textTransform: 'uppercase', fontSize: 12 }}>{item.label}</span>}</button>
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border-dim)', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', color: 'var(--accent-green)', fontFamily: 'JetBrains Mono', fontSize: 10 }}><span className='status-ring' />{expanded && 'SYSTEM ACTIVE'}</div>
    </aside>
  )
}
