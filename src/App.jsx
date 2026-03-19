import React, { useState, useEffect } from 'react'
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
import { StatusPill } from './components/UI'
import { useClock } from './hooks/useLiveTelemetry'

const PAGE_TITLES = {
  dashboard:    'Fleet Dashboard',
  vehicles:     'Vehicles',
  telemetry:    'Live Telemetry',
  alerts:       'Alerts',
  cybomain:     'CyboLion — Battery Intelligence',
  cybodrive:    'CyboDrive — Motor Monitoring',
  cybomodules:  'All Modules',
  aimodels:     'AI Engine',
  architecture: 'System Architecture',
  database:     'Database Schema',
  api:          'API Reference',
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const clock = useClock()

  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <DashboardPage />
      case 'vehicles':     return <VehiclesPage />
      case 'telemetry':    return <TelemetryPage />
      case 'alerts':       return <AlertsPage />
      case 'cybomain':     return <CyboLionPage />
      case 'cybodrive':    return <CyboDrivePage />
      case 'cybomodules':  return <AllModulesPage onNavigate={setPage} />
      case 'aimodels':     return <AIModelsPage />
      case 'architecture': return <ArchitecturePage />
      case 'database':     return <DatabasePage />
      case 'api':          return <APIPage />
      default:             return <DashboardPage />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={page} onNavigate={setPage} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 1,
            color: '#fff',
            fontFamily: 'var(--sans)',
          }}>
            {PAGE_TITLES[page] || 'AiEVOS'}
          </div>

          <StatusPill type="green">TELEMETRY LIVE</StatusPill>
          <StatusPill type="red">3 ALERTS</StatusPill>

          <div style={{ flex: 1 }} />

          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'var(--text3)',
          }}>
            {clock}
          </div>
        </div>

        {/* Page Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
        }}>
          {renderPage()}
        </div>
      </div>
    </div>
  )
}