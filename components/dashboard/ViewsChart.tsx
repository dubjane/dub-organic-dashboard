'use client'

import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { mockTimeSeries } from '@/lib/data'
import { formatNumber, formatDate } from '@/lib/utils'
import type { TimeRange, TimeSeriesPoint } from '@/lib/types'
import Chip from '@/components/ui/Chip'

const ranges: { label: string; value: TimeRange }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
]

function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1E1C1A] rounded-xl border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-4 py-3 font-body">
      <p className="text-xs text-neutral-300 mb-2">{formatDate(label as string)}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey as string} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-neutral-300 capitalize">{entry.dataKey as string}</span>
          <span className="font-semibold text-neutral-50 ml-auto pl-4">
            {formatNumber(Number(entry.value ?? 0))}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ViewsChart() {
  const [range, setRange] = useState<TimeRange>('30d')

  const data = useMemo<TimeSeriesPoint[]>(() => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    return mockTimeSeries.slice(-days)
  }, [range])

  return (
    <div className="bg-[#1E1C1A] rounded-2xl p-6 border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
            Views Over Time
          </p>
          <h2 className="font-display text-2xl text-neutral-50">Daily Reach</h2>
        </div>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <Chip
              key={r.value}
              label={r.label}
              active={range === r.value}
              onClick={() => setRange(r.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-solaris-500 rounded" />
          <span className="text-xs font-body text-neutral-300">TikTok</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-cyan-500 rounded" />
          <span className="text-xs font-body text-neutral-300">Instagram</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
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
          <Line
            type="monotone"
            dataKey="tiktok"
            stroke="#F08752"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#F08752', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="instagram"
            stroke="#00CDE6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#00CDE6', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
