import React, { useState } from 'react'
import { BatteryCharging, Cable, Cpu, Frame, Gauge, Grid2x2, Scale, Settings2, Siren, CarFront, Globe } from 'lucide-react'

const NAV = [
  { id:'dashboard',    label:'Dashboard',   icon:Grid2x2,       dot:'cyan'   },
  { id:'vehicles',     label:'Vehicles',    icon:CarFront,      dot:'green'  },
  { id:'telemetry',    label:'Telemetry',   icon:Gauge,         dot:'cyan'   },
  { id:'alerts',       label:'Alerts',      icon:Siren,         dot:'red'    },
  { id:'cybomain',     label:'CyboLion',    icon:BatteryCharging,dot:'green' },
  { id:'cybodrive',    label:'CyboDrive',   icon:Settings2,     dot:'cyan'   },
  { id:'cybomodules',  label:'Fleet View',  icon:Globe,         dot:'cyan'   },
  { id:'aimodels',     label:'AI Models',   icon:Cpu,           dot:'purple' },
  { id:'architecture', label:'Architecture',icon:Scale,         dot:'cyan'   },
  { id:'database',     label:'Database',    icon:Frame,         dot:'cyan'   },
  { id:'api',          label:'API Docs',    icon:Cable,         dot:'cyan'   },
]

const DOT_COLORS = {
  cyan:   'var(--accent-cyan)',
  green:  'var(--accent-green)',
  amber:  'var(--accent-amber)',
  red:    'var(--accent-red)',
  purple: 'var(--accent-purple)',
}

export default function Sidebar({ active, onNavigate, isMobile = false, mobileOpen = false, onClose }) {
  const [expanded, setExpanded] = useState(true)
  const sidebarOpen = isMobile ? mobileOpen : true

  return (
    <aside style={{
      width: isMobile ? 220 : (expanded ? 220 : 60),
      transition: isMobile ? 'transform .25s ease' : 'width .35s cubic-bezier(.2,.9,.2,1)',
      borderRight: '1px solid var(--border-dim)',
      background: 'linear-gradient(180deg, #030912, var(--bg-void))',
      display: 'grid',
      gridTemplateRows: '68px 1fr 50px',
      overflow: 'hidden',
      flexShrink: 0,
      position: isMobile ? 'fixed' : 'relative',
      left: 0,
      top: 0,
      bottom: 0,
      transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
      zIndex: 100,
    }}>

      {/* Logo / toggle */}
      <button
        onClick={() => {
          if (isMobile) onClose?.()
          else setExpanded(v => !v)
        }}
        style={{
          background:'transparent', border:'none',
          cursor:'pointer', textAlign:'left',
          padding: expanded ? '14px 16px' : '14px 0',
          display:'flex', alignItems:'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          borderBottom:'1px solid var(--border-dim)',
        }}
      >
        {(expanded || isMobile) ? (
          <div>
            <div style={{ fontFamily:'Orbitron', fontSize:18, fontWeight:900, color:'var(--accent-cyan)', textShadow:'var(--glow-cyan)', letterSpacing:'.05em' }}>
              AiEVOS
            </div>
            <div style={{ fontFamily:'JetBrains Mono', fontSize:8, color:'var(--text-secondary)', letterSpacing:'.2em', marginTop:2 }}>
              AI EV OPERATING SYS
            </div>
          </div>
        ) : (
          <div style={{ fontFamily:'Orbitron', fontSize:13, fontWeight:900, color:'var(--accent-cyan)', textShadow:'var(--glow-cyan)' }}>
            Ai
          </div>
        )}
      </button>

      {/* Nav */}
      <nav style={{ overflowY:'auto', padding:'8px 6px', display:'grid', gap:3, alignContent:'start' }}>
        {NAV.map(item => {
          const Icon     = item.icon
          const isActive = item.id === active
          const dotColor = DOT_COLORS[item.dot] || 'var(--accent-cyan)'

          return (
            <button
              key={item.id}
              title={(!expanded && !isMobile) ? item.label : undefined}
              onClick={() => onNavigate(item.id)}
              style={{
                display:'flex',
                alignItems:'center',
                gap: (expanded || isMobile) ? 10 : 0,
                justifyContent: (expanded || isMobile) ? 'flex-start' : 'center',
                border:'none',
                cursor:'pointer',
                textAlign:'left',
                padding: (expanded || isMobile) ? '9px 10px' : '10px 0',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0,212,255,.07)' : 'transparent',
                borderLeft: isActive ? `3px solid var(--accent-cyan)` : '3px solid transparent',
                boxShadow: isActive ? 'inset 0 0 20px rgba(0,212,255,.04)' : 'none',
                clipPath: isActive
                  ? 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)'
                  : 'none',
                transition:'all .18s',
                position:'relative',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {/* Status dot */}
              <span style={{
                position:'absolute', left: (expanded || isMobile) ? 36 : 26, top: 7,
                width:5, height:5, borderRadius:'50%',
                background: isActive ? dotColor : 'transparent',
                boxShadow: isActive ? `0 0 6px ${dotColor}` : 'none',
                transition:'all .2s',
              }} />

              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              {(expanded || isMobile) && (
                <span style={{
                  fontFamily:'Rajdhani', letterSpacing:'.1em',
                  textTransform:'uppercase', fontSize:12, fontWeight:600,
                }}>
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* System status footer */}
      <div style={{
        borderTop:'1px solid var(--border-dim)',
        display:'flex', alignItems:'center',
        gap:8, padding: (expanded || isMobile) ? '10px 12px' : '10px 0',
        justifyContent: (expanded || isMobile) ? 'flex-start' : 'center',
        color:'var(--accent-green)',
        fontFamily:'JetBrains Mono', fontSize:10,
      }}>
        <span className='status-ring' style={{ color:'var(--accent-green)', animation:'pulse-g 2s infinite' }} />
        {(expanded || isMobile) && <span style={{ letterSpacing:'.12em' }}>SYSTEM ACTIVE</span>}
      </div>
    </aside>
  )
}
