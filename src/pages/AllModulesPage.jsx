import React, { useState } from 'react'
import { VEHICLES, MODULES } from '../data/mockData'
import { FleetGlobe3D } from '../components/ThreeVisuals'
import { Card, CardTitle, ProgressBar } from '../components/UI'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function AllModulesPage() {
  const [expanded, setExpanded] = useState(null)
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <div style={{ animation:'pageIn .4s ease' }}>
      {/* Module cards */}
      <div style={{
        display:'grid',
        gridTemplateColumns:isMobile ? 'repeat(1,minmax(0,1fr))' : isTablet ? 'repeat(2,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))',
        gap:8, marginBottom:12,
      }}>
        {MODULES.map(m=>(
          <div key={m.key} className='cy-panel' style={{
            borderTop:`1px solid ${m.colorBorder}`,
            cursor:'pointer',
          }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 0 20px ${m.colorBorder}`}
            onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div className='cy-title' style={{ color:m.color, marginBottom:0 }}>{m.name}</div>
              <span style={{
                fontFamily:'JetBrains Mono', fontSize:9,
                color:m.statusColor, border:`1px solid ${m.statusColor}`,
                padding:'1px 6px', letterSpacing:'.1em',
              }}>{m.status}</span>
            </div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:8, lineHeight:1.5 }}>
              {m.desc}
            </div>
            <div style={{ fontFamily:'JetBrains Mono', fontSize:10, color:m.color, letterSpacing:'.1em' }}>
              {m.stat}
            </div>
          </div>
        ))}
      </div>

      {/* Fleet globe + vehicle table */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : '1fr 2fr', gap:8 }}>
        <FleetGlobe3D vehicles={VEHICLES} />

        <Card>
          <CardTitle>Fleet Vehicles — All</CardTitle>
          <div style={{ display:'grid', gap:4, overflowX:'auto' }}>
            {VEHICLES.map(v=>{
              const hc = v.health>85?'var(--accent-green)':v.health>70?'var(--accent-amber)':'var(--accent-red)'
              const isExp = expanded===v.id
              return (
                <div
                  key={v.id}
                  style={{
                    border:'1px solid var(--border-dim)',
                    cursor:'pointer', transition:'border-color .15s',
                  }}
                  onClick={()=>setExpanded(isExp?null:v.id)}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,212,255,.25)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-dim)'}
                >
                  <div style={{
                    display:'grid',
                    gridTemplateColumns:isMobile ? '70px 70px 1fr 70px' : '80px 80px 1fr 1fr 80px',
                    gap:10, padding:'8px 12px',
                    fontFamily:'JetBrains Mono', fontSize:11,
                    alignItems:'center',
                  }}>
                    <span style={{ color:'var(--accent-cyan)' }}>{v.id}</span>
                    <span style={{ color:hc, fontSize:10, letterSpacing:'.08em' }}>{v.status.toUpperCase()}</span>
                    <div style={{ height:3, background:'var(--bg-elevated)', overflow:'hidden', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${v.soc}%`, background:'var(--accent-cyan)', borderRadius:2 }} />
                    </div>
                    {!isMobile && <span style={{ color:'var(--text-secondary)' }}>{v.model}</span>}
                    <span style={{ color:hc }}>{v.health}%</span>
                  </div>
                  {isExp && (
                    <div style={{
                      padding:'6px 12px 10px',
                      fontFamily:'JetBrains Mono', fontSize:10,
                      color:'var(--text-secondary)',
                      borderTop:'1px solid var(--border-dim)',
                      display:'grid', gridTemplateColumns:isMobile ? '1fr' : '1fr 1fr 1fr', gap:10,
                      animation:'pageIn .2s ease',
                    }}>
                      <span>SoC: <span style={{color:'var(--accent-cyan)'}}>{v.soc}%</span></span>
                      <span>Temp: <span style={{color:'var(--accent-amber)'}}>{v.temp}°C</span></span>
                      <span>Location: <span style={{color:'var(--text-primary)'}}>Sector-{v.id.slice(-2)}</span></span>
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
