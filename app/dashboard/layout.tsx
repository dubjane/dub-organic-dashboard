import DashboardShell from '@/components/ui/DashboardShell'
import { MetricsProvider } from '@/lib/metrics-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MetricsProvider>
      <DashboardShell>{children}</DashboardShell>
    </MetricsProvider>
  )
}
