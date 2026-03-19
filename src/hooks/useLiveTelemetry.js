import { useState, useEffect } from 'react'
import { rand, TELEMETRY_FIELDS } from '../data/mockData'

export function useLiveTelemetry(intervalMs = 2000) {
  const [telemetry, setTelemetry] = useState(() =>
    Object.fromEntries(TELEMETRY_FIELDS.map(f => [f.key, f.base]))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry(() =>
        Object.fromEntries(
          TELEMETRY_FIELDS.map(f => [f.key, rand(f.base, f.variance)])
        )
      )
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return telemetry
}

export function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-IN', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}