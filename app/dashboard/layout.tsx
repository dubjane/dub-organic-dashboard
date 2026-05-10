import Sidebar from '@/components/ui/Sidebar'
import Topbar from '@/components/ui/Topbar'
import { MetricsProvider } from '@/lib/metrics-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MetricsProvider>
    <div className="flex min-h-screen bg-[#161618] relative">
      {/* Copper glow blob — top right */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          top: '-200px',
          right: '-200px',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(240,135,82,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Copper glow blob — bottom left */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          bottom: '-300px',
          left: '-200px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(240,135,82,0.08) 0%, transparent 70%)',
        }}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar />
        <main className="flex-1 px-10 py-8">
          {children}
        </main>
      </div>
    </div>
    </MetricsProvider>
  )
}
