import React, { useMemo, useState, useEffect, useRef } from 'react'
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
import { Command, Sparkles, Moon, Sun, ArrowRight, X, Play, MonitorCheck, HelpCircle } from 'lucide-react'

const PAGE_TITLES = {
  dashboard:    'Dashboard Overview',
  vehicles:     'EV Fleet Management',
  telemetry:    'Telemetry Engineering Workstation',
  alerts:       'Alert Incident Center',
  cybomain:     'CyboLion — Battery Pack Analytics',
  cybodrive:    'CyboDrive — Motor Powertrain Analytics',
  cybomodules:  'Fleet View Command Center',
  aimodels:     'ML Model Monitoring Platform',
  architecture: 'System Core Architecture',
  database:     'Data Observability Schema',
  api:          'API Gateway Documentation',
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [theme, setTheme] = useState('dark') // dark or light
  const [commandCenterOpen, setCommandCenterOpen] = useState(false)
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false)
  const clock = useClock()
  const { isMobile } = useBreakpoint()

  // Command Center States
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  // AI Copilot States
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Operational Copilot initialized. I have complete access to real-time telemetry, BMS values, and ML models. Ask me about fleet analysis, battery health, or active incidents.' }
  ])

  // Sync theme with body class
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme')
    } else {
      document.body.classList.remove('light-theme')
    }
  }, [theme])

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandCenterOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto focus command center search input
  useEffect(() => {
    if (commandCenterOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50)
    }
  }, [commandCenterOpen])

  // Highest critical active alert
  const headerAlert = useMemo(() => {
    return ALERTS.find(a => a.sev === 'critical') || ALERTS.find(a => a.sev === 'warning')
  }, [])

  // Fuzzy match commands
  const commands = useMemo(() => {
    const items = [
      { category: 'Pages', label: 'Go to Dashboard Overview', action: () => { setPage('dashboard'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to EV Fleet Management', action: () => { setPage('vehicles'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to Telemetry Workstation', action: () => { setPage('telemetry'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to Alert Incident Center', action: () => { setPage('alerts'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to CyboLion (Battery Pack)', action: () => { setPage('cybomain'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to CyboDrive (Motor Monitoring)', action: () => { setPage('cybodrive'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to Fleet Command View', action: () => { setPage('cybomodules'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to ML Model Monitoring', action: () => { setPage('aimodels'); setCommandCenterOpen(false); } },
      { category: 'Pages', label: 'Go to System Architecture API', action: () => { setPage('api'); setCommandCenterOpen(false); } },
      { category: 'Preferences', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, action: () => { setTheme(theme === 'dark' ? 'light' : 'dark'); setCommandCenterOpen(false); } },
      { category: 'Diagnostics', label: 'Trigger AI Fleet Diagnostic', action: () => { setCommandCenterOpen(false); triggerCopilotPrompt('Evaluate battery health'); } },
      { category: 'Diagnostics', label: 'Open AI Assistant Drawer', action: () => { setCommandCenterOpen(false); setAiCopilotOpen(true); } }
    ]
    if (!searchQuery) return items
    return items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, theme])

  // Handle Copilot Prompts
  const triggerCopilotPrompt = (text) => {
    setAiCopilotOpen(true)
    const userMsg = { sender: 'user', text }
    setChatLog(prev => [...prev, userMsg])
    
    // Simulate AI response based on text keywords
    setTimeout(() => {
      let aiResponseText = ''
      const promptLower = text.toLowerCase()
      
      if (promptLower.includes('incident') || promptLower.includes('alert')) {
        aiResponseText = `I have analyzed the current incident logs. There are ${ALERTS.length} active incidents. The most critical is on **EV-007**, where a thermal runaway warning was triggered (Cell 15 temp at 68°C). Recommended actions are: 1. Disengage high-power charging contactors. 2. Force secondary coolant pump rate to 100%. 3. Dispatch technician. I've flagged this in the primary operational dashboard.`
      } else if (promptLower.includes('battery') || promptLower.includes('lion') || promptLower.includes('health')) {
        aiResponseText = `BMS data shows the average battery State of Charge (SoC) is at 72.4% across the fleet. Average State of Health (SoH) is nominal at 94.2%. However, there is a cell imbalance alert on **EV-007** (cell delta voltage at 110mV, exceeding the threshold of 40mV). Recommended mitigation: Passive balancing has been triggered for Cell 15. Track SOH degradation curves.`
      } else if (promptLower.includes('motor') || promptLower.includes('drive')) {
        aiResponseText = `Powertrain diagnostics indicate nominal operations for 11 out of 12 motors. **EV-003** has an active warning for stator core temperature (94°C) under high-torque loading. Bearing frequency deviation of 8.2Hz suggests potential bearing wear. Recommended: Restrict peak motor torque to 120 N·m and increase cooling loop pressures.`
      } else {
        aiResponseText = `Processing query "${text}". Fleet status: 10/12 online, 2 active sessions, 1 critical risk (EV-007). All TimescaleDB hypertables are indexing nominally, with an average ingestion lag of 4.1ms. Concept drift indices are stable across all deployed ML classifiers.`
      }

      setChatLog(prev => [...prev, { sender: 'ai', text: aiResponseText }])
    }, 800)
  }

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    triggerCopilotPrompt(chatInput)
    setChatInput('')
  }

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
      height: '100vh',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
      background: 'var(--bg-void)',
      transition: 'background-color 0.2s ease',
      position: 'relative'
    }}>
      <Sidebar
        active={page}
        onNavigate={(nextPage) => {
          setPage(nextPage)
          setMobileNavOpen(false)
        }}
        onSearchClick={() => setCommandCenterOpen(true)}
        isMobile={isMobile}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <main style={{ display: 'grid', gridTemplateRows: '52px 1fr', overflow: 'hidden', minWidth: 0 }}>
        
        {/* Header bar */}
        <header style={{
          borderBottom: '1px solid var(--bg-border)',
          background: 'var(--bg-surface)',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'auto 1fr auto' : '1fr 2fr auto',
          gap: 16,
          alignItems: 'center',
          padding: '0 16px',
          transition: 'background-color 0.2s ease, border-color 0.2s ease'
        }}>
          {isMobile && (
            <button
              className='cy-btn'
              onClick={() => setMobileNavOpen(v => !v)}
              style={{ padding: '4px 8px', fontSize: 10 }}
            >
              MENU
            </button>
          )}

          {/* Breadcrumbs */}
          <div style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontWeight: 600 }}>AIEVOS</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{PAGE_TITLES[page]}</span>
          </div>

          {/* Header Warning Notification banner */}
          <div style={{ display: isMobile ? 'none' : 'block', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {headerAlert && (
              <div style={{
                fontSize: 11,
                color: headerAlert.sev === 'critical' ? 'var(--accent-danger)' : 'var(--accent-warning)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: headerAlert.sev === 'critical' ? 'rgba(229, 72, 77, 0.05)' : 'rgba(245, 165, 36, 0.05)',
                border: `1px solid ${headerAlert.sev === 'critical' ? 'rgba(229, 72, 77, 0.15)' : 'rgba(245, 165, 36, 0.15)'}`,
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer'
              }} onClick={() => setPage('alerts')}>
                <span className='status-ring' style={{ width: 5, height: 5 }} />
                <span>
                  <strong>INCIDENT LOG:</strong> {headerAlert.vehicle} {headerAlert.msg}
                </span>
              </div>
            )}
          </div>

          {/* Header Action controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Theme Toggle button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* AI Copilot toggler button */}
            <button
              onClick={() => setAiCopilotOpen(!aiCopilotOpen)}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--bg-border)',
                color: aiCopilotOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11.5,
                fontWeight: 600,
                outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bg-border)'}
            >
              <Sparkles size={12} fill={aiCopilotOpen ? 'var(--accent-primary)' : 'none'} />
              <span>AI Copilot</span>
            </button>

            {/* Secure Link */}
            <span style={{
              color: 'var(--accent-success)',
              fontSize: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontWeight: 500,
              fontFamily: 'var(--font-mono)'
            }}>
              <span className='status-ring' style={{ width: 5, height: 5 }} />
              SECURE
            </span>
          </div>
        </header>

        {/* Page Render Container */}
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden', minWidth: 0, position: 'relative' }}>
          
          <section
            key={page}
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '24px',
              animation: 'pageIn 0.25s ease'
            }}
          >
            {renderPage()}
          </section>

          {/* AI Copilot Persistent Drawer */}
          {aiCopilotOpen && (
            <aside style={{
              width: 320,
              borderLeft: '1px solid var(--bg-border)',
              background: 'var(--bg-surface)',
              display: 'grid',
              gridTemplateRows: '52px 1fr auto',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease',
              zIndex: 85
            }}>
              {/* Copilot Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid var(--bg-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 12.5, color: 'var(--text-primary)' }}>
                  <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
                  AIEVOS Copilot
                </div>
                <button
                  onClick={() => setAiCopilotOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Copilot Chat Log */}
              <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {chatLog.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                      padding: '8px 12px',
                      borderRadius: 10,
                      maxWidth: '85%',
                      fontSize: 11.5,
                      lineHeight: 1.45,
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--bg-border)',
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Quick Prompt suggestions */}
              <div style={{ padding: '0 16px 12px 16px', borderTop: '1px solid var(--bg-border)', paddingTop: 12 }}>
                <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                  SUGGESTED ACTIONS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    'Explain recent incidents',
                    'Evaluate battery health',
                    'Evaluate powertrain limits'
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => triggerCopilotPrompt(prompt)}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--bg-border)',
                        borderRadius: 6,
                        padding: '6px 10px',
                        color: 'var(--text-secondary)',
                        fontSize: 10.5,
                        textAlign: 'left',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'border-color 0.15s, color 0.15s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  <input
                    type="text"
                    placeholder="Ask Copilot anything..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    style={{
                      flexGrow: 1,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--bg-border)',
                      borderRadius: 6,
                      padding: '6px 10px',
                      color: 'var(--text-primary)',
                      fontSize: 11,
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="cy-btn primary" style={{ padding: '6px 10px', borderRadius: 6 }}>
                    <ArrowRight size={12} />
                  </button>
                </form>
              </div>

            </aside>
          )}

        </div>
      </main>

      {/* Global Command Center Overlay Modal */}
      {commandCenterOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          animation: 'fadeIn 0.15s ease'
        }} onClick={() => setCommandCenterOpen(false)}>
          <div
            style={{
              width: 500,
              maxWidth: '90%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--bg-border)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'pageIn 0.2s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--bg-border)' }}>
              <Command size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type a command or page search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <button
                onClick={() => setCommandCenterOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Match Commands List */}
            <div style={{ maxHeight: 280, overflowY: 'auto', padding: '6px' }}>
              {commands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={cmd.action}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    outline: 'none',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-secondary)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <span style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500 }}>{cmd.label}</span>
                  <span style={{
                    fontSize: 9.5,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--bg-border)',
                    padding: '1px 5px',
                    borderRadius: 3,
                    background: 'var(--bg-elevated)'
                  }}>{cmd.category}</span>
                </button>
              ))}
              {commands.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No matching system actions found.
                </div>
              )}
            </div>

            {/* Command Center Footer */}
            <div style={{
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--bg-border)',
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 9.5,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span>↑↓ Navigation · Enter to execute</span>
              <span>ESC to dismiss</span>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
