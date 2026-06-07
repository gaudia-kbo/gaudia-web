const BASE_URL = "https://baseballapi.entitysport.com";
const TOKEN = process.env.ENTITY_SPORTS_TOKEN ?? "ef1b7755821bcd4a82d8fc336df96e34";
const KBO_CID = "51";

export interface ESMatch {
  mid: string | number;  // API에서 숫자로 올 수 있음
  title: string;
  status: number;
  status_str: string;
  date_start: string;   // 혹시 몰라 유지
  datestart: string;    // 실제 API 필드명
  date_start_ist: string;
  dateend: string;
  teams: {
    home: { team_id: string; tname: string; abbr: string; scores?: string };
    away: { team_id: string; tname: string; abbr: string; scores?: string };
  };
  venue?: { name: string; location: string };
  competition?: { cid: string; cname: string };
  inning?: any[];
}

export interface ESMatchDetail extends ESMatch {
  players?: { home: any[]; away: any[] };
}

// status 코드
// 1 = scheduled, 2 = live, 3 = completed, 4 = postponed, 5 = cancelled

// 전체 경기 조회 (페이지네이션 순회)
async function fetchAllMatches(status?: number): Promise<ESMatch[]> {
  const allItems: ESMatch[] = [];
  let page = 1;
  const PER_PAGE = 100;

  while (true) {
    const params = new URLSearchParams({
      token: TOKEN,
      paged: String(page),
      per_page: String(PER_PAGE),
    });
    if (status !== undefined) params.append("status", String(status));

    const res = await fetch(`${BASE_URL}/matches?${params}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`EntitySports matches error: ${res.status}`);
    const data = await res.json();

    const items: ESMatch[] = (data.response?.items ?? []).map((m: any) => ({
      ...m,
      mid: String(m.mid), // 숫자 → 문자열 강제 변환
    }));
    allItems.push(...items);

    const totalPages: number = data.response?.total_pages ?? 1;
    if (page >= totalPages) break;
    page++;
  }

  return allItems;
}

// KBO 경기만 필터링 (cid=51, 문자열/숫자 모두 대응)
export async function fetchKBOMatches(status?: number): Promise<ESMatch[]> {
  const all = await fetchAllMatches(status);
  return all.filter(m => String(m.competition?.cid) === KBO_CID);
}

// 오늘 KBO 경기 (예정=1 + 라이브=3, 날짜 필터)
export async function fetchTodayKBOMatches(): Promise<ESMatch[]> {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = kst.toISOString().split("T")[0]; // "YYYY-MM-DD"

  const [scheduled, live] = await Promise.all([
    fetchKBOMatches(1), // 예정
    fetchKBOMatches(3), // 라이브 (Entity Sports 실제 live = status 3)
  ]);

  return [...scheduled, ...live].filter(m =>
    (m.datestart ?? m.date_start)?.startsWith(today)
  );
}

// 라이브 KBO 경기 (status=3이 실제 live)
export async function fetchLiveKBOMatches(): Promise<ESMatch[]> {
  return fetchKBOMatches(3);
}

// 완료된 KBO 경기 — status 없이 전체에서 completed만 필터
export async function fetchRecentKBOResults(): Promise<ESMatch[]> {
  const all = await fetchKBOMatches();
  return all.filter(m => m.status_str === "completed" || m.status_str === "result");
}

// 특정 경기 상세
export async function fetchMatchDetail(matchId: string): Promise<ESMatchDetail> {
  const res = await fetch(
    `${BASE_URL}/matches/${matchId}/info?token=${TOKEN}`,
    { next: { revalidate: 10 } }
  );
  if (!res.ok) throw new Error(`EntitySports match detail error: ${res.status}`);
  const data = await res.json();
  return data.response;
}