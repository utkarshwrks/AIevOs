import React, { useState } from 'react'
import { VEHICLES } from '../data/mockData'

const FILTERS = ['all','active','charging','warning']

function StatusBadge({ status }) {
  const map = {
    active:   { color:'var(--accent-green)', bg:'rgba(0,255,157,.08)',  border:'rgba(0,255,157,.3)'  },
    charging: { color:'var(--accent-cyan)',  bg:'rgba(0,212,255,.08)',  border:'rgba(0,212,255,.3)'  },
    warning:  { color:'var(--accent-amber)', bg:'rgba(255,184,0,.08)',  border:'rgba(255,184,0,.3)'  },
  }
  const s = map[status] || map.active
  return (
    <span style={{
      fontFamily:'JetBrains Mono', fontSize:10, padding:'2px 8px',
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      letterSpacing:'.08em',
    }}>
      {status.toUpperCase()}
    </span>
  )
}

function MiniSparkbar({ health }) {
  const color = health>85?'var(--accent-green)':health>70?'var(--accent-amber)':'var(--accent-red)'
  return (
    <div style={{ display:'flex', gap:2, alignItems:'flex-end', height:22 }}>
      {Array.from({length:8},(_,i)=>(
        <div key={i} style={{ width:3, height:6+i*2, borderRadius:1, background:color }} />
      ))}
    </div>
  )
}

export default function VehiclesPage() {
  const [filter, setFilter] = useState('all')
  const filtered = filter==='all' ? VEHICLES : VEHICLES.filter(v=>v.status===filter)

  return (
    <div style={{ animation:'pageIn .4s ease' }}>

      {/* Filter bar */}
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
        <span style={{ fontFamily:'JetBrains Mono', fontSize:11, color:'var(--text-secondary)', letterSpacing:'.15em' }}>
          FILTER:
        </span>
        {FILTERS.map(f=>(
          <button
            key={f}
            onClick={()=>setFilter(f)}
            className='cy-btn'
            style={{
              background: filter===f ? 'var(--accent-cyan)' : 'transparent',
              color:      filter===f ? 'var(--bg-void)'     : 'var(--accent-cyan)',
              padding:'4px 12px', fontSize:10,
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontFamily:'JetBrains Mono', fontSize:11, color:'var(--text-secondary)', minWidth:100 }}>
          {filtered.length} vehicles
        </span>
      </div>

      <div style={{ overflowX:'auto' }}>
        <div style={{ minWidth:640 }}>
          {/* Header */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'80px 1fr 100px 60px 80px 80px 60px 60px',
            gap:10, padding:'6px 14px',
            fontFamily:'JetBrains Mono', fontSize:10, letterSpacing:1,
            color:'var(--text-secondary)', textTransform:'uppercase',
            borderBottom:'1px solid var(--border-dim)', marginBottom:6,
          }}>
            <span>ID</span><span>Model</span><span>Status</span><span>SoC</span>
            <span>Health</span><span>Trend</span><span>Score</span><span>Temp</span>
          </div>

          {/* Rows */}
          {filtered.map(v=>{
        const hc = v.health>85?'var(--accent-green)':v.health>70?'var(--accent-amber)':'var(--accent-red)'
        return (
          <div
            key={v.id}
            style={{
              display:'grid',
              gridTemplateColumns:'80px 1fr 100px 60px 80px 80px 60px 60px',
              gap:10, padding:'10px 14px',
              background:'var(--bg-surface)',
              border:'1px solid var(--border-dim)',
              marginBottom:5, alignItems:'center',
              cursor:'pointer', transition:'all .15s',
              clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor='rgba(0,212,255,.35)'
              e.currentTarget.style.background='var(--bg-elevated)'
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor='var(--border-dim)'
              e.currentTarget.style.background='var(--bg-surface)'
            }}
          >
            <span style={{ fontFamily:'JetBrains Mono', fontSize:12, color:'var(--accent-cyan)' }}>{v.id}</span>
            <span style={{ fontSize:13, fontWeight:600 }}>{v.model}</span>
            <StatusBadge status={v.status} />
            <span style={{ fontFamily:'JetBrains Mono', fontSize:12, color:'var(--text-secondary)' }}>{v.soc}%</span>
            <div style={{ height:4, background:'var(--bg-elevated)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${v.health}%`, background:hc, borderRadius:2, transition:'width .6s' }} />
            </div>
            <MiniSparkbar health={v.health} />
            <span style={{ fontFamily:'JetBrains Mono', fontSize:12, color:hc }}>{v.health}%</span>
            <span style={{ fontFamily:'JetBrains Mono', fontSize:11, color:'var(--text-secondary)' }}>{v.temp}°C</span>
          </div>
        )
          })}
        </div>
      </div>

    </div>
  )
}
