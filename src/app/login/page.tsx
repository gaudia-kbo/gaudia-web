'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const supabase = createClient()

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'profile_nickname profile_image',
      },
    })
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">

      {/* 로고 */}
      <div className="text-center mb-10">
        <h1 className="font-logo text-5xl font-bold text-gold-DEFAULT mb-2">
          GAUDIA
        </h1>
        <p className="text-sm text-gaudia-text3">
          경기마다 쌓이는 즐거운 순간들
        </p>
      </div>

      {/* 카드 */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-cream-3
                      shadow-lg overflow-hidden">

        {/* 상단 배너 */}
        <div className="bg-gold-bg border-b border-gold-border px-6 py-5 text-center">
          <div className="text-3xl mb-2">⚾</div>
          <h2 className="text-lg font-bold text-gaudia-text">
            KBO 예측 참여하기
          </h2>
          <p className="text-xs text-gaudia-text3 mt-1">
            오늘의 경기를 예측하고 예측왕에 도전하세요!
          </p>
        </div>

        <div className="px-6 py-6">

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200
                            rounded-lg text-sm text-gaudia-red text-center">
              로그인 중 오류가 발생했습니다. 다시 시도해주세요.
            </div>
          )}

          {/* 카카오 로그인 버튼 */}
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3
                       bg-[#FEE500] hover:bg-[#F0D800]
                       text-[#3C1E1E] font-bold text-sm
                       py-3.5 rounded-xl transition-all duration-200
                       shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {/* 카카오 아이콘 */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fillRule="evenodd" clipRule="evenodd"
                d="M10 2C5.582 2 2 4.925 2 8.5c0 2.274 1.418 4.272 3.558 5.447L4.74 17.1a.25.25 0 00.362.277L9.2 14.97c.263.018.529.03.8.03 4.418 0 8-2.925 8-6.5S14.418 2 10 2z"
                fill="#3C1E1E"
              />
            </svg>
            카카오로 시작하기
          </button>

          {/* 안내 문구 */}
          <p className="text-xs text-gaudia-text3 text-center mt-4 leading-relaxed">
            가입 시 <span className="text-gold-DEFAULT font-bold">500 포인트</span> 즉시 지급!<br/>
            만 19세 이상만 이용 가능합니다
          </p>
        </div>
      </div>

      {/* 하단 법적 고지 */}
      <p className="mt-6 text-xs text-gaudia-text3 text-center leading-relaxed max-w-xs">
        GAUDIA는 비환금성 포인트 기반의 정보 예측 서비스입니다.<br/>
        도박·사행성 게임이 아닙니다.
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
