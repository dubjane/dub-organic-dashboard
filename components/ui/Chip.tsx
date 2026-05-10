'use client'

interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export default function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold font-body transition-all ${
        active
          ? 'bg-solaris-500 text-white shadow-sm'
          : 'bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:border-solaris-500/40 hover:text-solaris-400'
      }`}
    >
      {label}
    </button>
  )
}
