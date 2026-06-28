import { createClient } from '@/lib/supabase/server'
import Navbar    from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import PredictButtons from '@/components/predictions/PredictButtons'
import type { User, TopicOdds } from '@/types/database'

export default async function HomePage() {
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

  const { data: topics } = await supabase
    .from('topic_odds')
    .select('*')
    .eq('status', 'active')
    .order('participant_count', { ascending: false })
    .limit(10)

  const topicList = (topics ?? []) as TopicOdds[]

  return (
    <div className="min-h-screen bg-cream">
      <Navbar user={user} />
      <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
        <div className="mb-6">
          <h1 className="text-xl font-black text-gaudia-text">
            🔥 오늘의 KBO 예측
          </h1>
          <p className="text-xs text-gaudia-text3 mt-1">
            포인트로 예측하고 예측왕에 도전하세요!
          </p>
        </div>

        {topicList.length === 0 && (
          <div className="bg-white rounded-2xl border border-cream-3
                          p-8 text-center shadow-sm">
            <div className="text-4xl mb-3">⚾</div>
            <p className="text-sm font-bold text-gaudia-text">
              오늘의 예측 토픽을 준비 중입니다
            </p>
            <p className="text-xs text-gaudia-text3 mt-1">
              경기 시작 전 토픽이 열립니다
            </p>
          </div>
        )}

        <div className="space-y-3">
          {topicList.map(topic => (
            <TopicCard key={topic.id} topic={topic} userId={user?.id} />
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

// ── 마감 시간 텍스트 계산
function getDeadlineText(closesAt: string | null) {
  if (!closesAt) return null
  const now = new Date()
  const closes = new Date(closesAt)
  const diffMs = closes.getTime() - now.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)

  if (diffMs < 0) return { text: '🔒 예측 마감', color: '#9ca3af' }
  if (diffMin < 60) return { text: `⏰ ${diffMin}분 후 마감`, color: '#ef4444' }
  if (diffHour < 24) return { text: `⏰ ${diffHour}시간 후 마감`, color: '#f97316' }
  return {
    text: `⏰ ${closes.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })} 마감`,
    color: '#9ca3af',
  }
}

// ── 토픽 카드 컴포넌트
function TopicCard({
  topic,
  userId,
}: {
  topic: TopicOdds
  userId?: string
}) {
  const deadline = getDeadlineText(topic.closes_at ?? null)

  return (
    <div className="bg-white rounded-2xl border border-cream-3
                    shadow-sm overflow-hidden
                    hover:border-gold-border hover:shadow-md
                    transition-all duration-200">
      {/* 카드 상단 */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-gaudia-red
                           bg-red-50 border border-red-100
                           rounded-full px-2 py-0.5">
            {topic.sport_icon} LIVE
          </span>
          <span className="text-xs text-gaudia-text3">
            {topic.participant_count.toLocaleString()}명 참여
          </span>
        </div>
        <h3 className="text-sm font-bold text-gaudia-text leading-snug">
          {topic.title_ko}
        </h3>
        {/* 마감 시간 표시 */}
        {deadline && (
          <p className="text-xs mt-1" style={{ color: deadline.color }}>
            {deadline.text}
          </p>
        )}
      </div>

      {/* 예측 바 */}
      <div className="px-4 pb-3">
        <div className="flex justify-between text-xs font-mono
                        font-bold mb-1.5">
          <span className="text-gaudia-green">O {topic.yes_pct}%</span>
          <span className="text-gaudia-red">X {topic.no_pct}%</span>
        </div>
        <div className="h-2 bg-cream-2 rounded-full overflow-hidden flex">
          <div
            className="bg-gaudia-green h-full rounded-l-full transition-all"
            style={{ width: `${topic.yes_pct}%` }}
          />
          <div
            className="bg-gaudia-red h-full rounded-r-full transition-all"
            style={{ width: `${topic.no_pct}%` }}
          />
        </div>
      </div>

      {/* 예측 버튼 */}
      <PredictButtons topicId={topic.id} userId={userId} />
    </div>
  )
}