import React from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { Card, CardTitle, DataNumber, Grid, ProgressBar, AlertRow, StatusPill, PageHeader } from '../components/UI'
import { ALERTS } from '../data/mockData'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { Cpu, Wrench, ShieldCheck, Activity } from 'lucide-react'

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

const RPM_DATA  = Array.from({length:20},(_,i)=>({ t:`${i*3}:00`, rpm:Math.round(50+Math.random()*30)*100, torque:Math.round(140+Math.random()*60) }))
const EFF_DATA  = Array.from({length:24},(_,i)=>({ x:i, efficiency:88+Math.random()*6 }))

function MotorSchematic({ rpm }) {
  const dur = Math.max(0.4, 2.5 - (rpm/12000)*2.1)
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--bg-border)',
      borderRadius: 8,
      padding: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg viewBox='0 0 500 200' style={{ width:'100%', height:180 }}>
        <circle cx='160' cy='100' r='72' fill='none' stroke='var(--bg-border)' strokeWidth='3' />
        <circle cx='160' cy='100' r='64' fill='none' stroke='var(--bg-border)' strokeWidth='1' />
        <circle cx='160' cy='100' r='78' fill='var(--bg-surface)' stroke='var(--bg-border)' strokeWidth='1.5' />

        <g style={{ transformOrigin:'160px 100px' }}>
          <animateTransform
            attributeName='transform' type='rotate'
            from='0 160 100' to='360 160 100'
            dur={`${dur}s`} repeatCount='indefinite'
          />
          <line x1='160' y1='32' x2='160' y2='168' stroke='var(--accent-primary)' strokeWidth='2' />
          <line x1='92'  y1='100' x2='228' y2='100' stroke='var(--accent-primary)' strokeWidth='2' />
          <line x1='112' y1='52' x2='208' y2='148' stroke='var(--accent-primary)' strokeWidth='1' strokeDasharray='3 2' />
          <line x1='208' y1='52' x2='112' y2='148' stroke='var(--accent-primary)' strokeWidth='1' strokeDasharray='3 2' />
          
          <rect x='152' y='52' width='16' height='12' fill='var(--bg-border)' rx='2' />
          <rect x='152' y='136' width='16' height='12' fill='var(--bg-border)' rx='2' />
          <rect x='102' y='94' width='12' height='16' fill='var(--bg-border)' rx='2' />
          <rect x='186' y='94' width='12' height='16' fill='var(--bg-border)' rx='2' />
        </g>

        <circle cx='160' cy='100' r='14' fill='var(--bg-surface)' stroke='var(--accent-primary)' strokeWidth='1.5' />
        <circle cx='160' cy='100' r='6' fill='var(--text-secondary)' />

        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const cx = 160 + Math.cos(rad) * 64
          const cy = 100 + Math.sin(rad) * 64
          return (
            <circle key={i} cx={cx} cy={cy} r='4' fill='var(--bg-surface)' stroke='var(--accent-warning)' strokeWidth='1.5' />
          )
        })}

        <rect x='280' y='55' width='180' height='90' fill='var(--bg-surface)' stroke='var(--bg-border)' rx='6' />
        <text x='292' y='76' fill='var(--text-primary)' fontSize='10' fontFamily='var(--font-sans)' fontWeight='600'>INVERTER PHASE MODULE</text>
        <text x='292' y='96' fill='var(--text-muted)' fontSize='9' fontFamily='var(--font-mono)'>GATEWAY: NOMINAL</text>
        <text x='292' y='114' fill='var(--text-secondary)' fontSize='9.5' fontFamily='var(--font-mono)'>SWITCH FREQ: 12.4 kHz</text>
        <text x='292' y='130' fill='var(--accent-primary)' fontSize='9.5' fontFamily='var(--font-mono)'>RMS CURRENT: 82.4 A</text>

        <path d='M 224 100 L 280 100' fill='none' stroke='var(--bg-border)' strokeWidth='1.5' strokeDasharray='3 3' />

        <text x='160' y='16' textAnchor='middle' fill='var(--text-muted)' fontSize='8' fontFamily='var(--font-mono)' letterSpacing='0.05em'>
          PMSM ROTOR CROSS SECTION
        </text>
      </svg>
    </div>
  )
}

function PowertrainDiagnostics() {
  const checks = [
    { name: 'Phase Balance Index',  val: '99.8%',   status: 'nominal' },
    { name: 'Switching Ripples',    val: '0.14 A',   status: 'nominal' },
    { name: 'Rotor Align Drift',    val: '0.04°',    status: 'nominal' },
    { name: 'Coolant Flow Rate',    val: '0.38 L/s', status: 'nominal' },
  ]
  return (
    <Card>
      <CardTitle style={{ marginBottom: 12 }}>Powertrain Diagnostics</CardTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {checks.map(item => (
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
            <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.val}</span>
            <StatusPill type="green">{item.status.toUpperCase()}</StatusPill>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PredictiveMaintenance() {
  const schedule = [
    { name: 'Bearing Wear Inspection',  due: '85% remaining', status: 'nominal' },
    { name: 'Stator Insulation Test',   due: 'Due in 45 days', status: 'nominal' },
    { name: 'Gearbox Lubricant Flush',  due: '12,400 mi left', status: 'nominal' },
    { name: 'Inverter Cap Lifetime',    due: 'Inspect due',    status: 'warning' },
  ]
  return (
    <Card>
      <CardTitle style={{ marginBottom: 12 }}>Predictive Maintenance Schedule</CardTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {schedule.map(item => (
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
            <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
            <span style={{ color: item.status === 'warning' ? 'var(--accent-warning)' : 'var(--text-primary)' }}>{item.due}</span>
            <StatusPill type={item.status === 'warning' ? 'amber' : 'green'}>{item.status.toUpperCase()}</StatusPill>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function CyboDrivePage() {
  const t = useLiveTelemetry(2000)
  const { isMobile, isTablet } = useBreakpoint()
  const isNarrow = isMobile || isTablet
  const driveAlerts = ALERTS.filter(a => a.module === 'CyboDrive')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>

      {/* SaaS Page Header */}
      <PageHeader
        title="CyboDrive Motor Intelligence"
        description="Monitor phase switching harmonics, PMSM rotor positioning drift, and powertrain schedules."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cy-btn primary">Calibrate Rotor Alignment</button>
          </div>
        }
      />

      <Grid cols={isNarrow ? 1 : 2}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <CardTitle>CAD Motor Cross Section</CardTitle>
            <MotorSchematic rpm={Math.round(t.rpm)} />
          </Card>
          
          <PowertrainDiagnostics />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <CardTitle>Rotor Drive Metrics — Live</CardTitle>
            <Grid cols={2} style={{ marginBottom: 12 }}>
              {[
                { label: 'RPM LOAD SPEED',   value: Math.round(t.rpm),       unit: 'rpm', color: 'var(--text-primary)' },
                { label: 'SHAFT TORQUE',     value: Math.round(t.torque),    unit: 'N·m', color: 'var(--accent-success)' },
                { label: 'STATOR TEMP',      value: Math.round(t.motorTemp), unit: '°C',  color: 'var(--accent-danger)' },
                { label: 'CORE EFFICIENCY',  value: 92.4,                    unit: '%',   color: 'var(--accent-primary)' },
              ].map(({ label, value, unit, color }) => (
                <div key={label}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 9.5, marginBottom: 2 }}>{label}</div>
                  <DataNumber value={value} unit={unit} color={color} />
                </div>
              ))}
            </Grid>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 3 }}>
                <span>RPM Operating Limit</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((t.rpm / 12000) * 100)}%</span>
              </div>
              <ProgressBar value={Math.round((t.rpm / 12000) * 100)} />
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 3 }}>
                <span>Thermal Dissipation Limit</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((t.motorTemp / 120) * 100)}%</span>
              </div>
              <ProgressBar value={Math.round((t.motorTemp / 120) * 100)} color="var(--accent-danger)" />
            </div>
          </Card>
          
          <PredictiveMaintenance />
        </div>
      </Grid>

      <Grid cols={isNarrow ? 1 : 2}>
        <Card>
          <CardTitle>Rotor RPM vs Torque Profile</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={RPM_DATA} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
              <XAxis dataKey='t' tick={{ fill: '#94A3B8', fontSize: 9 }} interval={3} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <Tooltip {...CHART_THEME.tooltip} />
              <Line dataKey='rpm' stroke='var(--accent-primary)' dot={false} strokeWidth={1.5} name='RPM' />
              <Line dataKey='torque' stroke='var(--accent-success)' dot={false} strokeWidth={1.5} name='Torque N·m' />
              <Legend wrapperStyle={{ fontSize: 9.5, fontFamily: 'var(--font-mono)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Stator Inductive Efficiency Curve</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <AreaChart data={EFF_DATA} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id='effFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='var(--accent-primary)' stopOpacity={0.15}/>
                  <stop offset='95%' stopColor='var(--accent-primary)' stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
              <XAxis dataKey='x' tick={{ fill: '#94A3B8', fontSize: 9 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 8 }} domain={[75, 100]} />
              <Tooltip {...CHART_THEME.tooltip} />
              <Area dataKey='efficiency' stroke='var(--accent-primary)' fill='url(#effFill)' strokeWidth={1.5} dot={false} name='Efficiency %' />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {driveAlerts.length > 0 && (
        <Card>
          <CardTitle>Active Powertrain Alerts</CardTitle>
          {driveAlerts.map(a => <AlertRow key={a.id} {...a} />)}
        </Card>
      )}

    </div>
  )
}