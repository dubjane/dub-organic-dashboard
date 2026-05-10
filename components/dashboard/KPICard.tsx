import { formatNumber, formatPercent } from '@/lib/utils'
import { KPIData } from '@/lib/types'

interface KPICardProps {
  label: string
  data: KPIData
  isRate?: boolean
}

export default function KPICard({ label, data, isRate = false }: KPICardProps) {
  const isPositive = data.change >= 0
  const displayValue = isRate ? `${data.value}%` : formatNumber(data.value)
  const ttValue = isRate ? `${data.tiktok}%` : formatNumber(data.tiktok)
  const igValue = isRate ? `${data.instagram}%` : formatNumber(data.instagram)

  return (
    <div className="bg-[#1E1C1A] rounded-2xl p-6 border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-white/[0.1] transition-all group">
      <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-3">
        {label}
      </p>
      <div className="mb-3">
        <span className="font-display text-5xl text-solaris-500 leading-none">
          {displayValue}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-semibold font-body px-2 py-0.5 rounded-full ${
          isPositive
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {formatPercent(data.change)}
        </span>
        <span className="text-xs font-body text-neutral-300">vs last period</span>
      </div>
      <div className="flex gap-3 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-solaris-500" />
          <span className="text-xs font-body text-neutral-300">TT {ttValue}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-xs font-body text-neutral-300">IG {igValue}</span>
        </div>
      </div>
    </div>
  )
}
