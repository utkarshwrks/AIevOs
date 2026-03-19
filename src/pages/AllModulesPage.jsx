import React from 'react'
import { MODULES } from '../data/mockData'

export default function AllModulesPage({ onNavigate }) {
  const navMap = { cybolion: 'cybomain', cybodrive: 'cybodrive' }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12, animation: 'fadeIn .3s ease',
    }}>
      {MODULES.map(m => (
        <div
          key={m.key}
          onClick={() => navMap[m.key] && onNavigate(navMap[m.key])}
          style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 16, cursor: 'pointer',
            transition: 'all .2s', position: 'relative', overflow: 'hidden',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.color, borderRadius: '8px 8px 0 0' }} />

          <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 1, color: '#fff', marginBottom: 4 }}>{m.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 10 }}>{m.desc}</div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)',
            paddingTop: 8, borderTop: '1px solid var(--border)',
          }}>
            <span>{m.stat}</span>
            <span style={{ color: m.statusColor }}>{m.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}