'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/database'

interface NavbarProps {
  user: User | null
}

const NAV_LINKS = [
  { href: '/matches', label: '경기' },
  { href: '/ranking', label: '랭킹' },
]

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '2px solid #DFC06A',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      height: '56px',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '16px',
    }}>
      {/* 로고 */}
      <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', textDecoration: 'none' }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '22px', fontWeight: 700,
          color: '#B8860B', letterSpacing: '4px', lineHeight: 1,
        }}>
          GAUDIA
        </span>
        <span style={{ fontSize: '11px', color: '#8A8078', fontWeight: 500 }}>KBO 예측</span>
      </Link>

      {/* 네비 링크 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: 'auto' }}>
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '13px', fontWeight: 500,
                padding: '6px 12px', borderRadius: '99px',
                textDecoration: 'none',
                transition: 'all 0.15s',
                background: active ? '#FDF8EC' : 'transparent',
                color: active ? '#B8860B' : '#5A5248',
                border: active ? '1px solid #DFC06A' : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* 우측 영역 */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#FDF8EC', border: '1px solid #DFC06A',
            borderRadius: '99px', padding: '4px 12px',
            fontSize: '12px', fontWeight: 700, color: '#B8860B',
            fontFamily: "'DM Mono', monospace",
          }}>
            ⚡ {user.point_balance.toLocaleString()}
            <span style={{ color: '#8A8078', fontWeight: 400, marginLeft: '2px' }}>PT</span>
          </div>
          <button
            onClick={handleLogout}
            title="로그아웃"
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '12px', fontWeight: 700,
              border: 'none', cursor: 'pointer',
            }}
          >
            {user.nickname.slice(0, 1)}
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          style={{
            fontSize: '12px', fontWeight: 700, color: '#B8860B',
            background: '#FDF8EC', border: '1px solid #DFC06A',
            borderRadius: '99px', padding: '6px 16px',
            textDecoration: 'none',
          }}
        >
          로그인
        </Link>
      )}
    </nav>
  )
}