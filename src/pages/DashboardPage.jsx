import React, { useState, useEffect } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardTitle, DataNumber, AlertRow, ProgressBar } from '../components/UI'
import { ALERTS, VEHICLES } from '../data/mockData'
import { VehicleOverview3D, FleetGlobe3D, BatteryPackVisualization3D } from '../components/ThreeVisuals'
import { useBreakpoint } from '../hooks/useBreakpoint'

const TT = {
  contentStyle:{
    background:'var(--bg-elevated)', border:'1px solid var(--accent-cyan)',
    color:'var(--text-primary)', fontFamily:'JetBrains Mono', fontSize:10,
    borderRadius:0,
  }
}

const MOTOR_DATA = Array.from({length:24},(_,i)=>({
  hour:`${i}:00`,
  temp: Math.round(55 + Math.random()*30),
}))

const STATS = [
  { label:'Total Vehicles', value:12, color:'var(--accent-cyan)' },
  { label:'Active Alerts',  value:3,  color:'var(--accent-amber)' },
  { label:'Avg Battery',    value:'87%', color:'var(--accent-green)' },
  { label:'Charging Now',   value:2,  color:'var(--accent-cyan)' },
]

/* Live telemetry ticker */
function TelemetryFeed() {
  const [lines, setLines] = useState(
    ALERTS.concat(ALERTS).map((a,i) => ({
      ...a,
      idx:i,
      ts: new Date().toLocaleTimeString('en-US',{hour12:false}),
    }))
  )

  useEffect(()=>{
    const id = setInterval(()=>{
      setLines(prev => {
        const a = ALERTS[Math.floor(Math.random()*ALERTS.length)]
        const newLine = {
          ...a,
          idx: Date.now(),
          ts: new Date().toLocaleTimeString('en-US',{hour12:false}),
        }
        return [newLine, ...prev.slice(0,19)]
      })
    }, 2200)
    return ()=>clearInterval(id)
  },[])

  const sevColor = s => s==='critical'?'var(--accent-red)':s==='warning'?'var(--accent-amber)':'var(--accent-cyan)'

  return (
    <Card style={{ maxHeight:310, overflow:'hidden' }}>
      <CardTitle>Live Telemetry Feed</CardTitle>
      <div style={{
        maxHeight:256, overflowY:'auto',
        display:'grid', gap:3,
        fontFamily:'JetBrains Mono', fontSize:10,
      }}>
        {lines.map((a,i)=>(
          <div key={a.idx} style={{
            color: sevColor(a.sev),
            borderBottom:'1px solid var(--border-dim)',
            paddingBottom:3,
            opacity: Math.max(0.3, 1 - i*0.04),
            animation:'pageIn .3s ease',
          }}>
            [{a.ts}] [{a.module.toUpperCase()}] {a.msg}
          </div>
        ))}
      </div>
    </Card>
  )
}

/* Battery cell mini-heatmap */
function BatteryCellMini() {
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'repeat(8,1fr)',
      gap:2, marginTop:10,
    }}>
      {Array.from({length:24}).map((_,i)=>{
        const t = 20 + Math.random()*45
        const c = t<25?'#00ff9d':t<=40?'#00d4ff':t<=55?'#ffb800':'#ff2d55'
        return (
          <div key={i} style={{
            aspectRatio:1, background:c, opacity:.75,
            transition:'transform .15s',
          }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.2)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
          />
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  const { isMobile, isTablet } = useBreakpoint()
  const isNarrow = isMobile || isTablet

  return (
    <div className='cy-grid' style={{ gridTemplateColumns:isNarrow ? 'repeat(1,minmax(0,1fr))' : 'repeat(12,minmax(0,1fr))', animation:'pageIn .4s ease' }}>

      {/* Stats strip */}
      <div className='cy-panel' style={{
        gridColumn:'1 / -1',
        display:'grid', gridTemplateColumns:'repeat(4,1fr)',
        ...(isMobile ? { gridTemplateColumns:'repeat(1,minmax(0,1fr))' } : isTablet ? { gridTemplateColumns:'repeat(2,minmax(0,1fr))' } : {}),
        gap:0, padding:0, overflow:'hidden',
      }}>
        {STATS.map(({label,value,color},i)=>(
          <div key={label} style={{
            padding:'10px 16px',
            borderRight: i<3 ? '1px solid var(--border-dim)' : 'none',
          }}>
            <div className='cy-title' style={{ marginBottom:4 }}>{label}</div>
            <div className='cy-data' style={{ fontSize:28, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Vehicle hologram */}
      <div style={{ gridColumn:isNarrow ? '1 / -1' : '1 / span 7' }}>
        <VehicleOverview3D />
      </div>

      {/* Telemetry feed */}
      <div style={{ gridColumn:isNarrow ? '1 / -1' : '8 / -1' }}>
        <TelemetryFeed />
      </div>

      {/* Battery status */}
      <Card style={{ gridColumn:isNarrow ? '1 / -1' : '1 / span 4' }}>
        <CardTitle>Battery Status</CardTitle>
        <DataNumber value={72} unit='%' large />
        <ProgressBar value={72} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 }}>
          <div>
            <div style={{ color:'var(--text-secondary)', fontSize:11 }}>SOH</div>
            <div className='cy-data' style={{ fontSize:18, color:'var(--accent-green)' }}>87%</div>
          </div>
          <div>
            <div style={{ color:'var(--text-secondary)', fontSize:11 }}>Avg Temp</div>
            <div className='cy-data' style={{ fontSize:18, color:'var(--accent-amber)' }}>44°C</div>
          </div>
        </div>
        <BatteryCellMini />
      </Card>

      {/* Motor metrics */}
      <Card style={{ gridColumn:isNarrow ? '1 / -1' : '5 / span 4' }}>
        <CardTitle>Motor Metrics</CardTitle>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
          <div>
            <div style={{ color:'var(--text-secondary)', fontSize:11 }}>RPM</div>
            <div className='cy-data' style={{ fontSize:22 }}>6,240</div>
          </div>
          <div>
            <div style={{ color:'var(--text-secondary)', fontSize:11 }}>Torque</div>
            <div className='cy-data' style={{ fontSize:22, color:'var(--accent-green)' }}>182 N·m</div>
          </div>
          <div>
            <div style={{ color:'var(--text-secondary)', fontSize:11 }}>Temp</div>
            <div className='cy-data' style={{ fontSize:22, color:'var(--accent-amber)' }}>78°C</div>
          </div>
          <div>
            <div style={{ color:'var(--text-secondary)', fontSize:11 }}>Efficiency</div>
            <div className='cy-data' style={{ fontSize:22 }}>91%</div>
          </div>
        </div>
        <ResponsiveContainer width='100%' height={100}>
          <AreaChart data={MOTOR_DATA}>
            <defs>
              <linearGradient id='mFill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#00d4ff' stopOpacity='.32' />
                <stop offset='100%' stopColor='#00d4ff' stopOpacity='0' />
              </linearGradient>
            </defs>
            <CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' />
            <XAxis dataKey='hour' tick={{fill:'#5a7a8a',fontSize:8}} interval={5} />
            <YAxis tick={{fill:'#5a7a8a',fontSize:8}} />
            <Tooltip {...TT} />
            <Area type='monotone' dataKey='temp' stroke='var(--accent-cyan)' fill='url(#mFill)' strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent alerts */}
      <Card style={{ gridColumn:isNarrow ? '1 / -1' : '9 / -1' }}>
        <CardTitle>Recent Alerts</CardTitle>
        {ALERTS.slice(0,3).map(a=><AlertRow key={a.id} {...a} />)}
      </Card>

      {/* SoC distribution */}
      <Card style={{ gridColumn:'1 / -1' }}>
        <CardTitle>Battery SoC Distribution — All Vehicles</CardTitle>
        <ResponsiveContainer width='100%' height={150}>
          <BarChart data={VEHICLES} margin={{top:4,right:4,bottom:4,left:-20}}>
            <CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' />
            <XAxis dataKey='id' tick={{fill:'#5a7a8a',fontSize:9}} />
            <YAxis domain={[0,100]} tick={{fill:'#5a7a8a',fontSize:9}} />
            <Tooltip {...TT} />
            <Bar dataKey='soc' radius={[2,2,0,0]}>
              {VEHICLES.map((v,i)=>(
                <Cell key={i} fill={v.soc>70?'#00ff9d':v.soc>40?'#ffb800':'#ff2d55'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

    </div>
  )
}
