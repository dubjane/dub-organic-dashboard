export type TagType = 'HOOK' | 'VISUAL' | 'TREND' | 'AUDIO'

interface InsightTagProps {
  type: TagType
  dark?: boolean
}

const tagColors: Record<TagType, string> = {
  HOOK: 'bg-solaris-500/20 text-solaris-300',
  VISUAL: 'bg-cyan-500/20 text-cyan-400',
  TREND: 'bg-purple-500/20 text-purple-300',
  AUDIO: 'bg-green-500/20 text-green-300',
}

const tagColorsDark: Record<TagType, string> = {
  HOOK: 'bg-solaris-500/20 text-solaris-400',
  VISUAL: 'bg-cyan-500/20 text-cyan-500',
  TREND: 'bg-purple-500/20 text-purple-400',
  AUDIO: 'bg-green-500/20 text-green-400',
}

export default function InsightTag({ type, dark = false }: InsightTagProps) {
  const colors = dark ? tagColors : tagColorsDark
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold font-body tracking-widest uppercase ${colors[type]}`}>
      {type}
    </span>
  )
}
