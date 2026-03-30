import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardTitle, Grid, TabBar } from '../components/UI'
import { generateMonths } from '../data/mockData'
// In AllModulesPage.jsx
import { FleetGlobe3D } from "../components/ThreeVisuals";

// In CyboLionPage.jsx
import { BatteryPackVisualization3D } from "../components/ThreeVisuals";

// In VehiclePage.jsx
import { VehicleOverview3D } from "../components/ThreeVisuals";

const TT = {
  contentStyle:{
    background:'var(--bg-elevated)', border:'1px solid var(--accent-cyan)',
    color:'var(--text-primary)', fontFamily:'JetBrains Mono', fontSize:10, borderRadius:0,
  }
}

const MONTHS = generateMonths()

const SOH_PRED_DATA = MONTHS.map((m,i)=>({
  month:m,
  actual:    i<10 ? 97-i*1.5  : null,
  predicted: i>=7 ? 88-(i-7)*2.5 : null,
}))

const RISK_DATA = Array.from({length:60},(_,i)=>({
  t:i, risk:Math.min(95, 5+i*0.4+Math.random()*8),
}))

const CHARGING_COMPARISON = Array.from({length:11},(_,i)=>({
  soc:`${i*10}%`,
  standard:  [120,115,112,108,100,90,78,64,48,30,15][i],
  optimized: [80, 82, 85, 88, 88, 86,80,70,55,38,20][i],
}))

const TABS = [
  { id:'battery',  label:'Battery Health AI' },
  { id:'thermal',  label:'Thermal Prediction' },
  { id:'charging', label:'Charging Optimizer' },
]

function AIModelHeader({ color, bg, border, title, subtitle, badge, badgeColor }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
      <div style={{
        width:38, height:38,
        background:bg, border:`1px solid ${border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Orbitron', fontSize:13, fontWeight:700, color,
        clipPath:'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
      }}>
        AI
      </div>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', overflowWrap:'anywhere' }}>{title}</div>
        <div style={{ fontSize:11, color:'var(--text-secondary)', fontFamily:'JetBrains Mono', marginTop:2, overflowWrap:'anywhere' }}>{subtitle}</div>
      </div>
      {badge && (
        <div style={{
          marginLeft:'auto', fontFamily:'JetBrains Mono', fontSize:11,
          color:badgeColor, border:`1px solid ${badgeColor}`,
          padding:'2px 10px', letterSpacing:'.1em',
          maxWidth:'100%', overflowWrap:'anywhere',
        }}>
          {badge}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, val, sub }) {
  return (
    <Card style={{ background:'var(--bg-elevated)' }}>
      <CardTitle>{label}</CardTitle>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:13, color:'var(--accent-cyan)', marginBottom:4 }}>{val}</div>
      <div style={{ fontFamily:'JetBrains Mono', fontSize:10, color:'var(--text-secondary)' }}>{sub}</div>
    </Card>
  )
}

export default function AIModelsPage() {
  const [activeTab, setActiveTab] = useState('battery')

  return (
    <div style={{ animation:'pageIn .4s ease' }}>
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab==='battery' && (
        <Card>
          <AIModelHeader
            color='var(--accent-green)' bg='rgba(0,255,157,.07)' border='rgba(0,255,157,.3)'
            title='Battery Health Prediction Model'
            subtitle='PyTorch LSTM · Scikit-learn preprocessing · TimescaleDB features'
            badge='ACCURACY 94.2%' badgeColor='var(--accent-green)'
          />
          <Grid cols={3} style={{ marginBottom:16 }}>
            <StatCard label='Model Type'     val='LSTM RNN'  sub='Time-series sequential' />
            <StatCard label='Input Features' val='12 inputs' sub='Voltage, temp, cycles...' />
            <StatCard label='Output'         val='SoH · RUL' sub='Health + remaining life' />
          </Grid>
          <CardTitle>Actual vs AI Predicted SoH (%)</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={SOH_PRED_DATA} margin={{top:4,right:4,bottom:4,left:-20}}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--border-dim)' />
              <XAxis dataKey='month' tick={{fill:'#5a7a8a',fontSize:10}} />
              <YAxis domain={[75,100]} tick={{fill:'#5a7a8a',fontSize:9}} />
              <Tooltip {...TT} />
              <Line type='monotone' dataKey='actual'    stroke='#00e896' strokeWidth={2} dot={{fill:'#00e896',r:3}} name='Actual SoH %' connectNulls={false} />
              <Line type='monotone' dataKey='predicted' stroke='#f0a020' strokeWidth={2} strokeDasharray='5 5' dot={{fill:'#f0a020',r:3}} name='AI Predicted %' connectNulls={false} />
              <Legend wrapperStyle={{ fontFamily:'JetBrains Mono', fontSize:10, color:'var(--text-secondary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {activeTab==='thermal' && (
        <Card>
          <AIModelHeader
            color='var(--accent-red)' bg='rgba(255,45,85,.07)' border='rgba(255,45,85,.3)'
            title='Thermal Runaway Prediction Model'
            subtitle='Random Forest · Anomaly Detection · Real-time scoring'
            badge='⚠ ALERT ACTIVE' badgeColor='var(--accent-red)'
          />
          <Grid cols={3} style={{ marginBottom:16 }}>
            <StatCard label='Model Type'          val='Random Forest' sub='Classification + regression' />
            <StatCard label='Detection Window'    val='15 min'        sub='Advance warning time' />
            <StatCard label='False Positive Rate' val='0.8%'          sub='Precision: 99.2%' />
          </Grid>
          <CardTitle>Thermal Risk Score Over Time</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={RISK_DATA} margin={{top:4,right:4,bottom:4,left:-20}}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--border-dim)' />
              <XAxis dataKey='t' tick={{fill:'#5a7a8a',fontSize:9}} interval={9} />
              <YAxis tick={{fill:'#5a7a8a',fontSize:9}} />
              <Tooltip {...TT} />
              <Line type='monotone' dataKey='risk' stroke='#ff4560' strokeWidth={2} dot={false} name='Risk Score' />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {activeTab==='charging' && (
        <Card>
          <AIModelHeader
            color='var(--accent-cyan)' bg='rgba(0,212,255,.07)' border='rgba(0,212,255,.3)'
            title='Charging Optimization Model'
            subtitle='Reinforcement Learning · DQN Agent · Lifecycle optimization'
            badge='OPTIMIZING' badgeColor='var(--accent-cyan)'
          />
          <Grid cols={3} style={{ marginBottom:16 }}>
            <StatCard label='Algorithm'       val='DQN Agent' sub='Deep Q-Network RL' />
            <StatCard label='Cycle Extension' val='+18%'      sub='vs standard charge' />
            <StatCard label='Energy Saved'    val='7.4%'      sub='Per charge session' />
          </Grid>
          <CardTitle>Standard vs AI Optimized Charging Rate (W)</CardTitle>
          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={CHARGING_COMPARISON} margin={{top:4,right:4,bottom:4,left:-20}}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--border-dim)' />
              <XAxis dataKey='soc' tick={{fill:'#5a7a8a',fontSize:10}} />
              <YAxis tick={{fill:'#5a7a8a',fontSize:9}} />
              <Tooltip {...TT} />
              <Line type='monotone' dataKey='standard'  stroke='#5a7a8a' strokeWidth={2} dot={false} name='Standard' />
              <Line type='monotone' dataKey='optimized' stroke='#4090ff' strokeWidth={2} dot={false} name='AI Optimized' />
              <Legend wrapperStyle={{ fontFamily:'JetBrains Mono', fontSize:10, color:'var(--text-secondary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
