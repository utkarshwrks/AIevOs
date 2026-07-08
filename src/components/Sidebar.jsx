import React, { useState } from 'react'
import { BatteryCharging, Cable, Cpu, Frame, Gauge, Grid2x2, Scale, Settings2, Siren, CarFront, Globe, ChevronLeft, ChevronRight, Search, ChevronsUpDown, Command } from 'lucide-react'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',   icon: Grid2x2       },
  { id: 'vehicles',     label: 'Vehicles',    icon: CarFront      },
  { id: 'telemetry',    label: 'Telemetry',   icon: Gauge         },
  { id: 'alerts',       label: 'Alerts',      icon: Siren         },
  { id: 'cybomain',     label: 'CyboLion',    icon: BatteryCharging },
  { id: 'cybodrive',    label: 'CyboDrive',   icon: Settings2     },
  { id: 'cybomodules',  label: 'Fleet View',  icon: Globe         },
  { id: 'aimodels',     label: 'AI Models',   icon: Cpu           },
  { id: 'architecture', label: 'Architecture',icon: Scale         },
  { id: 'database',     label: 'Database',    icon: Frame         },
  { id: 'api',          label: 'API Docs',    icon: Cable         },
]

export default function Sidebar({ active, onNavigate, onSearchClick, isMobile = false, mobileOpen = false, onClose }) {
  const [expanded, setExpanded] = useState(true)
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState('AIEVOS Primary')

  const sidebarOpen = isMobile ? mobileOpen : true

  return (
    <aside
      className="floating-sidebar"
      style={{
        width: isMobile ? 220 : (expanded ? 210 : 66),
        transition: isMobile ? 'transform .25s ease' : 'width .2s cubic-bezier(0.4, 0, 0.2, 1), margin .2s ease',
        borderRight: '1px solid var(--bg-border)',
        background: 'var(--bg-surface)',
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr 40px',
        overflow: 'hidden',
        flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        left: 0,
        top: 0,
        bottom: 0,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        zIndex: 100,
      }}
    >
      {/* Workspace Switcher */}
      <div style={{
        padding: '12px 10px',
        borderBottom: '1px solid var(--bg-border)',
        position: 'relative'
      }}>
        <button
          onClick={() => {
            if (expanded || isMobile) setShowWorkspaceMenu(!showWorkspaceMenu)
            else setExpanded(true)
          }}
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            borderRadius: 8,
            padding: '6px 10px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: (expanded || isMobile) ? 'space-between' : 'center',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4,
              background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 9, fontWeight: 700
            }}>
              AE
            </div>
            {(expanded || isMobile) && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentWorkspace}</span>}
          </div>
          {(expanded || isMobile) && <ChevronsUpDown size={12} style={{ color: 'var(--text-muted)' }} />}
        </button>

        {showWorkspaceMenu && (expanded || isMobile) && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 10,
            right: 10,
            marginTop: 4,
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderRadius: 8,
            padding: 4,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 110,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {['AIEVOS Primary', 'EMEA Operations Hub', 'APAC Operations Hub'].map(ws => (
              <button
                key={ws}
                onClick={() => {
                  setCurrentWorkspace(ws)
                  setShowWorkspaceMenu(false)
                }}
                style={{
                  border: 'none',
                  background: currentWorkspace === ws ? 'var(--bg-secondary)' : 'transparent',
                  color: 'var(--text-primary)',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: currentWorkspace === ws ? 600 : 400
                }}
                onMouseEnter={e => { if(currentWorkspace !== ws) e.currentTarget.style.backgroundColor = 'var(--bg-elevated)' }}
                onMouseLeave={e => { if(currentWorkspace !== ws) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {ws}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Global Search command trigger button */}
      <div style={{ padding: '8px 10px 4px 10px' }}>
        <button
          onClick={onSearchClick}
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderRadius: 6,
            padding: '5px 8px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: (expanded || isMobile) ? 'space-between' : 'center',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search size={12} />
            {(expanded || isMobile) && <span>Search...</span>}
          </div>
          {(expanded || isMobile) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--bg-border)',
              borderRadius: 4,
              padding: '1px 4px',
              fontSize: 9,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}>
              <Command size={8} /> K
            </div>
          )}
        </button>
      </div>

      {/* Navigation items */}
      <nav style={{
        overflowY: 'auto',
        padding: '8px',
        display: 'grid',
        gap: 2,
        alignContent: 'start'
      }}>
        {NAV.map(item => {
          const Icon     = item.icon
          const isActive = item.id === active

          return (
            <button
              key={item.id}
              title={(!expanded && !isMobile) ? item.label : undefined}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: (expanded || isMobile) ? 10 : 0,
                justifyContent: (expanded || isMobile) ? 'flex-start' : 'center',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: (expanded || isMobile) ? '8px 12px' : '10px 0',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-secondary)' : 'transparent',
                borderRadius: '6px',
                transition: 'color 0.15s, background-color 0.15s',
                width: '100%',
                fontWeight: isActive ? 600 : 500,
                outline: 'none',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={14.5} strokeWidth={isActive ? 2 : 1.5} style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
              {(expanded || isMobile) && (
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11.5,
                  letterSpacing: '0.01em'
                }}>
                  {item.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* System Status Footer & Collapse Trigger */}
      <div style={{
        borderTop: '1px solid var(--bg-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        color: 'var(--accent-success)',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 500,
        height: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className='status-ring' style={{ color: 'var(--accent-success)', width: 5, height: 5 }} />
          {(expanded || isMobile) && (
            <span style={{ letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
              SYS: NOMINAL
            </span>
          )}
        </div>

        {!isMobile && (
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              borderRadius: 4
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {expanded ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
          </button>
        )}
      </div>
    </aside>
  )
}
