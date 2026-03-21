import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardTitle, Grid, LiveDot } from '../components/UI'
import { TELEMETRY_FIELDS, generateCellTemps } from '../data/mockData'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'

const TT = {
  contentStyle:{
    background:'var(--bg-elevated)', border:'1px solid var(--accent-cyan)',
    color:'var(--text-primary)', fontFamily:'JetBrains Mono', fontSize:10, borderRadius:0,
  }
}

function ThermalHeatmap() {
  const [temps, setTemps] = useState(generateCellTemps)

  useEffect(()=>{
    const id = setInterval(()=>setTemps(generateCellTemps()), 3000)
    return ()=>clearInterval(id)
  },[])

  const tempColor = t => {
    if (t<25)  return '#1a3d28'
    if (t<32)  return '#1d6b40'
    if (t<42)  return '#28a060'
    if (t<52)  return '#f0a020'
    if (t<62)  return '#e05010'
    return '#ff2040'
  }

  return (
    <Card>
      <CardTitle>Battery Temperature Heatmap — 96 Cells</CardTitle>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:3, marginTop:8 }}>
        {temps.map((t,i)=>(
          <div
            key={i}
            title={`Cell ${i+1}: ${Math.round(t)}°C`}
            style={{
              aspectRatio:1, borderRadius:2,
              background: tempColor(t),
              cursor:'pointer', transition:'all .3s',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='scale(1.2)'; e.currentTarget.style.zIndex=5 }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.zIndex=1 }}
          />
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginTop:10, alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ fontFamily:'JetBrains Mono', fontSize:9, color:'var(--text-secondary)' }}>TEMP SCALE:</span>
        {['#1a3d28','#1d6b40','#28a060','#f0a020','#e05010','#ff2040'].map((c,i)=>(
          <div key={i} style={{ width:14, height:14, borderRadius:2, background:c }} />
        ))}
        <span style={{ fontFamily:'JetBrains Mono', fontSize:9, color:'var(--text-secondary)' }}>20°C → 70°C+</span>
      </div>
    </Card>
  )
}

function LiveFeed({ telemetry }) {
  return (
    <Card>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <CardTitle>Live Sensor Feed — EV-007</CardTitle>
        <LiveDot />
      </div>
      {TELEMETRY_FIELDS.map(f=>{
        const val = telemetry[f.key] ?? f.base
        const pct = Math.min(100, Math.round((val/f.max)*100))
        return (
          <div key={f.key} style={{
            display:'grid', alignItems:'center',
            gridTemplateColumns:'130px 80px 40px 1fr',
            gap:10, padding:'7px 0',
            borderBottom:'1px solid var(--border-dim)',
            fontFamily:'JetBrains Mono', fontSize:11,
          }}>
            <span style={{ color:'var(--text-secondary)' }}>{f.label}</span>
            <span style={{ color:f.color, fontSize:13, fontWeight:600 }}>
              {f.key==='cellVolt' ? val.toFixed(3) : typeof val==='number' ? Math.round(val) : val}
            </span>
            <span style={{ color:'var(--text-secondary)', fontSize:10 }}>{f.unit}</span>
            <div style={{ height:3, background:'var(--bg-elevated)', borderRadius:2, overflow:'hidden' }}>
              <div style={{
                height:'100%', width:`${pct}%`,
                background:f.color, borderRadius:2,
                transition:'width .5s',
                boxShadow:`0 0 6px ${f.color}`,
              }} />
            </div>
          </div>
        )
      })}
    </Card>
  )
}

export default function TelemetryPage() {
  const telemetry = useLiveTelemetry(1500)

  const cellVData = Array.from({length:24},(_,i)=>({
    cell:`C${i+1}`,
    voltage: parseFloat((3.78+Math.random()*0.1).toFixed(3)),
  }))

  return (
    <div style={{ animation:'pageIn .4s ease' }}>
      <Grid cols={2}>
        <LiveFeed telemetry={telemetry} />
        <Card>
          <CardTitle>Cell Voltage Spread (Pack A)</CardTitle>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={cellVData} margin={{top:4,right:4,bottom:4,left:-20}}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--border-dim)' />
              <XAxis dataKey='cell' tick={{fill:'#4a5a6a',fontSize:8}} interval={1} />
              <YAxis domain={[3.7,4.0]} tick={{fill:'#4a5a6a',fontSize:9}} />
              <Tooltip {...TT} />
              <Bar dataKey='voltage' radius={[3,3,0,0]}>
                {cellVData.map((d,i)=>(
                  <Cell key={i} fill={d.voltage<3.8?'#ff4560':d.voltage>3.9?'#f0a020':'#00e896'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
      <div style={{ marginTop:10 }}>
        <ThermalHeatmap />
      </div>
    </div>
  )
}