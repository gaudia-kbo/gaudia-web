"use client";

import { useEffect, useState, useCallback } from "react";
import MatchCard from "@/components/matches/MatchCard";
import PredictModal from "@/components/predictions/PredictModal";
import { ESMatch } from "@/lib/entitysports";
import { createClient } from "@/lib/supabase/client";

type TabType = "today" | "live" | "recent";

const TABS: { key: TabType; label: string }[] = [
  { key: "today",  label: "오늘 경기" },
  { key: "live",   label: "실시간" },
  { key: "recent", label: "최근 결과" },
];

interface Topic {
  id: string;
  title_ko: string;
  option_yes_ko: string;
  option_no_ko: string;
  total_yes_pts: number;
  total_no_pts: number;
  participant_count: number;
  games: { external_id: string };
}

export default function MatchesPage() {
  const [tab, setTab] = useState<TabType>("today");
  const [matches, setMatches] = useState<ESMatch[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);

  // 모달 상태
  const [modalTopic, setModalTopic] = useState<Topic | null>(null);
  const [modalMatchTitle, setModalMatchTitle] = useState("");

  // 경기 목록 조회
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/matches?type=${tab}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setMatches(data.data);
        else setError(data.error ?? "데이터를 불러오지 못했습니다.");
      })
      .catch(() => setError("네트워크 오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, [tab]);

  // 토픽 목록 조회
  useEffect(() => {
    fetch("/api/topics")
      .then(r => r.json())
      .then(data => {
        if (data.ok) setTopics(data.data);
        setTopicsLoaded(true);
      })
      .catch(() => setTopicsLoaded(true));
  }, []);

  // 유저 포인트 조회 (Supabase 클라이언트 직접 사용)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("users")
        .select("point_balance")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setUserPoints(data.point_balance);
        });
    });
  }, []);

  // external_id로 토픽 찾기
  const getTopicForMatch = useCallback((externalId: string) => {
    return topics.find(t => String(t.games?.external_id) === String(externalId)) ?? null;
  }, [topics]);

  // 예측하기 버튼 클릭
  const handlePredict = useCallback((matchId: string) => {
    const match = matches.find(m => String(m.mid) === String(matchId));
    if (!match) return;
    const topic = getTopicForMatch(String(matchId));
    if (!topic) {
      alert("이 경기의 예측 토픽이 아직 준비되지 않았습니다.");
      return;
    }
    const title = `${match.teams.home.tname} vs ${match.teams.away.tname}`;
    setModalMatchTitle(title);
    setModalTopic(topic);
  }, [matches, getTopicForMatch]);

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F2" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#1C1712" }}>KBO 경기</h1>
          <p style={{ fontSize: "13px", color: "#8A8078", marginTop: "2px" }}>
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric", weekday: "short",
            })}
          </p>
        </div>

        {/* 탭 */}
        <div style={{
          display: "flex", gap: "4px", marginBottom: "20px",
          background: "#EDE8DF", padding: "4px", borderRadius: "12px",
        }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, fontSize: "13px", fontWeight: 500,
                padding: "7px 0", borderRadius: "9px", border: "none",
                cursor: "pointer", transition: "all 0.15s",
                background: tab === t.key ? "white" : "transparent",
                color: tab === t.key ? "#1C1712" : "#8A8078",
                boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 컨텐츠 */}
        {loading && <MatchListSkeleton />}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: "64px 0", fontSize: "14px", color: "#B83232" }}>
            {error}
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p style={{ fontSize: "14px", color: "#8A8078" }}>
              {tab === "live"   ? "현재 진행 중인 경기가 없습니다." :
               tab === "today"  ? "오늘 예정된 경기가 없습니다." :
               "최근 경기 결과가 없습니다."}
            </p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {matches.map(m => (
              <MatchCard
                key={String(m.mid)}
                match={m}
                hasTopic={topicsLoaded && !!getTopicForMatch(String(m.mid))}
                onPredict={handlePredict}
              />
            ))}
          </div>
        )}

      </div>

      {/* 예측 모달 */}
      {modalTopic && (
        <PredictModal
          topic={modalTopic}
          matchTitle={modalMatchTitle}
          userPoints={userPoints}
          onClose={() => setModalTopic(null)}
          onSuccess={(newBalance) => {
            setUserPoints(newBalance);
            setModalTopic(null);
          }}
        />
      )}
    </main>
  );
}

function MatchListSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          borderRadius: "12px", border: "1px solid #e5e7eb",
          background: "#f9fafb", height: "140px",
          animation: "pulse 1.5s infinite",
        }} />
      ))}
    </div>
  );
}