"use client";

import { ESMatch } from "@/lib/entitysports";

interface MatchCardProps {
  match: ESMatch;
  hasTopic?: boolean;
  onPredict?: (matchId: string) => void;
}

const TEAM_KO: Record<string, string> = {
  Bears:   "두산 베어스",
  Heroes:  "키움 히어로즈",
  Giants:  "롯데 자이언츠",
  Eagles:  "한화 이글스",
  Dinos:   "NC 다이노스",
  Twins:   "LG 트윈스",
  Tigers:  "KIA 타이거즈",
  Lions:   "삼성 라이온즈",
  Landers: "SSG 랜더스",
  Wiz:     "KT 위즈",
};

function getTeamKo(tname: string): string {
  const key = Object.keys(TEAM_KO).find(k => tname.includes(k));
  return key ? TEAM_KO[key] : tname;
}

function getStatusInfo(match: ESMatch) {
  const s = match.status;
  const gs = String((match as any).gamestate_str ?? "");
  const inningNum = gs.match(/(\d+)/)?.[1] ?? "";

  if (s === 3 && gs.toLowerCase().includes("break"))
    return { label: inningNum ? `${inningNum}회 BREAK` : "BREAK", type: "break" as const };
  if (s === 3 && match.status_str === "live")
    return { label: inningNum ? `${inningNum}회 진행 중` : "진행 중", type: "live" as const };
  if (s === 2)
    return { label: "진행 중", type: "live" as const };
  if (s === 1)
    return { label: "예정", type: "scheduled" as const };
  return { label: "완료", type: "completed" as const };
}

function getStartTime(match: ESMatch): string {
  const raw = (match as any).datestart ?? match.date_start ?? "";
  if (!raw) return "";
  const timePart = raw.split(" ")[1]?.slice(0, 5) ?? "";
  if (!timePart) return "";
  const [h, m] = timePart.split(":").map(Number);
  const kstMin = h * 60 + m + 210;
  const kh = Math.floor(kstMin / 60) % 24;
  const km = kstMin % 60;
  return `${String(kh).padStart(2, "0")}:${String(km).padStart(2, "0")}`;
}

function getScore(match: ESMatch) {
  const result = (match as any).result ?? {};
  return { home: result.home ?? "-", away: result.away ?? "-" };
}

export default function MatchCard({ match, hasTopic = false, onPredict }: MatchCardProps) {
  const { home, away } = match.teams;
  const status = getStatusInfo(match);
  const startTime = getStartTime(match);
  const score = getScore(match);
  const venue = match.venue?.name ?? "";
  const isLive = status.type === "live" || status.type === "break";

  return (
    <div style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderLeft: isLive ? "3px solid #ef4444" : "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "14px 16px",
      fontFamily: "inherit",
    }}>
      {/* 상단: 뱃지 + 시간 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <StatusBadge type={status.type} label={status.label} />
        {startTime && (
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{startTime} 시작</span>
        )}
      </div>

      {/* 팀 + 스코어 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>{home.abbr}</span>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>{getTeamKo(home.tname)}</span>
        </div>
        <div style={{ width: "80px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          {isLive ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "26px", fontWeight: 500, color: "#111827", minWidth: "24px", textAlign: "center" }}>{score.home}</span>
              <span style={{ fontSize: "16px", color: "#d1d5db" }}>:</span>
              <span style={{ fontSize: "26px", fontWeight: 500, color: "#111827", minWidth: "24px", textAlign: "center" }}>{score.away}</span>
            </div>
          ) : (
            <span style={{ fontSize: "14px", color: "#d1d5db" }}>VS</span>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "18px", fontWeight: 500, color: "#111827" }}>{away.abbr}</span>
          <span style={{ fontSize: "11px", color: "#9ca3af" }}>{getTeamKo(away.tname)}</span>
        </div>
      </div>

      {/* 하단: 경기장 + 예측 버튼 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: "12px", paddingTop: "10px",
        borderTop: "1px solid #f3f4f6",
      }}>
        <span style={{ fontSize: "11px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px" }}>
          📍 {venue || "경기장 미정"}
        </span>
        {onPredict && status.type !== "completed" && (
          <button
            onClick={() => onPredict(String(match.mid))}
            style={{
              fontSize: "12px", fontWeight: 500,
              padding: "5px 14px", borderRadius: "99px",
              border: hasTopic ? "1px solid #B8860B" : "1px solid #e5e7eb",
              background: hasTopic ? "#FDF8EC" : "transparent",
              color: hasTopic ? "#B8860B" : "#9ca3af",
              cursor: "pointer",
            }}
          >
            {hasTopic ? "⚡ 예측하기" : "예측 준비 중"}
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ type, label }: { type: string; label: string }) {
  const styles: Record<string, React.CSSProperties> = {
    live:      { background: "#fef2f2", color: "#b91c1c" },
    break:     { background: "#fffbeb", color: "#b45309" },
    scheduled: { background: "#f9fafb", color: "#6b7280" },
    completed: { background: "#f9fafb", color: "#6b7280" },
  };
  const s = styles[type] ?? styles.scheduled;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      fontSize: "11px", fontWeight: 500,
      padding: "3px 10px", borderRadius: "99px",
      ...s,
    }}>
      {type === "live" && (
        <span style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "#ef4444", display: "inline-block",
          animation: "pulse 1.2s infinite",
        }} />
      )}
      {label}
    </span>
  );
}