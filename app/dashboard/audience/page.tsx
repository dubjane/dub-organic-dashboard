'use client'

// ─── API integration notes ─────────────────────────────────────────────────────
// TODO(API): Follower counts — mockKPIs.followers (already wired to MetricsProvider)
//            Live: read from MetricsProvider context once Settings page is updated with real data.
// TODO(API): Follower growth — mockFollowerGrowth
//            Live: Supabase table `follower_snapshots` populated by Vercel Cron daily.
//            Query: SELECT date, tiktok_count, instagram_count ORDER BY date DESC LIMIT 90
// TODO(API): Demographics — mockAgeGroups, mockGenderData, mockTopLocations
//            TikTok: GET /v2/research/adv/audience/info (requires Business API access)
//            Instagram: GET /{user-id}/insights?metric=audience_gender_age,audience_city&period=lifetime
// TODO(API): Best time — mockBestTimeHeatmap
//            Derive from Supabase post_performance table grouped by day_of_week + hour_bucket.
//            SQL: SELECT day_of_week, hour_bucket, AVG(engagement_rate) FROM post_performance GROUP BY 1,2
// ──────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import {
  mockFollowerGrowth,
  mockAgeGroups,
  mockGenderData,
  mockTopLocations,
  mockBestTimeHeatmap,
} from '@/lib/data'
import { useMetrics } from '@/lib/metrics-context'
import { formatNumber, formatDate } from '@/lib/utils'

type AudienceTimeRange = '30d' | '60d' | '90d'
type PlatformToggle = 'tiktok' | 'instagram'

// ─── Shared tooltip style ──────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
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

function DemoTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1E1C1A] rounded-xl border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-4 py-3 font-body">
      <p className="text-xs text-neutral-300 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey as string} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-neutral-300 capitalize">{entry.dataKey as string}</span>
          <span className="font-semibold text-neutral-50 ml-auto pl-4">
            {Number(entry.value ?? 0).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Section card wrapper ──────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#1E1C1A] rounded-2xl border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)] p-6 ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
      {children}
    </p>
  )
}

// ─── Platform follower cards ───────────────────────────────────────────────────

function PlatformCard({
  platform,
  followers,
  change,
  weeklyNew,
}: {
  platform: 'tiktok' | 'instagram'
  followers: number
  change: number
  weeklyNew: number
}) {
  const isTT = platform === 'tiktok'
  const isPositive = change >= 0
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <SectionLabel>{isTT ? 'TikTok' : 'Instagram'}</SectionLabel>
          <h2 className="font-display text-4xl text-solaris-500">{formatNumber(followers)}</h2>
          <p className="text-sm font-body text-neutral-300 mt-0.5">Total Followers</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
            isTT ? 'bg-solaris-500/15 text-solaris-500' : 'bg-cyan-500/15 text-cyan-400'
          }`}
        >
          {isTT ? '▶' : '◈'}
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
        <div>
          <p className="text-[11px] font-body font-semibold uppercase tracking-widest text-neutral-300 mb-0.5">
            30d change
          </p>
          <span
            className={`text-xs font-semibold font-body px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
        <div>
          <p className="text-[11px] font-body font-semibold uppercase tracking-widest text-neutral-300 mb-0.5">
            New this week
          </p>
          <p className="text-sm font-semibold font-body text-neutral-200">+{formatNumber(weeklyNew)}</p>
        </div>
      </div>
    </Card>
  )
}

// ─── Follower growth chart ─────────────────────────────────────────────────────

function FollowerGrowthChart() {
  const [range, setRange] = useState<AudienceTimeRange>('30d')
  const days = range === '30d' ? 30 : range === '60d' ? 60 : 90
  const data = mockFollowerGrowth.slice(-days)

  const ranges: { label: string; value: AudienceTimeRange }[] = [
    { label: '30D', value: '30d' },
    { label: '60D', value: '60d' },
    { label: '90D', value: '90d' },
  ]

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <SectionLabel>Follower Growth</SectionLabel>
          <h2 className="font-display text-2xl text-neutral-50">Trajectory</h2>
        </div>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-body transition-all ${
                range === r.value
                  ? 'bg-solaris-500 text-white shadow-sm'
                  : 'bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:border-solaris-500/40 hover:text-solaris-400'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {[{ color: '#F08752', label: 'TikTok' }, { color: '#00CDE6', label: 'Instagram' }].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: s.color }} />
            <span className="text-xs font-body text-neutral-300">{s.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="ttGradAud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#F08752" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F08752" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="igGradAud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00CDE6" stopOpacity={0.15} />
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
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="tiktok"    stroke="#F08752" strokeWidth={2} fill="url(#ttGradAud)" dot={false} />
          <Area type="monotone" dataKey="instagram" stroke="#00CDE6" strokeWidth={2} fill="url(#igGradAud)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ─── Age demographics ──────────────────────────────────────────────────────────

function AgeChart() {
  return (
    <Card>
      <SectionLabel>Demographics</SectionLabel>
      <h2 className="font-display text-2xl text-neutral-50 mb-5">Age Distribution</h2>
      {/* TODO(API): Replace mockAgeGroups with data from TikTok /v2/research/adv/audience/info
                    or Instagram /{user-id}/insights?metric=audience_gender_age */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={mockAgeGroups} margin={{ top: 4, right: 4, bottom: 0, left: -16 }} barGap={4}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 11, fill: '#A4968B', fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: '#A4968B', fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<DemoTooltip />} />
          <Bar dataKey="tiktok"    name="TikTok"    fill="#F08752" radius={[3, 3, 0, 0]} maxBarSize={20} />
          <Bar dataKey="instagram" name="Instagram" fill="#00CDE6" radius={[3, 3, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3">
        {[{ color: '#F08752', label: 'TikTok' }, { color: '#00CDE6', label: 'Instagram' }].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-xs font-body text-neutral-300">{s.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Gender breakdown ──────────────────────────────────────────────────────────

function GenderBreakdown() {
  const platforms: { key: 'tiktok' | 'instagram'; label: string; color: string }[] = [
    { key: 'tiktok',    label: 'TikTok',    color: '#F08752' },
    { key: 'instagram', label: 'Instagram', color: '#00CDE6' },
  ]
  const segments = [
    { key: 'male'   as const, label: 'Male',   color: '#F08752' },
    { key: 'female' as const, label: 'Female', color: '#00CDE6' },
    { key: 'other'  as const, label: 'Other',  color: '#A4968B' },
  ]

  // TODO(API): Replace mockGenderData with real gender split from platform insights

  return (
    <Card>
      <SectionLabel>Demographics</SectionLabel>
      <h2 className="font-display text-2xl text-neutral-50 mb-5">Gender Split</h2>

      <div className="space-y-5">
        {platforms.map((p) => {
          const data = mockGenderData[p.key]
          return (
            <div key={p.key}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs font-semibold font-body text-neutral-300">{p.label}</span>
              </div>
              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden gap-px mb-2">
                <div className="bg-[#F08752] transition-all" style={{ width: `${data.male}%` }} />
                <div className="bg-[#00CDE6] transition-all" style={{ width: `${data.female}%` }} />
                <div className="bg-neutral-400 transition-all" style={{ width: `${data.other}%` }} />
              </div>
              <div className="flex gap-4">
                {segments.map((s) => (
                  <div key={s.key} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.color }} />
                    <span className="text-xs font-body text-neutral-300">{s.label}</span>
                    <span className="text-xs font-semibold font-body text-neutral-200">
                      {data[s.key]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ─── Top locations ─────────────────────────────────────────────────────────────

function TopLocations() {
  const [platform, setPlatform] = useState<PlatformToggle>('tiktok')
  const maxVal = Math.max(...mockTopLocations.map((l) => Math.max(l.tiktok, l.instagram)))

  // TODO(API): Replace mockTopLocations with Instagram /{user-id}/insights?metric=audience_city
  //            or TikTok /v2/research/adv/audience/info breakdown by region

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div>
          <SectionLabel>Audience</SectionLabel>
          <h2 className="font-display text-2xl text-neutral-50">Top Locations</h2>
        </div>
        <div className="flex gap-2">
          {(['tiktok', 'instagram'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-body transition-all capitalize ${
                platform === p
                  ? 'bg-solaris-500 text-white shadow-sm'
                  : 'bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:border-solaris-500/40 hover:text-solaris-400'
              }`}
            >
              {p === 'tiktok' ? 'TikTok' : 'Instagram'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {mockTopLocations.map((loc) => {
          const val = loc[platform]
          const pct = (val / maxVal) * 100
          return (
            <div key={loc.city} className="flex items-center gap-3">
              <div className="w-32 shrink-0">
                <p className="text-sm font-semibold font-body text-neutral-200">{loc.city}</p>
                <p className="text-xs font-body text-neutral-400">{loc.state}</p>
              </div>
              <div className="flex-1 bg-white/[0.06] rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: platform === 'tiktok' ? '#F08752' : '#00CDE6',
                  }}
                />
              </div>
              <span className="text-sm font-semibold font-body text-neutral-200 w-10 text-right">
                {val}%
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ─── Best time to post heatmap ─────────────────────────────────────────────────

function BestTimeHeatmap() {
  const [platform, setPlatform] = useState<PlatformToggle>('tiktok')
  const { days, slots } = mockBestTimeHeatmap
  const scores = mockBestTimeHeatmap[platform]

  // TODO(API): Replace with derived scores from Supabase post_performance table
  //            SQL: SELECT EXTRACT(DOW FROM posted_at) as dow,
  //                        FLOOR(EXTRACT(HOUR FROM posted_at) / 3) as hour_bucket,
  //                        AVG(engagement_rate) as avg_engagement
  //                 FROM post_performance GROUP BY 1, 2

  const maxScore = Math.max(...scores.flat())

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <SectionLabel>Publishing</SectionLabel>
          <h2 className="font-display text-2xl text-neutral-50">Best Time to Post</h2>
          <p className="text-xs font-body text-neutral-400 mt-1">
            Engagement score by day and time — darker = higher engagement
          </p>
        </div>
        <div className="flex gap-2">
          {(['tiktok', 'instagram'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-body transition-all ${
                platform === p
                  ? 'bg-solaris-500 text-white shadow-sm'
                  : 'bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:border-solaris-500/40 hover:text-solaris-400'
              }`}
            >
              {p === 'tiktok' ? 'TikTok' : 'Instagram'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: rows = time slots, columns = days */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Day headers */}
          <div className="grid mb-2" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
            <div />
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-semibold font-body text-neutral-400">
                {day}
              </div>
            ))}
          </div>

          {/* Slot rows */}
          <div className="space-y-1.5">
            {slots.map((slot, si) => (
              <div
                key={slot}
                className="grid items-center gap-1.5"
                style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}
              >
                <span className="text-[11px] font-body text-neutral-400 text-right pr-3 whitespace-nowrap">
                  {slot}
                </span>
                {days.map((day, di) => {
                  const score = scores[di][si]
                  const intensity = score / maxScore
                  const bgColor =
                    platform === 'tiktok'
                      ? `rgba(240,135,82,${Math.max(0.07, intensity * 0.9)})`
                      : `rgba(0,205,230,${Math.max(0.07, intensity * 0.9)})`
                  return (
                    <div
                      key={day}
                      title={`${day} ${slot}: ${score}`}
                      className="h-8 rounded-lg cursor-default transition-all hover:opacity-80"
                      style={{ backgroundColor: bgColor }}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-[11px] font-body text-neutral-400">Low</span>
            <div className="flex gap-0.5">
              {[0.07, 0.2, 0.4, 0.6, 0.8, 0.9].map((op) => (
                <div
                  key={op}
                  className="w-5 h-3 rounded-sm"
                  style={{
                    backgroundColor:
                      platform === 'tiktok'
                        ? `rgba(240,135,82,${op})`
                        : `rgba(0,205,230,${op})`,
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] font-body text-neutral-400">High</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AudiencePage() {
  const { kpis } = useMetrics()

  // TODO(API): Replace kpis.followers with live data once API keys are configured.
  //            The MetricsProvider already reads from localStorage — update Settings
  //            page to pull from TikTok/Instagram APIs and write here automatically.
  const ttFollowers  = kpis.followers.tiktok
  const igFollowers  = kpis.followers.instagram
  const ttChange     = kpis.followers.change
  const igChange     = kpis.followers.change * 0.7  // mock split; replace with real per-platform change
  const ttWeeklyNew  = Math.round(kpis.newFollowers.tiktok / 4)
  const igWeeklyNew  = Math.round(kpis.newFollowers.instagram / 4)

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}
      <div>
        <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
          Audience
        </p>
        <h1 className="font-display text-4xl text-neutral-50">Who's Following</h1>
      </div>

      {/* Platform follower cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <PlatformCard
          platform="tiktok"
          followers={ttFollowers}
          change={ttChange}
          weeklyNew={ttWeeklyNew}
        />
        <PlatformCard
          platform="instagram"
          followers={igFollowers}
          change={igChange}
          weeklyNew={igWeeklyNew}
        />
      </div>

      {/* Follower growth chart — full width */}
      <FollowerGrowthChart />

      {/* Demographics — two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AgeChart />
        <GenderBreakdown />
      </div>

      {/* Top locations — full width */}
      <TopLocations />

      {/* Best time to post — full width */}
      <BestTimeHeatmap />

    </div>
  )
}
