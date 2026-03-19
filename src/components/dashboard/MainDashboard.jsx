import React, { useMemo, useState } from 'react'
import EVCarHologram3D from '../3d/EVCarHologram3D'
import BatteryPackVisualization3D from '../3d/BatteryPackVisualization3D'
import VehicleOverview3D from '../3d/VehicleOverview3D'
import FleetGlobe3D from '../3d/FleetGlobe3D'
import { VEHICLES } from '../../data/mockData'

const VEHICLE_TYPES = ['Car', 'Bike', 'Truck']

export default function MainDashboard() {
  const [vehicleType, setVehicleType] = useState('Car')
  const [selectedModule, setSelectedModule] = useState('battery')
  const currentVehicle = useMemo(() => VEHICLES[0], [])

  return (
    <div className='cy-grid' style={{ gridTemplateColumns: '1.35fr 1fr', gridTemplateRows: '46px auto auto', alignItems: 'stretch' }}>
      <div className='cy-panel' style={{ gridColumn: '1 / -1', minHeight: 46, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
        <div className='cy-title' style={{ marginBottom: 0 }}>Vehicle Holographic Command Console</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          <span style={{ color: 'var(--text-secondary)' }}>PLATFORM</span>
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className='cy-select'>
            {VEHICLE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ gridColumn: '1', gridRow: '2 / span 2', minWidth: 0 }}>
        <EVCarHologram3D vehicleData={currentVehicle} selectedModule={selectedModule} onSelectModule={setSelectedModule} />
      </div>

      <div style={{ gridColumn: '2', gridRow: '2', minWidth: 0 }}>
        <BatteryPackVisualization3D />
      </div>

      <div style={{ gridColumn: '2', gridRow: '3', minWidth: 0 }}>
        <VehicleOverview3D onSelectModule={setSelectedModule} />
      </div>

      <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
        <FleetGlobe3D vehicles={VEHICLES} />
      </div>
    </div>
  )
}
