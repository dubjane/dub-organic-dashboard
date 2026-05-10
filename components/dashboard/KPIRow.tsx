'use client'

import { useMetrics } from '@/lib/metrics-context'
import KPICard from './KPICard'

export default function KPIRow() {
  const { kpis } = useMetrics()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <KPICard label="Total Followers" data={kpis.followers} />
      <KPICard label="Total Views" data={kpis.views} />
      <KPICard label="Engagement Rate" data={kpis.engagementRate} isRate />
      <KPICard label="New Followers" data={kpis.newFollowers} />
    </div>
  )
}
