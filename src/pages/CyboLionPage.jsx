import React from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { Card, CardTitle, Grid, StatusPill } from '../components/UI'
import { useLiveTelemetry } from '../hooks/useLiveTelemetry'

const SOH_DATA = [
  { year: 'Y1', actual: 100, predicted: null },
  { year: 'Y2', actual: 98,  predicted: null },
  { year: 'Y3', actual: 96,  predicted: null },
  { year: 'Y4', actual: 94,  predicted: null },
  { year: 'Y5', actual: 91,  predicted: null },
  { year: 'Y6', actual: 88,  predicted: null },
  { year: 'Y7', actual: 85,  predicted: null },
  { year: 'Y8', actual: 82,  predicted: 82   },
  { year: 'Y9', actual: 78,  predicted: 78   },
  { year: 'Y10',actual: null, predicted: 74   },
]

const CELL_V = Array.from({ length: 24 }, (_, i) => ({
  cell: `C${i + 1}`,
  v: parseFloat((3.78 + Math.random() * 0.12).toFixed(3)),
}))

const TT = { contentStyle: { background: '#0f1318', border: '1px solid #1e2a38', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11 } }

export default function CyboLionPage() {
  const t = useLiveTelemetry(2000)

  const soc      = Math.round(t.soc)
  const soh      = Math.round(t.soh)
  const rul      = 400 + Math.round(Math.random() * 30)
  const maxTemp  = Math.round(t.cellTemp)
  const risk     = Math.round(18 + Math.random() * 14)
  const riskColor = risk < 25 ? 'var(--green)' : risk < 50 ? 'var(--amber)' : 'var(--red)'

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: 'var(--green3)', border: '1px solid var(--green2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>🔋</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1, color: '#fff' }}>CyboLion</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>BATTERY INTELLIGENCE MODULE</div>
        </div>
        <div style={{ marginLeft: 'auto' }}><StatusPill type="green">MONITORING</StatusPill></div>
      </div>

      {/* KPIs */}
      <Grid cols={4}>
        <Card>
          <CardTitle>SoC</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--green)' }}>{soc}%</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>State of Charge</div>
        </Card>
        <Card>
          <CardTitle>SoH</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--amber)' }}>{soh}%</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>State of Health</div>
        </Card>
        <Card>
          <CardTitle>RUL</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--blue)' }}>{rul}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Cycles Remaining</div>
        </Card>
        <Card>
          <CardTitle>Max Cell Temp</CardTitle>
          <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--red)' }}>{maxTemp}°C</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Pack Temperature</div>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid cols={2}>
        <Card>
          <CardTitle>Cell Voltage (24 Cells)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CELL_V} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="cell" tick={{ fill: '#4a5a6a', fontSize: 8 }} interval={1} />
              <YAxis domain={[3.7, 4.0]} tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip {...TT} />
              <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                {CELL_V.map((d, i) => (
                  <Cell key={i} fill={d.v < 3.8 ? '#ff4560' : d.v > 3.9 ? '#f0a020' : '#00e896'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>SoH Degradation Forecast (AI)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SOH_DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="year" tick={{ fill: '#4a5a6a', fontSize: 10 }} />
              <YAxis domain={[70, 102]} tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="actual"    stroke="#00e896" strokeWidth={2} dot={{ fill: '#00e896', r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="#f0a020" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#f0a020', r: 3 }} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {[['#00e896','Actual SoH'],['#f0a020','AI Predicted']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* Thermal risk */}
      <Card>
        <CardTitle>Thermal Runaway Risk Gauge</CardTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 0' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
              <span>RISK LEVEL</span>
              <span style={{ color: riskColor }}>{risk}%</span>
            </div>
            <div style={{ height: 12, background: 'var(--bg4)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${risk}%`, borderRadius: 6,
                background: 'linear-gradient(90deg, var(--green), var(--amber), var(--red))',
                transition: 'width .5s',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', marginTop: 3 }}>
              <span>LOW</span><span>MEDIUM</span><span>HIGH</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 600, color: riskColor }}>{risk}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>RISK SCORE</div>
          </div>
        </div>
      </Card>
    </div>
  )
}