'use client'

import { usePathname, useRouter } from 'next/navigation'

const TABS = [
  { path: '/',            icon: '⚾', label: '홈'      },
  { path: '/leaderboard', icon: '🏆', label: '순위'    },
  { path: '/community',   icon: '💬', label: '커뮤니티' },
  { path: '/my',          icon: '👤', label: '내 정보'  },
]

export default function BottomNav() {
  const pathname  = usePathname()
  const router    = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden
                    bg-white border-t-2 border-gold-border
                    pb-safe shadow-lg">
      <div className="flex">
        {TABS.map(tab => {
          const active = pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="flex-1 flex flex-col items-center gap-1
                         py-2 px-1 transition-colors"
            >
              <span className={`text-xl leading-none transition-transform
                               ${active ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-bold
                               ${active
                                 ? 'text-gold-DEFAULT'
                                 : 'text-gaudia-text3'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
