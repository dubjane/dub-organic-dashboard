'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { mockPosts } from '@/lib/data'

const engagementTypes = ['likes', 'comments', 'shares', 'saves'] as const
type EngType = typeof engagementTypes[number]

const COLORS: Record<EngType, string> = {
  likes: '#F08752',
  comments: '#F49462',
  shares: '#00CDE6',
  saves: '#FFD2B4',
}

function CustomTooltip({ active, payload }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-[#1E1C1A] rounded-xl border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-3 py-2 font-body">
      <p className="text-sm font-semibold text-neutral-50 capitalize">{d.name as string}</p>
      <p className="text-xs text-neutral-300">{Number(d.value).toLocaleString()} total</p>
    </div>
  )
}

interface ChartDataPoint {
  name: EngType
  value: number
  color: string
}

export default function EngagementMix() {
  const totals = engagementTypes.reduce<Record<EngType, number>>(
    (acc, key) => {
      acc[key] = mockPosts.reduce((sum, p) => sum + p[key], 0)
      return acc
    },
    { likes: 0, comments: 0, shares: 0, saves: 0 }
  )

  const data: ChartDataPoint[] = engagementTypes.map((key) => ({
    name: key,
    value: totals[key],
    color: COLORS[key],
  }))

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="bg-[#1E1C1A] rounded-2xl p-6 border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
      <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
        Engagement Mix
      </p>
      <h2 className="font-display text-2xl text-neutral-50 mb-5">Interaction Breakdown</h2>

      <div className="flex items-center gap-6">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-2.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-sm font-body text-neutral-300 capitalize flex-1">{d.name}</span>
              <span className="text-sm font-semibold font-body text-neutral-200">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
