'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: '◈' },
  { label: 'Content', href: '/dashboard/content', icon: '◉' },
  { label: 'Audience', href: '/dashboard/audience', icon: '◎' },
{ label: 'Settings', href: '/dashboard/settings', icon: '○' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`w-60 shrink-0 h-screen fixed md:sticky top-0 bg-[#1E1C1A] border-r border-white/[0.06] flex flex-col z-40 md:z-20 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="px-6 pt-8 pb-6 border-b border-white/[0.06] flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl text-neutral-50 tracking-tight">dub</span>
          <span className="text-[10px] font-body font-semibold uppercase tracking-widest text-neutral-300 mt-1">social</span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden mt-0.5 text-neutral-400 hover:text-neutral-50 transition-colors"
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold font-body transition-all ${
                isActive
                  ? 'bg-solaris-500/10 text-solaris-600'
                  : 'text-neutral-300 hover:text-neutral-50 hover:bg-white/[0.05]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 pb-6">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
          <p className="text-[11px] font-semibold font-body uppercase tracking-widest text-neutral-300 mb-1">Connected</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-body text-neutral-300">TikTok</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-solaris-500 animate-pulse" />
            <span className="text-xs font-body text-neutral-300">Instagram</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
