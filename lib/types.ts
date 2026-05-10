export type InsightTagType = 'HOOK' | 'VISUAL' | 'TREND' | 'AUDIO'

export interface KPIData {
  value: number
  change: number // percentage
  tiktok: number
  instagram: number
}

export interface KPIs {
  followers: KPIData
  views: KPIData
  engagementRate: KPIData
  newFollowers: KPIData
}

export interface Post {
  id: string
  title: string
  platform: 'tiktok' | 'instagram'
  date: string
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  engagementRate: number
  whyItWorked: string[]
  tags: InsightTagType[]
}

export interface TimeSeriesPoint {
  date: string
  tiktok: number
  instagram: number
}

export type Platform = 'all' | 'tiktok' | 'instagram'
export type TimeRange = '7d' | '30d' | '90d'

// ─── Audience types ────────────────────────────────────────────────────────────

export interface AgeGroup {
  range: string
  tiktok: number    // % of TikTok audience
  instagram: number // % of Instagram audience
}

export interface GenderSplit {
  male: number
  female: number
  other: number
}

export interface LocationData {
  city: string
  state: string
  tiktok: number    // % of TikTok audience
  instagram: number
}

export interface BestTimeData {
  days: string[]
  slots: string[]
  tiktok: number[][]    // [dayIndex][slotIndex] → engagement score 0–100
  instagram: number[][]
}
