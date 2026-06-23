import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import type { User, Prediction } from '@/types/database'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  // 최근 예측 내역 10개
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*, topic:topics(title_ko, result, status)')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const u = user as User | null
  const predList = (predictions ?? []) as (Prediction & {
    topic?: { title_ko: string; result: string | null; status: string }
  })[]

  const accuracyPct = u && u.total_predictions > 0
    ? Math.round((u.correct_predictions / u.total_predictions) * 100)
    : 0

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={u} />

      <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl border border-cream-3 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-4">
            {u?.avatar_url ? (
              <img
                src={u.avatar_url}
                alt="프로필"
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-cream-2 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
              <p className="text-base font-black text-gaudia-text">
                {u?.nickname || '익명'}
              </p>
              <p className="text-xs text-gaudia-text3 mt-0.5">
                {authUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* 포인트 & 통계 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-2xl border border-cream-3 shadow-sm p-4 text-center">
            <p className="text-lg font-black text-gaudia-gold">
              ⚡ {(u?.point_balance ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gaudia-text3 mt-1">보유 포인트</p>
          </div>
          <div className="bg-white rounded-2xl border border-cream-3 shadow-sm p-4 text-center">
            <p className="text-lg font-black text-gaudia-green">
              {u?.correct_predictions ?? 0}회
            </p>
            <p className="text-xs text-gaudia-text3 mt-1">예측 적중</p>
          </div>
          <div className="bg-white rounded-2xl border border-cream-3 shadow-sm p-4 text-center">
            <p className="text-lg font-black text-gaudia-red">
              {accuracyPct}%
            </p>
            <p className="text-xs text-gaudia-text3 mt-1">정확도</p>
          </div>
        </div>

        {/* 총 예측 횟수 */}
        <div className="bg-white rounded-2xl border border-cream-3 shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gaudia-text3">총 예측 참여</span>
            <span className="text-sm font-bold text-gaudia-text">
              {u?.total_predictions ?? 0}회
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gaudia-text3">적중 횟수</span>
            <span className="text-sm font-bold text-gaudia-green">
              {u?.correct_predictions ?? 0}회
            </span>
          </div>
        </div>

        {/* 최근 예측 내역 */}
        <div>
          <p className="text-sm font-bold text-gaudia-text mb-3">
            📋 최근 예측 내역
          </p>
          <div className="bg-white rounded-2xl border border-cream-3 shadow-sm overflow-hidden">
            {predList.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gaudia-text3">
                  아직 예측 내역이 없습니다
                </p>
              </div>
            ) : (
              predList.map((p, i) => {
                const isSettled = p.is_settled
                const isCorrect = p.is_correct
                let resultBadge = null
                if (isSettled) {
                  resultBadge = isCorrect
                    ? <span className="text-xs font-bold text-gaudia-green">✅ 적중</span>
                    : <span className="text-xs font-bold text-gaudia-red">❌ 미적중</span>
                } else {
                  resultBadge = <span className="text-xs text-gaudia-text3">⏳ 대기중</span>
                }

                return (
                  <div
                    key={p.id}
                    className={`px-4 py-3 ${i !== predList.length - 1 ? 'border-b border-cream-2' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-gaudia-text flex-1 leading-snug">
                        {p.topic?.title_ko || '예측 토픽'}
                      </p>
                      {resultBadge}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold ${p.choice === 'yes' ? 'text-gaudia-green' : 'text-gaudia-red'}`}>
                        {p.choice === 'yes' ? 'O 예측' : 'X 예측'}
                      </span>
                      <span className="text-xs text-gaudia-text3">
                        -{p.points_bet}P
                      </span>
                      {isCorrect && (
                        <span className="text-xs text-gaudia-green">
                          +{p.points_won}P
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="mt-6">
          <a
            href="/api/auth/signout"
            className="block w-full py-3 text-center text-sm font-bold
                       text-gaudia-text3 border border-cream-3 rounded-xl
                       hover:bg-cream-2 transition-colors"
          >
            로그아웃
          </a>
        </div>

      </main>

      <BottomNav />
    </div>
  )
}