import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PointType } from '@/types/database'

export async function processPoint(
  userId: string,
  amount: number,
  type: PointType,
  description: string,
  referenceId?: string,
  supabaseClient?: SupabaseClient
) {
  const supabase = supabaseClient ?? createClient()

  const { data, error } = await supabase.rpc('process_point', {
    p_user_id:      userId,
    p_amount:       amount,
    p_type:         type,
    p_description:  description,
    p_reference_id: referenceId ?? null,
  })

  if (error) {
    console.error('포인트 처리 오류:', error)
    throw new Error(error.message)
  }

  return data
}

export async function grantSignupBonus(
  userId: string,
  supabaseClient?: SupabaseClient
) {
  return processPoint(
    userId,
    1000,
    'signup_bonus',
    'GAUDIA 가입을 환영합니다! 1000 포인트를 드립니다.',
    undefined,
    supabaseClient
  )
}

export async function grantDailyCheck(userId: string) {
  return processPoint(
    userId,
    300,
    'daily_check',
    '오늘도 GAUDIA에 방문해주셔서 감사합니다! 300 포인트를 드립니다.'
  )
}

export async function getPointBalance(userId: string): Promise<number> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('point_balance')
    .eq('id', userId)
    .single()

  if (error || !data) return 0
  return data.point_balance
}

export async function getPointHistory(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return []
  return data
}