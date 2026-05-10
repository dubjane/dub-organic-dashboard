import { mockPosts } from '@/lib/data'
import { formatNumber } from '@/lib/utils'

export default function TopPosts() {
  const top5 = [...mockPosts].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="bg-[#1E1C1A] rounded-2xl p-6 border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
      <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
        Top Posts
      </p>
      <h2 className="font-display text-2xl text-neutral-50 mb-5">This Period</h2>

      <div className="space-y-4">
        {top5.map((post, i) => (
          <div key={post.id} className="flex items-start gap-3">
            <span className="font-display text-2xl text-solaris-500 shrink-0 w-7 leading-none mt-0.5">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold font-body text-neutral-200 leading-snug line-clamp-2">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded font-body ${
                  post.platform === 'tiktok'
                    ? 'bg-solaris-500/15 text-solaris-400'
                    : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {post.platform === 'tiktok' ? 'TT' : 'IG'}
                </span>
                <span className="text-xs font-body text-neutral-300">{formatNumber(post.views)} views</span>
                <span className="text-xs font-body text-neutral-300">·</span>
                <span className="text-xs font-body text-neutral-300">{post.engagementRate}% eng</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
