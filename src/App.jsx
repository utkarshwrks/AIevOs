import React, { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import VehiclesPage from './pages/VehiclesPage'
import TelemetryPage from './pages/TelemetryPage'
import AlertsPage from './pages/AlertsPage'
import CyboLionPage from './pages/CyboLionPage'
import CyboDrivePage from './pages/CyboDrivePage'
import AllModulesPage from './pages/AllModulesPage'
import AIModelsPage from './pages/AIModelsPage'
import { ArchitecturePage, DatabasePage, APIPage } from './pages/SystemPages'
import { ALERTS } from './data/mockData'
import { useClock } from './hooks/useLiveTelemetry'

const PAGE_TITLES = {
  dashboard: 'Dashboard', vehicles: 'Vehicles', telemetry: 'Live Telemetry', alerts: 'Alerts', cybomain: 'CyboLion', cybodrive: 'CyboDrive', cybomodules: 'Fleet View', aimodels: 'CyboControl AI', architecture: 'CyboBalance', database: 'CyboFrame', api: 'API Gateway',
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const clock = useClock()
  const ticker = useMemo(() => ALERTS.slice(0, 3).map(a => `[${a.sev.toUpperCase()}] ${a.vehicle}: ${a.msg}`).join('  •  '), [])

  const renderPage = () => ({
    dashboard: <DashboardPage onNavigate={setPage} />,
    vehicles: <VehiclesPage />, telemetry: <TelemetryPage />, alerts: <AlertsPage />, cybomain: <CyboLionPage />, cybodrive: <CyboDrivePage />, cybomodules: <AllModulesPage onNavigate={setPage} />, aimodels: <AIModelsPage />, architecture: <ArchitecturePage />, database: <DatabasePage />, api: <APIPage />,
  }[page] || <DashboardPage />)

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
      <Sidebar active={page} onNavigate={setPage} />
      <main style={{ display: 'grid', gridTemplateRows: '52px 1fr', overflow: 'hidden' }}>
        <header style={{ borderBottom: '1px solid var(--border-dim)', background: 'rgba(6,13,20,.8)', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 12, alignItems: 'center', padding: '0 12px' }}>
          <div style={{ fontFamily: 'Rajdhani', textTransform: 'uppercase', letterSpacing: '.2em', color: 'var(--text-secondary)', fontSize: 11 }}>AiEVOS &gt; {PAGE_TITLES[page]}</div>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--accent-amber)' }}><div style={{ animation: 'ticker 18s linear infinite', display: 'inline-block' }}>{ticker}</div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'JetBrains Mono', fontSize: 11 }}><span>{clock}</span><span style={{ color: 'var(--accent-green)' }}>LINK:SECURE</span><span style={{ width: 18, height: 18, border: '1px solid var(--accent-cyan)' }} /></div>
        </header>
        <section style={{ overflowY: 'auto', padding: 10, animation: 'pageIn .4s ease' }}>{renderPage()}</section>
      </main>
    </div>
  )
}
