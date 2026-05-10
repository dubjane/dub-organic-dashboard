interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center px-4 md:px-10 bg-[rgba(22,22,24,0.9)] backdrop-blur-md border-b border-white/[0.08]">
      <button
        onClick={onMenuClick}
        className="md:hidden mr-3 text-neutral-400 hover:text-neutral-50 transition-colors"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="flex-1">
        <p className="text-[11px] font-body font-semibold uppercase tracking-widest text-neutral-300">
          Organic Social
        </p>
        <h1 className="text-sm font-body font-semibold text-neutral-50 -mt-0.5">
          Performance Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden md:block text-xs font-body text-neutral-300">Apr 1 – Apr 30, 2024</span>
        <div className="w-8 h-8 rounded-full bg-solaris-800/40 border border-solaris-700/40 flex items-center justify-center">
          <span className="text-xs font-semibold font-body text-solaris-300">J</span>
        </div>
      </div>
    </header>
  )
}
