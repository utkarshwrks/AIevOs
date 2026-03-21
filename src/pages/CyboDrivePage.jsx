import React from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardTitle, DataNumber, Grid, ProgressBar, AlertRow } from '../components/UI'
import { ALERTS } from '../data/mockData'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'

const TT = {
  contentStyle:{
    background:'var(--bg-elevated)', border:'1px solid var(--accent-cyan)',
    color:'var(--text-primary)', fontFamily:'JetBrains Mono', fontSize:10, borderRadius:0,
  }
}

const RPM_DATA  = Array.from({length:20},(_,i)=>({ t:`${i*3}:00`, rpm:Math.round(50+Math.random()*30)*100, torque:Math.round(140+Math.random()*60) }))
const EFF_DATA  = Array.from({length:24},(_,i)=>({ x:i, efficiency:83+Math.random()*10 }))

/* Animated motor schematic */
function MotorSchematic({ rpm }) {
  const dur = Math.max(0.3, 2 - (rpm/12000)*1.7)
  return (
    <svg viewBox='0 0 500 200' style={{ width:'100%', height:200 }}>
      {/* Stator rings */}
      <circle cx='160' cy='100' r='66' fill='none' stroke='rgba(0,212,255,.18)' strokeWidth='1' />
      <circle cx='160' cy='100' r='50' fill='none' stroke='rgba(0,212,255,.12)' strokeWidth='.7' />

      {/* Outer casing */}
      <circle cx='160' cy='100' r='72' fill='rgba(10,21,32,.8)' stroke='var(--accent-cyan)' strokeWidth='1.5' />

      {/* Rotor */}
      <g style={{ transformOrigin:'160px 100px' }}>
        <animateTransform
          attributeName='transform' type='rotate'
          from='0 160 100' to='360 160 100'
          dur={`${dur}s`} repeatCount='indefinite'
        />
        <line x1='160' y1='38' x2='160' y2='162' stroke='var(--accent-cyan)' strokeWidth='2.5' />
        <line x1='98'  y1='100' x2='222' y2='100' stroke='var(--accent-cyan)' strokeWidth='2.5' />
        <line x1='116' y1='56' x2='204' y2='144' stroke='rgba(0,212,255,.5)' strokeWidth='1.5' />
        <line x1='204' y1='56' x2='116' y2='144' stroke='rgba(0,212,255,.5)' strokeWidth='1.5' />
        <circle cx='160' cy='100' r='8' fill='var(--accent-cyan)' opacity='.8' />
      </g>

      {/* Center hub */}
      <circle cx='160' cy='100' r='12' fill='var(--bg-elevated)' stroke='var(--accent-cyan)' strokeWidth='1' />

      {/* Speed indicators */}
      {[0,45,90,135,180,225,270,315].map((deg,i)=>{
        const rad = (deg*Math.PI)/180
        const x1  = 160 + Math.cos(rad)*52
        const y1  = 100 + Math.sin(rad)*52
        const x2  = 160 + Math.cos(rad)*62
        const y2  = 100 + Math.sin(rad)*62
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke='rgba(0,212,255,.35)' strokeWidth='1' />
      })}

      {/* Inverter box */}
      <rect x='260' y='68' width='160' height='64' fill='rgba(10,21,32,.9)' stroke='var(--accent-cyan)' strokeWidth='1' />
      <text x='272' y='95' fill='var(--text-secondary)' fontSize='11' fontFamily='JetBrains Mono'>INVERTER BUS</text>
      <text x='272' y='115' fill='var(--accent-cyan)' fontSize='10' fontFamily='JetBrains Mono'>380V · 82A</text>

      {/* Connecting lines */}
      <line x1='234' y1='80' x2='260' y2='80' stroke='rgba(0,212,255,.3)' strokeWidth='.8' strokeDasharray='3 2' />
      <line x1='234' y1='120' x2='260' y2='120' stroke='rgba(0,212,255,.3)' strokeWidth='.8' strokeDasharray='3 2' />

      {/* HUD label */}
      <text x='160' y='18' textAnchor='middle' fill='rgba(0,212,255,.4)' fontSize='9' fontFamily='JetBrains Mono'>
        MOTOR · PMSM · 3-PHASE
      </text>
    </svg>
  )
}

export default function CyboDrivePage() {
  const t = useLiveTelemetry(2000)
  const driveAlerts = ALERTS.filter(a => a.module === 'CyboDrive')

  return (
    <div className='cy-grid' style={{ animation:'pageIn .4s ease' }}>

      <Grid cols={2}>
        {/* Motor schematic */}
        <Card>
          <CardTitle>Motor Schematic — PMSM Rotor</CardTitle>
          <MotorSchematic rpm={Math.round(t.rpm)} />
        </Card>

        {/* Drive metrics */}
        <Card>
          <CardTitle>Drive Metrics — Live</CardTitle>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[
              { label:'RPM',        value:Math.round(t.rpm),       unit:'rpm', color:'var(--accent-cyan)'  },
              { label:'Torque',     value:Math.round(t.torque),    unit:'N·m', color:'var(--accent-green)' },
              { label:'Motor Temp', value:Math.round(t.motorTemp), unit:'°C',  color:'var(--accent-amber)' },
              { label:'Efficiency', value:91,                       unit:'%',   color:'var(--accent-cyan)'  },
            ].map(({label,value,unit,color})=>(
              <div key={label}>
                <div style={{color:'var(--text-secondary)',fontSize:11,marginBottom:4}}>{label}</div>
                <DataNumber value={value} unit={unit} color={color} />
              </div>
            ))}
          </div>

          <div style={{ marginTop:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-secondary)', marginBottom:3 }}>
              <span>RPM Load</span>
              <span style={{fontFamily:'JetBrains Mono',color:'var(--accent-cyan)'}}>{Math.round((t.rpm/12000)*100)}%</span>
            </div>
            <ProgressBar value={Math.round((t.rpm/12000)*100)} />
          </div>

          <div style={{ marginTop:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-secondary)', marginBottom:3 }}>
              <span>Thermal Load</span>
              <span style={{fontFamily:'JetBrains Mono',color:'var(--accent-amber)'}}>{Math.round((t.motorTemp/120)*100)}%</span>
            </div>
            <ProgressBar value={Math.round((t.motorTemp/120)*100)} color='linear-gradient(90deg,var(--accent-green),var(--accent-amber))' />
          </div>
        </Card>
      </Grid>

      <Grid cols={2}>
        {/* RPM vs Torque */}
        <Card>
          <CardTitle>RPM vs Torque</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={RPM_DATA} margin={{top:4,right:4,bottom:4,left:-20}}>
              <CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' />
              <XAxis dataKey='t' tick={{fill:'#5a7a8a',fontSize:9}} interval={3} />
              <YAxis tick={{fill:'#5a7a8a',fontSize:9}} />
              <Tooltip {...TT} />
              <Line dataKey='rpm'    stroke='var(--accent-cyan)'  dot={false} strokeWidth={2} name='RPM' />
              <Line dataKey='torque' stroke='var(--accent-green)' dot={false} strokeWidth={2} name='Torque N·m' />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Efficiency */}
        <Card>
          <CardTitle>Motor Efficiency Trend</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <AreaChart data={EFF_DATA} margin={{top:4,right:4,bottom:4,left:-20}}>
              <defs>
                <linearGradient id='effFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%'   stopColor='#00d4ff' stopOpacity='.28' />
                  <stop offset='100%' stopColor='#00d4ff' stopOpacity='0' />
                </linearGradient>
              </defs>
              <CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' />
              <XAxis dataKey='x' tick={{fill:'#5a7a8a',fontSize:9}} />
              <YAxis tick={{fill:'#5a7a8a',fontSize:9}} domain={[75,100]} />
              <Tooltip {...TT} />
              <Area dataKey='efficiency' stroke='var(--accent-cyan)' fill='url(#effFill)' dot={false} strokeWidth={2} name='Efficiency %' />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Inline alerts */}
      {driveAlerts.length > 0 && (
        <Card>
          <CardTitle>CyboDrive Alerts</CardTitle>
          {driveAlerts.map(a=><AlertRow key={a.id} {...a} />)}
        </Card>
      )}

    </div>
  )
}