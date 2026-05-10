'use client'

import { useState } from 'react'
import { useMetrics } from '@/lib/metrics-context'
import { KPIs } from '@/lib/types'

interface PlatformInputs {
  tiktok: string
  instagram: string
  change: string
}

interface EngagementInputs extends PlatformInputs {
  value: string
}

interface FormState {
  followers: PlatformInputs
  views: PlatformInputs
  engagementRate: EngagementInputs
  newFollowers: PlatformInputs
}

function kpisToForm(kpis: KPIs): FormState {
  return {
    followers: {
      tiktok: String(kpis.followers.tiktok),
      instagram: String(kpis.followers.instagram),
      change: String(kpis.followers.change),
    },
    views: {
      tiktok: String(kpis.views.tiktok),
      instagram: String(kpis.views.instagram),
      change: String(kpis.views.change),
    },
    engagementRate: {
      tiktok: String(kpis.engagementRate.tiktok),
      instagram: String(kpis.engagementRate.instagram),
      value: String(kpis.engagementRate.value),
      change: String(kpis.engagementRate.change),
    },
    newFollowers: {
      tiktok: String(kpis.newFollowers.tiktok),
      instagram: String(kpis.newFollowers.instagram),
      change: String(kpis.newFollowers.change),
    },
  }
}

function n(s: string): number {
  const v = parseFloat(s)
  return isNaN(v) ? 0 : v
}

export default function SettingsPage() {
  const { kpis, updateKPIs } = useMetrics()
  const [form, setForm] = useState<FormState>(() => kpisToForm(kpis))
  const [saved, setSaved] = useState(false)

  function setField(
    metric: keyof FormState,
    field: string,
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [metric]: { ...prev[metric], [field]: value },
    }))
    setSaved(false)
  }

  function handleSave() {
    const next: KPIs = {
      followers: {
        tiktok: n(form.followers.tiktok),
        instagram: n(form.followers.instagram),
        value: n(form.followers.tiktok) + n(form.followers.instagram),
        change: n(form.followers.change),
      },
      views: {
        tiktok: n(form.views.tiktok),
        instagram: n(form.views.instagram),
        value: n(form.views.tiktok) + n(form.views.instagram),
        change: n(form.views.change),
      },
      engagementRate: {
        tiktok: n(form.engagementRate.tiktok),
        instagram: n(form.engagementRate.instagram),
        value: n(form.engagementRate.value),
        change: n(form.engagementRate.change),
      },
      newFollowers: {
        tiktok: n(form.newFollowers.tiktok),
        instagram: n(form.newFollowers.instagram),
        value: n(form.newFollowers.tiktok) + n(form.newFollowers.instagram),
        change: n(form.newFollowers.change),
      },
    }
    updateKPIs(next)
    setSaved(true)
  }

  const metrics: {
    key: keyof FormState
    label: string
    hint: string
    isRate?: boolean
  }[] = [
    { key: 'followers', label: 'Total Followers', hint: 'Absolute count' },
    { key: 'views', label: 'Total Views', hint: 'Absolute count' },
    { key: 'engagementRate', label: 'Engagement Rate', hint: 'Percentage', isRate: true },
    { key: 'newFollowers', label: 'New Followers', hint: 'This period' },
  ]

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-neutral-300 mb-1">
          Settings
        </p>
        <h1 className="font-display text-4xl text-neutral-800">Metrics</h1>
        <p className="text-sm font-body text-neutral-400 mt-2">
          Manually override dashboard KPI values. Changes persist in your browser.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/40 shadow-[0_1px_3px_rgba(60,40,20,0.08),0_4px_16px_rgba(60,40,20,0.06)] divide-y divide-neutral-100">
        {metrics.map(({ key, label, hint, isRate }) => {
          const row = form[key] as EngagementInputs
          return (
            <div key={key} className="p-6">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold font-body text-neutral-700">{label}</p>
                  <p className="text-xs font-body text-neutral-300 mt-0.5">{hint}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="flex items-center gap-1.5 text-xs font-semibold font-body text-neutral-400 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-solaris-500 inline-block" />
                    TikTok
                  </span>
                  <input
                    type="number"
                    value={row.tiktok}
                    onChange={(e) => setField(key, 'tiktok', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-100 bg-neutral-50 text-sm font-body text-neutral-700 focus:outline-none focus:border-solaris-300 focus:bg-white transition-colors"
                    placeholder="0"
                  />
                </label>

                <label className="block">
                  <span className="flex items-center gap-1.5 text-xs font-semibold font-body text-neutral-400 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
                    Instagram
                  </span>
                  <input
                    type="number"
                    value={row.instagram}
                    onChange={(e) => setField(key, 'instagram', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-100 bg-neutral-50 text-sm font-body text-neutral-700 focus:outline-none focus:border-solaris-300 focus:bg-white transition-colors"
                    placeholder="0"
                  />
                </label>

                {isRate && (
                  <label className="block">
                    <span className="text-xs font-semibold font-body text-neutral-400 mb-1.5 block">
                      Overall Rate (%)
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={row.value}
                      onChange={(e) => setField(key, 'value', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-100 bg-neutral-50 text-sm font-body text-neutral-700 focus:outline-none focus:border-solaris-300 focus:bg-white transition-colors"
                      placeholder="0.0"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="text-xs font-semibold font-body text-neutral-400 mb-1.5 block">
                    Change vs last period (%)
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    value={row.change}
                    onChange={(e) => setField(key, 'change', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-100 bg-neutral-50 text-sm font-body text-neutral-700 focus:outline-none focus:border-solaris-300 focus:bg-white transition-colors"
                    placeholder="0.0"
                  />
                </label>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-solaris-500 hover:bg-solaris-600 text-white text-sm font-semibold font-body rounded-xl transition-colors shadow-sm"
        >
          Save Changes
        </button>
        {saved && (
          <span className="text-sm font-body text-emerald-600 font-semibold">
            ✓ Saved — dashboard updated
          </span>
        )}
      </div>
    </div>
  )
}
