import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import type { User } from '@/types/database'

export default async function RankingPage() {
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

  // 예측왕 - 적중 횟수 기준
  const { data: topCorrect } = await supabase
    .from('users')
    .select('id, nickname, correct_predictions, total_predictions, point_balance')
    .order('correct_predictions', { ascending: false })
    .limit(10)

  // 정확도왕 - 최소 20회 이상, 정확도 기준
  const { data: topAccuracy } = await supabase
    .from('users')
    .select('id, nickname, correct_predictions, total_predictions, accuracy_rate')
    .gte('total_predictions', 20)
    .order('accuracy_rate', { ascending: false })
    .limit(10)

  const correctList = topCorrect ?? []
  const accuracyList = topAccuracy ?? []

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}위`
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />

      <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl font-black text-gaudia-text">
            🏆 랭킹
          </h1>
          <p className="text-xs text-gaudia-text3 mt-1">
            이번 달 예측 고수들을 확인하세요
          </p>
        </div>

        {/* 예측왕 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-gaudia-text">🏆 예측왕</span>
            <span className="text-xs text-gaudia-text3">적중 횟수 기준</span>
          </div>
          <div className="bg-white rounded-2xl border border-cream-3 shadow-sm overflow-hidden">
            {correctList.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gaudia-text3">아직 예측 데이터가 없습니다</p>
              </div>
            ) : (
              correctList.map((u, i) => (
                <div
                  key={u.id}
                  className={`flex items-center px-4 py-3 ${i !== correctList.length - 1 ? 'border-b border-cream-2' : ''} ${u.id === authUser?.id ? 'bg-gold-bg' : ''}`}
                >
                  <span className="w-10 text-sm font-bold text-gaudia-text">
                    {medalEmoji(i + 1)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gaudia-text">
                      {u.nickname || '익명'}
                      {u.id === authUser?.id && (
                        <span className="ml-1 text-xs text-gaudia-gold">(나)</span>
                      )}
                    </p>
                    <p className="text-xs text-gaudia-text3">{u.total_predictions || 0}회 예측</p>
                  </div>
                  <span className="text-sm font-black text-gaudia-green">
                    {u.correct_predictions || 0}회 적중
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 정확도왕 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-gaudia-text">🎯 정확도왕</span>
            <span className="text-xs text-gaudia-text3">최소 20회 이상 · 정확도 기준</span>
          </div>
          <div className="bg-white rounded-2xl border border-cream-3 shadow-sm overflow-hidden">
            {accuracyList.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-bold text-gaudia-text mb-1">
                  아직 조건을 충족한 예측자가 없습니다
                </p>
                <p className="text-xs text-gaudia-text3">
                  20회 이상 예측하면 정확도왕에 도전할 수 있어요!
                </p>
              </div>
            ) : (
              accuracyList.map((u, i) => (
                <div
                  key={u.id}
                  className={`flex items-center px-4 py-3 ${i !== accuracyList.length - 1 ? 'border-b border-cream-2' : ''} ${u.id === authUser?.id ? 'bg-gold-bg' : ''}`}
                >
                  <span className="w-10 text-sm font-bold text-gaudia-text">
                    {medalEmoji(i + 1)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gaudia-text">
                      {u.nickname || '익명'}
                      {u.id === authUser?.id && (
                        <span className="ml-1 text-xs text-gaudia-gold">(나)</span>
                      )}
                    </p>
                    <p className="text-xs text-gaudia-text3">{u.total_predictions || 0}회 예측</p>
                  </div>
                  <span className="text-sm font-black text-gaudia-red">
                    {Math.round(u.accuracy_rate || 0)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}