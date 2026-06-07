import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'GAUDIA — KBO 예측 플랫폼',
  description: '경기마다 쌓이는 즐거운 순간들. KBO 집단지성 예측 플랫폼.',
  openGraph: {
    title:       'GAUDIA ⚾',
    description: '경기마다 쌓이는 즐거운 순간들',
    type:        'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-cream">
        {children}
      </body>
    </html>
  )
}
