import React from 'react'
import { Card, CardTitle, SchemaBlock, ArchLayer, ApiEndpoint } from '../components/UI'
import { ARCH_LAYERS, DB_SCHEMA, API_ENDPOINTS } from '../data/mockData'

/* ── Architecture Page ────────────────────────────────────── */
export function ArchitecturePage() {
  return (
    <div style={{ animation:'pageIn .4s ease' }}>
      <Card>
        <CardTitle>System Architecture — Data Flow</CardTitle>
        <div style={{ fontFamily:'JetBrains Mono', fontSize:11, color:'var(--text-secondary)', marginBottom:14 }}>
          Vehicle sensors → CAN Bus → IoT Gateway → MQTT/Kafka → FastAPI → TimescaleDB → AI Engine → Dashboard
        </div>
        {ARCH_LAYERS.map((layer,i)=>(
          <React.Fragment key={layer.label}>
            <ArchLayer layer={layer} />
            {i<ARCH_LAYERS.length-1 && (
              <div style={{
                textAlign:'center', color:'var(--accent-cyan)',
                fontSize:18, padding:'2px 0 2px 80px',
                fontFamily:'JetBrains Mono', opacity:.6,
              }}>↓</div>
            )}
          </React.Fragment>
        ))}
      </Card>
    </div>
  )
}

/* ── Database Page ────────────────────────────────────────── */
export function DatabasePage() {
  const left  = DB_SCHEMA.slice(0,3)
  const right = DB_SCHEMA.slice(3)
  return (
    <div style={{ animation:'pageIn .4s ease' }}>
      <div className='cy-panel' style={{ marginBottom:10 }}>
        <div className='cy-title'>PostgreSQL + TimescaleDB Schema</div>
        <div style={{ fontFamily:'JetBrains Mono', fontSize:11, color:'var(--text-secondary)' }}>
          Hypertables enable automatic time-based partitioning for high-frequency telemetry data.
          TimescaleDB provides continuous aggregates and compression policies.
        </div>
      </div>
      <div className='cy-grid' data-cols={2} style={{ gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <div>{left.map(t=><SchemaBlock key={t.name} table={t} />)}</div>
        <div>{right.map(t=><SchemaBlock key={t.name} table={t} />)}</div>
      </div>
    </div>
  )
}

/* ── API Page ─────────────────────────────────────────────── */
export function APIPage() {
  const methodCounts = API_ENDPOINTS.reduce((acc,ep)=>{
    acc[ep.method] = (acc[ep.method]||0)+1
    return acc
  },{})

  return (
    <div style={{ animation:'pageIn .4s ease' }}>
      {/* Summary bar */}
      <div className='cy-panel' style={{ marginBottom:10, display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
        <div className='cy-title' style={{ margin:0 }}>FastAPI Endpoints — AiEVOS Backend</div>
        <div style={{ marginLeft:'auto', display:'flex', gap:14, flexWrap:'wrap' }}>
          {Object.entries(methodCounts).map(([m,n])=>{
            const mc = { GET:'var(--accent-green)', POST:'var(--accent-cyan)', WS:'var(--accent-purple)', DELETE:'var(--accent-red)' }
            return (
              <span key={m} style={{ fontFamily:'JetBrains Mono', fontSize:11, color:mc[m]||'var(--accent-cyan)' }}>
                {m} ×{n}
              </span>
            )
          })}
        </div>
      </div>
      <Card style={{ overflowX:'auto' }}>
        <div style={{ minWidth:620 }}>
        {/* Header row */}
        <div style={{
          display:'grid', gridTemplateColumns:'52px 1fr auto',
          gap:10, padding:'4px 4px 8px',
          fontFamily:'JetBrains Mono', fontSize:10,
          color:'var(--text-secondary)', letterSpacing:'.15em',
          borderBottom:'1px solid var(--border-dim)', marginBottom:4,
          textTransform:'uppercase',
        }}>
          <span>Method</span><span>Endpoint</span><span>Description</span>
        </div>
        {API_ENDPOINTS.map((ep,i)=><ApiEndpoint key={i} {...ep} />)}
        </div>
      </Card>
    </div>
  )
}
