const BASE_URL = "https://dsg-api.com/api/baseball";
const AUTHKEY = process.env.DSG_AUTHKEY ?? "1KLE3GOZ46ePAMToDXWu8BmzwVIvsYfgN75";
const PASSWD  = process.env.DSG_PASSWORD ?? "@2t3Bw(rsY";

function baseParams(extra: Record<string, string> = {}) {
  return new URLSearchParams({
    authkey: AUTHKEY,
    passwd:  PASSWD,
    ftype:   "json",
    ...extra,
  });
}

function kstToday(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

// 오늘 경기 목록
export async function dsgFetchTodayMatches() {
  const params = baseParams({ date: kstToday() });
  const res = await fetch(`${BASE_URL}/get_matches_day/?${params}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`DSG get_matches_day error: ${res.status}`);
  const data = await res.json();
  return data;
}

// 특정 날짜 경기 목록
export async function dsgFetchMatchesByDate(date: string) {
  const params = baseParams({ date });
  const res = await fetch(`${BASE_URL}/get_matches_day/?${params}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`DSG get_matches_day error: ${res.status}`);
  return res.json();
}

// 특정 경기 상세
export async function dsgFetchMatchDetail(matchId: string) {
  const params = baseParams({ match_id: matchId });
  const res = await fetch(`${BASE_URL}/get_matches/?${params}`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) throw new Error(`DSG get_matches error: ${res.status}`);
  return res.json();
}