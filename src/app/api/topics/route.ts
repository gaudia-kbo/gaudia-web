import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get("game_id");
  const externalId = req.nextUrl.searchParams.get("external_id");

  const supabase = await createClient();

  try {
    let query = supabase
      .from("topics")
      .select(`
        id, category, title_ko, title_en,
        option_yes_ko, option_no_ko,
        status, closes_at, result,
        total_yes_pts, total_no_pts, participant_count,
        game_id,
        games (
          id, external_id, home_team, away_team,
          stadium, game_date, status
        )
      `)
      .eq("country_code", "KR")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (gameId) {
      query = query.eq("game_id", gameId);
    }
    if (externalId) {
      query = query.eq("games.external_id", externalId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ ok: true, count: data.length, data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}