import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PREDICTION_COST = 100; // -100P

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // 로그인 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await req.json();
  const { topic_id, choice } = body; // choice: "yes" | "no"

  if (!topic_id || !choice || !["yes", "no"].includes(choice)) {
    return NextResponse.json({ ok: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    // 1. 토픽 유효성 확인
    const { data: topic, error: topicError } = await supabase
      .from("topics")
      .select("id, status, closes_at")
      .eq("id", topic_id)
      .single();

    if (topicError || !topic) {
      return NextResponse.json({ ok: false, error: "토픽을 찾을 수 없습니다." }, { status: 404 });
    }
    if (topic.status !== "active") {
      return NextResponse.json({ ok: false, error: "마감된 예측입니다." }, { status: 400 });
    }
    if (new Date(topic.closes_at) < new Date()) {
      return NextResponse.json({ ok: false, error: "예측 마감 시간이 지났습니다." }, { status: 400 });
    }

    // 2. 중복 예측 확인
    const { data: existing } = await supabase
      .from("predictions")
      .select("id")
      .eq("user_id", user.id)
      .eq("topic_id", topic_id)
      .single();

    if (existing) {
      return NextResponse.json({ ok: false, error: "이미 예측에 참여했습니다." }, { status: 400 });
    }

    // 3. 유저 포인트 확인
    const { data: userRow, error: userError } = await supabase
      .from("users")
      .select("id, point_balance")
      .eq("id", user.id)
      .single();

    if (userError || !userRow) {
      return NextResponse.json({ ok: false, error: "유저 정보를 찾을 수 없습니다." }, { status: 404 });
    }
    if (userRow.point_balance < PREDICTION_COST) {
      return NextResponse.json({ ok: false, error: "포인트가 부족합니다." }, { status: 400 });
    }

    // 4. predictions INSERT
    const { data: prediction, error: predError } = await supabase
      .from("predictions")
      .insert({
        user_id: user.id,
        topic_id,
        choice,
        points_bet: PREDICTION_COST,
        is_settled: false,
      })
      .select()
      .single();

    if (predError) throw predError;

    // 5. 포인트 차감
    const newBalance = userRow.point_balance - PREDICTION_COST;
    const { error: pointError } = await supabase
      .from("users")
      .update({ point_balance: newBalance })
      .eq("id", user.id);

    if (pointError) throw pointError;

    // 6. point_transactions INSERT
    await supabase.from("point_transactions").insert({
      user_id: user.id,
      amount: -PREDICTION_COST,
      balance_after: newBalance,
      type: "prediction_bet",
      reference_id: prediction.id,
      description: `예측 참여`,
    });

    // 7. topics 참여자 수 + 포인트 집계 업데이트
    await supabase.rpc("increment_topic_stats", {
      p_topic_id: topic_id,
      p_choice: choice,
      p_points: PREDICTION_COST,
    }).then(() => {}); // RPC 없으면 무시

    return NextResponse.json({
      ok: true,
      message: "예측이 완료됐습니다!",
      points_used: PREDICTION_COST,
      balance_after: newBalance,
      prediction_id: prediction.id,
    });

  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}