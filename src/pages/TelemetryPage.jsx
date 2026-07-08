import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { Card, CardTitle, Grid, LiveDot, StatusPill, PageHeader } from '../components/UI'
import { TELEMETRY_FIELDS, generateCellTemps, rand } from '../data/mockData'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'
import { useBreakpoint } from '../hooks/useBreakpoint'

const CHART_THEME = {
  tooltip: {
    contentStyle: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--bg-border)',
      borderRadius: '6px',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10
    }
  }
}

function ThermalHeatmap() {
  const [temps, setTemps] = useState(generateCellTemps)

  useEffect(() => {
    const id = setInterval(() => setTemps(generateCellTemps()), 3000)
    return () => clearInterval(id)
  }, [])

  const tempColor = t => {
    if (t < 25) return '#10b981'
    if (t < 40) return '#4F8CFF'
    if (t < 55) return '#F5A524'
    return '#E5484D'
  }

  return (
    <Card>
      <CardTitle style={{ marginBottom: 12 }}>Thermal Risk Analysis (96-Cell Layout)</CardTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gap: 3,
        marginTop: 8
      }}>
        {temps.map((t, i) => (
          <div
            key={i}
            title={`Cell ${i + 1}: ${Math.round(t)}°C`}
            style={{
              aspectRatio: 1,
              borderRadius: 2,
              background: tempColor(t),
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>THERMAL LEGEND:</span>
        <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#10b981', borderRadius: 2 }} /> &lt;25°C</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#4F8CFF', borderRadius: 2 }} /> 25–40°C</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#F5A524', borderRadius: 2 }} /> 40–55°C</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#E5484D', borderRadius: 2 }} /> &gt;55°C</span>
        </div>
      </div>
    </Card>
  )
}

function LiveFeed({ telemetry }) {
  const { isMobile } = useBreakpoint()
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <CardTitle style={{ margin: 0 }}>Sensor Ingress (EV-007)</CardTitle>
        <LiveDot />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {TELEMETRY_FIELDS.map(f => {
          const val = telemetry[f.key] ?? f.base
          const pct = Math.min(100, Math.round((val / f.max) * 100))
          const color = f.key === 'cellTemp' || f.key === 'motorTemp'
            ? 'var(--accent-danger)'
            : f.key === 'soh' || f.key === 'soc'
            ? 'var(--accent-success)'
            : 'var(--accent-primary)'
          return (
            <div key={f.key} style={{
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: isMobile ? '1fr auto' : '130px 80px 40px 1fr',
              gap: 12,
              padding: '6px 0',
              borderBottom: '1px solid var(--bg-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {f.key === 'cellVolt' ? val.toFixed(3) : typeof val === 'number' ? Math.round(val) : val}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 9.5, display: isMobile ? 'none' : 'block' }}>{f.unit}</span>
              <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden', gridColumn: isMobile ? '1 / -1' : 'auto' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: color,
                  borderRadius: 2,
                  transition: 'width .3s'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function SensorDiagnostics() {
  const diagnostics = [
    { name: 'Coolant Flow Valve',   val: '0.45 L/s',  status: 'nominal',   drift: '0.01 L/s' },
    { name: 'Rotor Align Enc',      val: '180.2°',    status: 'nominal',   drift: '0.04°' },
    { name: 'Thermocouple C15',     val: '68.4°C',    status: 'critical',  drift: '3.2°C/m' },
    { name: 'ADXL345 Accel',        val: '0.02 G',    status: 'nominal',   drift: '0.00 G' },
    { name: 'BMS Current Sensor',   val: '82.4 A',    status: 'nominal',   drift: '0.12 A' },
  ]
  
  return (
    <Card>
      <CardTitle style={{ marginBottom: 12 }}>Transducer Diagnostics</CardTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {diagnostics.map(item => (
          <div key={item.name} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',
            border: '1px solid var(--bg-border)',
            borderRadius: 6,
            background: 'var(--bg-elevated)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5
          }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.name}</span>
            <span style={{ color: 'var(--text-primary)' }}>{item.val}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 9.5 }}>Δ {item.drift}</span>
            <StatusPill type={item.status === 'critical' ? 'red' : 'green'}>{item.status.toUpperCase()}</StatusPill>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function TelemetryPage() {
  const telemetry = useLiveTelemetry(1500)
  const { isMobile, isTablet } = useBreakpoint()
  const isNarrow = isMobile || isTablet

  const [timeData, setTimeData] = useState([])

  useEffect(() => {
    setTimeData(Array.from({ length: 15 }, (_, i) => ({
      t: i * 2,
      voltage: 370 + rand(0, 10),
      current: 70 + rand(0, 15),
    })))
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setTimeData(prev => {
        const nextTime = prev.length ? prev[prev.length - 1].t + 2 : 0
        const item = {
          t: nextTime,
          voltage: 370 + rand(0, 10),
          current: Math.round(Math.abs(telemetry.current || 82)),
        }
        return [...prev.slice(1), item]
      })
    }, 2000)
    return () => clearInterval(id)
  }, [telemetry])

  const cellVData = Array.from({ length: 24 }, (_, i) => ({
    cell: `C${i + 1}`,
    voltage: parseFloat((3.78 + Math.random() * 0.1).toFixed(3)),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      
      {/* SaaS Page Header */}
      <PageHeader
        title="Telemetry Workstation"
        description="Inspect pack parameters, discharge timelines, and transducer diagnostics in real-time."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cy-btn primary">Calibrate Sensors</button>
          </div>
        }
      />

      <Grid cols={isNarrow ? 1 : 2}>
        <LiveFeed telemetry={telemetry} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <CardTitle>Voltage & Current Timeline (Real-Time)</CardTitle>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart data={timeData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
                <XAxis dataKey='t' tick={{ fill: '#94A3B8', fontSize: 9 }} name="Sec" />
                <YAxis yAxisId="left" domain={[340, 400]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 150]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                <Tooltip {...CHART_THEME.tooltip} />
                <Line yAxisId="left" type='monotone' dataKey='voltage' stroke='var(--accent-primary)' strokeWidth={1.5} dot={false} name="Voltage (V)" />
                <Line yAxisId="right" type='monotone' dataKey='current' stroke='var(--accent-warning)' strokeWidth={1.5} dot={false} name="Current (A)" />
                <Legend wrapperStyle={{ fontSize: 9.5, fontFamily: 'var(--font-mono)' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          
          <SensorDiagnostics />
        </div>
      </Grid>

      <Grid cols={isNarrow ? 1 : 2}>
        <Card>
          <CardTitle>Cell Voltage Dispersion (Pack A)</CardTitle>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={cellVData} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--bg-border)' />
              <XAxis dataKey='cell' tick={{ fill: '#94A3B8', fontSize: 8 }} interval={1} />
              <YAxis domain={[3.7, 4.0]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <Tooltip {...CHART_THEME.tooltip} />
              <Bar dataKey='voltage' radius={[2, 2, 0, 0]}>
                {cellVData.map((d, i) => (
                  <Cell key={i} fill={d.voltage < 3.8 ? 'var(--accent-danger)' : d.voltage > 3.9 ? 'var(--accent-warning)' : 'var(--accent-success)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <ThermalHeatmap />
      </Grid>

    </div>
  )
}
