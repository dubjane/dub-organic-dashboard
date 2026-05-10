'use client'

import { useState } from 'react'
import { mockPosts } from '@/lib/data'
import { formatNumber } from '@/lib/utils'
import type { Platform } from '@/lib/types'
import Chip from '@/components/ui/Chip'

const filters: { label: string; value: Platform }[] = [
  { label: 'All', value: 'all' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
]

const tableHeaders = ['Post', 'Platform', 'Views', 'Likes', 'Comments', 'Shares', 'Eng Rate', 'Why It Worked']

export default function PerformanceTable() {
  const [filter, setFilter] = useState<Platform>('all')

  const posts = mockPosts.filter((p) => filter === 'all' || p.platform === filter)

  return (
    <div className="bg-[#1E1C1A] rounded-2xl p-6 border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
            Content Performance
          </p>
          <h2 className="font-display text-2xl text-neutral-50">All Posts</h2>
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
            />
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {tableHeaders.map((h) => (
                <th key={h} className="pb-3 text-[11px] font-semibold font-body uppercase tracking-[0.06em] text-neutral-300 pr-4 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                <td className="py-3.5 pr-4 max-w-[220px]">
                  <p className="text-sm font-semibold font-body text-neutral-200 line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  <p className="text-xs font-body text-neutral-300 mt-0.5">{post.date}</p>
                </td>
                <td className="py-3.5 pr-4">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md font-body ${
                    post.platform === 'tiktok'
                      ? 'bg-solaris-500/15 text-solaris-400'
                      : 'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {post.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-sm font-semibold font-body text-neutral-200 whitespace-nowrap">
                  {formatNumber(post.views)}
                </td>
                <td className="py-3.5 pr-4 text-sm font-body text-neutral-300 whitespace-nowrap">
                  {formatNumber(post.likes)}
                </td>
                <td className="py-3.5 pr-4 text-sm font-body text-neutral-300 whitespace-nowrap">
                  {formatNumber(post.comments)}
                </td>
                <td className="py-3.5 pr-4 text-sm font-body text-neutral-300 whitespace-nowrap">
                  {formatNumber(post.shares)}
                </td>
                <td className="py-3.5 pr-4 min-w-[100px]">
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
                <td className="py-3.5 max-w-[200px]">
                  <p className="text-xs font-body text-neutral-300 line-clamp-2 leading-relaxed">
                    {post.whyItWorked[0]}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
