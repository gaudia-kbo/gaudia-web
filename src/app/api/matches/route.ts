import { NextRequest, NextResponse } from "next/server";
import {
  fetchKBOMatches,
  fetchTodayKBOMatches,
  fetchLiveKBOMatches,
  fetchRecentKBOResults,
} from "@/lib/entitysports";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "today";

  try {
    let matches;
    if (type === "live") {
      matches = await fetchLiveKBOMatches();
    } else if (type === "recent") {
      matches = await fetchRecentKBOResults();
    } else if (type === "all") {
      matches = await fetchKBOMatches();
    } else {
      // default: "today"
      matches = await fetchTodayKBOMatches();
    }

    return NextResponse.json({
      ok: true,
      count: matches.length,
      type,
      data: matches,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}