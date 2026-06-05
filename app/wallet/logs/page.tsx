"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Gift,
  Home,
  Ticket,
  User,
  Wallet,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import { getCurrentProfile } from "../../lib/auth";

type RewardLog = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  amount: string | null;
  emoji: string | null;
  created_at: string;
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

export default function WalletLogsPage() {
  const [logs, setLogs] = useState<RewardLog[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true);
      setErrorMessage("");

      const profile = await getCurrentProfile();

      if (!profile) {
        setIsLoggedIn(false);
        setLogs([]);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);

      const { data, error } = await supabase
        .from("reward_logs")
        .select("id, type, title, description, amount, emoji, created_at")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("전체 보상 내역 불러오기 실패:", error.message);
        setErrorMessage("전체 내역을 불러오지 못했어요.");
        setLogs([]);
        setIsLoading(false);
        return;
      }

      setLogs((data ?? []) as RewardLog[]);
      setIsLoading(false);
    }

    loadLogs();
  }, []);

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
            <p className="text-xs font-bold text-[#FF642A]">내 복 기록</p>
            <h1 className="text-2xl font-black">전체 내역</h1>
          </div>

          <div className="w-11 h-11 rounded-full bg-[#FFF4DF] border border-orange-100 shadow-sm flex items-center justify-center">
            <Wallet size={23} className="text-[#FF642A]" />
          </div>
        </header>

        <div className="px-5 pb-32 space-y-5">
          <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
            <p className="text-sm font-bold text-white/70">지갑 기록</p>
            <h2 className="text-2xl font-black mt-1">
              최근 보상 내역 {logs.length}건
            </h2>
            <p className="text-sm leading-relaxed text-white/75 mt-3">
                광고 보상, 복권 결과, 경품 응모 등 내 계정의 최근 활동을
                최신순으로 최대 100건까지 확인할 수 있어요.
            </p>
          </section>

          {isLoading ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#FF642A]">
                전체 내역을 불러오는 중이에요...
              </p>
            </section>
          ) : !isLoggedIn ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#3B2414]">로그인이 필요해요</p>
              <p className="text-sm text-[#7E6658] mt-2">
                로그인하면 내 전체 보상 내역을 확인할 수 있어요.
              </p>

              <div className="mt-4 space-y-2">
                <Link
                  href="/login?next=/wallet/logs"
                  className="h-12 rounded-[18px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black flex items-center justify-center"
                >
                  로그인하고 전체 내역 보기
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
          ) : logs.length === 0 ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#3B2414]">아직 내역이 없어요</p>
              <p className="text-sm text-[#7E6658] mt-2">
                광고를 보거나 복권을 긁으면 여기에 기록돼요.
              </p>
            </section>
          ) : (
            <section className="space-y-3">
              {logs.map((item) => (
                <LogCard key={item.id} item={item} />
              ))}

              <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
                <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
                <p className="text-sm leading-relaxed text-[#6B4B38]">
                  보상 내역은 최신순으로 표시되며, 현재 화면에서는 최근 100건까지 확인할 수 있어요.
                </p>
              </section>
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

function LogCard({ item }: { item: RewardLog }) {
  return (
    <article className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF4DF] flex items-center justify-center text-3xl shrink-0">
        {item.emoji ?? "🧧"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-xs font-bold text-[#8A7567]">
          <Clock size={13} />
          {formatDateTime(item.created_at)}
        </div>

        <h4 className="font-black mt-1 leading-tight">{item.title}</h4>

        <p className="text-sm text-[#7E6658] mt-0.5 leading-tight">
          {item.description ?? "상세 내용 없음"}
        </p>
      </div>

      <p className="font-black text-[#FF642A] shrink-0">
        {item.amount ?? "-"}
      </p>
    </article>
  );
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