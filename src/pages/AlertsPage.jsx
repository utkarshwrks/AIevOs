import React from 'react'
import { AlertRow, Grid, MetricCard } from '../components/UI'
import { ALERTS } from '../data/mockData'

export default function AlertsPage() {
  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <Grid cols={3} style={{ marginBottom: 20 }}>
        <MetricCard label="Critical" value="1" color="var(--red)" barColor="var(--red)" barPct={33} />
        <MetricCard label="Warning"  value="2" color="var(--amber)" barColor="var(--amber)" barPct={66} />
        <MetricCard label="Info"     value="5" color="var(--blue)" barColor="var(--blue)" barPct={100} />
      </Grid>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>
          All Active Alerts
        </div>
        {ALERTS.map(a => <AlertRow key={a.id} {...a} />)}
      </div>
    </div>
  )
}