import React from 'react'
import { Card, CardTitle, SchemaBlock, ArchLayer, ApiEndpoint } from '../components/UI'
import { ARCH_LAYERS, DB_SCHEMA, API_ENDPOINTS } from '../data/mockData'

export function ArchitecturePage() {
  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <Card>
        <CardTitle>System Architecture — Data Flow</CardTitle>
        {ARCH_LAYERS.map((layer, i) => (
          <React.Fragment key={layer.label}>
            <ArchLayer layer={layer} />
            {i < ARCH_LAYERS.length - 1 && (
              <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 20, padding: '4px 0 4px 80px' }}>↓</div>
            )}
          </React.Fragment>
        ))}
      </Card>
    </div>
  )
}

export function DatabasePage() {
  const left  = DB_SCHEMA.slice(0, 3)
  const right = DB_SCHEMA.slice(3)

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>{left.map(t => <SchemaBlock key={t.name} table={t} />)}</div>
        <div>{right.map(t => <SchemaBlock key={t.name} table={t} />)}</div>
      </div>
    </div>
  )
}

export function APIPage() {
  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <Card>
        <CardTitle>FastAPI Endpoints — AiEVOS Backend</CardTitle>
        {API_ENDPOINTS.map((ep, i) => <ApiEndpoint key={i} {...ep} />)}
      </Card>
    </div>
  )
}