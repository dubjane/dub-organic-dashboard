'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#161618] relative">
      {/* Copper glow blob — top right */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          top: '-200px', right: '-200px',
          width: '800px', height: '800px',
          background: 'radial-gradient(circle, rgba(240,135,82,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Copper glow blob — bottom left */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          bottom: '-300px', left: '-200px',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(240,135,82,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Mobile overlay — fades in behind the drawer, hidden on md+ */}
      <div
        aria-hidden
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-4 md:px-10 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
