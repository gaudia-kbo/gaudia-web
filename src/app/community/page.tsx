import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import type { User } from '@/types/database'

export default async function CommunityPage() {
  const supabase = await createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  let user: User | null = null
  if (authUser) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()
    user = data
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-gaudia-text">
            💬 커뮤니티
          </h1>
          <p className="text-xs text-gaudia-text3 mt-1">
            팬들과 함께 예측을 나눠요
          </p>
        </div>

        {/* 준비중 카드 */}
        <div className="bg-white rounded-2xl border border-cream-3 shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">⚾</div>
          <h2 className="text-base font-black text-gaudia-text mb-2">
            커뮤니티 준비 중입니다
          </h2>
          <p className="text-sm text-gaudia-text3 leading-relaxed">
            팬들과 함께 예측을 나누고<br />
            의견을 공유하는 공간을 준비하고 있어요.<br />
            곧 만나요! 🙌
          </p>

          {/* 예정 기능 미리보기 */}
          <div className="mt-8 text-left space-y-3">
            <p className="text-xs font-bold text-gaudia-text3 mb-3">
              📋 준비 중인 기능
            </p>
            {[
              { icon: '📝', text: '오늘의 경기 자유 토론' },
              { icon: '🔥', text: '인기 예측 분석 & 공유' },
              { icon: '🏆', text: '예측왕들의 픽 공개' },
              { icon: '📊', text: '팀별 팬 예측 통계' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gaudia-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 알림 신청 */}
        <div className="mt-4 bg-gold-bg rounded-2xl border border-gold-border p-4 text-center">
          <p className="text-sm font-bold text-gaudia-text">
            🔔 오픈 알림을 받고 싶으신가요?
          </p>
          <p className="text-xs text-gaudia-text3 mt-1">
            커뮤니티 오픈 시 앱 푸시 알림으로 알려드릴게요
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}