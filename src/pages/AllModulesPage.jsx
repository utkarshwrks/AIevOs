import React, { useState } from 'react'
import { VEHICLES, MODULES } from '../data/mockData'
import { FleetGlobe3D } from '../components/ThreeVisuals'
import { Card, CardTitle, ProgressBar, StatusPill, Grid, PageHeader } from '../components/UI'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { Globe, ShieldAlert, Zap, Compass } from 'lucide-react'

export default function AllModulesPage() {
  const [expanded, setExpanded] = useState(null)
  const { isMobile, isTablet } = useBreakpoint()
  const isNarrow = isMobile || isTablet

  const getModuleStatusType = (status) => {
    if (status === 'HEALTHY' || status === 'NOMINAL') return 'green'
    if (status === '1 ALERT' || status === '1 WARNING') return 'amber'
    return 'gray'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      
      <PageHeader
        title="Fleet Command Center"
        description="Global operational status of fleet systems, regional risk maps, and vehicle registry."
        actions={
          <button className="cy-btn primary" onClick={() => alert('Initiating operational scan...')}>
            Trigger Operational Scan
          </button>
        }
      />

      {/* Platform Modules Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 12,
      }}>
        {MODULES.map(m => {
          const borderStyle = m.key === 'cybolion'
            ? 'var(--accent-success)'
            : m.key === 'cybodrive' || m.key === 'cybocontrol'
            ? 'var(--accent-primary)'
            : m.key === 'cyboframe'
            ? 'var(--accent-danger)'
            : 'var(--accent-warning)'
          return (
            <div key={m.key} className='cy-panel' style={{
              borderTop: `2px solid ${borderStyle}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--text-primary)' }}>
                  {m.name}
                </div>
                <StatusPill type={getModuleStatusType(m.status)}>{m.status}</StatusPill>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.45 }}>
                {m.desc}
              </p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                {m.stat}
              </div>
            </div>
          )
        })}
      </div>

      {/* Fleet globe + vehicle table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isNarrow ? '1fr' : '1.2fr 1.6fr',
        gap: 16
      }}>
        
        {/* Geographic Command Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ height: 260 }}>
            <FleetGlobe3D />
          </div>
          
          <Card>
            <CardTitle style={{ marginBottom: 12 }}>Command Overview</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Globe size={11} /> Regional Fleet Health</span>
                <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>NA: 100% · EMEA: 92% · APAC: 100%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><ShieldAlert size={11} /> Risk Hotspots</span>
                <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--accent-danger)', fontWeight: 600 }}>Berlin (EV-007)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={11} /> Charging Stations</span>
                <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>92% active station coverage</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Compass size={11} /> Fleet Availability</span>
                <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--accent-success)', fontWeight: 600 }}>98.4% Nominal</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Operational Vehicles Log */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardTitle style={{ marginBottom: 12 }}>Operational Telemetry Registry</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flexGrow: 1, maxHeight: 380 }}>
            {VEHICLES.map(v => {
              const hc = v.health > 85 ? 'var(--accent-success)' : v.health > 70 ? 'var(--accent-warning)' : 'var(--accent-danger)'
              const isExp = expanded === v.id
              return (
                <div
                  key={v.id}
                  style={{
                    border: '1px solid var(--bg-border)',
                    background: 'var(--bg-surface)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                  onClick={() => setExpanded(isExp ? null : v.id)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)' }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '70px 70px 1fr 60px' : '80px 80px 1fr 1fr 70px',
                    gap: 10,
                    padding: '10px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    alignItems: 'center',
                  }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{v.id}</span>
                    <span style={{ color: hc, fontSize: 9.5, fontWeight: 500 }}>{v.status.toUpperCase()}</span>
                    <div style={{ height: 4, background: 'var(--bg-border)', overflow: 'hidden', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${v.soc}%`, background: 'var(--accent-primary)', borderRadius: 2 }} />
                    </div>
                    {!isMobile && <span style={{ color: 'var(--text-secondary)' }}>{v.model}</span>}
                    <span style={{ color: hc, fontWeight: 600, textAlign: 'right' }}>{v.health}%</span>
                  </div>
                  {isExp && (
                    <div style={{
                      padding: '8px 12px 10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      borderTop: '1px solid var(--bg-border)',
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                      gap: 10,
                      animation: 'pageIn .2s ease',
                    }}>
                      <span>SoC: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v.soc}%</span></span>
                      <span>Temp: <span style={{ color: v.temp > 50 ? 'var(--accent-danger)' : 'var(--text-primary)', fontWeight: 500 }}>{v.temp}°C</span></span>
                      <span>Location: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Sector-{v.id.slice(-2)}</span></span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
