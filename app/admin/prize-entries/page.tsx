"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Gift,
  Ticket,
  Trophy,
  User,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type AdminPrizeEntry = {
  id: string;
  profile_id: string;
  prize_id: string;
  prize_title: string;
  ticket_cost: number;
  created_at: string;
  nickname: string | null;
};

export default function AdminPrizeEntriesPage() {
  const [entries, setEntries] = useState<AdminPrizeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPrizeEntries() {
      setIsLoading(true);

      const { data, error } = await supabase.rpc("get_admin_prize_entries");

      if (error) {
        console.error("관리자 경품 응모 내역 조회 실패:", error.message);

        if (error.message.includes("not allowed")) {
          setErrorMessage("관리자 권한이 필요해요.");
        } else {
          setErrorMessage("경품 응모 내역을 불러오지 못했어요.");
        }

        setEntries([]);
        setIsLoading(false);
        return;
      }

      setErrorMessage("");
      setEntries((data ?? []) as AdminPrizeEntry[]);
      setIsLoading(false);
    }

    loadPrizeEntries();
  }, []);

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
            <h1 className="text-2xl font-black">경품 응모 내역</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Trophy size={26} />
              </div>

              <div>
                <p className="text-sm font-bold text-white/70">전체 응모 현황</p>
                <h2 className="text-2xl font-black mt-1">
                  총 {entries.length}건
                </h2>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/75 mt-4">
              회원들이 어떤 경품에 응모했는지 최근순으로 확인할 수 있어요.
            </p>
          </section>

          {isLoading ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#FF642A]">
                경품 응모 내역을 불러오는 중...
              </p>
            </section>
          ) : errorMessage ? (
            <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-[24px] bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mx-auto mb-4">
                <Gift size={30} />
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
              <p className="font-black text-[#3B2414]">응모 내역이 없어요</p>
              <p className="text-sm text-[#7E6658] mt-2">
                아직 경품에 응모한 회원이 없어요.
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
              현재는 조회 전용 응모 내역이에요. 다음 단계에서 경품별 응모자 보기와
              당첨자 추첨 기능을 추가할 수 있어요.
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
            <Gift size={24} />
          </div>

          <div className="min-w-0">
            <h3 className="font-black text-lg leading-tight truncate">
              {entry.prize_title}
            </h3>

            <p className="text-sm text-[#7E6658] mt-1 flex items-center gap-1">
              <User size={14} />
              {entry.nickname ?? "알 수 없는 회원"}
            </p>
          </div>
        </div>

        <p className="font-black text-[#FF642A] shrink-0">
          -{entry.ticket_cost}장
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <MiniInfo
          icon={<Ticket size={17} />}
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