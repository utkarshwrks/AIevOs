import React from 'react'
import { LiveDot } from './UI'

const NAV = [
  { id: 'dashboard',     label: 'Fleet Dashboard',  section: 'Core'    },
  { id: 'vehicles',      label: 'Vehicles',          section: null      },
  { id: 'telemetry',     label: 'Live Telemetry',    section: null      },
  { id: 'alerts',        label: 'Alerts',            badge: '3',        section: null      },
  { id: 'cybomain',      label: 'CyboLion 🔋',       section: 'Modules' },
  { id: 'cybodrive',     label: 'CyboDrive ⚡',      section: null      },
  { id: 'cybomodules',   label: 'All Modules',       section: null      },
  { id: 'aimodels',      label: 'AI Models',         section: 'AI Engine'},
  { id: 'architecture',  label: 'Architecture',      section: 'System'  },
  { id: 'database',      label: 'Database Schema',   section: null      },
  { id: 'api',           label: 'API Reference',     section: null      },
]

export default function Sidebar({ active, onNavigate }) {
  let lastSection = null

  return (
    <div style={{
      width: 200, minWidth: 200,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 18, color: '#fff', letterSpacing: 2 }}>
          AiEVOS
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1 }}>
          AI EV OPERATING SYSTEM
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV.map(item => {
          const showSection = item.section && item.section !== lastSection
          if (showSection) lastSection = item.section

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div style={{
                  padding: '6px 14px 2px',
                  fontFamily: 'var(--mono)', fontSize: 9,
                  letterSpacing: 2, color: 'var(--text3)',
                  textTransform: 'uppercase',
                }}>
                  {item.section}
                </div>
              )}
              <div
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', cursor: 'pointer',
                  borderLeft: `2px solid ${active === item.id ? 'var(--green)' : 'transparent'}`,
                  background: active === item.id ? 'var(--bg3)' : 'transparent',
                  color: active === item.id ? 'var(--green)' : 'var(--text2)',
                  fontSize: 13, fontWeight: 500,
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { if (active !== item.id) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)' } }}
                onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)' } }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: 'var(--red3)', color: 'var(--red)',
                    border: '1px solid var(--red2)',
                    fontSize: 9, padding: '1px 6px', borderRadius: 10,
                    fontFamily: 'var(--mono)',
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            </React.Fragment>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <LiveDot />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
          LIVE · 12 VEHICLES
        </span>
      </div>
    </div>
  )
}