import React, { useState, useEffect } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { BatteryPackVisualization3D } from '../components/ThreeVisuals'
import { Card, CardTitle, DataNumber, Grid, ProgressBar, StatusPill, PageHeader } from '../components/UI'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'
import { generateCellTemps } from '../data/mockData'
import { Zap, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react'

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

const SOH_DATA = Array.from({ length: 10 }, (_, i) => ({
  year: `Yr ${i + 1}`,
  predicted: 98 - i * 2.4,
  lower: 98 - i * 2.4 - 1.8 - (i * 0.3),
  upper: 98 - i * 2.4 + 1.8 + (i * 0.1),
}))

const CELL_V = Array.from({ length: 24 }, (_, i) => {
  const base = 3.88
  let v = base + (Math.random() - 0.5) * 0.04
  if (i === 14) v = 3.792
  return {
    cell: `C${i + 1}`,
    v: parseFloat(v.toFixed(3)),
  }
})

const TDATA = Array.from({ length: 24 }, (_, i) => ({
  x: `${i}h`,
  temp: 28 + Math.random() * 8 + (i > 15 ? 12 : 0),
}))

const colorByTemp = t => {
  if (t < 25) return '#10b981'
  if (t < 40) return '#4F8CFF'
  if (t < 55) return '#F5A524'
  return '#E5484D'
}

function CellGrid96({ temps }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 3 }}>
        {temps.map((t, i) => {
          const isAnomaly = i === 14 || i === 15
          return (
            <div
              key={i}
              title={`Cell ${i + 1} · ${t.toFixed(1)}°C`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                height: 12,
                background: colorByTemp(t),
                opacity: hovered === i ? 1 : 0.8,
                transform: hovered === i ? 'scale(1.2)' : 'scale(1)',
                transition: 'all .12s',
                cursor: 'pointer',
                borderRadius: '2px',
                border: isAnomaly ? '1px solid var(--text-primary)' : 'none'
              }}
            />
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        {hovered !== null ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
            Selected Cell: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>C{hovered + 1}</span> ·{' '}
            <span style={{ color: colorByTemp(temps[hovered]), fontWeight: 600 }}>{temps[hovered].toFixed(1)}°C</span>
          </div>
        ) : (
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hover cells for telemetry values</div>
        )}
        <div style={{ display: 'flex', gap: 6, fontSize: 9.5, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, background: '#10b981', borderRadius: 1 }} /> &lt;25°C</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, background: '#4F8CFF', borderRadius: 1 }} /> 25-40°C</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, background: '#F5A524', borderRadius: 1 }} /> 40-55°C</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, background: '#E5484D', borderRadius: 1 }} /> &gt;55°C</span>
        </div>
      </div>
    </div>
  )
}

export default function CyboLionPage() {
  const t = useLiveTelemetry(2000)
  const [cellTemps, setCellTemps] = useState(generateCellTemps)

  useEffect(() => {
    const id = setInterval(() => setCellTemps(generateCellTemps()), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      
      {/* SaaS Page Header */}
      <PageHeader
        title="CyboLion Battery Intelligence"
        description="Inspect battery health metrics, run passive cell balancing, and review LSTM SOH forecasts."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cy-btn primary">Recalibrate Cell Balancer</button>
          </div>
        }
      />

      {/* 3D CAD Blueprint Visualizer */}
      <div style={{ height: 260 }}>
        <BatteryPackVisualization3D />
      </div>

      <Grid cols={3}>
        {/* Battery Health Score Card */}
        <Card>
          <CardTitle>Battery Pack Analytics</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 2 }}>OVERALL HEALTH SCORE</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 34, fontWeight: 700, color: 'var(--accent-success)', fontFamily: 'var(--font-sans)' }}>94%</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>NOMINAL</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, borderTop: '1px solid var(--bg-border)', paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Capacity Retention</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>94.2%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Internal Resistance</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>12.4 mΩ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Self-Discharge Rate</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>1.1% / month</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cell Imbalance Detection */}
        <Card>
          <CardTitle>Cell Imbalance Diagnostics</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12 }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9, marginBottom: 2 }}>MAX CELL VOLT</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>3.902 V <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>C12</span></div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9, marginBottom: 2 }}>MIN CELL VOLT</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-danger)', fontWeight: 600 }}>3.792 V <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>C15</span></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>CELL DELTA DEVIATION</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--accent-danger)', fontWeight: 600 }}>110 mV</div>
              </div>
              <StatusPill type="red">IMBALANCE ALERT</StatusPill>
            </div>

            <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', border: '1px solid var(--bg-border)', borderRadius: 6, padding: '6px 10px', marginTop: 4 }}>
              BMS Passive Balancing: <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>ACTIVE</span> (Cell 15 discharge shunt engaged)
            </div>
          </div>
        </Card>

        {/* AI Predictions / Failure Probability */}
        <Card>
          <CardTitle>AI Hazards & Diagnostics</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>HAZARD PROBABILITY</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent-danger)' }}>1.2%</div>
              </div>
              <StatusPill type="amber">ELEVATED</StatusPill>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderTop: '1px solid var(--bg-border)', paddingTop: 8 }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>LSTM CONFIDENCE</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600 }}>98.6%</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>CYCLE LIFE COUNT</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600 }}>384 cycles</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(245, 165, 36, 0.05)', border: '1px solid rgba(245, 165, 36, 0.15)', borderRadius: 6, padding: '6px 8px', marginTop: 2 }}>
              <Cpu size={12} style={{ color: 'var(--accent-warning)', flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>AI predicts EOL in <strong>3.8 yrs</strong> (confidence: 94.2%)</span>
            </div>
          </div>
        </Card>
      </Grid>

      <Grid cols={isNarrow ? 1 : 2}>
        {/* 96-cell thermal grid card */}
        <Card>
          <CardTitle>Thermal Sensor Grid (Pack Level)</CardTitle>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Thermistors polled: </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>96 / 96 Nominal</span>
          </div>
          <CellGrid96 temps={cellTemps} />
        </Card>

        {/* SOC / SOH analytics */}
        <Card>
          <CardTitle>Charge & Capacity Analytics</CardTitle>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Pack Charge (SoC)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{Math.round(t.soc)}%</span>
            </div>
            <ProgressBar value={Math.round(t.soc)} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Capacity Retention (SoH)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-success)' }}>{Math.round(t.soh)}%</span>
            </div>
            <ProgressBar value={Math.round(t.soh)} color="var(--accent-success)" />
          </div>
        </Card>
      </Grid>

      <Grid cols={isNarrow ? 1 : 2}>
        {/* Cell voltage spread chart */}
        <Card>
          <CardTitle>High Resolution Cell Voltage Spread</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={CELL_V} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
              <XAxis dataKey='cell' tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <YAxis domain={[3.7, 4.0]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <Tooltip {...CHART_THEME.tooltip} />
              <ReferenceLine y={3.8} stroke='var(--accent-danger)' strokeDasharray='3 3' label={{ value: 'LOW THRESHOLD', fill: 'var(--accent-danger)', fontSize: 8, position: 'insideTopLeft' }} />
              <Bar dataKey='v' radius={[2, 2, 0, 0]}>
                {CELL_V.map((d, i) => (
                  <Cell key={i} fill={d.v < 3.82 ? 'var(--accent-danger)' : 'var(--accent-primary)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* LSTM prediction curve */}
        <Card>
          <CardTitle>Battery Life Prediction & Degradation Trend (LSTM)</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={SOH_DATA} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
              <XAxis dataKey='year' tick={{ fill: '#94A3B8', fontSize: 9 }} />
              <YAxis domain={[65, 100]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <Tooltip {...CHART_THEME.tooltip} />
              <ReferenceLine y={80} stroke='var(--accent-warning)' strokeDasharray='3 3' label={{ value: 'EOL SOH (80%)', fill: 'var(--accent-warning)', fontSize: 8, position: 'insideTopLeft' }} />
              <Line type='monotone' dataKey='predicted' stroke='var(--accent-primary)' strokeWidth={1.5} dot={{ r: 2 }} name="Predicted SOH %" />
              <Line type='monotone' dataKey='upper' stroke='rgba(79, 140, 255, 0.2)' strokeDasharray='3 3' dot={false} name="Upper CI" />
              <Line type='monotone' dataKey='lower' stroke='rgba(79, 140, 255, 0.2)' strokeDasharray='3 3' dot={false} name="Lower CI" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

    </div>
  )
}