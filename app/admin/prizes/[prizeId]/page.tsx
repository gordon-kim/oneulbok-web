"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Gift,
  Ticket,
  Trophy,
  User,
  Users,
} from "lucide-react";

import { supabase } from "../../../lib/supabase";

type AdminPrizeEntry = {
  id: string;
  profile_id: string;
  prize_id: string;
  prize_title: string;
  ticket_cost: number;
  created_at: string;
  nickname: string | null;
};

type AdminPrizeWinner = {
  id: string;
  prize_id: string;
  prize_title: string;
  profile_id: string;
  prize_entry_id: string;
  winner_nickname: string | null;
  selected_by: string | null;
  selected_at: string;
};

export default function AdminPrizeDetailPage() {
  const params = useParams();
  const prizeId = String(params.prizeId || "");

  const [entries, setEntries] = useState<AdminPrizeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [winner, setWinner] = useState<AdminPrizeWinner | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    async function loadPrizeEntries() {
      if (!prizeId) {
        setErrorMessage("경품 정보를 찾을 수 없어요.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_admin_prize_entries_by_prize",
        {
          target_prize_id: prizeId,
        }
      );

      if (error) {
        console.error("경품별 응모자 조회 실패:", error.message);

        if (error.message.includes("not allowed")) {
          setErrorMessage("관리자 권한이 필요해요.");
        } else {
          setErrorMessage("경품별 응모자 목록을 불러오지 못했어요.");
        }

        setEntries([]);
        setIsLoading(false);
        return;
      }

      setErrorMessage("");
      setEntries((data ?? []) as AdminPrizeEntry[]);

      const { data: winnerData, error: winnerError } = await supabase.rpc(
        "get_admin_prize_winner",
        {
          target_prize_id: prizeId,
        }
      );

      if (winnerError) {
        console.error("기존 당첨자 조회 실패:", winnerError.message);
        setWinner(null);
      } else {
        setWinner((winnerData ?? null) as AdminPrizeWinner | null);
      }

      setIsLoading(false);
    }

    loadPrizeEntries();
  }, [prizeId]);

    async function handleDrawWinner() {
      if (!prizeId) {
        alert("경품 정보를 찾을 수 없어요.");
        return;
      }

      if (entries.length === 0) {
        alert("응모자가 없어서 추첨할 수 없어요.");
        return;
      }

      if (winner) {
        alert("이미 당첨자가 추첨된 경품이에요.");
        return;
      }

      const isConfirmed = window.confirm(
        "이 경품의 당첨자를 랜덤으로 추첨할까요?\n추첨 후에는 같은 경품에 대해 다시 추첨할 수 없어요."
      );

      if (!isConfirmed) {
        return;
      }

      setIsDrawing(true);

      const { data, error } = await supabase.rpc("draw_admin_prize_winner", {
        target_prize_id: prizeId,
      });

      if (error) {
        console.error("당첨자 추첨 실패:", error.message);

        if (error.message.includes("no entries")) {
          alert("응모자가 없어서 추첨할 수 없어요.");
        } else if (error.message.includes("not allowed")) {
          alert("관리자 권한이 필요해요.");
        } else {
          alert("당첨자 추첨에 실패했어요.");
        }

        setIsDrawing(false);
        return;
      }

      const pickedWinner = data?.winner ?? null;

      setWinner(pickedWinner as AdminPrizeWinner | null);
      setIsDrawing(false);

      alert(
        data?.alreadyDrawn
          ? "이미 추첨된 당첨자를 불러왔어요."
          : "당첨자 추첨이 완료됐어요."
      );
    }

  const prizeTitle = useMemo(() => {
    return entries[0]?.prize_title ?? prizeId;
  }, [entries, prizeId]);

  const totalTicketCost = entries.reduce(
    (sum, entry) => sum + (entry.ticket_cost ?? 0),
    0
  );

  const participantCount = new Set(entries.map((entry) => entry.profile_id))
    .size;

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <header className="px-6 pt-6 pb-4 flex items-center gap-4">
          <Link
            href="/admin/prizes"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#FF642A]">경품별 응모자</p>
            <h1 className="text-2xl font-black truncate">{prizeTitle}</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Trophy size={26} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-white/70">응모자 상세</p>
                <h2 className="text-2xl font-black mt-1 truncate">
                  {prizeTitle}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <div className="rounded-[18px] bg-white/10 border border-white/15 p-3 text-center">
                <p className="text-xs font-bold text-white/65">응모</p>
                <p className="text-xl font-black mt-1">{entries.length}건</p>
              </div>

              <div className="rounded-[18px] bg-white/10 border border-white/15 p-3 text-center">
                <p className="text-xs font-bold text-white/65">응모권</p>
                <p className="text-xl font-black mt-1">{totalTicketCost}장</p>
              </div>

              <div className="rounded-[18px] bg-white/10 border border-white/15 p-3 text-center">
                <p className="text-xs font-bold text-white/65">참여자</p>
                <p className="text-xl font-black mt-1">{participantCount}명</p>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={21} className="text-[#FF642A]" />
                <h3 className="text-lg font-black">당첨자 추첨</h3>
              </div>

              {winner ? (
                <div className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
                  <p className="text-sm font-bold text-[#8A7567]">당첨자</p>
                  <p className="text-2xl font-black text-[#3B2414] mt-1">
                    {winner.winner_nickname ?? "알 수 없는 회원"}
                  </p>
                  <p className="text-xs text-[#8A7567] mt-2">
                    추첨일: {new Date(winner.selected_at).toLocaleString("ko-KR")}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-[#7E6658] mb-4">
                    이 경품에 응모한 회원 중 1명을 랜덤으로 추첨할 수 있어요.
                  </p>

                  <button
                    onClick={handleDrawWinner}
                    disabled={isDrawing || entries.length === 0}
                    className="w-full h-14 rounded-[20px] bg-[#FF642A] text-white font-black shadow-sm active:scale-95 transition disabled:opacity-50"
                  >
                    {isDrawing ? "추첨 중..." : "당첨자 추첨하기"}
                  </button>
                </>
              )}
            </section>

          {isLoading ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#FF642A]">
                응모자 목록을 불러오는 중...
              </p>
            </section>
          ) : errorMessage ? (
            <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-[24px] bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mx-auto mb-4">
                <Users size={30} />
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
          ) : entries.length === 0 ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#3B2414]">응모자가 없어요</p>
              <p className="text-sm text-[#7E6658] mt-2">
                아직 이 경품에 응모한 회원이 없어요.
              </p>
            </section>
          ) : (
            <section className="space-y-3">
              {entries.map((entry) => (
                <PrizeEntryCard key={entry.id} entry={entry} />
              ))}
            </section>
          )}

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              현재는 경품별 응모자 조회 화면이에요. 다음 단계에서 이 응모자 목록을
              기준으로 랜덤 당첨자를 추첨할 수 있어요.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

function PrizeEntryCard({ entry }: { entry: AdminPrizeEntry }) {
  return (
    <article className="rounded-[26px] bg-white border border-orange-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
            <User size={24} />
          </div>

          <div className="min-w-0">
            <h3 className="font-black text-lg leading-tight truncate">
              {entry.nickname ?? "알 수 없는 회원"}
            </h3>

            <p className="text-sm text-[#7E6658] mt-1 truncate">
              {entry.prize_title}
            </p>
          </div>
        </div>

        <p className="font-black text-[#FF642A] shrink-0">
          -{entry.ticket_cost}장
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <MiniInfo
          icon={<Gift size={17} />}
          title="경품 ID"
          value={entry.prize_id}
        />

        <MiniInfo
          icon={<CalendarDays size={17} />}
          title="응모일"
          value={new Date(entry.created_at).toLocaleDateString("ko-KR")}
        />
      </div>

      <p className="text-xs text-[#8A7567] mt-3">
        응모 시간: {new Date(entry.created_at).toLocaleString("ko-KR")}
      </p>
    </article>
  );
}

function MiniInfo({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-3 text-center">
      <div className="text-[#FF642A] flex justify-center mb-1">{icon}</div>
      <p className="text-[11px] font-bold text-[#8A7567]">{title}</p>
      <p className="text-xs font-black mt-0.5 truncate">{value}</p>
    </div>
  );
}