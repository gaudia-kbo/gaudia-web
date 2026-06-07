import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, nickname, point_balance, profile_image_url")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "유저 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ...data });
}