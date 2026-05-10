import KPIRow from '@/components/dashboard/KPIRow'
import ViewsChart from '@/components/dashboard/ViewsChart'
import TopPosts from '@/components/dashboard/TopPosts'
import PerformanceTable from '@/components/dashboard/PerformanceTable'
import WhyItWorked from '@/components/dashboard/WhyItWorked'
import FollowerChart from '@/components/dashboard/FollowerChart'
import EngagementMix from '@/components/dashboard/EngagementMix'
export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* KPI Row */}
      <div>
        <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-4">
          April 2024 — Key Metrics
        </p>
        <KPIRow />
      </div>

      {/* Views Chart + Top Posts */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <ViewsChart />
        <TopPosts />
      </div>

      {/* Performance Table */}
      <PerformanceTable />

      {/* Why It Worked */}
      <WhyItWorked />

      {/* Follower Chart + Engagement Mix */}
      <div className="grid grid-cols-[1fr_380px] gap-5">
        <FollowerChart />
        <EngagementMix />
      </div>
    </div>
  )
}
