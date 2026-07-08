import React, { useState, useEffect } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Card, CardTitle, DataNumber, AlertRow, ProgressBar, PageHeader, StatusPill, Grid } from '../components/UI'
import { ALERTS, VEHICLES } from '../data/mockData'
import { VehicleOverview3D } from '../components/ThreeVisuals'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { Sparkles, BrainCircuit, Activity, Wrench, ShieldAlert } from 'lucide-react'

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

const FLEET_HEALTH_DATA = [
  { day: 'Mon', availability: 98.2 },
  { day: 'Tue', availability: 98.5 },
  { day: 'Wed', availability: 97.9 },
  { day: 'Thu', availability: 98.8 },
  { day: 'Fri', availability: 99.1 },
  { day: 'Sat', availability: 98.4 },
  { day: 'Sun', availability: 98.6 },
]

const UTILIZATION_DATA = [
  { hour: '00:00', active: 30, charging: 40 },
  { hour: '04:00', active: 20, charging: 50 },
  { hour: '08:00', active: 65, charging: 20 },
  { hour: '12:00', active: 85, charging: 10 },
  { hour: '16:00', active: 70, charging: 15 },
  { hour: '20:00', active: 55, charging: 30 },
]

const MAINTENANCE_FORECAST = [
  { id: 'EV-007', days: 4,  status: 'critical' },
  { id: 'EV-011', days: 12, status: 'warning' },
  { id: 'EV-003', days: 18, status: 'warning' },
]

const VEHICLE_RANKINGS = [
  { id: 'EV-006', score: 96, model: 'Kia EV6' },
  { id: 'EV-001', score: 95, model: 'Tata Nexon' },
  { id: 'EV-009', score: 94, model: 'Ather 450X' },
  { id: 'EV-007', score: 78, model: 'Tesla Model 3' },
]

export default function DashboardPage({ onNavigate }) {
  const { isMobile, isTablet } = useBreakpoint()
  const isNarrow = isMobile || isTablet

  const [tickerAlerts, setTickerAlerts] = useState(
    ALERTS.slice(0, 3).map((a, i) => ({
      ...a,
      idx: i,
      ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
    }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setTickerAlerts(prev => {
        const a = ALERTS[Math.floor(Math.random() * ALERTS.length)]
        const newItem = {
          ...a,
          idx: Date.now(),
          ts: new Date().toLocaleTimeString('en-US', { hour12: false }),
        }
        return [newItem, ...prev.slice(0, 2)]
      })
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn 0.3s ease' }}>
      
      {/* SaaS Page Header */}
      <PageHeader
        title="Command Operations"
        description="Operational overview, real-time diagnostic status, and battery/motor metrics."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cy-btn" onClick={() => onNavigate('vehicles')}>Manage Fleet</button>
            <button className="cy-btn primary" onClick={() => onNavigate('telemetry')}>Launch Diagnostics</button>
          </div>
        }
      />

      {/* Hero Header Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isNarrow ? '1fr' : '2fr 1fr',
        gap: 16,
      }}>
        {/* Welcome Header */}
        <div className="cy-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 6,
          background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-secondary))'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Good afternoon, Administrator.
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 480 }}>
            Fleet availability is nominal at <strong>98.4%</strong>. Active battery balancing is disengaging cell delta anomalies on EV-007, while motor heat dissipation limits are maintained.
          </p>
        </div>

        {/* AI Executive Insight Card */}
        <div className="cy-panel" style={{
          border: '1px solid rgba(79, 140, 255, 0.25)',
          background: 'rgba(79, 140, 255, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <BrainCircuit size={13} />
            AI Executive Insight
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            LSTM models forecast a stator bearing wear limit breach on **EV-003** in 12 days. Torque limit throttled. Coolant loop active.
          </p>
        </div>
      </div>

      {/* Key KPIs (4 grid cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 16,
      }}>
        <Card>
          <CardTitle style={{ marginBottom: 4 }}>Fleet Health Index</CardTitle>
          <DataNumber value={98.4} unit="%" color="var(--accent-success)" />
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4 }}>AVERAGE UPTIME</div>
        </Card>
        <Card>
          <CardTitle style={{ marginBottom: 4 }}>Devices Online</CardTitle>
          <DataNumber value={10} unit="/ 12 active" />
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4 }}>COMMUNICATION OK</div>
        </Card>
        <Card>
          <CardTitle style={{ marginBottom: 4 }}>Charging Stations</CardTitle>
          <DataNumber value={2} color="var(--accent-primary)" />
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4 }}>ACTIVE INGRESS SESSION</div>
        </Card>
        <Card>
          <CardTitle style={{ marginBottom: 4 }}>System Warnings</CardTitle>
          <DataNumber value={3} color="var(--accent-warning)" />
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 4 }}>RESOLVED 2 INCIDENTS</div>
        </Card>
      </div>

      {/* Middle Grid - Command Analytics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isNarrow ? '1fr' : 'repeat(12, minmax(0, 1fr))',
        gap: 16
      }}>
        
        {/* CAD Blueprint 3D (span 8) */}
        <div style={{ gridColumn: isNarrow ? '1 / -1' : '1 / span 8', height: 290 }}>
          <VehicleOverview3D />
        </div>

        {/* Fleet Health Analytics (span 4) */}
        <Card style={{ gridColumn: isNarrow ? '1 / -1' : '9 / -1' }}>
          <CardTitle>Fleet Health Analytics</CardTitle>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>7-Day Average Availability: </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-success)' }}>98.4%</span>
          </div>
          <ResponsiveContainer width='100%' height={160}>
            <LineChart data={FLEET_HEALTH_DATA} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
              <XAxis dataKey='day' tick={{ fill: '#94A3B8', fontSize: 9 }} />
              <YAxis domain={[95, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
              <Tooltip {...CHART_THEME.tooltip} />
              <Line type='monotone' dataKey='availability' stroke='var(--accent-success)' strokeWidth={1.5} dot={{ r: 2 }} name="Availability %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* Battery, Motor and Risk forecasting Grid */}
      <Grid cols={isNarrow ? 1 : 3}>
        {/* Battery Intelligence overview */}
        <Card>
          <CardTitle>Battery Pack Analytics</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 9.5 }}>BMS VOLTAGE DEVIATION</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--accent-danger)', fontWeight: 600 }}>110 mV <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>C15 anomaly</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: '1px solid var(--bg-border)', paddingTop: 8 }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>AVG CHARGE</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>72.4%</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>AVG TEMP</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>44°C</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Motor Intelligence */}
        <Card>
          <CardTitle>Motor Stator Metrics</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 9.5 }}>MAX DRIVE TORQUE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-primary)', fontWeight: 600 }}>182 N·m <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>EV-003</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: '1px solid var(--bg-border)', paddingTop: 8 }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>AVG RPM</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>6,240 rpm</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>STATOR TEMP</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-warning)', fontWeight: 600 }}>94°C</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk forecasting */}
        <Card>
          <CardTitle>AI Thermal Runaway Risk</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 9 }}>HAZARD PROBABILITY</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent-danger)', fontFamily: 'var(--font-mono)' }}>1.2%</div>
              </div>
              <StatusPill type="amber">ELEVATED</StatusPill>
            </div>
            <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 8, fontSize: 10.5, color: 'var(--text-secondary)' }}>
              Self-discharge indices nominal. High-temp anomaly isolated to EV-007 coolant shunt failure.
            </div>
          </div>
        </Card>
      </Grid>

      {/* Bottom Grid - Operational Ingress */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isNarrow ? '1fr' : 'repeat(12, minmax(0, 1fr))',
        gap: 16
      }}>
        {/* Recent Incidents (span 4) */}
        <Card style={{ gridColumn: isNarrow ? '1 / -1' : '1 / span 4' }}>
          <CardTitle style={{ marginBottom: 12 }}>Recent Alert Timeline</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ALERTS.slice(0, 3).map(a => (
              <AlertRow key={a.id} {...a} />
            ))}
          </div>
        </Card>

        {/* Maintenance schedule (span 3) */}
        <Card style={{ gridColumn: isNarrow ? '1 / -1' : '5 / span 3' }}>
          <CardTitle style={{ marginBottom: 12 }}>Maintenance Schedule</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MAINTENANCE_FORECAST.map(item => {
              const pillType = item.status === 'critical' ? 'red' : item.status === 'warning' ? 'amber' : 'green'
              return (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 6,
                  borderBottom: '1px solid var(--bg-border)'
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.id}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.days}d limit</span>
                  <StatusPill type={pillType}>{item.status.toUpperCase()}</StatusPill>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Charging Network Activity (span 3) */}
        <Card style={{ gridColumn: isNarrow ? '1 / -1' : '8 / span 3' }}>
          <CardTitle>Charging Network Activity</CardTitle>
          <ResponsiveContainer width='100%' height={120}>
            <AreaChart data={UTILIZATION_DATA}>
              <defs>
                <linearGradient id='rewards' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='var(--accent-primary)' stopOpacity={0.15}/>
                  <stop offset='95%' stopColor='var(--accent-primary)' stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
              <XAxis dataKey='hour' tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <Tooltip {...CHART_THEME.tooltip} />
              <Area type='monotone' dataKey='charging' stroke='var(--accent-primary)' fillOpacity={1} fill='url(#rewards)' name="Charging Sessions %" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Regional Operations (span 2) */}
        <Card style={{ gridColumn: isNarrow ? '1 / -1' : '11 / -1' }}>
          <CardTitle>Regional Operations</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {VEHICLE_RANKINGS.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{item.id}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  color: item.score > 90 ? 'var(--accent-success)' : 'var(--accent-warning)',
                  fontWeight: 600
                }}>
                  {item.score}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  )
}
