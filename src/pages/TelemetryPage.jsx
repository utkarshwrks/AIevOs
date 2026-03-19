import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardTitle, Grid, LiveDot } from '../components/UI'
import { TELEMETRY_FIELDS, generateCellTemps, rand } from '../data/mockData'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'

function ThermalHeatmap() {
  const [temps, setTemps] = useState(() => generateCellTemps())

  useEffect(() => {
    const id = setInterval(() => setTemps(generateCellTemps()), 3000)
    return () => clearInterval(id)
  }, [])

  const tempColor = t => {
    if (t < 25) return '#1a3d28'
    if (t < 32) return '#1d6b40'
    if (t < 42) return '#28a060'
    if (t < 52) return '#f0a020'
    if (t < 62) return '#e05010'
    return '#ff2040'
  }

  return (
    <Card>
      <CardTitle>Battery Temperature Heatmap — 96 Cells</CardTitle>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3, marginTop: 8,
      }}>
        {temps.map((t, i) => (
          <div
            key={i}
            title={`Cell ${i + 1}: ${Math.round(t)}°C`}
            style={{
              aspectRatio: '1', borderRadius: 3,
              background: tempColor(t),
              cursor: 'pointer',
              transition: 'all .3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>TEMP</span>
        {['#1a3d28', '#1d6b40', '#28a060', '#f0a020', '#e05010', '#ff2040'].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>20°C → 70°C+</span>
      </div>
    </Card>
  )
}

function LiveFeed({ telemetry }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <CardTitle>Live Sensor Feed — EV-007</CardTitle>
        <LiveDot />
      </div>
      <div>
        {TELEMETRY_FIELDS.map(f => {
          const val = telemetry[f.key]
          const pct = Math.min(100, Math.round((val / f.max) * 100))
          return (
            <div key={f.key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '7px 12px', borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--mono)', fontSize: 11,
            }}>
              <span style={{ color: 'var(--text3)', minWidth: 120 }}>{f.label}</span>
              <span style={{ color: f.color, fontSize: 13, minWidth: 70 }}>{val}</span>
              <span style={{ color: 'var(--text3)', fontSize: 10, minWidth: 40 }}>{f.unit}</span>
              <div style={{ flex: 1, height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: f.color, borderRadius: 2,
                  transition: 'width .5s',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function TelemetryPage() {
  const telemetry = useLiveTelemetry(1500)

  const cellVData = Array.from({ length: 24 }, (_, i) => ({
    cell: `C${i + 1}`,
    voltage: parseFloat((3.78 + Math.random() * 0.1).toFixed(3)),
  }))

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <Grid cols={2}>
        <LiveFeed telemetry={telemetry} />
        <Card>
          <CardTitle>Cell Voltage Spread (Pack A)</CardTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cellVData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="cell" tick={{ fill: '#4a5a6a', fontSize: 8 }} interval={1} />
              <YAxis domain={[3.7, 4.0]} tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip contentStyle={{ background: '#0f1318', border: '1px solid #1e2a38', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11 }} />
              <Bar dataKey="voltage" radius={[3, 3, 0, 0]}>
                {cellVData.map((d, i) => (
                  <Cell key={i} fill={d.voltage < 3.8 ? '#ff4560' : d.voltage > 3.9 ? '#f0a020' : '#00e896'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
      <ThermalHeatmap />
    </div>
  )
}