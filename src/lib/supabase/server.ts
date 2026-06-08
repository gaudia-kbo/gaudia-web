import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

function createSupabaseServerClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  response?: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (response) {
              response.cookies.set(name, value, options)
              return
            }

            try {
              cookieStore.set(name, value, options)
            } catch {
              // 서버 컴포넌트에서 쿠키 설정 시 무시
            }
          })
        },
      },
    }
  )
}

// 서버 컴포넌트 / 서버 액션에서 사용하는 Supabase 클라이언트
export async function createClient() {
  const cookieStore = await cookies()
  return createSupabaseServerClient(cookieStore)
}

// Route Handler에서 redirect 응답에 세션 쿠키를 포함할 때 사용
export async function createRouteHandlerClient(response: NextResponse) {
  const cookieStore = await cookies()
  return createSupabaseServerClient(cookieStore, response)
}
