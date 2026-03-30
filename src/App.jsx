import React, { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import VehiclesPage from './pages/VehiclesPage'
import TelemetryPage from './pages/TelemetryPage'
import { AlertsPage } from './pages/AlertsPage'
import CyboLionPage from './pages/CyboLionPage'
import CyboDrivePage from './pages/CyboDrivePage'
import AllModulesPage from './pages/AllModulesPage'
import AIModelsPage from './pages/AIModelsPage'
import { ArchitecturePage, DatabasePage, APIPage } from './pages/SystemPages'
import { ALERTS } from './data/mockData'
import { useClock } from './hooks/useLiveTelemetry'
import { useBreakpoint } from './hooks/useBreakpoint'

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  vehicles:     'Vehicles',
  telemetry:    'Live Telemetry',
  alerts:       'Alerts',
  cybomain:     'CyboLion — Battery Intelligence',
  cybodrive:    'CyboDrive — Motor Monitoring',
  cybomodules:  'Fleet View',
  aimodels:     'AI Models',
  architecture: 'System Architecture',
  database:     'Database Schema',
  api:          'API Gateway',
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const clock = useClock()
  const { isMobile } = useBreakpoint()

  const ticker = useMemo(()=>
    ALERTS.slice(0,3).map(a=>`[${a.sev.toUpperCase()}] ${a.vehicle}: ${a.msg}`).join('  ·  ')
  ,[])

  const renderPage = () => {
    const map = {
      dashboard:    <DashboardPage onNavigate={setPage} />,
      vehicles:     <VehiclesPage />,
      telemetry:    <TelemetryPage />,
      alerts:       <AlertsPage />,
      cybomain:     <CyboLionPage />,
      cybodrive:    <CyboDrivePage />,
      cybomodules:  <AllModulesPage onNavigate={setPage} />,
      aimodels:     <AIModelsPage />,
      architecture: <ArchitecturePage />,
      database:     <DatabasePage />,
      api:          <APIPage />,
    }
    return map[page] || <DashboardPage />
  }

  return (
    <div style={{
      height:'100dvh', minHeight:'100vh', overflow:'hidden',
      display:'grid', gridTemplateColumns:isMobile ? '1fr' : 'auto 1fr',
      position:'relative', zIndex:1,
    }}>
      <Sidebar
        active={page}
        onNavigate={(nextPage) => {
          setPage(nextPage)
          setMobileNavOpen(false)
        }}
        isMobile={isMobile}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      {isMobile && mobileNavOpen && (
        <button
          aria-label='Close navigation'
          onClick={() => setMobileNavOpen(false)}
          style={{
            position:'fixed',
            inset:0,
            background:'rgba(0,0,0,.35)',
            border:'none',
            zIndex:90,
          }}
        />
      )}

      <main style={{ display:'grid', gridTemplateRows:'52px 1fr', overflow:'hidden', minWidth:0 }}>

        {/* Header */}
        <header style={{
          borderBottom:'1px solid var(--border-dim)',
          background:'rgba(6,13,20,.9)',
          display:'grid',
          gridTemplateColumns:isMobile ? 'auto 1fr auto' : '1fr 2fr auto',
          gap:12, alignItems:'center',
          padding:'0 14px',
          backdropFilter:'blur(10px)',
        }}>
          {isMobile && (
            <button
              className='cy-btn'
              onClick={() => setMobileNavOpen(v => !v)}
              style={{ padding:'6px 10px', fontSize:10 }}
            >
              MENU
            </button>
          )}
          {/* Breadcrumb */}
          <div style={{
            fontFamily:'Rajdhani', textTransform:'uppercase',
            letterSpacing:'.2em', color:'var(--text-secondary)', fontSize:11,
            display:'flex', alignItems:'center', gap:8,
            minWidth:0,
          }}>
            <span style={{ color:'var(--accent-cyan)', fontFamily:'Orbitron', fontSize:12 }}>AiEVOS</span>
            <span style={{ color:'var(--border-glow)' }}>›</span>
            <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{PAGE_TITLES[page]}</span>
          </div>

          {/* Alert ticker */}
          <div style={{ overflow:'hidden', whiteSpace:'nowrap', display:isMobile ? 'none' : 'block' }}>
            <div style={{
              fontFamily:'JetBrains Mono', fontSize:10,
              color:'var(--accent-amber)',
              animation:'ticker 20s linear infinite',
              display:'inline-block',
            }}>
              {ticker}
            </div>
          </div>

          {/* Right — clock + status */}
          <div style={{
            display:'flex', alignItems:'center', gap:14,
            fontFamily:'JetBrains Mono', fontSize:11,
            minWidth:0,
          }}>
            <span style={{ color:'var(--text-secondary)', letterSpacing:'.05em', display:isMobile ? 'none' : 'inline' }}>{clock}</span>
            <span style={{
              color:'var(--accent-green)', fontSize:10, letterSpacing:'.12em',
              display:'flex', alignItems:'center', gap:6,
            }}>
              <span className='status-ring' style={{ color:'var(--accent-green)', width:6, height:6 }} />
              <span style={{ whiteSpace:'nowrap' }}>LINK:SECURE</span>
            </span>
            {/* User avatar placeholder */}
            <div style={{
              width:28, height:28,
              border:'1px solid var(--accent-cyan)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'var(--accent-cyan)', fontSize:10, fontWeight:700,
              clipPath:'polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))',
            }}>
              OP
            </div>
          </div>
        </header>

        {/* Page content */}
        <section
          key={page}
          style={{
            overflowY:'auto', overflowX:'hidden',
            padding:10,
            animation:'pageIn .35s ease',
          }}
        >
          {renderPage()}
        </section>

      </main>
    </div>
  )
}
