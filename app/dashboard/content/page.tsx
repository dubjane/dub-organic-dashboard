'use client'

// ─── API integration notes ─────────────────────────────────────────────────────
// TODO(API): Replace mockPosts with real API calls once keys are configured.
// TikTok Business API — https://developers.tiktok.com/
//   Endpoint: GET /v2/research/adv/video/list
//   Auth: OAuth 2.0, TIKTOK_API_KEY in .env.local
// Instagram Graph API — https://developers.facebook.com/docs/instagram-api/
//   Endpoint: GET /{user-id}/media?fields=id,caption,timestamp,like_count,comments_count
//   Auth: INSTAGRAM_ACCESS_TOKEN in .env.local
// Both APIs return paginated results. Persist to Supabase via Vercel Cron.
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react'
import { mockPosts } from '@/lib/data'
import type { Platform, InsightTagType } from '@/lib/types'
import InsightTag from '@/components/ui/InsightTag'
import type { TagType } from '@/components/ui/InsightTag'
import Chip from '@/components/ui/Chip'
import { formatNumber } from '@/lib/utils'

type SortKey = 'date' | 'views' | 'engagementRate'
type DateRangeKey = 'all' | '7d' | '30d' | '90d'

const PLATFORM_FILTERS: { label: string; value: Platform }[] = [
  { label: 'All', value: 'all' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
]

const DATE_RANGE_OPTIONS: { label: string; value: DateRangeKey }[] = [
  { label: 'All time', value: 'all' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
]

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Newest first', value: 'date' },
  { label: 'Most views', value: 'views' },
  { label: 'Best engagement', value: 'engagementRate' },
]

const TABLE_HEADERS: { label: string; sortKey?: SortKey; alignRight?: boolean }[] = [
  { label: 'Post' },
  { label: 'Platform' },
  { label: 'Date', sortKey: 'date' },
  { label: 'Views', sortKey: 'views', alignRight: true },
  { label: 'Likes', alignRight: true },
  { label: 'Comments', alignRight: true },
  { label: 'Shares', alignRight: true },
  { label: 'Saves', alignRight: true },
  { label: 'Eng Rate', sortKey: 'engagementRate' },
  { label: 'Tags' },
]

function ThumbnailPlaceholder({ platform }: { platform: 'tiktok' | 'instagram' }) {
  return (
    <div
      className={`w-11 h-[52px] rounded-lg shrink-0 flex items-center justify-center text-base ${
        platform === 'tiktok'
          ? 'bg-solaris-500/15 text-solaris-500'
          : 'bg-cyan-500/15 text-cyan-400'
      }`}
    >
      {platform === 'tiktok' ? '▶' : '◈'}
    </div>
  )
}

const SELECT_CLASS =
  'bg-white/[0.04] border border-white/[0.08] rounded-xl text-neutral-200 text-sm font-body px-3 py-1.5 focus:outline-none focus:border-solaris-500/40 cursor-pointer'

// Reference date — TODO(API): replace with Date.now() once live data is used
const REFERENCE_DATE = new Date('2024-04-30')

export default function ContentPage() {
  const [platform, setPlatform] = useState<Platform>('all')
  const [dateRange, setDateRange] = useState<DateRangeKey>('all')
  const [sortBy, setSortBy] = useState<SortKey>('date')

  const posts = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : Infinity
    const since = isFinite(days)
      ? new Date(REFERENCE_DATE.getTime() - days * 86_400_000)
      : new Date(0)

    // TODO(API): Replace filter + sort with server-side query params once API is live
    return [...mockPosts]
      .filter((p) => platform === 'all' || p.platform === platform)
      .filter((p) => new Date(p.date) >= since)
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime()
        if (sortBy === 'views') return b.views - a.views
        return b.engagementRate - a.engagementRate
      })
  }, [platform, dateRange, sortBy])

  const totalViews = posts.reduce((s, p) => s + p.views, 0)
  const avgEng = posts.length
    ? (posts.reduce((s, p) => s + p.engagementRate, 0) / posts.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}
      <div>
        <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
          Content
        </p>
        <h1 className="font-display text-4xl text-neutral-50">Performance Feed</h1>
      </div>

      {/* Filter + sort bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {PLATFORM_FILTERS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              active={platform === f.value}
              onClick={() => setPlatform(f.value)}
            />
          ))}
        </div>
        <div className="w-px h-5 bg-white/[0.08] mx-1" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRangeKey)}
          className={SELECT_CLASS}
        >
          {DATE_RANGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#1E1C1A]">
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className={SELECT_CLASS}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#1E1C1A]">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Posts shown',     value: String(posts.length) },
          { label: 'Combined views',  value: formatNumber(totalViews) },
          { label: 'Avg engagement',  value: `${avgEng}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1E1C1A] rounded-2xl px-5 py-4 border border-white/[0.06]"
          >
            <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
              {stat.label}
            </p>
            <p className="font-display text-3xl text-solaris-500">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-[#1E1C1A] rounded-2xl border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h.label}
                    onClick={() => h.sortKey && setSortBy(h.sortKey)}
                    className={[
                      'px-4 py-3.5 text-[11px] font-semibold font-body uppercase tracking-[0.06em] whitespace-nowrap select-none',
                      h.sortKey ? 'cursor-pointer hover:text-neutral-50 transition-colors' : '',
                      h.alignRight ? 'text-right' : '',
                      sortBy === h.sortKey ? 'text-solaris-400' : 'text-neutral-300',
                    ].join(' ')}
                  >
                    {h.label}
                    {sortBy === h.sortKey && (
                      <span className="ml-1 opacity-50">↓</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="px-4 py-14 text-center text-sm font-body text-neutral-400"
                  >
                    No posts match the current filters.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                >
                  {/* Post title + thumbnail */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-[240px] max-w-[320px]">
                      <ThumbnailPlaceholder platform={post.platform} />
                      <p className="text-sm font-semibold font-body text-neutral-200 leading-snug line-clamp-2">
                        {post.title}
                      </p>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md font-body ${
                        post.platform === 'tiktok'
                          ? 'bg-solaris-500/15 text-solaris-400'
                          : 'bg-cyan-500/10 text-cyan-400'
                      }`}
                    >
                      {post.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-sm font-body text-neutral-300 whitespace-nowrap">
                    {post.date}
                  </td>

                  {/* Views */}
                  <td className="px-4 py-3.5 text-sm font-semibold font-body text-neutral-200 text-right whitespace-nowrap">
                    {formatNumber(post.views)}
                  </td>

                  {/* Likes */}
                  <td className="px-4 py-3.5 text-sm font-body text-neutral-300 text-right whitespace-nowrap">
                    {formatNumber(post.likes)}
                  </td>

                  {/* Comments */}
                  <td className="px-4 py-3.5 text-sm font-body text-neutral-300 text-right whitespace-nowrap">
                    {formatNumber(post.comments)}
                  </td>

                  {/* Shares */}
                  <td className="px-4 py-3.5 text-sm font-body text-neutral-300 text-right whitespace-nowrap">
                    {formatNumber(post.shares)}
                  </td>

                  {/* Saves */}
                  <td className="px-4 py-3.5 text-sm font-body text-neutral-300 text-right whitespace-nowrap">
                    {formatNumber(post.saves)}
                  </td>

                  {/* Engagement rate */}
                  <td className="px-4 py-3.5 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/[0.08] rounded-full h-1.5">
                        <div
                          className="bg-solaris-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(post.engagementRate * 6, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold font-body text-neutral-200 whitespace-nowrap">
                        {post.engagementRate}%
                      </span>
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 min-w-[140px]">
                      {(post.tags as InsightTagType[]).map((tag) => (
                        <InsightTag key={tag} type={tag as TagType} dark />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
          <p className="text-xs font-body text-neutral-400">
            Showing {posts.length} of {mockPosts.length} posts
          </p>
          <p className="text-xs font-body text-neutral-400">
            {/* TODO(API): Add real pagination controls here */}
            Mock data — connect TikTok &amp; Instagram APIs to load live posts
          </p>
        </div>
      </div>
    </div>
  )
}
