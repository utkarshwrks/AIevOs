import React, { useState } from 'react'
import { VEHICLES } from '../data/mockData'

const FILTERS = ['all', 'active', 'charging', 'warning']

function MiniSparkbar({ health }) {
  const color = health > 85 ? 'var(--green)' : health > 70 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 20 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ width: 3, height: 8 + i * 2, borderRadius: 1, background: color }} />
      ))}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active:   { bg: 'var(--green3)',  color: 'var(--green)',  border: 'var(--green2)'  },
    charging: { bg: 'var(--blue3)',   color: 'var(--blue)',   border: 'var(--blue2)'   },
    warning:  { bg: 'var(--amber3)',  color: 'var(--amber)',  border: 'var(--amber2)'  },
  }
  const t = map[status] || map.active
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px', borderRadius: 10,
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
    }}>
      {status.toUpperCase()}
    </span>
  )
}

export default function VehiclesPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? VEHICLES : VEHICLES.filter(v => v.status === filter)

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>FILTER:</span>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '4px 12px', borderRadius: 4, cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: 10,
              background: filter === f ? 'var(--green3)' : 'var(--bg3)',
              color: filter === f ? 'var(--green)' : 'var(--text3)',
              border: `1px solid ${filter === f ? 'var(--green2)' : 'var(--border)'}`,
              transition: 'all .15s',
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr 100px 60px 80px 1fr 80px 60px',
        gap: 12, padding: '6px 12px',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1,
        color: 'var(--text3)', textTransform: 'uppercase',
        borderBottom: '1px solid var(--border)', marginBottom: 4,
      }}>
        <span>ID</span>
        <span>Model</span>
        <span>Status</span>
        <span>SoC</span>
        <span>Health</span>
        <span>Trend</span>
        <span>Score</span>
        <span>Temp</span>
      </div>

      {/* Vehicle rows */}
      {filtered.map(v => {
        const healthColor = v.health > 85 ? 'var(--green)' : v.health > 70 ? 'var(--amber)' : 'var(--red)'
        return (
          <div
            key={v.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px 60px 80px 1fr 80px 60px',
              gap: 12, padding: '10px 12px',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 6, marginBottom: 6, alignItems: 'center',
              cursor: 'pointer', transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg4)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg3)' }}
          >
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal)' }}>{v.id}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{v.model}</span>
            <StatusBadge status={v.status} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>{v.soc}%</span>
            <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${v.health}%`, background: healthColor, borderRadius: 2 }} />
            </div>
            <MiniSparkbar health={v.health} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: healthColor }}>{v.health}%</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>{v.temp}°C</span>
          </div>
        )
      })}
    </div>
  )
}