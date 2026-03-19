// ─── AiEVOS Shared UI Components ───
import React from 'react'

const s = {
  // Reusable inline style helpers
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 14,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function CardTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)',
      fontSize: 11,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: 'var(--text3)',
      marginBottom: 10,
    }}>
      {children}
    </div>
  )
}

export function MetricCard({ label, value, sub, color = '#fff', barColor, barPct }) {
  return (
    <Card>
      <CardTitle>{label}</CardTitle>
      <div style={{ fontSize: 28, fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
      {sub && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
          {sub}
        </div>
      )}
      {barPct !== undefined && (
        <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
          <div style={{ height: '100%', width: `${barPct}%`, background: barColor || color, borderRadius: 2, transition: 'width .3s' }} />
        </div>
      )}
    </Card>
  )
}

export function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)',
      fontSize: 13,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: 'var(--text2)',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottom: '1px solid var(--border)',
    }}>
      {children}
    </div>
  )
}

export function StatusPill({ children, type = 'green' }) {
  const map = {
    green:  { bg: 'var(--green3)',  color: 'var(--green)',  border: 'var(--green2)' },
    amber:  { bg: 'var(--amber3)',  color: 'var(--amber)',  border: 'var(--amber2)' },
    red:    { bg: 'var(--red3)',    color: 'var(--red)',    border: 'var(--red2)'   },
    blue:   { bg: 'var(--blue3)',   color: 'var(--blue)',   border: 'var(--blue2)'  },
  }
  const t = map[type] || map.green
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20,
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1,
      background: t.bg, color: t.color, border: `1px solid ${t.border}`,
    }}>
      <PulseDot color={t.color} />
      {children}
    </div>
  )
}

export function PulseDot({ color = 'var(--green)', size = 6 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      animation: 'pulse 1.5s ease infinite',
    }} />
  )
}

export function LiveDot() {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: 'var(--green)',
      animation: 'livePulse 2s ease infinite',
    }} />
  )
}

export function Grid({ cols = 4, gap = 12, children, style = {} }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
      marginBottom: gap,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function AlertRow({ sev, vehicle, module: mod, msg, detail, time }) {
  const map = {
    critical: { cls: { background: 'var(--red3)',    color: 'var(--red)',   border: '1px solid var(--red2)'   }, icon: '!' },
    warning:  { cls: { background: 'var(--amber3)',  color: 'var(--amber)', border: '1px solid var(--amber2)' }, icon: '⚠' },
    info:     { cls: { background: 'var(--blue3)',   color: 'var(--blue)',  border: '1px solid var(--blue2)'  }, icon: 'i' },
  }
  const t = map[sev] || map.info
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 6, marginBottom: 6,
      background: 'var(--bg3)', border: '1px solid var(--border)',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontSize: 11,
        ...t.cls,
      }}>
        {t.icon}
      </div>
      <div>
        <div style={{ color: '#fff', fontSize: 12 }}>{msg}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{vehicle} · {mod} · {detail}</div>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
        {time}
      </div>
    </div>
  )
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '8px 16px',
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${active === tab.id ? 'var(--green)' : 'transparent'}`,
            fontFamily: 'var(--mono)',
            fontSize: 12,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: active === tab.id ? 'var(--green)' : 'var(--text3)',
            cursor: 'pointer',
            transition: 'all .15s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function SchemaBlock({ table }) {
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 6, padding: 12, marginBottom: 8,
      fontFamily: 'var(--mono)', fontSize: 11,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 600 }}>{table.name}</span>
        {table.badge && (
          <span style={{ color: 'var(--teal)', fontSize: 9, padding: '1px 4px', borderRadius: 3, background: 'var(--teal3)', border: '1px solid var(--teal2)' }}>
            {table.badge}
          </span>
        )}
      </div>
      {table.fields.map((f, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, padding: '2px 0', color: 'var(--text2)' }}>
          <span style={{ color: 'var(--purple)', minWidth: 90 }}>{f.type}</span>
          <span>{f.name}</span>
          {f.key && (
            <span style={{ color: 'var(--amber)', fontSize: 9, padding: '1px 4px', borderRadius: 3, background: 'var(--amber3)', border: '1px solid var(--amber2)', marginLeft: 4 }}>
              {f.key}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export function ArchLayer({ layer }) {
  const colorMap = {
    teal:   { bg: 'var(--teal3)',   color: 'var(--teal)',   border: 'var(--teal2)'   },
    purple: { bg: 'var(--purple3)', color: 'var(--purple)', border: 'var(--purple2)' },
    amber:  { bg: 'var(--amber3)',  color: 'var(--amber)',  border: 'var(--amber2)'  },
    blue:   { bg: 'var(--blue3)',   color: 'var(--blue)',   border: 'var(--blue2)'   },
    red:    { bg: 'var(--red3)',    color: 'var(--red)',    border: 'var(--red2)'    },
    green:  { bg: 'var(--green3)', color: 'var(--green)',  border: 'var(--green2)'  },
    gray:   { bg: 'var(--bg4)',    color: 'var(--text2)',  border: 'var(--border2)' },
  }
  const t = colorMap[layer.color] || colorMap.gray
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '12px 16px', marginBottom: 6,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', minWidth: 80 }}>
        {layer.label}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {layer.items.map(item => (
          <span key={item} style={{
            padding: '4px 10px', borderRadius: 4,
            fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 600,
            background: t.bg, color: t.color, border: `1px solid ${t.border}`,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ApiEndpoint({ method, path, desc }) {
  const methodColor = {
    GET:  'var(--green)',
    POST: 'var(--blue)',
    WS:   'var(--teal)',
  }
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 6, padding: '10px 14px', marginBottom: 8,
      display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: 'var(--mono)', fontSize: 12,
    }}>
      <span style={{ color: methodColor[method] || 'var(--text)', minWidth: 40 }}>{method}</span>
      <span style={{ color: '#fff' }}>{path}</span>
      <span style={{ color: 'var(--text3)', marginLeft: 'auto', fontSize: 10 }}>{desc}</span>
    </div>
  )
}