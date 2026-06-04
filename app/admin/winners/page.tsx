"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Gift,
  Save,
  Trophy,
  User,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type WinnerStatus = "pending" | "completed" | "hold";

type AdminWinner = {
  id: string;
  prize_id: string;
  prize_title: string;
  profile_id: string;
  prize_entry_id: string;
  winner_nickname: string | null;
  selected_by: string | null;
  selected_at: string;
  status: WinnerStatus;
  admin_memo: string | null;
  created_at: string;
};

const statusLabels: Record<WinnerStatus, string> = {
  pending: "지급 전",
  completed: "지급 완료",
  hold: "지급 보류",
};

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<AdminWinner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [savingWinnerId, setSavingWinnerId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | WinnerStatus>("all");

  useEffect(() => {
    loadWinners();
  }, []);

  async function loadWinners() {
    setIsLoading(true);

    const { data, error } = await supabase.rpc("get_admin_winners");

    if (error) {
      console.error("관리자 당첨 내역 조회 실패:", error.message);

      if (error.message.includes("not allowed")) {
        setErrorMessage("관리자 권한이 필요해요.");
      } else {
        setErrorMessage("당첨 내역을 불러오지 못했어요.");
      }

      setWinners([]);
      setIsLoading(false);
      return;
    }

    setErrorMessage("");
    setWinners((data ?? []) as AdminWinner[]);
    setIsLoading(false);
  }

  async function handleUpdateWinnerStatus(
    winnerId: string,
    nextStatus: WinnerStatus,
    nextMemo: string
  ) {
    setSavingWinnerId(winnerId);

    const { data, error } = await supabase.rpc("update_admin_winner_status", {
      target_winner_id: winnerId,
      next_status: nextStatus,
      next_admin_memo: nextMemo || null,
    });

    if (error) {
      console.error("당첨자 지급 상태 변경 실패:", error.message);

      if (error.message.includes("not allowed")) {
        alert("관리자 권한이 필요해요.");
      } else if (error.message.includes("invalid status")) {
        alert("올바르지 않은 지급 상태예요.");
      } else {
        alert("지급 상태 저장에 실패했어요.");
      }

      setSavingWinnerId(null);
      return;
    }

    const updatedWinner = data as AdminWinner;

    setWinners((currentWinners) =>
      currentWinners.map((winner) =>
        winner.id === updatedWinner.id ? updatedWinner : winner
      )
    );

    setSavingWinnerId(null);
    alert("지급 상태가 저장됐어요.");
  }

  const pendingCount = winners.filter((winner) => winner.status === "pending").length;
  const completedCount = winners.filter((winner) => winner.status === "completed").length;
  const holdCount = winners.filter((winner) => winner.status === "hold").length;
  const filteredWinners =
      statusFilter === "all"
        ? winners
        : winners.filter((winner) => winner.status === statusFilter);


  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <header className="px-6 pt-6 pb-4 flex items-center gap-4">
          <Link
            href="/admin"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div>
            <p className="text-xs font-bold text-[#FF642A]">오늘복 운영</p>
            <h1 className="text-2xl font-black">당첨 내역</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Trophy size={26} />
              </div>

              <div>
                <p className="text-sm font-bold text-white/70">경품 당첨 관리</p>
                <h2 className="text-2xl font-black mt-1">
                  총 {winners.length}건
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <div className="rounded-[18px] bg-white/10 border border-white/15 p-3 text-center">
                <p className="text-xs font-bold text-white/65">지급 전</p>
                <p className="text-xl font-black mt-1">{pendingCount}</p>
              </div>

              <div className="rounded-[18px] bg-white/10 border border-white/15 p-3 text-center">
                <p className="text-xs font-bold text-white/65">완료</p>
                <p className="text-xl font-black mt-1">{completedCount}</p>
              </div>

              <div className="rounded-[18px] bg-white/10 border border-white/15 p-3 text-center">
                <p className="text-xs font-bold text-white/65">보류</p>
                <p className="text-xl font-black mt-1">{holdCount}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-4 gap-2">
              <FilterButton
                label="전체"
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              />
              <FilterButton
                label="지급 전"
                active={statusFilter === "pending"}
                onClick={() => setStatusFilter("pending")}
              />
              <FilterButton
                label="완료"
                active={statusFilter === "completed"}
                onClick={() => setStatusFilter("completed")}
              />
              <FilterButton
                label="보류"
                active={statusFilter === "hold"}
                onClick={() => setStatusFilter("hold")}
              />
            </section>

          {isLoading ? (
              <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
                <p className="font-black text-[#FF642A]">
                  당첨 내역을 불러오는 중...
                </p>
              </section>
            ) : errorMessage ? (
              <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-6 text-center">
                <div className="w-16 h-16 rounded-[24px] bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mx-auto mb-4">
                  <Trophy size={30} />
                </div>

                <h2 className="text-xl font-black text-[#3B2414]">
                  {errorMessage}
                </h2>

                <p className="text-sm leading-relaxed text-[#7E6658] mt-3">
                  이 페이지는 오늘복 운영자만 접근할 수 있어요.
                  관리자 권한이 있는 계정으로 로그인해주세요.
                </p>

                <Link
                  href="/"
                  className="mt-5 h-12 rounded-[18px] bg-[#FFF4DF] text-[#FF642A] font-black flex items-center justify-center active:scale-95 transition"
                >
                  홈으로 돌아가기
                </Link>
              </section>
            ) : filteredWinners.length === 0 ? (
              <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
                <p className="font-black text-[#3B2414]">
                  {winners.length === 0
                    ? "당첨 내역이 없어요"
                    : "해당 상태의 당첨 내역이 없어요"}
                </p>

                <p className="text-sm text-[#7E6658] mt-2">
                  {winners.length === 0
                    ? "아직 추첨된 당첨자가 없어요."
                    : "다른 지급 상태 필터를 선택해보세요."}
                </p>
              </section>
            ) : (
              <section className="space-y-3">
                {filteredWinners.map((winner) => (
                  <WinnerCard
                    key={winner.id}
                    winner={winner}
                    isSaving={savingWinnerId === winner.id}
                    onSave={handleUpdateWinnerStatus}
                  />
                ))}
              </section>
            )}

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              당첨자 지급 상태를 관리하는 화면이에요. 실제 상품권 지급 후
              상태를 “지급 완료”로 변경해두면 운영 관리가 쉬워져요.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

function WinnerCard({
  winner,
  isSaving,
  onSave,
}: {
  winner: AdminWinner;
  isSaving: boolean;
  onSave: (winnerId: string, status: WinnerStatus, memo: string) => void;
}) {
  const [status, setStatus] = useState<WinnerStatus>(winner.status);
  const [memo, setMemo] = useState(winner.admin_memo ?? "");

  return (
    <article className="rounded-[26px] bg-white border border-orange-100 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
            <Gift size={24} />
          </div>

          <div className="min-w-0">
            <h3 className="font-black text-lg leading-tight truncate">
              {winner.prize_title}
            </h3>

            <p className="text-sm text-[#7E6658] mt-1 flex items-center gap-1">
              <User size={14} />
              {winner.winner_nickname ?? "알 수 없는 회원"}
            </p>
          </div>
        </div>

        <StatusBadge status={winner.status} />
      </div>

      <div className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-3 flex items-center gap-2">
        <CalendarDays size={17} className="text-[#FF642A] shrink-0" />
        <p className="text-xs font-bold text-[#8A7567]">
          추첨일: {new Date(winner.selected_at).toLocaleString("ko-KR")}
        </p>
      </div>

      <Link
        href={`/admin/prizes/${winner.prize_id}`}
        className="h-12 rounded-[18px] bg-[#FFF4DF] border border-orange-100 text-[#FF642A] font-black flex items-center justify-center active:scale-95 transition"
      >
        경품 응모자 상세 보기
      </Link>

      <div className="space-y-2">
        <label className="text-xs font-black text-[#8A7567]">
          지급 상태
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as WinnerStatus)}
          className="w-full h-12 rounded-[18px] bg-[#FFF8EF] border border-orange-100 px-4 font-bold outline-none focus:border-[#FF642A]"
        >
          <option value="pending">지급 전</option>
          <option value="completed">지급 완료</option>
          <option value="hold">지급 보류</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-[#8A7567]">
          관리자 메모
        </label>

        <textarea
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="예: 5/15 CU 상품권 발송 완료"
          className="w-full min-h-[88px] rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-4 text-sm font-bold outline-none focus:border-[#FF642A] resize-none"
        />
      </div>

      <button
        onClick={() => onSave(winner.id, status, memo)}
        disabled={isSaving}
        className="w-full h-13 rounded-[20px] bg-[#FF642A] text-white font-black shadow-sm active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 py-4"
      >
        <Save size={19} />
        {isSaving ? "저장 중..." : "지급 상태 저장"}
      </button>
    </article>
  );
}

function StatusBadge({ status }: { status: WinnerStatus }) {
  const badgeClass =
    status === "completed"
      ? "bg-[#EAF7E6] text-[#2E7D32] border-green-100"
      : status === "hold"
      ? "bg-[#FFF4DF] text-[#B36B00] border-orange-100"
      : "bg-[#F3F0ED] text-[#7E6658] border-stone-200";

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${badgeClass}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-[16px] border text-xs font-black active:scale-95 transition ${
        active
          ? "bg-[#FF642A] border-[#FF642A] text-white shadow-sm"
          : "bg-white border-orange-100 text-[#8A7567]"
      }`}
    >
      {label}
    </button>
  );
}