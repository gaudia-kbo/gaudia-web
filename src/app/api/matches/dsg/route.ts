import { NextRequest, NextResponse } from "next/server";
import { dsgFetchTodayMatches, dsgFetchMatchesByDate, dsgFetchMatchDetail } from "@/lib/dsg";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "today";
  const date = req.nextUrl.searchParams.get("date") ?? "";
  const matchId = req.nextUrl.searchParams.get("match_id") ?? "";

  try {
    let data;
    if (type === "detail" && matchId) {
      data = await dsgFetchMatchDetail(matchId);
    } else if (type === "date" && date) {
      data = await dsgFetchMatchesByDate(date);
    } else {
      data = await dsgFetchTodayMatches();
    }

    return NextResponse.json({ ok: true, type, data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}