import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const redirectResponse = NextResponse.redirect(`${origin}${next}`)
  const supabase = await createRouteHandlerClient(redirectResponse)

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  await new Promise((resolve) => setTimeout(resolve, 0))

  if (error || !data.user) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const user = data.user

  const { data: existingUser } = await supabase
    .from('users')
    .select('id, is_adult_verified')
    .eq('id', user.id)
    .single()

  if (!existingUser) {
    // 신규 유저: 프로필 생성 후 onboarding으로
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
      return NextResponse.redirect(`${origin}/login?error=user_create_failed`)
    }

    return NextResponse.redirect(`${origin}/onboarding`)
  }

  if (!existingUser.is_adult_verified) {
    // 기존 유저인데 연령 미확인 상태
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  return redirectResponse
}