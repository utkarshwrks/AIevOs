import React from 'react'
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { MetricCard, Card, CardTitle, AlertRow, Grid } from '../components/UI'
import { VEHICLES, ALERTS } from '../data/mockData'

const CHARGING_DATA = [
  { name: 'Active',   value: 7, color: '#00e896' },
  { name: 'Charging', value: 2, color: '#4090ff' },
  { name: 'Warning',  value: 3, color: '#f0a020' },
]

const MOTOR_TEMP_DATA = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  temp: Math.round(60 + Math.random() * 25),
}))

export default function DashboardPage() {
  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <Grid cols={4}>
        <MetricCard
          label="Total Vehicles"
          value="12"
          sub="FLEET SIZE"
          barColor="var(--blue)"
          barPct={100}
        />
        <MetricCard
          label="Fleet Health Score"
          value={<>87<span style={{ fontSize: 16, color: 'var(--text3)' }}>%</span></>}
          sub="AVG HEALTH INDEX"
          color="var(--green)"
          barColor="var(--green)"
          barPct={87}
        />
        <MetricCard
          label="Active Alerts"
          value="3"
          sub={<><span style={{ color: 'var(--red)' }}>1 CRITICAL</span> · 2 WARNING</>}
          color="var(--red)"
          barColor="var(--red)"
          barPct={25}
        />
        <MetricCard
          label="Avg Battery SoC"
          value={<>72<span style={{ fontSize: 16, color: 'var(--text3)' }}>%</span></>}
          sub={<><span style={{ color: 'var(--green)' }}>↑ 4%</span> SINCE YESTERDAY</>}
          color="var(--amber)"
          barColor="var(--amber)"
          barPct={72}
        />
      </Grid>

      <Grid cols={2}>
        <Card>
          <CardTitle>Battery SoC Distribution</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={VEHICLES} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="id" tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <YAxis tick={{ fill: '#4a5a6a', fontSize: 9 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#0f1318', border: '1px solid #1e2a38', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11 }}
                labelStyle={{ color: '#c8d4e0' }}
              />
              <Bar dataKey="soc" radius={[4, 4, 0, 0]}>
                {VEHICLES.map((v, i) => (
                  <Cell key={i} fill={v.soc > 70 ? '#00e896' : v.soc > 40 ? '#f0a020' : '#ff4560'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle>Motor Temp Trend (24h)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOTOR_TEMP_DATA} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a38" />
              <XAxis dataKey="hour" tick={{ fill: '#4a5a6a', fontSize: 9 }} interval={3} />
              <YAxis tick={{ fill: '#4a5a6a', fontSize: 9 }} />
              <Tooltip contentStyle={{ background: '#0f1318', border: '1px solid #1e2a38', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11 }} />
              <Line type="monotone" dataKey="temp" stroke="#4090ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid cols={2}>
        <Card>
          <CardTitle style={{ marginBottom: 12 }}>Recent Alerts</CardTitle>
          {ALERTS.map(a => <AlertRow key={a.id} {...a} />)}
        </Card>

        <Card>
          <CardTitle>Charging Status</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={CHARGING_DATA}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={80}
                dataKey="value"
              >
                {CHARGING_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1318', border: '1px solid #1e2a38', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11 }} />
              <Legend
                wrapperStyle={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}
                iconType="square"
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    </div>
  )
}