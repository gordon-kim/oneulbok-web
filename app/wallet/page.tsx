"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabase";
import { getCurrentProfile } from "../lib/auth";

import {
  ArrowLeft,
  Gift,
  Home,
  Ticket,
  Wallet,
  User,
  Coins,
  Trophy,
  Clock,
} from "lucide-react";

type SupabaseRewardLog = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  amount: string | null;
  emoji: string | null;
  created_at: string;
};

export default function WalletPage() {
  const [points, setPoints] = useState(0);
  const [scratchTickets, setScratchTickets] = useState(0);
  const [entryTickets, setEntryTickets] = useState(0);
  const [winnerCount, setWinnerCount] = useState(0);
  const [rewardLogs, setRewardLogs] = useState<SupabaseRewardLog[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      async function loadWalletData() {
        const profile = await getCurrentProfile();

        if (!profile) {
          setIsLoggedIn(false);
          setPoints(0);
          setScratchTickets(0);
          setEntryTickets(0);
          setWinnerCount(0);
          setRewardLogs([]);
          return;
        }

        setIsLoggedIn(true);
        setPoints(profile.points ?? 0);
        setScratchTickets(profile.scratch_tickets ?? 0);
        setEntryTickets(profile.entry_tickets ?? 0);

        const { count: winnerTotal, error: winnerCountError } = await supabase
          .from("prize_winners")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", profile.id);

        if (winnerCountError) {
          console.error("당첨 건수 불러오기 실패:", winnerCountError.message);
          setWinnerCount(0);
        } else {
          setWinnerCount(winnerTotal ?? 0);
        }

        const { data: logs, error: logsError } = await supabase
          .from("reward_logs")
          .select("id, type, title, description, amount, emoji, created_at")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (logsError) {
          console.error("최근 내역 불러오기 실패:", logsError.message);
          setRewardLogs([]);
          return;
        }

        setRewardLogs(logs ?? []);
      }

      loadWalletData();
    }, []);

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100 relative">
        {/* 상단 헤더 */}
        <header className="px-6 pt-6 pb-4 flex items-center justify-between">
          <Link
            href="/"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div className="text-center">
            <p className="text-xs font-bold text-[#FF642A]">내 복 확인</p>
            <h1 className="text-2xl font-black">내 지갑</h1>
          </div>

          <div className="w-11 h-11 rounded-full bg-[#FFF4DF] border border-orange-100 shadow-sm flex items-center justify-center overflow-hidden">
            <Image
              src="/images/bok-mascot-v2.png"
              alt="오늘복 캐릭터"
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
        </header>

        <div className="px-5 pb-32 space-y-5">
          {/* 지갑 메인 카드 */}
          <section className="rounded-[32px] bg-gradient-to-br from-[#FF6A2A] to-[#FF9B4A] p-6 shadow-lg shadow-orange-200 text-white relative overflow-hidden">
            <div className="absolute right-4 top-4 text-3xl opacity-80">✨</div>
            <div className="absolute right-7 bottom-5 text-5xl opacity-20">福</div>

            <p className="text-sm font-bold text-white/85 mb-2">현재 보유 포인트</p>
            <div className="flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight">{points}</span>
                <span className="text-2xl font-black mb-1">P</span>
            </div>
            <p className="text-sm text-white/85 mt-4 leading-relaxed">
              포인트는 추후 쿠폰 교환 또는 이벤트 참여에 사용할 수 있어요.
            </p>
          </section>

          {!isLoggedIn && (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5">
              <p className="text-sm font-black text-[#FF642A] mb-2">
                로그인이 필요해요
              </p>
              <p className="text-sm leading-relaxed text-[#6B4B38]">
                로그인하면 내 포인트, 복권, 응모권, 당첨 내역과 최근 보상 기록을
                확인할 수 있어요.
              </p>

              <Link
                href="/login?next=/wallet"
                className="mt-4 h-12 rounded-[18px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black active:scale-95 transition flex items-center justify-center"
              >
                로그인하고 지갑 보기
              </Link>
            </section>
          )}

          {/* 보유 현황 */}
          <section className="grid grid-cols-3 gap-3">
            <InfoCard icon={<Ticket size={25} />} title="복권" value={`${scratchTickets}장`} />
            <InfoCard icon={<Gift size={25} />} title="응모권" value={`${entryTickets}장`} />

            <Link href="/wallet/winners" className="active:scale-95 transition">
              <InfoCard
                icon={<Trophy size={25} />}
                title="당첨"
                value={`${winnerCount}건`}
                hint="확인하기"
              />
            </Link>
          </section>

          {/* 빠른 버튼 */}
          <section className="grid grid-cols-2 gap-3">
            <Link
              href="/scratch"
              className="h-16 rounded-[22px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Ticket size={22} className="text-[#FF642A]" />
              복권 긁기
            </Link>
            <Link
              href="/prizes"
              className="h-16 rounded-[22px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white shadow-lg shadow-orange-200 font-black active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Gift size={22} />
              경품 응모
            </Link>
          </section>

          {/* 최근 내역 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">최근 내역</h3>
              <Link
                href="/wallet/logs"
                className="text-sm font-bold text-[#8A7567] flex items-center gap-1 active:scale-95 transition"
              >
                전체보기
              </Link>
            </div>

            <div className="space-y-3">
              {!isLoggedIn ? (
                <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5 text-center">
                  <p className="font-black text-[#3B2414]">로그인이 필요해요</p>
                  <p className="text-sm text-[#7E6658] mt-2">
                    로그인하면 내 포인트와 최근 내역을 확인할 수 있어요.
                  </p>
                  <Link
                    href="/login?next=/wallet"
                    className="mt-4 h-12 rounded-[18px] bg-[#FFF4DF] text-[#FF642A] font-black flex items-center justify-center"
                  >
                    로그인하러 가기
                  </Link>
                </div>
              ) : rewardLogs.length === 0 ? (
                <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5 text-center">
                  <p className="font-black text-[#3B2414]">아직 내역이 없어요</p>
                  <p className="text-sm text-[#7E6658] mt-2">
                    광고를 보거나 복권을 긁으면 여기에 기록돼요.
                  </p>
                </div>
              ) : (
                rewardLogs.map((item) => (
                  <LogCard key={item.id} item={item} />
                ))
              )}
            </div>
          </section>

          {/* 안내 */}
          <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-start gap-3">
            <Coins className="text-[#FF642A] mt-0.5" size={22} />
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              포인트, 복권, 응모권, 당첨 내역과 최근 보상 기록은 내 계정에 안전하게 저장돼요.
            </p>
          </section>
        </div>

        {/* 하단 네비게이션 */}
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

function InfoCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex flex-col items-center justify-center min-h-[112px]">
      <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs font-bold text-[#8A7567]">{title}</p>
      <p className="text-xl font-black mt-1">{value}</p>

      {hint && (
        <p className="text-[11px] font-black text-[#FF642A] mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}

function LogCard({ item }: { item: SupabaseRewardLog }) {
  return (
    <article className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF4DF] flex items-center justify-center text-3xl shrink-0">
        {item.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-xs font-bold text-[#8A7567]">
          <Clock size={13} />
          {new Date(item.created_at).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </div>
        <h4 className="font-black mt-1 leading-tight">{item.title}</h4>
        <p className="text-sm text-[#7E6658] mt-0.5 leading-tight">
          {item.description}
        </p>
      </div>

      <p className="font-black text-[#FF642A] shrink-0">{item.amount}</p>
    </article>
  );
}

function BottomNav({ icon, label, href, active = false }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) {
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
