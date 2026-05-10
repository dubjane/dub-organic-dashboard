export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center px-10 bg-[rgba(22,22,24,0.9)] backdrop-blur-md border-b border-white/[0.08]">
      <div className="flex-1">
        <p className="text-[11px] font-body font-semibold uppercase tracking-widest text-neutral-300">
          Organic Social
        </p>
        <h1 className="text-sm font-body font-semibold text-neutral-50 -mt-0.5">
          Performance Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-body text-neutral-300">Apr 1 – Apr 30, 2024</span>
        <div className="w-8 h-8 rounded-full bg-solaris-800/40 border border-solaris-700/40 flex items-center justify-center">
          <span className="text-xs font-semibold font-body text-solaris-300">J</span>
        </div>
      </div>
    </header>
  )
}
