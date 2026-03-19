import React from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BatteryPackVisualization3D } from '../components/ThreeVisuals'
import { Card, CardTitle, DataNumber, Grid, ProgressBar } from '../components/UI'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'

const SOH_DATA = Array.from({ length: 10 }, (_, i) => ({ year: `Y${i + 1}`, predicted: 98 - i * 2.6, confidence: 2 + Math.random() * 2 }))
const CELL_V = Array.from({ length: 24 }, (_, i) => ({ cell: `C${i + 1}`, v: parseFloat((3.78 + Math.random() * 0.12).toFixed(3)) }))
const TDATA = Array.from({ length: 24 }, (_, i) => ({ x: i, temp: 26 + Math.random() * 30 }))
const TT = { contentStyle: { background: 'var(--bg-elevated)', border: '1px solid var(--accent-cyan)', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontSize: 10 } }

export default function CyboLionPage() {
  const t = useLiveTelemetry(2000)
  return (
    <div className='cy-grid'>
      <BatteryPackVisualization3D />

      <div className='cy-grid' style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Card>
          <CardTitle>Real-Time Cell Grid</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 3 }}>{Array.from({ length: 96 }, (_, i) => { const temp = 22 + Math.random() * 42; return <div key={i} style={{ height: 14, background: temp < 25 ? '#00ff9d' : temp < 40 ? '#00d4ff' : temp < 55 ? '#ffb800' : '#ff2d55' }} title={`Cell ${i + 1} · ${temp.toFixed(1)}°C`} /> })}</div>
        </Card>
        <Card>
          <CardTitle>SOC / SOH Gauges</CardTitle>
          <div><div>SOC <DataNumber value={Math.round(t.soc)} unit='%' /></div><ProgressBar value={Math.round(t.soc)} /></div>
          <div style={{ marginTop: 8 }}><div>SOH <DataNumber value={Math.round(t.soh)} unit='%' color='var(--accent-green)' /></div><ProgressBar value={Math.round(t.soh)} /></div>
          <CardTitle>Temperature History</CardTitle>
          <ResponsiveContainer width='100%' height={140}><AreaChart data={TDATA}><defs><linearGradient id='tempzone' x1='0' y1='0' x2='1' y2='0'><stop offset='0%' stopColor='#00ff9d' /><stop offset='65%' stopColor='#ffb800' /><stop offset='100%' stopColor='#ff2d55' /></linearGradient></defs><CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' /><XAxis dataKey='x' tick={{ fill: '#5a7a8a', fontSize: 9 }} /><YAxis tick={{ fill: '#5a7a8a', fontSize: 9 }} /><Tooltip {...TT} /><Area type='monotone' dataKey='temp' stroke='url(#tempzone)' fill='url(#tempzone)' fillOpacity={.16} dot={false} /></AreaChart></ResponsiveContainer>
        </Card>
      </div>

      <Grid cols={2}>
        <Card>
          <CardTitle>Battery Cell Voltage Chart</CardTitle>
          <ResponsiveContainer width='100%' height={190}><BarChart data={CELL_V}><CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' /><XAxis dataKey='cell' tick={{ fill: '#5a7a8a', fontSize: 8 }} /><YAxis domain={[3.7, 4]} tick={{ fill: '#5a7a8a', fontSize: 9 }} /><Tooltip {...TT} /><ReferenceLine y={3.76} stroke='var(--accent-red)' strokeDasharray='4 4' /><ReferenceLine y={3.95} stroke='var(--accent-red)' strokeDasharray='4 4' /><Bar dataKey='v'>{CELL_V.map((d, i) => <Cell key={i} fill={Math.abs(3.85 - d.v) > .07 ? '#ff2d55' : '#00d4ff'} />)}</Bar></BarChart></ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle>Battery Life Prediction (AI)</CardTitle>
          <ResponsiveContainer width='100%' height={190}><LineChart data={SOH_DATA}><CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' /><XAxis dataKey='year' tick={{ fill: '#5a7a8a', fontSize: 9 }} /><YAxis domain={[68, 100]} tick={{ fill: '#5a7a8a', fontSize: 9 }} /><Tooltip {...TT} /><Line type='monotone' dataKey='predicted' stroke='var(--accent-cyan)' dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer>
        </Card>
      </Grid>
    </div>
  )
}
