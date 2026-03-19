import React from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardTitle, DataNumber, AlertRow, ProgressBar } from '../components/UI'
import { ALERTS, VEHICLES } from '../data/mockData'
import { VehicleOverview3D } from '../components/ThreeVisuals'

const MOTOR_TEMP_DATA = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, temp: Math.round(60 + Math.random() * 25) }))
const TT = { contentStyle: { background: 'var(--bg-elevated)', border: '1px solid var(--accent-cyan)', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontSize: 10 } }

export default function DashboardPage() {
  const stats = [
    ['Total Vehicles', 12],
    ['Active Alerts', 3],
    ['Avg Battery Health', '87%'],
    ['Active Charging', 2],
  ]

  return (
    <div className='cy-grid' style={{ gridTemplateColumns: 'repeat(12,minmax(0,1fr))' }}>
      <div className='cy-panel' style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, alignItems: 'center' }}>
        {stats.map(([k, v], i) => <div key={k} style={{ borderRight: i < 3 ? '1px solid var(--border-dim)' : 'none', paddingRight: 10 }}><div className='cy-title'>{k}</div><div className='cy-data' style={{ fontSize: 28 }}>{v}</div></div>)}
      </div>

      <div style={{ gridColumn: '1 / span 7' }}><VehicleOverview3D /></div>
      <Card style={{ gridColumn: '8 / -1', maxHeight: 320, overflow: 'hidden' }}>
        <CardTitle>Live Telemetry Feed</CardTitle>
        <div style={{ display: 'grid', gap: 4, maxHeight: 270, overflow: 'auto', fontFamily: 'JetBrains Mono', fontSize: 10 }}>
          {ALERTS.concat(ALERTS).map((a, idx) => <div key={idx} style={{ color: a.sev === 'critical' ? 'var(--accent-red)' : a.sev === 'warning' ? 'var(--accent-amber)' : 'var(--accent-cyan)', borderBottom: '1px solid var(--border-dim)', paddingBottom: 4 }}>[{new Date().toLocaleTimeString('en-US', { hour12: false })}] [{a.module.toUpperCase()}] {a.msg}</div>)}
        </div>
      </Card>

      <Card style={{ gridColumn: '1 / span 4' }}>
        <CardTitle>Battery Status</CardTitle>
        <DataNumber value={72} unit='%' large />
        <ProgressBar value={72} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 2, marginTop: 10 }}>{Array.from({ length: 24 }).map((_, i) => <div key={i} style={{ aspectRatio: 1, background: i % 6 === 0 ? 'var(--accent-red)' : i % 4 === 0 ? 'var(--accent-amber)' : 'var(--accent-cyan)', opacity: .75 }} />)}</div>
      </Card>

      <Card style={{ gridColumn: '5 / span 4' }}>
        <CardTitle>Motor Metrics</CardTitle>
        <div style={{ display: 'grid', gap: 8 }}>
          <div>RPM <span className='cy-data'>6240</span></div>
          <div>Torque <span className='cy-data'>182 N·m</span></div>
          <div>Temp <span className='cy-data'>78°C</span></div>
        </div>
        <ResponsiveContainer width='100%' height={130}><AreaChart data={MOTOR_TEMP_DATA}><defs><linearGradient id='motorFill' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stopColor='#00d4ff' stopOpacity='.35' /><stop offset='100%' stopColor='#00d4ff' stopOpacity='0' /></linearGradient></defs><CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' /><XAxis dataKey='hour' tick={{ fill: '#5a7a8a', fontSize: 9 }} interval={5} /><YAxis tick={{ fill: '#5a7a8a', fontSize: 9 }} /><Tooltip {...TT} /><Area type='monotone' dataKey='temp' stroke='var(--accent-cyan)' fill='url(#motorFill)' strokeWidth={2} dot={false} /></AreaChart></ResponsiveContainer>
      </Card>

      <Card style={{ gridColumn: '9 / -1' }}>
        <CardTitle>Recent Alerts</CardTitle>
        {ALERTS.slice(0, 3).map(a => <AlertRow key={a.id} {...a} />)}
      </Card>

      <Card style={{ gridColumn: '1 / -1' }}>
        <CardTitle>Battery SoC Distribution</CardTitle>
        <ResponsiveContainer width='100%' height={160}><BarChart data={VEHICLES}><CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' /><XAxis dataKey='id' tick={{ fill: '#5a7a8a', fontSize: 9 }} /><YAxis domain={[0, 100]} tick={{ fill: '#5a7a8a', fontSize: 9 }} /><Tooltip {...TT} /><Bar dataKey='soc'>{VEHICLES.map((v, i) => <Cell key={i} fill={v.soc > 70 ? '#00ff9d' : v.soc > 40 ? '#ffb800' : '#ff2d55'} />)}</Bar></BarChart></ResponsiveContainer>
      </Card>
    </div>
  )
}
