import React, { useState, useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { Card, CardTitle, Grid, TabBar, StatusPill, DataNumber, PageHeader } from '../components/UI'
import { generateMonths } from '../data/mockData'
import { Cpu, Activity, ShieldAlert, GitCommit } from 'lucide-react'

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

const MONTHS = generateMonths()

// Mock drift and inference volume over 12 months
const MONITORING_DATA = MONTHS.map((m, i) => ({
  month: m,
  inferences: Math.round(18000 + i * 1500 + Math.random() * 2000),
  drift: parseFloat((0.01 + i * 0.005 + (i === 10 ? 0.03 : 0)).toFixed(3)),
  accuracy: parseFloat((96.2 - i * 0.2).toFixed(1))
}))

const VERSION_REGISTRY = {
  battery: [
    { version: 'v2.4.1', status: 'active',    accuracy: '94.2%', drift: '0.015', deployed: '2026-05-12' },
    { version: 'v2.4.0', status: 'shadow',    accuracy: '93.8%', drift: '0.024', deployed: '2026-04-01' },
    { version: 'v2.3.9', status: 'deprecated',accuracy: '92.1%', drift: '0.052', deployed: '2026-01-15' },
  ],
  thermal: [
    { version: 'v3.1.0', status: 'active',    accuracy: '99.2%', drift: '0.008', deployed: '2026-06-02' },
    { version: 'v3.0.8', status: 'shadow',    accuracy: '98.9%', drift: '0.012', deployed: '2026-05-18' },
    { version: 'v2.8.2', status: 'deprecated',accuracy: '97.5%', drift: '0.045', deployed: '2025-11-20' },
  ],
  charging: [
    { version: 'v1.8.4', status: 'active',    accuracy: '18.4%*', drift: '0.021', deployed: '2026-05-22' }, // Extension %
    { version: 'v1.8.2', status: 'shadow',    accuracy: '17.2%*', drift: '0.024', deployed: '2026-05-01' },
    { version: 'v1.7.0', status: 'deprecated',accuracy: '15.0%*', drift: '0.038', deployed: '2026-02-10' },
  ]
}

const TABS = [
  { id: 'battery',  label: 'Battery Health AI (LSTM)' },
  { id: 'thermal',  label: 'Thermal Risk AI (Random Forest)' },
  { id: 'charging', label: 'Charging Optimizer (DQN RL)' },
]

export default function AIModelsPage() {
  const [activeTab, setActiveTab] = useState('battery')

  const activeVersions = useMemo(() => VERSION_REGISTRY[activeTab] || [], [activeTab])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      
      <PageHeader
        title="AI Diagnostic Models"
        description="Monitor machine learning validation metrics, concept drift thresholds, and active model versions."
        actions={
          <button className="cy-btn primary" onClick={() => alert('Retraining selected model on latest fleet telemetry...')}>
            Trigger Model Retraining
          </button>
        }
      />

      {/* Model Tabs Selection */}
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Model Dashboard */}
      {activeTab === 'battery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPI Strip */}
          <Grid cols={4}>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Inference Volume</CardTitle>
              <DataNumber value={28450} unit="req/day" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>TOTAL INFERENCES TODAY</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Model Accuracy</CardTitle>
              <DataNumber value={94.2} unit="%" color="var(--accent-success)" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>F1 SCORE CONFIDENCE</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Concept Drift Index</CardTitle>
              <DataNumber value={0.015} color="var(--accent-success)" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>NOMINAL DEVIATION</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Deployment Status</CardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0 2px 0' }}>
                <StatusPill type="green">HEALTHY</StatusPill>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>4 REPLICAS ON AWS EKS</div>
            </Card>
          </Grid>

          <Grid cols={12} gap={16}>
            {/* Charts section (span 8) */}
            <Card style={{ gridColumn: '1 / span 8', minWidth: 0 }}>
              <CardTitle>Inference Ingress & Concept Drift Index</CardTitle>
              <ResponsiveContainer width='100%' height={220}>
                <BarChart data={MONITORING_DATA} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
                  <XAxis dataKey='month' tick={{ fill: '#94A3B8', fontSize: 9 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#94A3B8', fontSize: 8 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 0.1]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                  <Tooltip {...CHART_THEME.tooltip} />
                  <Bar yAxisId="left" dataKey='inferences' fill='var(--accent-primary)' radius={[2, 2, 0, 0]} name="Inference Count" />
                  <Line yAxisId="right" type='monotone' dataKey='drift' stroke='var(--accent-warning)' strokeWidth={1.5} dot={false} name="Drift Score" />
                  <Legend wrapperStyle={{ fontSize: 9.5, fontFamily: 'var(--font-mono)' }} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Evaluation metrics (span 4) */}
            <Card style={{ gridColumn: '9 / -1' }}>
              <CardTitle>Model Parameters & Training</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Architecture</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>LSTM RNN PyTorch</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Input Dimensions</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>12 Time-series vectors</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Training Epochs</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>120 epochs (Early stop)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Validation Loss</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>0.0124 MSE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ROC AUC score</span>
                  <span style={{ color: 'var(--accent-success)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>0.978</span>
                </div>
              </div>
            </Card>
          </Grid>
        </div>
      )}

      {activeTab === 'thermal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPI Strip */}
          <Grid cols={4}>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Inference Volume</CardTitle>
              <DataNumber value={42510} unit="req/day" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>TOTAL INFERENCES TODAY</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Model Accuracy</CardTitle>
              <DataNumber value={99.2} unit="%" color="var(--accent-success)" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>PRECISION METRIC</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Concept Drift Index</CardTitle>
              <DataNumber value={0.008} color="var(--accent-success)" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>NOMINAL DEVIATION</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Deployment Status</CardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0 2px 0' }}>
                <StatusPill type="red">WARNING FLAG</StatusPill>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-danger)', marginTop: 8 }}>ELEVATED INCIDENT EV-007</div>
            </Card>
          </Grid>

          <Grid cols={12} gap={16}>
            <Card style={{ gridColumn: '1 / span 8', minWidth: 0 }}>
              <CardTitle>Thermal Classifier Accuracy & Concept Drift Timeline</CardTitle>
              <ResponsiveContainer width='100%' height={220}>
                <LineChart data={MONITORING_DATA} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
                  <XAxis dataKey='month' tick={{ fill: '#94A3B8', fontSize: 9 }} />
                  <YAxis yAxisId="left" domain={[90, 100]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 0.05]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                  <Tooltip {...CHART_THEME.tooltip} />
                  <Line yAxisId="left" type='monotone' dataKey='accuracy' stroke='var(--accent-success)' strokeWidth={1.5} dot={{ r: 2 }} name="Classifier Accuracy %" />
                  <Line yAxisId="right" type='monotone' dataKey='drift' stroke='var(--accent-danger)' strokeWidth={1.5} dot={false} name="Data Drift" />
                  <Legend wrapperStyle={{ fontSize: 9.5, fontFamily: 'var(--font-mono)' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card style={{ gridColumn: '9 / -1' }}>
              <CardTitle>Model Parameters & Training</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Architecture</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Random Forest Class.</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Decision Trees</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>150 Estimators</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>False Positives</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>0.8% threshold</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Inference latency</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>1.8 ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Detection window</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>15 min advance warn</span>
                </div>
              </div>
            </Card>
          </Grid>
        </div>
      )}

      {activeTab === 'charging' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPI Strip */}
          <Grid cols={4}>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Inference Volume</CardTitle>
              <DataNumber value={2405} unit="req/day" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>TOTAL SESSIONS GENERATED</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Cycle Extension</CardTitle>
              <DataNumber value={18.4} unit="%" color="var(--accent-success)" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>vs STANDARD CHARGING</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Concept Drift Index</CardTitle>
              <DataNumber value={0.021} color="var(--accent-success)" />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>NOMINAL DEVIATION</div>
            </Card>
            <Card>
              <CardTitle style={{ marginBottom: 4 }}>Deployment Status</CardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0 2px 0' }}>
                <StatusPill type="green">OPTIMIZING</StatusPill>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>RL AGENT IN SERVICE</div>
            </Card>
          </Grid>

          <Grid cols={12} gap={16}>
            <Card style={{ gridColumn: '1 / span 8', minWidth: 0 }}>
              <CardTitle>Reinforcement Learning DQN Reward Trend</CardTitle>
              <ResponsiveContainer width='100%' height={220}>
                <AreaChart data={MONITORING_DATA} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id='rewards' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='var(--accent-primary)' stopOpacity={0.15}/>
                      <stop offset='95%' stopColor='var(--accent-primary)' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke='var(--bg-border)' strokeDasharray='3 3' />
                  <XAxis dataKey='month' tick={{ fill: '#94A3B8', fontSize: 9 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 8 }} />
                  <Tooltip {...CHART_THEME.tooltip} />
                  <Area type='monotone' dataKey='inferences' stroke='var(--accent-primary)' fillOpacity={1} fill='url(#rewards)' name="Avg Reward Curve" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card style={{ gridColumn: '9 / -1' }}>
              <CardTitle>Model Parameters & Training</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Architecture</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Deep Q-Network (DQN)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Action Spaces</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Discrete charge currents</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>State Space</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>SoC, temp, cycle count</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Energy Savings</span>
                  <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>7.4% average reduction</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Framework</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>RLlib / Ray Cluster</span>
                </div>
              </div>
            </Card>
          </Grid>
        </div>
      )}

      {/* Version Control Registry Card */}
      <div className="cy-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 14, borderBottom: '1px solid var(--bg-border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitCommit size={14} style={{ color: 'var(--accent-primary)' }} />
            Model Version Control Registry
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            minWidth: 600
          }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderBottom: '1px solid var(--bg-border)', textAlign: 'left' }}>
                <th style={{ padding: '8px 14px' }}>VERSION</th>
                <th style={{ padding: '8px 14px' }}>DEPLOY STATUS</th>
                <th style={{ padding: '8px 14px' }}>METRIC RATING</th>
                <th style={{ padding: '8px 14px' }}>CONCEPT DRIFT INDEX</th>
                <th style={{ padding: '8px 14px' }}>DEPLOYMENT DATE</th>
              </tr>
            </thead>
            <tbody>
              {activeVersions.map(v => (
                <tr key={v.version} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{v.version}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <StatusPill type={v.status === 'active' ? 'green' : v.status === 'shadow' ? 'blue' : 'gray'}>
                      {v.status.toUpperCase()}
                    </StatusPill>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{v.accuracy}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{v.drift}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{v.deployed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
