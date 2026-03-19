import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardTitle, Grid, TabBar } from '../components/UI'

const TT = { contentStyle: { background: '#0f1318', border: '1px solid #1e2a38', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11 } }
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const SOH_PRED_DATA = MONTHS.map((m, i) => ({
  month: m,
  actual:    i < 10 ? 97 - i * 1.5 : null,
  predicted: i >= 7  ? 88 - (i - 7) * 2.5 : null,
}))

const RISK_DATA = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  risk: Math.min(95, 5 + i * 0.4 + Math.random() * 8),
}))

const CHARGING_COMPARISON = Array.from({ length: 11 }, (_, i) => ({
  soc: `${i * 10}%`,
  standard:    [120,115,112,108,100,90,78,64,48,30,15][i],
  optimized:   [80, 82, 85, 88, 88, 86,80,70,55,38,20][i],
}))

const TABS = [
  { id: 'battery',  label: 'Battery Health AI'   },
  { id: 'thermal',  label: 'Thermal Prediction'  },
  { id: 'charging', label: 'Charging Optimizer'  },
]

function AIModelHeader({ icon, color, bg, border, title, subtitle, badge, badgeColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: bg, border: `1px solid ${border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color,
      }}>
        AI
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{subtitle}</div>
      </div>
      {badge && (
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: badgeColor }}>
          {badge}
        </div>
      )}
    </div>
  )
}

export default function AIModelsPage() {
  const [activeTab, setActiveTab] = useState('battery')

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'battery' && (
        <Card>
          <AIModelHeader
            color="var(--green)" bg="var(--green3)" border="var(--green2)"
            title="Battery Health Prediction Model"
            subtitle="PyTorch LSTM · Scikit-learn preprocessing"
            badge="ACCURACY 94.2%"
            badgeColor="var(--green)"
          />
          <Grid cols={3} style={{ marginBottom: 12 }}>
            {[
              ['Model Type',  'LSTM RNN',     'Time-series sequential' ],
              ['Input Features', '12 inputs', 'Voltage, temp, cycles...' ],
              ['Output',      'SoH · RUL',    'Health + remaining life'  ],
            ].map(([label, val, sub]) => (
              <Card key={label} style={{ background: 'var(--bg3)' }}>
                <CardTitle>{label}</CardTitle>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal)' }}>{val}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>
              </Card>
            ))}
          </Grid>
          <CardTitle>Actual vs AI Predicted SoH (%)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SOH_PRED_DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="month" tick={{ fill: '#4a5a6a', fontSize: 10 }} />
              <YAxis domain={[75, 100]} tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="actual"    stroke="#00e896" strokeWidth={2} dot={{ fill: '#00e896', r: 3 }} name="Actual SoH %" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="#f0a020" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#f0a020', r: 3 }} name="AI Predicted %" connectNulls={false} />
              <Legend wrapperStyle={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {activeTab === 'thermal' && (
        <Card>
          <AIModelHeader
            color="var(--red)" bg="var(--red3)" border="var(--red2)"
            title="Thermal Runaway Prediction Model"
            subtitle="Random Forest · Anomaly Detection"
            badge="⚠ ALERT ACTIVE"
            badgeColor="var(--red)"
          />
          <Grid cols={3} style={{ marginBottom: 12 }}>
            {[
              ['Model Type',         'Random Forest', 'Classification + regression'],
              ['Detection Window',   '15 min',        'Advance warning time'       ],
              ['False Positive Rate','0.8%',          'Precision: 99.2%'           ],
            ].map(([label, val, sub]) => (
              <Card key={label} style={{ background: 'var(--bg3)' }}>
                <CardTitle>{label}</CardTitle>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal)' }}>{val}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>
              </Card>
            ))}
          </Grid>
          <CardTitle>Risk Score Over Time</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={RISK_DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="t" tick={{ fill: '#4a5a6a', fontSize: 9 }} interval={9} />
              <YAxis tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="risk" stroke="#ff4560" strokeWidth={2} dot={false} name="Risk Score" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {activeTab === 'charging' && (
        <Card>
          <AIModelHeader
            color="var(--blue)" bg="var(--blue3)" border="var(--blue2)"
            title="Charging Optimization Model"
            subtitle="Reinforcement Learning · DQN Agent"
            badge="OPTIMIZING"
            badgeColor="var(--blue)"
          />
          <Grid cols={3} style={{ marginBottom: 12 }}>
            {[
              ['Algorithm',       'DQN Agent', 'Deep Q-Network RL'         ],
              ['Cycle Extension', '+18%',      'vs standard charge'        ],
              ['Energy Saved',    '7.4%',      'Per charge session'        ],
            ].map(([label, val, sub]) => (
              <Card key={label} style={{ background: 'var(--bg3)' }}>
                <CardTitle>{label}</CardTitle>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal)' }}>{val}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>
              </Card>
            ))}
          </Grid>
          <CardTitle>Standard vs AI Optimized Charging Rate (W)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CHARGING_COMPARISON} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="soc" tick={{ fill: '#4a5a6a', fontSize: 10 }} />
              <YAxis tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="standard"  stroke="#7a90a4" strokeWidth={2} dot={false} name="Standard"     />
              <Line type="monotone" dataKey="optimized" stroke="#4090ff" strokeWidth={2} dot={false} name="AI Optimized" />
              <Legend wrapperStyle={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}