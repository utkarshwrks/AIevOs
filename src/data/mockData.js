// ─── AiEVOS Mock Data ───

export const VEHICLES = [
  { id: 'EV-001', model: 'Tata Nexon EV',   status: 'charging', soc: 98, health: 95, temp: 32 },
  { id: 'EV-002', model: 'MG ZS EV',         status: 'active',   soc: 84, health: 91, temp: 38 },
  { id: 'EV-003', model: 'Hyundai Kona',     status: 'warning',  soc: 61, health: 82, temp: 78 },
  { id: 'EV-004', model: 'Tata Tigor EV',    status: 'active',   soc: 74, health: 88, temp: 42 },
  { id: 'EV-005', model: 'BYD Atto 3',       status: 'active',   soc: 67, health: 93, temp: 36 },
  { id: 'EV-006', model: 'Kia EV6',          status: 'active',   soc: 79, health: 96, temp: 35 },
  { id: 'EV-007', model: 'Tesla Model 3',    status: 'warning',  soc: 45, health: 78, temp: 68 },
  { id: 'EV-008', model: 'Ola S1 Pro',       status: 'active',   soc: 82, health: 89, temp: 40 },
  { id: 'EV-009', model: 'Ather 450X',       status: 'charging', soc: 55, health: 94, temp: 30 },
  { id: 'EV-010', model: 'Chetak EV',        status: 'active',   soc: 88, health: 90, temp: 37 },
  { id: 'EV-011', model: 'Revolt RV400',     status: 'warning',  soc: 52, health: 81, temp: 44 },
  { id: 'EV-012', model: 'Hero Vida V1',     status: 'active',   soc: 76, health: 87, temp: 39 },
]

export const ALERTS = [
  { id: 1, sev: 'critical', vehicle: 'EV-007', module: 'CyboLion',   msg: 'Thermal runaway risk detected',  detail: 'Cell temp 68°C — immediate inspection required', time: '02:14 ago' },
  { id: 2, sev: 'warning',  vehicle: 'EV-003', module: 'CyboDrive',  msg: 'Motor overheating alert',        detail: 'RPM 8,240 · Motor temp 94°C',                    time: '01:47 ago' },
  { id: 3, sev: 'warning',  vehicle: 'EV-011', module: 'CyboWire',   msg: 'Voltage drop detected',          detail: 'Harness connector C4 · 0.8V drop',               time: '00:52 ago' },
  { id: 4, sev: 'info',     vehicle: 'EV-001', module: 'System',     msg: 'Charging complete',              detail: 'SoC reached 98% · Station 4',                    time: '00:10 ago' },
  { id: 5, sev: 'info',     vehicle: 'EV-009', module: 'System',     msg: 'Charging session started',       detail: 'SoC 55% → Charging at 7.4kW',                    time: '00:05 ago' },
]

export const MODULES = [
  {
    key: 'cybolion', name: 'CyboLion', icon: '🔋', color: 'var(--green)', colorBg: 'var(--green3)', colorBorder: 'var(--green2)',
    desc: 'Battery Intelligence Module. Monitors cell voltage, temperature, SoC/SoH and predicts thermal runaway.',
    stat: '96 CELLS MONITORED', status: 'HEALTHY', statusColor: 'var(--green)',
  },
  {
    key: 'cybodrive', name: 'CyboDrive', icon: '⚡', color: 'var(--blue)', colorBg: 'var(--blue3)', colorBorder: 'var(--blue2)',
    desc: 'Motor monitoring. Tracks RPM, torque, temperature and efficiency across all powertrain units.',
    stat: 'MOTOR A · B · C', status: '1 ALERT', statusColor: 'var(--amber)',
  },
  {
    key: 'cybowire', name: 'CyboWire', icon: '🔌', color: 'var(--amber)', colorBg: 'var(--amber3)', colorBorder: 'var(--amber2)',
    desc: 'Harness monitoring. Detects voltage drops, loose connectors, insulation leakage and short circuits.',
    stat: '24 NODES', status: '1 WARNING', statusColor: 'var(--amber)',
  },
  {
    key: 'cybocontrol', name: 'CyboControl', icon: '🖥', color: 'var(--purple)', colorBg: 'var(--purple3)', colorBorder: 'var(--purple2)',
    desc: 'Controller monitoring. Tracks inverter temperature, current draw and switching faults.',
    stat: 'INVERTER · MCU', status: 'NOMINAL', statusColor: 'var(--green)',
  },
  {
    key: 'cybobalance', name: 'CyboBalance', icon: '⚙', color: 'var(--teal)', colorBg: 'var(--teal3)', colorBorder: 'var(--teal2)',
    desc: 'Wheel balance monitoring via MPU6050 and ADXL345. Detects imbalance and tyre wear patterns.',
    stat: '4 WHEELS', status: 'BALANCED', statusColor: 'var(--green)',
  },
  {
    key: 'cyboframe', name: 'CyboFrame', icon: '🏗', color: 'var(--red)', colorBg: 'var(--red3)', colorBorder: 'var(--red2)',
    desc: 'Chassis monitoring via accelerometers and strain gauges. Detects impact, frame stress and accidents.',
    stat: '12 SENSORS', status: 'NOMINAL', statusColor: 'var(--green)',
  },
]

export const TELEMETRY_FIELDS = [
  { label: 'Battery SoC',   key: 'soc',       unit: '%',    max: 100,   color: '#00e896', base: 72,  variance: 5  },
  { label: 'Battery SoH',   key: 'soh',       unit: '%',    max: 100,   color: '#f0a020', base: 86,  variance: 2  },
  { label: 'Pack Voltage',  key: 'voltage',   unit: 'V',    max: 420,   color: '#4090ff', base: 374, variance: 8  },
  { label: 'Current Draw',  key: 'current',   unit: 'A',    max: 200,   color: '#a060ff', base: 82,  variance: 10 },
  { label: 'Motor RPM',     key: 'rpm',       unit: 'rpm',  max: 12000, color: '#4090ff', base: 6240,variance: 200},
  { label: 'Motor Temp',    key: 'motorTemp', unit: '°C',   max: 120,   color: '#ff4560', base: 78,  variance: 5  },
  { label: 'Motor Torque',  key: 'torque',    unit: 'N·m',  max: 300,   color: '#00c8d4', base: 182, variance: 10 },
  { label: 'Cell Max Temp', key: 'cellTemp',  unit: '°C',   max: 80,    color: '#f0a020', base: 38,  variance: 3  },
  { label: 'Cell Min Volt', key: 'cellVolt',  unit: 'V',    max: 4.2,   color: '#00e896', base: 3.82,variance:.05 },
  { label: 'Speed',         key: 'speed',     unit: 'km/h', max: 150,   color: '#00e896', base: 48,  variance: 8  },
]

export const DB_SCHEMA = [
  {
    name: 'vehicles',
    fields: [
      { type: 'UUID',      name: 'id',            key: 'PK' },
      { type: 'VARCHAR',   name: 'vehicle_id' },
      { type: 'VARCHAR',   name: 'model' },
      { type: 'VARCHAR',   name: 'status' },
      { type: 'FLOAT',     name: 'health_score' },
      { type: 'TIMESTAMP', name: 'registered_at' },
    ],
  },
  {
    name: 'telemetry_data',
    badge: 'TimescaleDB hypertable',
    fields: [
      { type: 'TIMESTAMPTZ', name: 'time',       key: 'PK' },
      { type: 'UUID',        name: 'vehicle_id', key: 'FK' },
      { type: 'FLOAT',       name: 'battery_soc' },
      { type: 'FLOAT',       name: 'battery_soh' },
      { type: 'FLOAT',       name: 'motor_rpm' },
      { type: 'FLOAT',       name: 'motor_temp' },
      { type: 'FLOAT',       name: 'motor_torque' },
      { type: 'FLOAT',       name: 'speed_kmh' },
      { type: 'FLOAT',       name: 'voltage' },
      { type: 'FLOAT',       name: 'current' },
    ],
  },
  {
    name: 'battery_cells',
    fields: [
      { type: 'UUID',        name: 'id',         key: 'PK' },
      { type: 'UUID',        name: 'vehicle_id', key: 'FK' },
      { type: 'INT',         name: 'cell_index' },
      { type: 'FLOAT',       name: 'voltage' },
      { type: 'FLOAT',       name: 'temperature' },
      { type: 'TIMESTAMPTZ', name: 'recorded_at' },
    ],
  },
  {
    name: 'alerts',
    fields: [
      { type: 'UUID',        name: 'id',         key: 'PK' },
      { type: 'UUID',        name: 'vehicle_id', key: 'FK' },
      { type: 'VARCHAR',     name: 'severity' },
      { type: 'VARCHAR',     name: 'module' },
      { type: 'TEXT',        name: 'message' },
      { type: 'BOOLEAN',     name: 'resolved' },
      { type: 'TIMESTAMPTZ', name: 'triggered_at' },
    ],
  },
  {
    name: 'motor_metrics',
    badge: 'TimescaleDB',
    fields: [
      { type: 'TIMESTAMPTZ', name: 'time',         key: 'PK' },
      { type: 'UUID',        name: 'vehicle_id',   key: 'FK' },
      { type: 'FLOAT',       name: 'rpm' },
      { type: 'FLOAT',       name: 'torque_nm' },
      { type: 'FLOAT',       name: 'temperature' },
      { type: 'FLOAT',       name: 'efficiency_pct' },
    ],
  },
  {
    name: 'charging_sessions',
    fields: [
      { type: 'UUID',        name: 'id',            key: 'PK' },
      { type: 'UUID',        name: 'vehicle_id',    key: 'FK' },
      { type: 'FLOAT',       name: 'soc_start' },
      { type: 'FLOAT',       name: 'soc_end' },
      { type: 'FLOAT',       name: 'energy_kwh' },
      { type: 'VARCHAR',     name: 'charge_profile' },
      { type: 'TIMESTAMPTZ', name: 'start_time' },
      { type: 'TIMESTAMPTZ', name: 'end_time' },
    ],
  },
]

export const API_ENDPOINTS = [
  { method: 'GET',  path: '/api/v1/vehicles',                     desc: 'List all fleet vehicles with status' },
  { method: 'GET',  path: '/api/v1/vehicles/{id}',                desc: 'Get single vehicle details' },
  { method: 'GET',  path: '/api/v1/telemetry/{vehicle_id}',       desc: 'Time-series telemetry (TimescaleDB)' },
  { method: 'POST', path: '/api/v1/telemetry/ingest',             desc: 'Ingest MQTT telemetry payload' },
  { method: 'GET',  path: '/api/v1/battery/{vehicle_id}',         desc: 'Battery pack + cell data' },
  { method: 'GET',  path: '/api/v1/battery/{vehicle_id}/predict', desc: 'AI SoH prediction + RUL' },
  { method: 'GET',  path: '/api/v1/motor/{vehicle_id}',           desc: 'Motor RPM, torque, temp metrics' },
  { method: 'GET',  path: '/api/v1/alerts',                       desc: 'All active alerts (filterable)' },
  { method: 'POST', path: '/api/v1/alerts/{id}/resolve',          desc: 'Resolve an alert' },
  { method: 'GET',  path: '/api/v1/analytics/fleet',              desc: 'Fleet health + aggregated stats' },
  { method: 'GET',  path: '/api/v1/analytics/thermal-risk/{id}',  desc: 'Thermal runaway risk score (AI)' },
  { method: 'POST', path: '/api/v1/charging/optimize/{id}',       desc: 'Get AI optimal charging profile' },
  { method: 'WS',   path: '/ws/telemetry/{vehicle_id}',           desc: 'WebSocket — live telemetry stream' },
]

export const ARCH_LAYERS = [
  {
    label: 'SENSORS',
    color: 'teal',
    items: ['BMS', 'Temp Sensors', 'RPM Sensor', 'MPU6050', 'ADXL345', 'Strain Gauge'],
  },
  {
    label: 'GATEWAY',
    color: 'purple',
    items: ['CAN Bus', 'IoT Gateway (ECU-1051)', 'Edge Processing', '4G/LTE'],
  },
  {
    label: 'TRANSPORT',
    color: 'amber',
    items: ['MQTT Broker', 'Apache Kafka', 'REST API', 'WebSocket'],
  },
  {
    label: 'BACKEND',
    color: 'blue',
    items: ['FastAPI (Python)', 'PostgreSQL', 'TimescaleDB', 'Redis Cache'],
  },
  {
    label: 'AI ENGINE',
    color: 'red',
    items: ['PyTorch LSTM', 'Scikit-learn', 'Random Forest', 'DQN RL Agent'],
  },
  {
    label: 'FRONTEND',
    color: 'green',
    items: ['Next.js / React', 'Tailwind CSS', 'Recharts', 'WebSocket Client'],
  },
  {
    label: 'CLOUD',
    color: 'gray',
    items: ['AWS EKS', 'Azure AKS', 'GCP GKE', 'Docker', 'Kubernetes'],
  },
]

// ─── Helpers ───
export const rand = (base, variance) =>
  +(base + (Math.random() - 0.5) * 2 * variance).toFixed(2)

export const generateCellTemps = () =>
  Array.from({ length: 96 }, (_, i) => {
    const base = 20 + Math.random() * 20 + Math.random() * 15
    if (i >= 14 && i <= 16) return 64 + Math.random() * 8
    return base
  })

export const generateHours = () =>
  Array.from({ length: 24 }, (_, i) => `${i}:00`)

export const generateMonths = () =>
  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']