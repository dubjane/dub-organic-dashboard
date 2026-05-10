import InsightTag from '@/components/ui/InsightTag'
import type { TagType } from '@/components/ui/InsightTag'

interface InsightItem {
  n: number
  text: string
}

interface InsightCategory {
  type: TagType
  title: string
  items: InsightItem[]
}

const insights: InsightCategory[] = [
  {
    type: 'HOOK',
    title: 'Opening Pattern',
    items: [
      { n: 1, text: 'Contrarian opens outperform positive framing by 2.4×' },
      { n: 2, text: 'Questions with implicit financial fear drive watch time' },
      { n: 3, text: 'Specific numbers (e.g. "$847") increase trust signals' },
    ],
  },
  {
    type: 'VISUAL',
    title: 'Visual Strategy',
    items: [
      { n: 1, text: 'Text overlays with 3+ lines correlate with higher saves' },
      { n: 2, text: 'Clean white or blurred backgrounds remove distraction' },
      { n: 3, text: 'Face-to-camera adds 38% more comment engagement' },
    ],
  },
  {
    type: 'TREND',
    title: 'Trend Surfing',
    items: [
      { n: 1, text: 'Generational comparison formats are high-share this quarter' },
      { n: 2, text: 'Myth-busting finance content indexed +62% in April' },
      { n: 3, text: '"No math" framing reduces drop-off in first 3 seconds' },
    ],
  },
  {
    type: 'AUDIO',
    title: 'Audio & Pacing',
    items: [
      { n: 1, text: 'Trending audio adds ~18% distribution boost on TikTok' },
      { n: 2, text: 'Posts under 28s outperform longer formats by 31%' },
      { n: 3, text: 'Voiceover with captions increases watch completion' },
    ],
  },
]

export default function WhyItWorked() {
  return (
    <div className="rounded-2xl bg-[#111110] p-8 border border-white/[0.06]">
      <div className="mb-8">
        <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-400 mb-1">
          Insights Engine
        </p>
        <h2 className="font-display text-3xl text-white">Why It Worked</h2>
        <p className="text-sm font-body text-neutral-400 mt-2 max-w-lg">
          Pattern analysis across your top-performing content this period.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {insights.map((category) => (
          <div key={category.type} className="space-y-3">
            <div className="flex items-center gap-3">
              <InsightTag type={category.type} dark />
              <span className="text-sm font-semibold font-body text-neutral-300">
                {category.title}
              </span>
            </div>
            <div className="space-y-2.5">
              {category.items.map((item) => (
                <div key={item.n} className="flex items-start gap-3">
                  <span className="font-display text-lg text-solaris-500 shrink-0 leading-none mt-0.5 w-5">
                    {item.n}
                  </span>
                  <p className="text-sm font-body text-neutral-300 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
