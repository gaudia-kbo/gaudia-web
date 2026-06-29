import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { birthYear } = await request.json()

  if (!birthYear || birthYear < 1900 || birthYear > 2099) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true })
  const supabase = await createRouteHandlerClient(response)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const currentYear = new Date().getFullYear()
  const age = currentYear - birthYear

  if (age < 19) {
    await supabase.from('users').delete().eq('id', user.id)
    await supabase.auth.signOut()
    return NextResponse.json({ blocked: true }, { status: 403 })
  }

  await supabase
    .from('users')
    .update({ birth_year: birthYear, is_adult_verified: true })
    .eq('id', user.id)

  return response
}