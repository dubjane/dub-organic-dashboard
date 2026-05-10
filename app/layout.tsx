import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import CursorGlow from '@/components/ui/CursorGlow'

const roslindale = localFont({
  src: '../public/fonts/RoslindaleDeckNarrow-Medium.otf',
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: false,
})

const figtree = localFont({
  src: '../public/fonts/Figtree-VariableFont_wght copy.ttf',
  variable: '--font-body',
  weight: '300 700',
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'dub — Organic Social Dashboard',
  description: 'TikTok & Instagram organic metrics for dub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roslindale.variable} ${figtree.variable}`}>
      <body>
        <CursorGlow />
        {children}
      </body>
    </html>
  )
}
