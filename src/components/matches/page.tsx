"use client";

import { useEffect, useState } from "react";
import MatchCard from "@/components/matches/MatchCard";
import { ESMatch } from "@/lib/entitysports";

type TabType = "today" | "live" | "recent";

const TABS: { key: TabType; label: string }[] = [
  { key: "today", label: "오늘 경기" },
  { key: "live",  label: "실시간" },
  { key: "recent", label: "최근 결과" },
];

export default function MatchesPage() {
  const [tab, setTab] = useState<TabType>("today");
  const [matches, setMatches] = useState<ESMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-xl mx-auto px-4 pt-6 pb-20">

        {/* 헤더 */}
        <div className="mb-5">
          <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
            KBO 경기
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric", month: "long", day: "numeric", weekday: "short",
            })}
          </p>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 mb-5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`
                flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors
                ${tab === t.key
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 컨텐츠 */}
        {loading && <MatchListSkeleton />}

        {!loading && error && (
          <div className="text-center py-16 text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">
              {tab === "live" ? "현재 진행 중인 경기가 없습니다." :
               tab === "today" ? "오늘 예정된 경기가 없습니다." :
               "최근 경기 결과가 없습니다."}
            </p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="flex flex-col gap-3">
            {matches.map(m => (
              <MatchCard
                key={m.mid}
                match={m}
                onPredict={(id) => {
                  // TODO: 예측 플로우 연결
                  console.log("예측 클릭:", id);
                }}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

function MatchListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 h-36 animate-pulse"
        />
      ))}
    </div>
  );
}