import React, { useState, useMemo } from 'react'
import { Grid, MetricCard, StatusPill, PageHeader } from '../components/UI'
import { ALERTS } from '../data/mockData'
import { AlertCircle, ShieldAlert, CheckCircle, User, Clock, ArrowUpRight, Check } from 'lucide-react'

const INCIDENT_DETAILS = {
  1: {
    rca: 'Coolant bypass valve locked at 12% aperture. Cell 15 temp reached 68°C (rising at +3.2°C/min). Cell voltage delta is at 82mV, exceeding the nominal 30mV threshold.',
    timeline: [
      { time: '02:14 ago', text: 'Critical thermal alert triggered by BMS' },
      { time: '02:12 ago', text: 'AI thermal runaway prediction model flagged 98.4% risk score' },
      { time: '02:10 ago', text: 'Emergency cooling loop command sent (Bypass bypass failed)' },
      { time: '01:50 ago', text: 'Charge rate throttled to 0kW' }
    ],
    actions: [
      'Disengage high-power charging contactors immediately',
      'Force emergency coolant pump flow rate to 100%',
      'Dispatch field technician to sector location for thermal scan'
    ],
    owner: 'Operations Room A'
  },
  2: {
    rca: 'Stator core temperature hit 94°C during sustained high-torque load (8,240 RPM). Bearing frequency deviation of 8.2Hz detected, suggesting lubrication failure or misalignment.',
    timeline: [
      { time: '01:47 ago', text: 'Motor temperature warning triggered' },
      { time: '01:45 ago', text: 'Rotor alignment check nominal' },
      { time: '01:40 ago', text: 'Coolant temp validated at 45°C' }
    ],
    actions: [
      'Restrict motor peak torque output to 120 N·m',
      'Increase secondary glycol cooling loop pressure',
      'Schedule motor bearing inspection within 14 days'
    ],
    owner: 'Powertrain Team'
  },
  3: {
    rca: 'Voltage drop of 0.8V measured across harness connector segment C4 under 12A discharge load. Impedance drift suggests loose pin crimping or surface corrosion.',
    timeline: [
      { time: '00:52 ago', text: 'Voltage drop mismatch alert triggered' },
      { time: '00:48 ago', text: 'Continuity analysis performed' }
    ],
    actions: [
      'Clean wiring harness pins at terminal C4',
      'Measure resistance drift across connector bridge',
      'Inspect harness insulation integrity'
    ],
    owner: 'Harness Engineering'
  },
  4: {
    rca: 'State of Charge (SoC) reached target threshold of 98% on Station 4. Contactors opened nominally; thermal parameters within safe bounds.',
    timeline: [
      { time: '00:10 ago', text: 'SoC reached 98%' },
      { time: '00:09 ago', text: 'Charging session terminated nominally' }
    ],
    actions: [
      'Release charging cable latch lock',
      'Log charging efficiency metrics',
      'Archive session database logs'
    ],
    owner: 'Automation Engine'
  },
  5: {
    rca: 'Ingested MQTT charging handshake frame. SoC 55% at start, charging at 7.4kW. Pack voltage nominal at 368V.',
    timeline: [
      { time: '00:05 ago', text: 'Charger connection validated' },
      { time: '00:04 ago', text: 'Session initiated successfully' }
    ],
    actions: [
      'Monitor cell temperature profiles',
      'Track charging curve performance',
      'Validate connector lock signal'
    ],
    owner: 'Automation Engine'
  }
}

export function AlertsPage() {
  const [incidents, setIncidents] = useState(() =>
    ALERTS.map(a => ({
      ...a,
      status: 'active',
      owner: INCIDENT_DETAILS[a.id]?.owner || 'Unassigned'
    }))
  )
  const [selectedId, setSelectedId] = useState(1)

  const activeIncidents = useMemo(() => incidents.filter(i => i.status !== 'resolved'), [incidents])
  const selectedIncident = useMemo(() => incidents.find(i => i.id === selectedId), [incidents, selectedId])
  const details = useMemo(() => INCIDENT_DETAILS[selectedId] || {}, [selectedId])

  const kpis = useMemo(() => {
    const crit = activeIncidents.filter(i => i.sev === 'critical').length
    const warn = activeIncidents.filter(i => i.sev === 'warning').length
    const info = activeIncidents.filter(i => i.sev === 'info').length
    return { crit, warn, info }
  }, [activeIncidents])

  const handleAcknowledge = (id) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, status: 'acknowledged' } : inc
    ))
  }

  const handleResolve = (id) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, status: 'resolved' } : inc
    ))
    const remaining = activeIncidents.filter(inc => inc.id !== id)
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id)
    }
  }

  const handleEscalate = (id) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, owner: 'On-Call Tier 2 Lead' } : inc
    ))
  }

  const handleOwnerChange = (id, nextOwner) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, owner: nextOwner } : inc
    ))
  }

  const getSevColor = (sev) => {
    if (sev === 'critical') return 'var(--accent-danger)'
    if (sev === 'warning') return 'var(--accent-warning)'
    return 'var(--accent-primary)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      
      {/* SaaS Page Header */}
      <PageHeader
        title="Alert Incident Center"
        description="Verify active warning triggers, inspect real-time auto-diagnostics, and allocate resolution paths."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cy-btn primary" onClick={() => handleResolve(selectedId)}>Resolve Selection</button>
          </div>
        }
      />

      {/* Alert KPI Summary Row */}
      <Grid cols={3}>
        <MetricCard label='CRITICAL INCIDENTS' value={kpis.crit} color='var(--accent-danger)' barPct={kpis.crit * 20} barColor='var(--accent-danger)' />
        <MetricCard label='ACTIVE WARNINGS' value={kpis.warn} color='var(--accent-warning)' barPct={kpis.warn * 20} barColor='var(--accent-warning)' />
        <MetricCard label='NOMINAL METRICS' value={kpis.info} color='var(--accent-primary)' barPct={kpis.info * 20} barColor='var(--accent-primary)' />
      </Grid>

      {/* Incident Center Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 16,
        alignItems: 'start',
      }}>
        {/* Incident List */}
        <div className='cy-panel' style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>Operational Incident Log</span>
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{activeIncidents.length} Active alerts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeIncidents.map(inc => {
              const isSelected = inc.id === selectedId
              const sevColor = getSevColor(inc.sev)
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedId(inc.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '4px 1fr auto',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--bg-border)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-secondary)' : 'transparent',
                    alignItems: 'center',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={e => { if(!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-elevated)' }}
                  onMouseLeave={e => { if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <div style={{ background: sevColor, height: 28, borderRadius: 1 }} />
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 12 }}>{inc.msg}</span>
                      <span style={{
                        fontSize: 9,
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        borderRadius: 3,
                        background: inc.status === 'acknowledged' ? 'rgba(245, 165, 36, 0.05)' : 'rgba(229, 72, 77, 0.05)',
                        border: inc.status === 'acknowledged' ? '1px solid rgba(245, 165, 36, 0.15)' : '1px solid rgba(229, 72, 77, 0.15)',
                        color: inc.status === 'acknowledged' ? 'var(--accent-warning)' : 'var(--accent-danger)'
                      }}>
                        {inc.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10, marginTop: 4 }}>
                      {inc.vehicle} · {inc.module} · Owner: {inc.owner}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{inc.time}</span>
                    <ArrowUpRight size={12} style={{ color: isSelected ? 'var(--accent-primary)' : 'transparent' }} />
                  </div>
                </div>
              )
            })}
            {activeIncidents.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={24} style={{ color: 'var(--accent-success)', marginBottom: 8 }} />
                <div>Zero active incidents flagged. Fleet operations optimal.</div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Incident Details Drawer */}
        {selectedIncident && (
          <div className='cy-panel' style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ borderBottom: '1px solid var(--bg-border)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ShieldAlert size={14} style={{ color: getSevColor(selectedIncident.sev) }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  INCIDENT {selectedIncident.id}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: getSevColor(selectedIncident.sev),
                  textTransform: 'uppercase'
                }}>
                  {selectedIncident.sev}
                </span>
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {selectedIncident.msg}
              </h4>
            </div>

            {/* Root Cause Analysis */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Root Cause Analysis (RCA)
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.45, background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)', borderRadius: 6, padding: '8px 10px' }}>
                {details.rca}
              </p>
            </div>

            {/* Recommended Action Items */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Recommended Action Checklist
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {details.actions?.map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 11, color: 'var(--text-primary)' }}>
                    <div style={{ width: 14, height: 14, border: '1px solid var(--bg-border)', background: 'var(--bg-elevated)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <Check size={10} style={{ color: 'var(--accent-success)' }} />
                    </div>
                    <span style={{ lineHeight: 1.4 }}>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chronological Incident Timeline */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Incident Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 6, borderLeft: '1px solid var(--bg-border)' }}>
                {details.timeline?.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 10.5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', flexShrink: 0 }}><Clock size={9} style={{ marginRight: 3, display: 'inline' }} /> {step.time}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ownership Workflow */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--bg-border)', paddingTop: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={12} /> Assignee:
              </span>
              <select
                value={selectedIncident.owner}
                onChange={e => handleOwnerChange(selectedIncident.id, e.target.value)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--bg-border)',
                  borderRadius: 4,
                  padding: '4px 8px',
                  color: 'var(--text-primary)',
                  fontSize: 10.5,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Operations Room A">Operations Room A</option>
                <option value="Powertrain Team">Powertrain Team</option>
                <option value="Harness Engineering">Harness Engineering</option>
                <option value="Automation Engine">Automation Engine</option>
                <option value="On-Call Tier 2 Lead">On-Call Tier 2 Lead</option>
              </select>
            </div>

            {/* Resolution workflow buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {selectedIncident.status === 'active' && (
                <button
                  className="cy-btn primary"
                  onClick={() => handleAcknowledge(selectedIncident.id)}
                  style={{ flexGrow: 1 }}
                >
                  Acknowledge
                </button>
              )}
              <button
                className="cy-btn"
                onClick={() => handleResolve(selectedIncident.id)}
                style={{ flexGrow: 1, color: 'var(--accent-success)', borderColor: 'rgba(47, 191, 113, 0.2)' }}
              >
                Mark Resolved
              </button>
              <button
                className="cy-btn"
                onClick={() => handleEscalate(selectedIncident.id)}
                style={{ flexGrow: 1, color: 'var(--accent-warning)', borderColor: 'rgba(245, 165, 36, 0.2)' }}
              >
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default AlertsPage