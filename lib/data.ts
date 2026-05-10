import type { KPIs, Post, TimeSeriesPoint, AgeGroup, GenderSplit, LocationData, BestTimeData } from './types'

// ─── KPIs ──────────────────────────────────────────────────────────────────────

export const mockKPIs: KPIs = {
  followers: {
    value: 284600,
    change: 12.4,
    tiktok: 198200,
    instagram: 86400,
  },
  views: {
    value: 14820000,
    change: 31.7,
    tiktok: 10940000,
    instagram: 3880000,
  },
  engagementRate: {
    value: 8.3,
    change: 1.2,
    tiktok: 9.1,
    instagram: 6.8,
  },
  newFollowers: {
    value: 18420,
    change: -3.2,
    tiktok: 13100,
    instagram: 5320,
  },
}

// ─── Posts ─────────────────────────────────────────────────────────────────────
// TODO(API): Replace with TikTok Business API — GET /v2/research/adv/video/list
// TODO(API): Replace with Instagram Graph API — GET /{user-id}/media?fields=id,caption,timestamp,like_count,comments_count,shares_count
// Map API responses to the Post interface in lib/types.ts

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Why your savings account is lying to you',
    platform: 'tiktok',
    date: '2024-04-28',
    views: 2840000,
    likes: 198000,
    comments: 14200,
    shares: 42000,
    saves: 31000,
    engagementRate: 10.1,
    whyItWorked: ['Strong contrarian hook', 'Relatable pain point', 'Financial fear + curiosity', 'Under 30 seconds'],
    tags: ['HOOK', 'TREND'],
  },
  {
    id: '2',
    title: "I turned $100 into $847 in 6 months — here's the app",
    platform: 'tiktok',
    date: '2024-04-21',
    views: 1920000,
    likes: 143000,
    comments: 9800,
    shares: 28400,
    saves: 22100,
    engagementRate: 10.6,
    whyItWorked: ['Specific numbers build credibility', 'Personal story', 'Curiosity gap headline', 'Clear CTA'],
    tags: ['HOOK', 'VISUAL'],
  },
  {
    id: '3',
    title: "The investing myth that's keeping you broke",
    platform: 'instagram',
    date: '2024-04-18',
    views: 940000,
    likes: 62000,
    comments: 4100,
    shares: 18200,
    saves: 14800,
    engagementRate: 10.5,
    whyItWorked: ['Myth-busting frame', 'Shareable insight', 'Carousel format', 'Saved for later'],
    tags: ['HOOK', 'TREND'],
  },
  {
    id: '4',
    title: 'Gen Z vs Millennial investing habits',
    platform: 'tiktok',
    date: '2024-04-14',
    views: 1480000,
    likes: 98000,
    comments: 12400,
    shares: 21000,
    saves: 9800,
    engagementRate: 9.5,
    whyItWorked: ['Generational debate drives comments', 'Trending comparison format', 'High share rate'],
    tags: ['TREND'],
  },
  {
    id: '5',
    title: 'Rate my portfolio 👀',
    platform: 'instagram',
    date: '2024-04-10',
    views: 724000,
    likes: 48000,
    comments: 6200,
    shares: 8400,
    saves: 5100,
    engagementRate: 9.4,
    whyItWorked: ['Interactive format', 'UGC-adjacent', 'Emoji in title drives curiosity'],
    tags: ['HOOK', 'VISUAL'],
  },
  {
    id: '6',
    title: 'How compound interest actually works (no math)',
    platform: 'tiktok',
    date: '2024-04-06',
    views: 1120000,
    likes: 87000,
    comments: 5200,
    shares: 31000,
    saves: 28400,
    engagementRate: 13.5,
    whyItWorked: ['Education + "no math" removes fear barrier', 'Very high save rate', 'Evergreen topic'],
    tags: ['HOOK', 'VISUAL', 'AUDIO'],
  },
  {
    id: '7',
    title: 'dub year in review: $2B invested',
    platform: 'instagram',
    date: '2024-04-02',
    views: 512000,
    likes: 34000,
    comments: 2800,
    shares: 12400,
    saves: 4200,
    engagementRate: 10.4,
    whyItWorked: ['Social proof milestone', 'Brand trust signal', 'Clean visual design'],
    tags: ['VISUAL'],
  },
  {
    id: '8',
    title: "Your coffee habit is not why you're broke",
    platform: 'tiktok',
    date: '2024-03-28',
    views: 3240000,
    likes: 241000,
    comments: 18200,
    shares: 54000,
    saves: 19800,
    engagementRate: 10.3,
    whyItWorked: ['Contrarian take on viral myth', 'High debate potential', 'Trending "avocado toast" format'],
    tags: ['HOOK', 'TREND', 'AUDIO'],
  },
]

// ─── Time series ───────────────────────────────────────────────────────────────

function generateTimeSeries(days: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = []
  const now = new Date('2024-04-30')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const base = 1 - (i / days) * 0.4
    const noise = () => (Math.random() - 0.5) * 0.3
    const spike = i % 7 === 0 ? 1.8 : 1
    points.push({
      date: d.toISOString().split('T')[0],
      tiktok: Math.round((120000 + Math.random() * 80000) * base * (1 + noise()) * spike),
      instagram: Math.round((42000 + Math.random() * 28000) * base * (1 + noise()) * spike),
    })
  }
  return points
}

export const mockTimeSeries: TimeSeriesPoint[] = generateTimeSeries(90)

export const mockFollowerGrowth: TimeSeriesPoint[] = (() => {
  const points: TimeSeriesPoint[] = []
  const now = new Date('2024-04-30')
  let tt = 180000
  let ig = 72000
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    tt += Math.round(200 + Math.random() * 300)
    ig += Math.round(80 + Math.random() * 120)
    points.push({ date: d.toISOString().split('T')[0], tiktok: tt, instagram: ig })
  }
  return points
})()

// ─── Audience demographics ─────────────────────────────────────────────────────
// TODO(API): TikTok — GET /v2/research/adv/audience/info (Business API)
// TODO(API): Instagram — GET /{user-id}/insights?metric=audience_gender_age,audience_city
// Both return breakdowns by gender, age, and location. Map to the types below.

export const mockAgeGroups: AgeGroup[] = [
  { range: '13–17', tiktok: 8,  instagram: 4  },
  { range: '18–24', tiktok: 34, instagram: 28 },
  { range: '25–34', tiktok: 31, instagram: 38 },
  { range: '35–44', tiktok: 16, instagram: 19 },
  { range: '45–54', tiktok: 8,  instagram: 8  },
  { range: '55+',   tiktok: 3,  instagram: 3  },
]

export const mockGenderData: { tiktok: GenderSplit; instagram: GenderSplit } = {
  tiktok:    { male: 48, female: 49, other: 3 },
  instagram: { male: 42, female: 54, other: 4 },
}

export const mockTopLocations: LocationData[] = [
  { city: 'New York',     state: 'NY', tiktok: 14.2, instagram: 16.8 },
  { city: 'Los Angeles',  state: 'CA', tiktok: 11.4, instagram: 13.2 },
  { city: 'Chicago',      state: 'IL', tiktok: 7.8,  instagram: 8.4  },
  { city: 'Houston',      state: 'TX', tiktok: 5.6,  instagram: 5.2  },
  { city: 'Phoenix',      state: 'AZ', tiktok: 4.2,  instagram: 3.8  },
  { city: 'Philadelphia', state: 'PA', tiktok: 3.8,  instagram: 4.1  },
]

// Best time to post — engagement score 0–100 per slot
// [dayIndex 0=Mon…6=Sun][slotIndex 0=6–10am…4=9pm–12am]
// TODO(API): Derive from historical post performance data in Supabase
//            or TikTok/Instagram insights endpoint once sufficient history exists.
export const mockBestTimeHeatmap: BestTimeData = {
  days:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  slots: ['6–10am', '10am–12', '12–5pm', '5–9pm', '9pm–12'],
  tiktok: [
    [45, 58, 72, 91, 66],
    [40, 62, 76, 94, 70],
    [43, 55, 69, 88, 63],
    [41, 61, 74, 95, 69],
    [46, 67, 79, 97, 74],
    [54, 72, 83, 89, 80],
    [50, 69, 80, 85, 76],
  ],
  instagram: [
    [38, 51, 64, 82, 57],
    [36, 57, 70, 87, 63],
    [40, 50, 61, 79, 56],
    [38, 54, 67, 86, 61],
    [41, 62, 73, 91, 67],
    [49, 67, 77, 83, 73],
    [45, 64, 75, 80, 69],
  ],
}
