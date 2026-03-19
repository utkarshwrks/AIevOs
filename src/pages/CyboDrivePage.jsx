import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardTitle, Grid, StatusPill } from '../components/UI'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'

const RPM_TORQUE = Array.from({ length: 20 }, (_, i) => ({
  t: `${i * 3}:00`,
  rpm: Math.round(50 + Math.random() * 30) * 100,
  torque: Math.round(140 + Math.random() * 60),
}))

const MOTOR_TEMP_24 = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  temp: Math.round(62 + Math.random() * 20),
}))

const TT = {
  contentStyle: { background: '#0f1318', border: '1px solid #1e2a38', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11 }
}

export default function CyboDrivePage() {
  const t = useLiveTelemetry(2000)

  const rpm    = Math.round(t.rpm)
  const torque = Math.round(t.torque)
  const temp   = Math.round(t.motorTemp)
  const eff    = Math.round(88 + Math.random() * 5)

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: 'var(--blue3)', border: '1px solid var(--blue2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>⚡</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1, color: '#fff' }}>CyboDrive</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>MOTOR MONITORING MODULE</div>
        </div>
        <div style={{ marginLeft: 'auto' }}><StatusPill type="amber">1 ALERT ACTIVE</StatusPill></div>
      </div>

      {/* KPIs */}
      <Grid cols={4}>
        <Card>
          <CardTitle>Motor RPM</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--blue)' }}>{rpm}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>CURRENT RPM</div>
        </Card>
        <Card>
          <CardTitle>Torque</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--green)' }}>{torque}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>N·m</div>
        </Card>
        <Card>
          <CardTitle>Motor Temp</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: temp > 85 ? 'var(--red)' : 'var(--amber)' }}>{temp}°C</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>OPERATING TEMP</div>
        </Card>
        <Card>
          <CardTitle>Efficiency</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--teal)' }}>{eff}%</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>DRIVE EFFICIENCY</div>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid cols={2}>
        <Card>
          <CardTitle>RPM vs Torque (Live)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={RPM_TORQUE} margin={{ top: 4, right: 4, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="t" tick={{ fill: '#4a5a6a', fontSize: 9 }} interval={3} />
              <YAxis tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="rpm"    stroke="#4090ff" strokeWidth={2} dot={false} name="RPM" />
              <Line type="monotone" dataKey="torque" stroke="#00e896" strokeWidth={2} dot={false} name="Torque N·m" />
              <Legend wrapperStyle={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Motor Temp Trend</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOTOR_TEMP_24} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="hour" tick={{ fill: '#4a5a6a', fontSize: 9 }} interval={3} />
              <YAxis tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="temp" stroke="#ff4560" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    </div>
  )
}