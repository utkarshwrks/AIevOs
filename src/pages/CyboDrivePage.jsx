import React from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardTitle, DataNumber, Grid, ProgressBar, AlertRow } from '../components/UI'
import { ALERTS } from '../data/mockData'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'

const RPM_TORQUE = Array.from({ length: 20 }, (_, i) => ({ t: `${i * 3}:00`, rpm: Math.round(50 + Math.random() * 30) * 100, torque: Math.round(140 + Math.random() * 60) }))
const EFF = Array.from({ length: 24 }, (_, i) => ({ x: i, efficiency: 83 + Math.random() * 10 }))
const TT = { contentStyle: { background: 'var(--bg-elevated)', border: '1px solid var(--accent-cyan)', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontSize: 10 } }

export default function CyboDrivePage() {
  const t = useLiveTelemetry(2000)
  return (
    <div className='cy-grid'>
      <Grid cols={2}>
        <Card>
          <CardTitle>Motor Schematic</CardTitle>
          <svg viewBox='0 0 500 200' style={{ width: '100%', height: 200 }}>
            <circle cx='160' cy='100' r='64' fill='none' stroke='#00d4ff' strokeWidth='2' />
            <circle cx='160' cy='100' r='22' fill='#0f1f2e' stroke='#00d4ff' />
            <line x1='160' y1='40' x2='160' y2='160' stroke='#00d4ff'><animateTransform attributeName='transform' type='rotate' from='0 160 100' to='360 160 100' dur='2s' repeatCount='indefinite' /></line>
            <rect x='250' y='72' width='140' height='56' fill='#0a1520' stroke='#00d4ff' />
            <text x='262' y='105' fill='#5a7a8a' fontSize='12'>INVERTER BUS</text>
          </svg>
        </Card>
        <Card>
          <CardTitle>Drive Metrics</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div><div style={{ color: 'var(--text-secondary)' }}>RPM</div><DataNumber value={Math.round(t.rpm)} /></div>
            <div><div style={{ color: 'var(--text-secondary)' }}>Torque</div><DataNumber value={Math.round(t.torque)} unit='N·m' color='var(--accent-green)' /></div>
            <div><div style={{ color: 'var(--text-secondary)' }}>Temp</div><DataNumber value={Math.round(t.motorTemp)} unit='°C' color='var(--accent-amber)' /></div>
            <div><div style={{ color: 'var(--text-secondary)' }}>Efficiency</div><DataNumber value={91} unit='%' color='var(--accent-cyan)' /></div>
          </div>
          <ProgressBar value={Math.min(100, Math.round((t.rpm / 12000) * 100))} />
        </Card>
      </Grid>

      <Grid cols={2}>
        <Card>
          <CardTitle>RPM vs Torque</CardTitle>
          <ResponsiveContainer width='100%' height={200}><LineChart data={RPM_TORQUE}><CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' /><XAxis dataKey='t' tick={{ fill: '#5a7a8a', fontSize: 9 }} interval={3} /><YAxis tick={{ fill: '#5a7a8a', fontSize: 9 }} /><Tooltip {...TT} /><Line dataKey='rpm' stroke='var(--accent-cyan)' dot={false} strokeWidth={2} /><Line dataKey='torque' stroke='var(--accent-green)' dot={false} strokeWidth={2} /></LineChart></ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle>Motor Efficiency Trend</CardTitle>
          <ResponsiveContainer width='100%' height={200}><AreaChart data={EFF}><defs><linearGradient id='eff' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stopColor='#00d4ff' stopOpacity='.24' /><stop offset='100%' stopColor='#00d4ff' stopOpacity='0' /></linearGradient></defs><CartesianGrid stroke='var(--border-dim)' strokeDasharray='3 3' /><XAxis dataKey='x' tick={{ fill: '#5a7a8a', fontSize: 9 }} /><YAxis tick={{ fill: '#5a7a8a', fontSize: 9 }} /><Tooltip {...TT} /><Area dataKey='efficiency' stroke='var(--accent-cyan)' fill='url(#eff)' dot={false} strokeWidth={2} /></AreaChart></ResponsiveContainer>
        </Card>
      </Grid>

      <Card>
        <CardTitle>Inline Alerts</CardTitle>
        {ALERTS.filter(a => a.module === 'CyboDrive').map(a => <AlertRow key={a.id} {...a} />)}
      </Card>
    </div>
  )
}
