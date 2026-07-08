import React, { useState, useMemo } from 'react'
import { VEHICLES } from '../data/mockData'
import { StatusPill, PageHeader, EmptyState } from '../components/UI'
import { Search, Filter, Play, Download, Settings, RefreshCw, Layers, CheckSquare, Square } from 'lucide-react'

export default function VehiclesPage() {
  const [segment, setSegment] = useState('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkActionOpen, setBulkActionOpen] = useState(false)

  // Enriched column parameters
  const enrichedVehicles = useMemo(() => {
    return VEHICLES.map(v => {
      const lastSync = v.status === 'warning' ? '12m ago' : 'Just Now'
      const sector = `Sector-${v.id.slice(-2)}`
      const healthScore = v.health
      const soh = Math.round(v.health + (100 - v.health) * 0.15)
      return {
        ...v,
        soh,
        healthScore,
        location: sector,
        lastSync
      }
    })
  }, [])

  // Ingress query filters
  const filteredVehicles = useMemo(() => {
    return enrichedVehicles.filter(v => {
      const matchesSearch = v.id.toLowerCase().includes(search.toLowerCase()) ||
                            v.model.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'all' || v.status === statusFilter

      let matchesSegment = true
      if (segment === 'thermal-risk') {
        matchesSegment = v.temp > 50 || v.status === 'warning'
      } else if (segment === 'low-battery') {
        matchesSegment = v.soc < 60
      } else if (segment === 'active') {
        matchesSegment = v.status === 'active' || v.status === 'charging'
      }

      return matchesSearch && matchesStatus && matchesSegment
    })
  }, [enrichedVehicles, search, statusFilter, segment])

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredVehicles.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredVehicles.map(v => v.id))
    }
  }

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id))
    } else {
      setSelectedIds(prev => [...prev, id])
    }
  }

  const triggerBulkAction = (action) => {
    alert(`Bulk Action: "${action}" executed for: ${selectedIds.join(', ')}`)
    setSelectedIds([])
    setBulkActionOpen(false)
  }

  const getStatusType = (status) => {
    if (status === 'active') return 'green'
    if (status === 'charging') return 'blue'
    if (status === 'warning') return 'amber'
    return 'gray'
  }

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setSegment('all')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pageIn 0.3s ease' }}>
      
      {/* SaaS Page Header */}
      <PageHeader
        title="Vehicles Database"
        description="Query, filter, and schedule operational routines across active EV components."
        actions={
          <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
            <button
              className="cy-btn"
              disabled={selectedIds.length === 0}
              onClick={() => setBulkActionOpen(!bulkActionOpen)}
              style={{
                opacity: selectedIds.length === 0 ? 0.6 : 1,
                cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Bulk Actions ({selectedIds.length})
            </button>
            
            {bulkActionOpen && selectedIds.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                padding: '4px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 80,
                minWidth: 160,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <button onClick={() => triggerBulkAction('AI Diagnostics')} style={{ border: 'none', background: 'transparent', textAlign: 'left', padding: '6px 10px', fontSize: 11, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg-secondary)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><Play size={11} /> Run AI Diagnostic</button>
                <button onClick={() => triggerBulkAction('Schedule Maintenance')} style={{ border: 'none', background: 'transparent', textAlign: 'left', padding: '6px 10px', fontSize: 11, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg-secondary)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><Settings size={11} /> Schedule Maintenance</button>
                <button onClick={() => triggerBulkAction('Export CSV')} style={{ border: 'none', background: 'transparent', textAlign: 'left', padding: '6px 10px', fontSize: 11, color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg-secondary)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><Download size={11} /> Export CSV</button>
              </div>
            )}
          </div>
        }
      />

      {/* Saved Views / Segments Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--bg-border)',
        gap: 16
      }}>
        {[
          { id: 'all',          label: 'All Active Fleet' },
          { id: 'thermal-risk', label: 'Thermal Risk Warn' },
          { id: 'low-battery',  label: 'Low Charge (< 60%)' },
          { id: 'active',       label: 'Online Status' }
        ].map(tab => {
          const isActive = segment === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => { setSegment(tab.id); setSelectedIds([]); }}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '8px 0 10px 0',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color 0.15s, border-color 0.15s'
              }}
              onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Advanced filters search bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: 10, flexGrow: 1, maxWidth: 450 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search database (ID or model)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-border)',
                borderRadius: '6px',
                padding: '6px 12px 6px 32px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 11.5,
                outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter size={11} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-border)',
                borderRadius: '6px',
                padding: '6px 10px 6px 26px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="charging">Charging</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          {filteredVehicles.length} records found
        </div>
      </div>

      {/* Notion/Linear styled Table */}
      {filteredVehicles.length > 0 ? (
        <div className="cy-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-sans)',
              fontSize: 11.5,
              minWidth: 800,
            }}>
              <thead>
                <tr style={{
                  background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--bg-border)',
                  color: 'var(--text-muted)',
                  textAlign: 'left'
                }}>
                  <th style={{ width: 44, padding: '10px 14px', textAlign: 'center' }}>
                    <button
                      onClick={toggleSelectAll}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', outline: 'none' }}
                    >
                      {filteredVehicles.length > 0 && selectedIds.length === filteredVehicles.length ? (
                        <CheckSquare size={13} style={{ color: 'var(--accent-primary)' }} />
                      ) : (
                        <Square size={13} />
                      )}
                    </button>
                  </th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>VEHICLE</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>STATUS</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>SOC</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>SOH</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>TEMP</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>LOCATION</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>HEALTH SCORE</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>LAST SYNC</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map(v => {
                  const isSelected = selectedIds.includes(v.id)
                  const hcColor = v.healthScore > 85 ? 'var(--accent-success)' : v.healthScore > 70 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                  
                  return (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: '1px solid var(--bg-border)',
                        background: isSelected ? 'rgba(79, 140, 255, 0.02)' : 'transparent',
                        transition: 'background-color 0.1s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleSelect(v.id)}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <td style={{ padding: '10px 14px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSelect(v.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)', outline: 'none' }}
                        >
                          {isSelected ? <CheckSquare size={13} /> : <Square size={13} />}
                        </button>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.id}</div>
                        <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{v.model}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <StatusPill type={getStatusType(v.status)}>{v.status.toUpperCase()}</StatusPill>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 500 }}>{v.soc}%</span>
                          <div style={{ width: 50, height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${v.soc}%`,
                              background: v.soc > 70 ? 'var(--accent-success)' : v.soc > 40 ? 'var(--accent-primary)' : 'var(--accent-danger)',
                              borderRadius: 2
                            }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{v.soh}%</td>
                      <td style={{
                        padding: '10px 14px',
                        fontFamily: 'var(--font-mono)',
                        color: v.temp > 50 ? 'var(--accent-danger)' : 'var(--text-primary)'
                      }}>
                        {v.temp}°C
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{v.location}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: hcColor }}>{v.healthScore}%</span>
                          <div style={{ width: 32, height: 3, background: 'var(--bg-border)', borderRadius: 1.5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${v.healthScore}%`, background: hcColor }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 10.5, fontFamily: 'var(--font-mono)' }}>
                        {v.lastSync}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <EmptyState
          title="No Vehicles Match Criteria"
          description="We couldn't find any operational nodes matching your current query parameters or search keyword."
          action={
            <button className="cy-btn primary" onClick={resetFilters}>
              Reset Database Filters
            </button>
          }
        />
      )}
      
    </div>
  )
}
