// ─── AlertsPage.jsx ────────────────────────────────────────────────
import React from 'react'
import { AlertRow, Grid, MetricCard } from '../components/UI'
import { ALERTS } from '../data/mockData'

export function AlertsPage() {
  const critical = ALERTS.filter(a=>a.sev==='critical').length
  const warning  = ALERTS.filter(a=>a.sev==='warning').length
  const info     = ALERTS.filter(a=>a.sev==='info').length

  return (
    <div style={{ animation:'pageIn .4s ease' }}>
      <Grid cols={3} style={{ marginBottom:14 }}>
        <MetricCard label='Critical' value={critical} color='var(--accent-red)'   barPct={critical*20} barColor='var(--accent-red)' />
        <MetricCard label='Warning'  value={warning}  color='var(--accent-amber)' barPct={warning*20}  barColor='var(--accent-amber)' />
        <MetricCard label='Info'     value={info}     color='var(--accent-cyan)'  barPct={info*20}     barColor='var(--accent-cyan)' />
      </Grid>
      <div className='cy-panel'>
        <div className='cy-title'>All Active Alerts — EV Fleet</div>
        {ALERTS.map(a=><AlertRow key={a.id} {...a} />)}
      </div>
    </div>
  )
}

export default AlertsPage