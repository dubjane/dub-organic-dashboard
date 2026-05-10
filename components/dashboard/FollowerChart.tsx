'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { mockFollowerGrowth } from '@/lib/data'
import { formatNumber, formatDate } from '@/lib/utils'

function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1E1C1A] rounded-xl border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-4 py-3 font-body">
      <p className="text-xs text-neutral-300 mb-2">{formatDate(label as string)}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey as string} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-neutral-300 capitalize">{entry.dataKey as string}</span>
          <span className="font-semibold text-neutral-50 ml-auto pl-4">
            {formatNumber(Number(entry.value ?? 0))}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function FollowerChart() {
  const data = mockFollowerGrowth.slice(-30)

  return (
    <div className="bg-[#1E1C1A] rounded-2xl p-6 border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
      <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
        Follower Growth
      </p>
      <h2 className="font-display text-2xl text-neutral-50 mb-5">30-Day Trajectory</h2>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="ttGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F08752" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F08752" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="igGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00CDE6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#00CDE6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: '#A4968B', fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatNumber}
            tick={{ fontSize: 11, fill: '#A4968B', fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="tiktok" stroke="#F08752" strokeWidth={2} fill="url(#ttGrad)" dot={false} />
          <Area type="monotone" dataKey="instagram" stroke="#00CDE6" strokeWidth={2} fill="url(#igGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
