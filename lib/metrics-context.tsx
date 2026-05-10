'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mockKPIs } from './data'
import { KPIs } from './types'

interface MetricsContextValue {
  kpis: KPIs
  updateKPIs: (next: KPIs) => void
}

const MetricsContext = createContext<MetricsContextValue | null>(null)

const STORAGE_KEY = 'dub-metrics'

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [kpis, setKPIs] = useState<KPIs>(mockKPIs)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setKPIs(JSON.parse(raw) as KPIs)
    } catch (_e) {}
  }, [])

  function updateKPIs(next: KPIs) {
    setKPIs(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (_e) {}
  }

  return (
    <MetricsContext.Provider value={{ kpis, updateKPIs }}>
      {children}
    </MetricsContext.Provider>
  )
}

export function useMetrics(): MetricsContextValue {
  const ctx = useContext(MetricsContext)
  if (!ctx) throw new Error('useMetrics must be used within MetricsProvider')
  return ctx
}
