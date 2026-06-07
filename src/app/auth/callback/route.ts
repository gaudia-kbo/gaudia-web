import { createRouteHandlerClient } from '@/lib/supabase/server'
import { grantSignupBonus } from '@/lib/points'
import { NextResponse } from 'next/server'

// 카카오 로그인 후 리다이렉트되는 콜백 URL
// Supabase가 code를 session으로 교환하고 신규 유저면 500PT 지급
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const redirectResponse = NextResponse.redirect(`${origin}${next}`)
  const supabase = await createRouteHandlerClient(redirectResponse)

  // code → session 교환
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  // supabase-js 2.91+ 에서 SIGNED_IN 이벤트가 지연되어 쿠키가 늦게 기록될 수 있음
  await new Promise((resolve) => setTimeout(resolve, 0))

  if (error || !data.user) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const user = data.user

  // users 테이블에 해당 유저가 있는지 확인
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  // 신규 유저면 프로필 생성 + 500PT 지급
  if (!existingUser) {
    const kakaoNickname =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      `야구팬${Math.floor(Math.random() * 9000) + 1000}`

    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        nickname: kakaoNickname.slice(0, 12),
        avatar_url: user.user_metadata?.avatar_url ?? null,
        country_code: 'KR',
        locale: 'ko',
        point_balance: 0,
      })

    if (insertError) {
      console.error('유저 생성 오류:', insertError)
    } else {
      try {
        await grantSignupBonus(user.id, supabase)
      } catch (e) {
        console.error('가입 포인트 지급 오류:', e)
      }
    }
  }

  return redirectResponse
}
