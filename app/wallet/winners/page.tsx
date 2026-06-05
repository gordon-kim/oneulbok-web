"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Gift,
  Home,
  Ticket,
  Trophy,
  User,
  Wallet,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import { getCurrentProfile } from "../../lib/auth";

type WinnerStatus = "pending" | "completed" | "hold";

type MyWinner = {
  id: string;
  prize_id: string;
  prize_title: string;
  profile_id: string;
  status: WinnerStatus;
  admin_memo: string | null;
  selected_at: string;
  created_at: string;
};

const statusLabels: Record<WinnerStatus, string> = {
  pending: "지급 전",
  completed: "지급 완료",
  hold: "지급 보류",
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WalletWinnersPage() {
  const [winners, setWinners] = useState<MyWinner[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | WinnerStatus>("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadMyWinners() {
      setIsLoading(true);
      setErrorMessage("");

      const profile = await getCurrentProfile();

      if (!profile) {
        setIsLoggedIn(false);
        setWinners([]);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);

      const { data, error } = await supabase
        .from("prize_winners")
        .select("id, prize_id, prize_title, profile_id, status, admin_memo, selected_at, created_at")
        .eq("profile_id", profile.id)
        .order("selected_at", { ascending: false });

      if (error) {
        console.error("내 당첨 내역 불러오기 실패:", error.message);
        setErrorMessage("당첨 내역을 불러오지 못했어요.");
        setWinners([]);
        setIsLoading(false);
        return;
      }

      setWinners((data ?? []) as MyWinner[]);
      setIsLoading(false);
    }

    loadMyWinners();
  }, []);

  const filteredWinners =
    statusFilter === "all"
      ? winners
      : winners.filter((winner) => winner.status === statusFilter);

  const pendingCount = winners.filter((winner) => winner.status === "pending").length;
  const completedCount = winners.filter((winner) => winner.status === "completed").length;
  const holdCount = winners.filter((winner) => winner.status === "hold").length;

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100 relative">
        <header className="px-6 pt-6 pb-4 flex items-center justify-between">
          <Link
            href="/wallet"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div className="text-center">
            <p className="text-xs font-bold text-[#FF642A]">내 복 확인</p>
            <h1 className="text-2xl font-black">당첨 내역</h1>
          </div>

          <div className="w-11 h-11 rounded-full bg-[#FFF4DF] border border-orange-100 shadow-sm flex items-center justify-center">
            <Trophy size={23} className="text-[#FF642A]" />
          </div>
        </header>

        <div className="px-5 pb-32 space-y-5">
          <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
            <p className="text-sm font-bold text-white/70">경품 당첨 기록</p>
            <h2 className="text-2xl font-black mt-1">
              내 당첨 내역 {winners.length}건
            </h2>
            <p className="text-sm leading-relaxed text-white/75 mt-3">
              내가 당첨된 경품과 지급 상태를 확인할 수 있어요.
            </p>
          </section>

          {isLoggedIn && winners.length > 0 && (
            <section className="grid grid-cols-4 gap-2">
              <FilterButton
                label={`전체 ${winners.length}`}
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              />
              <FilterButton
                label={`지급 전 ${pendingCount}`}
                active={statusFilter === "pending"}
                onClick={() => setStatusFilter("pending")}
              />
              <FilterButton
                label={`완료 ${completedCount}`}
                active={statusFilter === "completed"}
                onClick={() => setStatusFilter("completed")}
              />
              <FilterButton
                label={`보류 ${holdCount}`}
                active={statusFilter === "hold"}
                onClick={() => setStatusFilter("hold")}
              />
            </section>
          )}

          {isLoading ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#FF642A]">
                당첨 내역을 불러오는 중이에요...
              </p>
            </section>
          ) : !isLoggedIn ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#3B2414]">로그인이 필요해요</p>
              <p className="text-sm text-[#7E6658] mt-2">
                로그인하면 내 당첨 내역을 확인할 수 있어요.
              </p>

              <div className="mt-4 space-y-2">
                <Link
                  href="/login?next=/wallet/winners"
                  className="h-12 rounded-[18px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black flex items-center justify-center"
                >
                  로그인하고 당첨 내역 보기
                </Link>

                <Link
                  href="/wallet"
                  className="h-12 rounded-[18px] bg-[#FFF4DF] text-[#FF642A] font-black flex items-center justify-center"
                >
                  지갑으로 돌아가기
                </Link>
              </div>
            </section>
          ) : errorMessage ? (
            <section className="rounded-[24px] bg-red-50 border border-red-100 p-5">
              <p className="font-black text-red-600">{errorMessage}</p>
              <p className="text-sm text-red-500 mt-2">
                잠시 후 다시 시도해주세요.
              </p>
            </section>
          ) : filteredWinners.length === 0 ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#3B2414]">
                {winners.length === 0 ? "아직 당첨 내역이 없어요" : "해당 상태의 당첨 내역이 없어요"}
              </p>
              <p className="text-sm text-[#7E6658] mt-2">
                {winners.length === 0
                  ? "경품에 응모하고 당첨되면 이곳에서 확인할 수 있어요."
                  : "다른 지급 상태 필터를 선택해보세요."}
              </p>

              {winners.length === 0 && (
                <Link
                  href="/prizes"
                  className="mt-4 h-12 rounded-[18px] bg-[#FFF4DF] text-[#FF642A] font-black flex items-center justify-center"
                >
                  경품 보러 가기
                </Link>
              )}
            </section>
          ) : (
            <section className="space-y-3">
              {filteredWinners.map((winner) => (
                <WinnerCard key={winner.id} winner={winner} />
              ))}

              <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
                <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
                <p className="text-sm leading-relaxed text-[#6B4B38]">
                  당첨 경품은 운영자 확인 후 순차적으로 지급돼요. 지급 상태가
                  보류인 경우 운영 기준에 따라 확인이 필요할 수 있어요.
                </p>
              </section>

              <Link
                href="/wallet"
                className="w-full h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#FF642A] active:scale-95 transition flex items-center justify-center"
              >
                지갑으로 돌아가기
              </Link>
            </section>
          )}
        </div>

        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-orange-100 px-4 py-3 rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 gap-1">
            <BottomNav href="/" icon={<Home size={24} />} label="홈" />
            <BottomNav href="/scratch" icon={<Ticket size={24} />} label="복권" />
            <BottomNav href="/prizes" icon={<Gift size={24} />} label="경품함" />
            <BottomNav active href="/wallet" icon={<Wallet size={24} />} label="지갑" />
            <BottomNav href="/my" icon={<User size={24} />} label="내정보" />
          </div>
        </nav>
      </section>
    </main>
  );
}

function WinnerCard({ winner }: { winner: MyWinner }) {
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
              <CalendarDays size={14} />
              추첨일 {formatDateTime(winner.selected_at)}
            </p>
          </div>
        </div>

        <StatusBadge status={winner.status} />
      </div>

      <div className="rounded-[20px] bg-[#FFF8EF] border border-orange-100 p-4">
        <p className="text-xs font-black text-[#FF642A] mb-1">
          지급 안내
        </p>
        <p className="text-sm leading-relaxed text-[#6B4B38] whitespace-pre-wrap">
          {winner.admin_memo || getDefaultStatusMessage(winner.status)}
        </p>
      </div>
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

function getDefaultStatusMessage(status: WinnerStatus) {
  if (status === "completed") {
    return "경품 지급이 완료됐어요.";
  }

  if (status === "hold") {
    return "경품 지급 확인이 필요해요. 운영자 확인 후 상태가 변경될 수 있어요.";
  }

  return "운영자가 경품 지급을 확인하고 있어요.";
}

function BottomNav({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition active:scale-95 ${
        active ? "text-[#FF642A]" : "text-[#8D827B]"
      }`}
    >
      <div>{icon}</div>
      <span className="text-xs font-black">{label}</span>
    </Link>
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
      className={`min-h-11 rounded-[16px] border px-1 text-[11px] font-black active:scale-95 transition ${
        active
          ? "bg-[#FF642A] border-[#FF642A] text-white shadow-sm"
          : "bg-white border-orange-100 text-[#8A7567]"
      }`}
    >
      {label}
    </button>
  );
}