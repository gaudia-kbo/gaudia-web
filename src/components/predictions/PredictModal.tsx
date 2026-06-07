"use client";

import { useState } from "react";

interface Topic {
  id: string;
  title_ko: string;
  option_yes_ko: string;
  option_no_ko: string;
  total_yes_pts: number;
  total_no_pts: number;
  participant_count: number;
}

interface PredictModalProps {
  topic: Topic;
  matchTitle: string;
  userPoints: number;
  onClose: () => void;
  onSuccess: (balanceAfter: number) => void;
}

const COST = 100;

export default function PredictModal({
  topic, matchTitle, userPoints, onClose, onSuccess
}: PredictModalProps) {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const totalPts = (topic.total_yes_pts ?? 0) + (topic.total_no_pts ?? 0);
  const yesPct = totalPts > 0 ? Math.round((topic.total_yes_pts / totalPts) * 100) : 50;
  const noPct = 100 - yesPct;

  const handleSubmit = async () => {
    if (!choice) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic_id: topic.id, choice }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "오류가 발생했습니다.");
      } else {
        setDone(true);
        onSuccess(data.balance_after);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 배경 오버레이
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      {/* 모달 바텀시트 */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "20px 20px 0 0",
          width: "100%", maxWidth: "480px",
          padding: "24px 20px 36px",
          fontFamily: "inherit",
        }}
      >
        {/* 핸들 */}
        <div style={{
          width: "36px", height: "4px",
          background: "#e5e7eb", borderRadius: "99px",
          margin: "0 auto 20px",
        }} />

        {done ? (
          /* 완료 화면 */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>
              예측 완료!
            </p>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
              {choice === "yes" ? topic.option_yes_ko : topic.option_no_ko} 선택
            </p>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "28px" }}>
              -{COST}P 차감됐습니다
            </p>
            <button onClick={onClose} style={{
              width: "100%", padding: "14px",
              background: "#B8860B", color: "white",
              border: "none", borderRadius: "12px",
              fontSize: "15px", fontWeight: 600, cursor: "pointer",
            }}>
              확인
            </button>
          </div>
        ) : (
          <>
            {/* 헤더 */}
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>{matchTitle}</p>
            <p style={{ fontSize: "17px", fontWeight: 600, color: "#111827", marginBottom: "20px", lineHeight: 1.4 }}>
              {topic.title_ko}
            </p>

            {/* 현재 여론 바 */}
            {totalPts > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>현재 여론</span>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>{topic.participant_count}명 참여</span>
                </div>
                <div style={{ display: "flex", borderRadius: "99px", overflow: "hidden", height: "8px", background: "#f3f4f6" }}>
                  <div style={{ width: `${yesPct}%`, background: "#2A5FA8", transition: "width 0.3s" }} />
                  <div style={{ width: `${noPct}%`, background: "#B83232" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#2A5FA8", fontWeight: 500 }}>{topic.option_yes_ko} {yesPct}%</span>
                  <span style={{ fontSize: "11px", color: "#B83232", fontWeight: 500 }}>{noPct}% {topic.option_no_ko}</span>
                </div>
              </div>
            )}

            {/* 선택 버튼 */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {(["yes", "no"] as const).map(c => {
                const label = c === "yes" ? topic.option_yes_ko : topic.option_no_ko;
                const selected = choice === c;
                const color = c === "yes" ? "#2A5FA8" : "#B83232";
                return (
                  <button
                    key={c}
                    onClick={() => setChoice(c)}
                    style={{
                      flex: 1, padding: "14px 8px",
                      border: `2px solid ${selected ? color : "#e5e7eb"}`,
                      borderRadius: "12px",
                      background: selected ? `${color}10` : "white",
                      color: selected ? color : "#6b7280",
                      fontSize: "15px", fontWeight: selected ? 700 : 400,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* 포인트 안내 */}
            <div style={{
              background: "#FDF8EC", border: "1px solid #DFC06A",
              borderRadius: "10px", padding: "12px 14px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "16px",
            }}>
              <span style={{ fontSize: "13px", color: "#5A5248" }}>예측 비용</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#B8860B" }}>-{COST}P</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: "20px", padding: "0 2px",
            }}>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>보유 포인트</span>
              <span style={{ fontSize: "12px", color: userPoints < COST ? "#B83232" : "#6b7280" }}>
                {userPoints.toLocaleString()}P → {(userPoints - COST).toLocaleString()}P
              </span>
            </div>

            {/* 에러 */}
            {error && (
              <p style={{ fontSize: "13px", color: "#B83232", marginBottom: "12px", textAlign: "center" }}>
                {error}
              </p>
            )}

            {/* 제출 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={!choice || loading || userPoints < COST}
              style={{
                width: "100%", padding: "15px",
                background: (!choice || loading || userPoints < COST) ? "#e5e7eb" : "#B8860B",
                color: (!choice || loading || userPoints < COST) ? "#9ca3af" : "white",
                border: "none", borderRadius: "12px",
                fontSize: "15px", fontWeight: 700,
                cursor: (!choice || loading || userPoints < COST) ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              {loading ? "처리 중..." :
               userPoints < COST ? "포인트 부족" :
               !choice ? "선택해주세요" : "예측하기"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}