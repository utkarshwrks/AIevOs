import React, { useState, useEffect } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BatteryPackVisualization3D } from '../components/ThreeVisuals'
import { Card, CardTitle, DataNumber, Grid, ProgressBar } from '../components/UI'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'
import { generateCellTemps } from '../data/mockData'

const TT = {
  contentStyle:{
    background:'var(--bg-elevated)', border:'1px solid var(--accent-cyan)',
    color:'var(--text-primary)', fontFamily:'JetBrains Mono', fontSize:10, borderRadius:0,
  }
}

const SOH_DATA = Array.from({length:10},(_,i)=>({
  year:`Y${i+1}`, predicted:98-i*2.6, lower:97-i*2.6-1.5, upper:98-i*2.6+1.5,
}))

const CELL_V = Array.from({length:24},(_,i)=>({
  cell:`C${i+1}`,
  v: parseFloat((3.78+Math.random()*0.12).toFixed(3)),
}))

const TDATA = Array.from({length:24},(_,i)=>({
  x:i, temp: 26+Math.random()*30,
}))

const colorByTemp = t => t<25?'#00ff9d':t<=40?'#00d4ff':t<=55?'#ffb800':'#ff2d55'

function CellGrid96({ temps }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:3 }}>
        {temps.map((t,i)=>(
          <div
            key={i}
            title={`Cell ${i+1} · ${t.toFixed(1)}°C`}
            onMouseEnter={()=>setHovered(i)}
            onMouseLeave={()=>setHovered(null)}
            style={{
              height:14,
              background: colorByTemp(t),
              opacity: hovered===i ? 1 : .72,
              transform: hovered===i ? 'scale(1.25)' : 'scale(1)',
              transition:'all .12s',
              cursor:'pointer',
              boxShadow: hovered===i ? `0 0 10px ${colorByTemp(t)}` : 'none',
            }}
          />
        ))}
      </div>
      {hovered !== null && (
        <div style={{
          marginTop:6, fontFamily:'JetBrains Mono', fontSize:10,
          color:'var(--text-secondary)',
        }}>
          Cell <span style={{color:'var(--accent-cyan)'}}>{hovered+1}</span> ·{' '}
          <span style={{color:colorByTemp(temps[hovered])}}>{temps[hovered].toFixed(1)}°C</span>
        </div>
      )}
    </div>
  )
}

export default function CyboLionPage() {
  const t = useLiveTelemetry(2000)
  const [cellTemps, setCellTemps] = useState(generateCellTemps)

  useEffect(()=>{
    const id = setInterval(()=>setCellTemps(generateCellTemps()), 3500)
    return ()=>clearInterval(id)
  },[])

  return (
    <div className='cy-grid' style={{ animation:'pageIn .4s ease' }}>

      <BatteryPackVisualization3D />

      <Grid cols={2}>
        {/* Cell grid */}
        <Card>
          <CardTitle>96-Cell Real-Time Grid</CardTitle>
          <CellGrid96 temps={cellTemps} />
          <div style={{ display:'flex', gap:12, marginTop:10, fontFamily:'JetBrains Mono', fontSize:9, color:'var(--text-secondary)', flexWrap:'wrap' }}>
            {[['#00ff9d','< 25°C'],['#00d4ff','25–40°C'],['#ffb800','40–55°C'],['#ff2d55','> 55°C']].map(([c,l])=>(
              <span key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:8, height:8, background:c }} />{l}
              </span>
            ))}
          </div>
        </Card>

        {/* Gauges + temp history */}
        <Card>
          <CardTitle>SOC / SOH Gauges</CardTitle>
          <div style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
              <span style={{color:'var(--text-secondary)',fontSize:11}}>State of Charge</span>
              <DataNumber value={Math.round(t.soc)} unit='%' />
            </div>
            <ProgressBar value={Math.round(t.soc)} />
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
              <span style={{color:'var(--text-secondary)',fontSize:11}}>State of Health</span>
              <DataNumber value={Math.round(t.soh)} unit='%' color='var(--accent-green)' />
            </div>
            <ProgressBar value={Math.round(t.soh)} color='linear-gradient(90deg,var(--accent-green),var(--accent-cyan))' />
          </div>

          <CardTitle>Temperature History</CardTitle>
          <ResponsiveContainer width='100%' height={130}>
            <AreaChart data={TDATA}>
              <defs>
                <linearGradient id='tzone' x1='0' y1='0' x2='1' y2='0'>
                  <stop offset='0%'   stopColor='#00ff9d' />
                  <stop offset='65%'  stopColor='#ffb800' />
                  <stop offset='100%' stopColor='#ff2d55' />
                </linearGradient>
              </defs>
              <CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' />
              <XAxis dataKey='x' tick={{fill:'#5a7a8a',fontSize:8}} />
              <YAxis tick={{fill:'#5a7a8a',fontSize:8}} />
              <Tooltip {...TT} />
              <Area type='monotone' dataKey='temp' stroke='url(#tzone)' fill='url(#tzone)' fillOpacity={.14} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid cols={2}>
        {/* Cell voltage */}
        <Card>
          <CardTitle>Cell Voltage Spread (Pack A)</CardTitle>
          <ResponsiveContainer width='100%' height={190}>
            <BarChart data={CELL_V} margin={{top:4,right:4,bottom:4,left:-20}}>
              <CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' />
              <XAxis dataKey='cell' tick={{fill:'#5a7a8a',fontSize:8}} />
              <YAxis domain={[3.7,4.0]} tick={{fill:'#5a7a8a',fontSize:8}} />
              <Tooltip {...TT} />
              <ReferenceLine y={3.76} stroke='var(--accent-red)' strokeDasharray='4 4' label={{ value:'MIN', fill:'var(--accent-red)', fontSize:8 }} />
              <ReferenceLine y={3.95} stroke='var(--accent-red)' strokeDasharray='4 4' label={{ value:'MAX', fill:'var(--accent-red)', fontSize:8 }} />
              <Bar dataKey='v' radius={[2,2,0,0]}>
                {CELL_V.map((d,i)=>(
                  <Cell key={i} fill={Math.abs(3.85-d.v)>.07?'#ff2d55':'#00d4ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Battery life prediction */}
        <Card>
          <CardTitle>Battery Life Prediction — AI (PyTorch LSTM)</CardTitle>
          <ResponsiveContainer width='100%' height={190}>
            <LineChart data={SOH_DATA} margin={{top:4,right:4,bottom:4,left:-20}}>
              <CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' />
              <XAxis dataKey='year' tick={{fill:'#5a7a8a',fontSize:9}} />
              <YAxis domain={[68,100]} tick={{fill:'#5a7a8a',fontSize:8}} />
              <Tooltip {...TT} />
              <ReferenceLine y={80} stroke='var(--accent-amber)' strokeDasharray='4 4' label={{value:'EOL 80%',fill:'var(--accent-amber)',fontSize:8}} />
              <Line type='monotone' dataKey='predicted' stroke='var(--accent-cyan)' dot={{fill:'var(--accent-cyan)',r:3}} strokeWidth={2} name='Predicted SoH %' />
              <Line type='monotone' dataKey='upper' stroke='rgba(0,212,255,.25)' dot={false} strokeWidth={1} strokeDasharray='3 3' name='Upper CI' />
              <Line type='monotone' dataKey='lower' stroke='rgba(0,212,255,.25)' dot={false} strokeWidth={1} strokeDasharray='3 3' name='Lower CI' />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontFamily:'JetBrains Mono', fontSize:10, color:'var(--text-secondary)', marginTop:6 }}>
            RUL Estimate: <span style={{color:'var(--accent-cyan)'}}>~3.8 years</span> · Confidence: <span style={{color:'var(--accent-green)'}}>94.2%</span>
          </div>
        </Card>
      </Grid>

    </div>
  )
}