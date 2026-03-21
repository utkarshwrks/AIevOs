import { useState, useEffect, useRef } from 'react'
import { TELEMETRY_FIELDS, rand } from '../data/mockData'

// ── useClock ─────────────────────────────────────────────
export function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour12: false })
  )
  useEffect(() => {
    const id = setInterval(() =>
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    , 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

// ── useLiveTelemetry ─────────────────────────────────────
export function useLiveTelemetry(intervalMs = 2000) {
  const buildState = () => {
    const s = {}
    TELEMETRY_FIELDS.forEach(f => { s[f.key] = f.base })
    return s
  }

  const stateRef = useRef(buildState())
  const [data, setData] = useState(buildState())

  useEffect(() => {
    const id = setInterval(() => {
      const next = {}
      TELEMETRY_FIELDS.forEach(f => {
        const v = rand(stateRef.current[f.key], f.variance * 0.4)
        const clamped = Math.max(0, Math.min(f.max, v))
        next[f.key] = +clamped.toFixed(f.key === 'cellVolt' ? 3 : 1)
      })
      stateRef.current = next
      setData({ ...next })
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return data
}