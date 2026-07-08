import React, { useState, useMemo } from 'react'
import { Card, CardTitle, SchemaBlock, ArchLayer, ApiEndpoint, StatusPill, Grid, PageHeader } from '../components/UI'
import { ARCH_LAYERS, DB_SCHEMA, API_ENDPOINTS } from '../data/mockData'
import { Server, Database, Key, Terminal, Code, Cpu, Activity, Play } from 'lucide-react'

// Microservice health specs
const MICROSERVICES = [
  { name: 'MQTT Telemetry Gateway', status: 'active',    cpu: '12%', latency: '2.4ms', replicas: '3 / 3' },
  { name: 'Timescale Ingestion Pipeline', status: 'active', cpu: '18%', latency: '4.1ms', replicas: '2 / 2' },
  { name: 'AI LSTM Classifier Unit', status: 'active',    cpu: '42%', latency: '14.5ms', replicas: '4 / 4' },
  { name: 'WebSocket Stream Server', status: 'active',    cpu: '8%',  latency: '1.1ms', replicas: '2 / 2' },
]

// Query analytics
const SLOW_QUERIES = [
  { query: 'SELECT * FROM telemetry_data WHERE vehicle_id = $1 ORDER BY time DESC LIMIT 100', time: '2.8ms', count: '14,240' },
  { query: 'SELECT time_bucket(\'5m\', time), avg(battery_soc) FROM telemetry_data GROUP BY 1', time: '18.4ms', count: '4,200' },
  { query: 'SELECT * FROM battery_cells WHERE temperature > 60 AND recorded_at > $1', time: '1.2ms', count: '94,100' },
]

// API code snippets mock DB
const CODE_SNIPPETS = {
  '/api/v1/vehicles': {
    curl: `curl -X GET "https://api.aievos.com/v1/vehicles" \\\n  -H "X-AIEVOS-API-KEY: ae_live_72fa..."`,
    python: `import aievos\n\nclient = aievos.Client(api_key="ae_live_72fa...")\nvehicles = client.vehicles.list()\nprint(vehicles)`,
    response: `[\n  {\n    "id": "EV-001",\n    "model": "Tata Nexon EV",\n    "status": "charging",\n    "soc": 98,\n    "health": 95\n  },\n  ...\n]`
  },
  '/api/v1/telemetry/{vehicle_id}': {
    curl: `curl -X GET "https://api.aievos.com/v1/telemetry/EV-007" \\\n  -H "X-AIEVOS-API-KEY: ae_live_72fa..."`,
    python: `import aievos\n\nclient = aievos.Client(api_key="ae_live_72fa...")\ntelemetry = client.telemetry.get("EV-007")\nprint(telemetry)`,
    response: `{\n  "vehicle_id": "EV-007",\n  "soc": 45,\n  "voltage": 374.8,\n  "current": 82.4,\n  "motor_rpm": 6240,\n  "motor_temp": 78\n}`
  },
  '/api/v1/battery/{vehicle_id}/predict': {
    curl: `curl -X GET "https://api.aievos.com/v1/battery/EV-007/predict" \\\n  -H "X-AIEVOS-API-KEY: ae_live_72fa..."`,
    python: `import aievos\n\nclient = aievos.Client(api_key="ae_live_72fa...")\nprediction = client.battery.predict_soh("EV-007")\nprint(prediction)`,
    response: `{\n  "vehicle_id": "EV-007",\n  "predicted_soh": 75.4,\n  "confidence_score": 98.6,\n  "rul_years_estimate": 3.8\n}`
  }
}

/* ── Architecture Page ────────────────────────────────────── */
export function ArchitecturePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      <PageHeader
        title="System Architecture & Pipelines"
        description="Real-time operational streaming pipeline topography, microservice registry, and Kubernetes health metrics."
        actions={
          <button className="cy-btn primary" onClick={() => alert('Calibrating MQTT edge streams...')}>
            Calibrate Edge Streams
          </button>
        }
      />
      
      <Card>
        <CardTitle style={{ marginBottom: 8 }}>Operational Pipeline Stream Map</CardTitle>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 14px',
          border: '1px solid var(--bg-border)',
          borderRadius: 6,
          background: 'var(--bg-elevated)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-secondary)',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <span>EV Sensors</span> <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: 'var(--accent-primary)' }}>CAN Bus</span> <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span>Edge Gateway</span> <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: 'var(--accent-warning)' }}>MQTT Broker</span> <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span>FastAPI</span> <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: 'var(--accent-success)' }}>TimescaleDB</span> <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: '#A78BFA' }}>PyTorch LSTM</span>
        </div>
      </Card>

      <Grid cols={2}>
        {/* Microservices health */}
        <Card>
          <CardTitle style={{ marginBottom: 12 }}>Kubernetes Microservice Health</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MICROSERVICES.map(ms => (
              <div key={ms.name} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--bg-border)',
                borderRadius: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ms.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>CPU: {ms.cpu}</span>
                <span style={{ color: 'var(--text-muted)', display: 'inline-block', minWidth: 60, textAlign: 'right' }}>{ms.latency}</span>
                <span style={{ color: 'var(--text-muted)' }}>{ms.replicas}</span>
                <StatusPill type="green">RUNNING</StatusPill>
              </div>
            ))}
          </div>
        </Card>

        {/* Infrastructure Dependencies list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ARCH_LAYERS.map(layer => (
            <ArchLayer key={layer.label} layer={layer} />
          ))}
        </div>
      </Grid>
      
    </div>
  )
}

/* ── Database Page ────────────────────────────────────────── */
export function DatabasePage() {
  const left  = DB_SCHEMA.slice(0,3)
  const right = DB_SCHEMA.slice(3)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      <PageHeader
        title="TimescaleDB Metrics & Schema"
        description="Ingestion throughput stats, query compiler analysis, and hypertable partition schema definitions."
        actions={
          <button className="cy-btn primary" onClick={() => alert('Running TimescaleDB maintenance scripts...')}>
            Run Vacuum Optimize
          </button>
        }
      />
      
      <Card>
        <CardTitle style={{ marginBottom: 8 }}>PostgreSQL + TimescaleDB Partitioning</CardTitle>
        <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          High-frequency timeseries telemetry data is partitioned into physical chunks using TimescaleDB Hypertables.
          Continuous Aggregation is configured for 5-minute rollups to guarantee optimal query performance under load.
        </p>
      </Card>

      <Grid cols={3}>
        {/* Storage Metrics */}
        <Card>
          <CardTitle>Storage Observability</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hypertable Raw</span>
              <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>41.2 GB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Compressed Disk Space</span>
              <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>3.4 GB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Compression Ratio</span>
              <span style={{ color: 'var(--accent-success)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>12.1x compression</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ingestion Rate</span>
              <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>4,250 metrics/sec</span>
            </div>
          </div>
        </Card>

        {/* Data Quality metrics */}
        <Card>
          <CardTitle>Data Quality Integrity</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Missing Packets Rate</span>
              <span style={{ color: 'var(--accent-success)', fontFamily: 'var(--font-mono)' }}>0.002%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Duplicate Timestamps</span>
              <span style={{ color: 'var(--accent-success)', fontFamily: 'var(--font-mono)' }}>0.00%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Checksum Check Failures</span>
              <span style={{ color: 'var(--accent-success)', fontFamily: 'var(--font-mono)' }}>0 / day</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Impedance Outliers</span>
              <span style={{ color: 'var(--accent-warning)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>2 flags ignored</span>
            </div>
          </div>
        </Card>

        {/* Compactor & Partition Policy */}
        <Card>
          <CardTitle>Retention Policy guidelines</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Raw Telemetry Policy</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>90 days partition</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Compressed Aggregates</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>365 days retention</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--bg-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Timescale Compactor</span>
              <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>Active (Scheduled)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Auto-Backup Gateway</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>AWS S3 daily</span>
            </div>
          </div>
        </Card>
      </Grid>

      {/* Query analytics */}
      <Card>
        <CardTitle style={{ marginBottom: 12 }}>Slow Query Analytics log</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SLOW_QUERIES.map(sq => (
            <div key={sq.query} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              gap: 20
            }}>
              <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexGrow: 1 }}>{sq.query}</span>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>Calls: {sq.count}</span>
              <span style={{ color: 'var(--accent-warning)', fontWeight: 600, flexShrink: 0 }}>Avg: {sq.time}</span>
            </div>
          ))}
        </div>
      </Card>

      <Grid cols={2} style={{ gap: 16 }}>
        <div>{left.map(t => <SchemaBlock key={t.name} table={t} />)}</div>
        <div>{right.map(t => <SchemaBlock key={t.name} table={t} />)}</div>
      </Grid>
      
    </div>
  )
}

/* ── API Page ─────────────────────────────────────────────── */
export function APIPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/vehicles')
  const [selectedLanguage, setSelectedLanguage] = useState('curl')
  const [testResponse, setTestResponse] = useState('')
  const [testingEndpoint, setTestingEndpoint] = useState(false)

  const activeSnippet = useMemo(() => CODE_SNIPPETS[selectedEndpoint] || {}, [selectedEndpoint])

  const triggerTest = () => {
    setTestingEndpoint(true)
    setTimeout(() => {
      setTestResponse(activeSnippet.response || '{}')
      setTestingEndpoint(false)
    }, 800)
  }

  const methodCounts = API_ENDPOINTS.reduce((acc, ep) => {
    acc[ep.method] = (acc[ep.method] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn .3s ease' }}>
      <PageHeader
        title="Interactive API Gateway"
        description="Full API endpoints catalog, credentials registration, and Stripe-style request sandbox."
        actions={
          <button className="cy-btn primary" onClick={() => alert('Generating new API token credentials...')}>
            Create Secret Token
          </button>
        }
      />
      
      {/* Endpoint counts header */}
      <div className='cy-panel' style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>FastAPI Gateway Endpoints</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(methodCounts).map(([m, n]) => {
            const mc = { GET: 'var(--accent-success)', POST: 'var(--accent-primary)', WS: '#A78BFA', DELETE: 'var(--accent-danger)' }
            return (
              <span key={m} style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: mc[m] || 'var(--accent-primary)', fontWeight: 600 }}>
                {m} ({n})
              </span>
            )
          })}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 16,
        alignItems: 'start'
      }}>
        {/* Stripe-inspired documentation layout (left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <CardTitle style={{ marginBottom: 12 }}>Authentication Gateway</CardTitle>
            <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 10 }}>
              Authenticate your API requests by passing your operational secret key in the request header credentials.
            </p>
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
              borderRadius: 6,
              padding: '8px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              color: 'var(--text-primary)'
            }}>
              X-AIEVOS-API-KEY: ae_live_72fa...
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 10.5, color: 'var(--text-muted)' }}>
              <span>SDKs available:</span>
              <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Python SDK</span>
              <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}>JavaScript SDK</span>
              <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Go Driver</span>
            </div>
          </Card>

          <Card style={{ padding: 0 }}>
            <div style={{ padding: 12, borderBottom: '1px solid var(--bg-border)' }}>
              <CardTitle style={{ margin: 0 }}>Endpoint Catalog Reference</CardTitle>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {API_ENDPOINTS.map((ep, i) => {
                const isSelected = selectedEndpoint === ep.path
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (CODE_SNIPPETS[ep.path]) {
                        setSelectedEndpoint(ep.path)
                        setTestResponse('')
                      }
                    }}
                    style={{
                      borderBottom: i < API_ENDPOINTS.length - 1 ? '1px solid var(--bg-border)' : 'none',
                      cursor: CODE_SNIPPETS[ep.path] ? 'pointer' : 'default',
                      opacity: CODE_SNIPPETS[ep.path] ? 1 : 0.6
                    }}
                  >
                    <ApiEndpoint {...ep} />
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Code examples & Interactive sandbox panel (right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Code example card */}
          <Card style={{ background: '#0B0F14' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--bg-border)', paddingBottom: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}><Code size={12} /> REQUEST EXAMPLE</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {['curl', 'python'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    style={{
                      background: selectedLanguage === lang ? 'var(--bg-elevated)' : 'transparent',
                      border: 'none',
                      color: selectedLanguage === lang ? 'var(--text-primary)' : 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer'
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <pre style={{
              background: '#070a0e',
              padding: 12,
              borderRadius: 6,
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#F8FAFC',
              lineHeight: 1.5,
              border: '1px solid var(--bg-border)'
            }}>
              <code>{selectedLanguage === 'curl' ? activeSnippet.curl : activeSnippet.python}</code>
            </pre>
          </Card>

          {/* Interactive sandbox */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <CardTitle style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Terminal size={12} /> Interactive Testing Sandbox</CardTitle>
              <button
                className="cy-btn primary"
                disabled={testingEndpoint}
                onClick={triggerTest}
                style={{ padding: '4px 10px', fontSize: 10.5, gap: 6 }}
              >
                <Play size={10} fill="white" /> {testingEndpoint ? 'Requesting...' : 'Send Request'}
              </button>
            </div>
            
            <div style={{
              background: '#070a0e',
              border: '1px solid var(--bg-border)',
              borderRadius: 6,
              padding: 12,
              minHeight: 120,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#F8FAFC'
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 9.5, borderBottom: '1px solid var(--bg-border)', paddingBottom: 4, marginBottom: 8 }}>
                RESPONSE PAYLOAD
              </div>
              {testResponse ? (
                <pre style={{ overflowX: 'auto', margin: 0 }}>
                  <code>{testResponse}</code>
                </pre>
              ) : (
                <span style={{ color: 'var(--text-muted)', margin: 'auto', textAlign: 'center' }}>
                  Click "Send Request" to trigger operational mock payload ingestion.
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
      
    </div>
  )
}
