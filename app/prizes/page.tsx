"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Gift,
  Home,
  Ticket,
  Trophy,
  Wallet,
  User,
} from "lucide-react";

import {
  getTodayKey,
} from "../lib/storage";

import { supabase } from "../lib/supabase";
import { getCurrentProfile } from "../lib/auth";

import AdBanner from "../components/AdBanner";

const prizes = [
  {
    id: "cu-1000",
    title: "CU 1,000원권",
    brand: "오늘의 복",
    emoji: "🏪",
    ticketCost: 1,
    targetEntries: 500,
    totalEntriesToday: 53,
    desc: "편의점에서 가볍게 쓰기 좋은 오늘의 실속 경품이에요.",
  },
  {
    id: "starbucks-americano",
    title: "스타벅스 아메리카노",
    brand: "인기 경품",
    emoji: "☕",
    ticketCost: 1,
    targetEntries: 300,
    totalEntriesToday: 128,
    desc: "하루를 깨우는 달달한 여유를 받아보세요.",
  },
  {
    id: "baemin-5000",
    title: "배민 5천원권",
    brand: "보너스 경품",
    emoji: "🛵",
    ticketCost: 1,
    targetEntries: 400,
    totalEntriesToday: 241,
    desc: "맛있는 선택, 즐거운 배달 쿠폰이에요.",
  },
];

export default function PrizesPage() {
  const [entryTickets, setEntryTickets] = useState(0);
  const [entryCount, setEntryCount] = useState(0);

  const DAILY_AD_LIMIT = 10;
  const [adViewsToday, setAdViewsToday] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [prizeEntryTotals, setPrizeEntryTotals] = useState<Record<string, number>>({});
  const [remainingTimeText, setRemainingTimeText] = useState("00:00:00");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  function getRemainingTimeUntilMidnight() {
    const now = new Date();

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const diffMs = midnight.getTime() - now.getTime();
    const totalSeconds = Math.max(Math.floor(diffMs / 1000), 0);

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
      async function loadPrizesData() {
        const todayKey = getTodayKey();

        const profile = await getCurrentProfile();

        if (!profile) {
          setIsLoggedIn(false);
          setProfileId(null);
          setEntryTickets(0);
          setEntryCount(0);
          setAdViewsToday(0);
          setPrizeEntryTotals({});
          return;
        }

        setIsLoggedIn(true);
        setProfileId(profile.id);
        setEntryTickets(profile.entry_tickets ?? 0);

        // 오늘 광고 시청 횟수 불러오기
        const { data: adViewData, error: adViewError } = await supabase
          .from("ad_views")
          .select("view_count")
          .eq("profile_id", profile.id)
          .eq("view_date", todayKey)
          .maybeSingle();

        if (adViewError) {
          console.error("경품 화면 광고 횟수 불러오기 실패:", adViewError.message);
          setAdViewsToday(0);
        } else {
          setAdViewsToday(adViewData?.view_count ?? 0);
        }

        // 내 전체 경품 응모내역 불러오기
        const { data: prizeEntries, error: prizeEntriesError } = await supabase
          .from("prize_entries")
          .select("prize_id, ticket_cost")
          .eq("profile_id", profile.id);

        if (prizeEntriesError) {
          console.error("경품 응모내역 불러오기 실패:", prizeEntriesError.message);
          setEntryCount(0);
          setPrizeEntryTotals({});
          return;
        }

        const entries = prizeEntries ?? [];

        setEntryCount(entries.length);

        const nextPrizeEntryTotals: Record<string, number> = {};

        entries.forEach((entry) => {
          const currentCount = nextPrizeEntryTotals[entry.prize_id] || 0;
          nextPrizeEntryTotals[entry.prize_id] =
            currentCount + (entry.ticket_cost ?? 1);
        });

        setPrizeEntryTotals(nextPrizeEntryTotals);
      }

      loadPrizesData();
    }, []);

  useEffect(() => {
    setRemainingTimeText(getRemainingTimeUntilMidnight());

    const timer = setInterval(() => {
      setRemainingTimeText(getRemainingTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const remainingAds = Math.max(DAILY_AD_LIMIT - adViewsToday, 0);
  const visibleEntryTickets = isLoggedIn ? entryTickets : 0;
  const visibleEntryCount = isLoggedIn ? entryCount : 0;

  async function handleEnterPrize(prizeId: string, ticketCost: number, prizeTitle: string) {
      if (!isLoggedIn) {
        alert("로그인 후 경품에 응모할 수 있어요.");
        return;
      }

      if (!profileId) {
        alert("프로필 정보를 불러오지 못했어요. 다시 로그인해주세요.");
        return;
      }

      if (entryTickets < ticketCost) {
        alert("응모권이 부족해요. 광고를 보고 응모권을 받아주세요!");
        return;
      }

    const nextEntryTickets = entryTickets - ticketCost;
    const nextEntryCount = entryCount + 1;

    const currentPrizeTotal = prizeEntryTotals[prizeId] || 0;
    const nextPrizeEntryTotals = {
      ...prizeEntryTotals,
      [prizeId]: currentPrizeTotal + ticketCost,
    };

    const { error } = await supabase
      .from("profiles")
      .update({
        entry_tickets: nextEntryTickets,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (error) {
      console.error("경품 응모 Supabase 저장 실패:", error.message);
      alert("경품 응모 저장에 실패했어요. 다시 시도해주세요.");
      return;
    }

    const { error: logError } = await supabase
      .from("reward_logs")
      .insert({
        profile_id: profileId,
        type: "prize",
        title: "경품 응모",
        description: `${prizeTitle} 응모`,
        amount: `-${ticketCost}장`,
        emoji: "🎁",
      });

    if (logError) {
      console.error("경품 응모 내역 저장 실패:", logError.message);
    }

    const { error: prizeEntryError } = await supabase
      .from("prize_entries")
      .insert({
        profile_id: profileId,
        prize_id: prizeId,
        prize_title: prizeTitle,
        ticket_cost: ticketCost,
      });

    if (prizeEntryError) {
      console.error("경품 응모 상세내역 저장 실패:", prizeEntryError.message);
    }

    setEntryTickets(nextEntryTickets);
    setEntryCount(nextEntryCount);
    setPrizeEntryTotals(nextPrizeEntryTotals);

    setSuccessMessage(`${prizeTitle}에 응모했어요!`);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

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
            <p className="text-xs font-bold text-[#FF642A]">오늘의 경품</p>
            <h1 className="text-2xl font-black">경품함</h1>
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
          {successMessage && (
            <section className="rounded-[24px] bg-[#EAF7E6] border border-green-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <p className="font-black text-[#2E7D32]">응모 완료!</p>
                <p className="text-sm font-bold text-[#4F6F52] mt-1">
                  {successMessage}
                </p>
              </div>
            </section>
          )}

          {/* 메인 배너 */}
          <section className="rounded-[30px] bg-gradient-to-br from-[#FFF1DA] to-[#FFE0C4] border border-orange-100 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute right-5 top-4 text-2xl">✨</div>
            <div className="absolute right-12 bottom-5 text-xl">🍀</div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#FFD67A] to-[#FF6A2A] flex items-center justify-center shadow-md border-4 border-white overflow-hidden">
                <Image
                  src="/images/bok-mascot-v2.png"
                  alt="오늘복 복주머니 캐릭터"
                  width={66}
                  height={66}
                  className="object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[#FF642A] mb-1">
                  응모권으로 선물 받기
                </p>
                <h2 className="text-2xl font-black leading-tight">
                  오늘의 복을 골라보세요
                </h2>
                <p className="text-sm text-[#7E6658] mt-2">
                  보유한 응모권으로 원하는 경품에 응모해요.
                </p>
              </div>
            </div>
          </section>

          {/* 내 응모 현황 */}
          <section className="grid grid-cols-3 gap-3">
            <InfoCard icon={<Ticket size={25} />} title="응모권" value={`${visibleEntryTickets}장`} />
            <InfoCard icon={<Trophy size={25} />} title="응모중" value={`${visibleEntryCount}건`} />
            <InfoCard icon={<CalendarDays size={25} />} title="발표" value="오늘" />
          </section>

          {/* 경품 목록 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">진행중인 경품</h3>
              <p className="text-sm font-bold text-[#8A7567]">
                총 {prizes.length}개
              </p>
            </div>

            <div className="space-y-3">
              {prizes.map((prize) => (
                  <PrizeCard
                    key={prize.id}
                    prize={prize}
                    entryTickets={visibleEntryTickets}
                    extraEntries={prizeEntryTotals[prize.id] || 0}
                    remainingTimeText={remainingTimeText}
                    isLoggedIn={isLoggedIn}
                    onEnterPrize={handleEnterPrize}
                  />
                ))}
            </div>

            {visibleEntryTickets <= 0 && (
              !isLoggedIn ? (
                <Link
                  href="/login?next=/prizes"
                  className="w-full h-14 rounded-[20px] bg-[#FFF4DF] border border-orange-100 text-[#FF642A] font-black shadow-sm active:scale-95 transition flex items-center justify-center"
                >
                  로그인하고 응모권 받기
                </Link>
              ) : remainingAds > 0 ? (
                <Link
                  href="/ad"
                  className="w-full h-14 rounded-[20px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black shadow-lg shadow-orange-100 active:scale-95 transition flex items-center justify-center"
                >
                  광고 보고 응모권 받기
                </Link>
              ) : (
                <div className="w-full h-14 rounded-[20px] bg-[#D9D1C8] text-white font-black flex items-center justify-center">
                  오늘 광고 완료
                </div>
              )
            )}
          </section>

          {/* 하단 광고 배너 */}
          <AdBanner
            slotId="prizes-list-bottom"
            label="추천"
            title="놓치기 아쉬운 혜택"
            desc="응모권을 모아 더 많은 경품에 도전해보세요."
          />

          <Link
            href="/wallet/winners"
            className="w-full h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#FF642A] active:scale-95 transition flex items-center justify-center"
          >
            내 당첨 내역 보기
          </Link>

          {/* 안내 */}
          <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              응모권이 목표 수에 도달하면 금일 확정 경품이 1개 추가되고,
              남은 응모권은 다음날로 이월돼요.
            </p>
            <p className="text-xs leading-relaxed text-[#8A7567] mt-3">
              오늘복의 복권과 응모권은 앱 내 이벤트 참여용 보상이며,
              현금성 도박이나 현금 환급 서비스가 아니에요.
            </p>
          </section>
        </div>

        {/* 하단 네비게이션 */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-orange-100 px-4 py-3 rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 gap-1">
            <BottomNav href="/" icon={<Home size={24} />} label="홈" />
            <BottomNav href="/scratch" icon={<Ticket size={24} />} label="복권" />
            <BottomNav active href="/prizes" icon={<Gift size={24} />} label="경품함" />
            <BottomNav href="/wallet" icon={<Wallet size={24} />} label="지갑" />
            <BottomNav href="/my" icon={<User size={24} />} label="내정보" />
          </div>
        </nav>
      </section>
    </main>
  );
}

function PrizeCard({
  prize,
  entryTickets,
  extraEntries,
  remainingTimeText,
  isLoggedIn,
  onEnterPrize,
}: {
  prize: (typeof prizes)[number];
  entryTickets: number;
  extraEntries: number;
  remainingTimeText: string;
  isLoggedIn: boolean;
  onEnterPrize: (prizeId: string, ticketCost: number, prizeTitle: string) => Promise<void>;
}) {
  const canEnter = isLoggedIn && entryTickets >= prize.ticketCost;

  const totalEntries = prize.totalEntriesToday + extraEntries;
  const confirmedPrizeCount = Math.floor(totalEntries / prize.targetEntries);
  const currentRoundEntries = totalEntries % prize.targetEntries;
  const progressPercent = Math.floor(
    (currentRoundEntries / prize.targetEntries) * 100
  );

  return (
    <article className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-4 space-y-4">
      <div className="flex gap-4 items-start">
        <div className="w-20 h-20 rounded-[26px] bg-[#FFF4DF] flex items-center justify-center text-5xl shrink-0">
          {prize.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-[#FF642A] bg-[#FFF4DF] px-2.5 py-1 rounded-full inline-flex">
            {prize.brand}
          </p>

          <h4 className="text-xl font-black mt-2 leading-tight">
            {prize.title}
          </h4>

          <p className="text-sm text-[#7E6658] mt-1 leading-relaxed">
            {prize.desc}
          </p>
        </div>
      </div>

      <div className="rounded-[22px] bg-[#FFF8EF] border border-orange-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-black text-[#6B4B38]">
            현재 응모권 수
          </p>
          <p className="text-sm font-black text-[#FF642A]">
            {progressPercent}%
          </p>
        </div>

        <div className="flex items-end gap-1 mb-3">
          <span className="text-4xl font-black text-[#FF642A]">
            {currentRoundEntries}
          </span>
          <span className="text-2xl font-black text-[#8A7567] mb-1">
            / {prize.targetEntries}
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#F0E4D8] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF5C22] to-[#FF8A3D] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[18px] border border-orange-100 bg-white p-3 text-center">
          <p className="text-xs font-bold text-[#8A7567]">금일 확정 경품</p>
          <p className="text-xl font-black mt-1">
            <span className="text-[#FF642A]">{confirmedPrizeCount}</span>개
          </p>
        </div>

        <div className="rounded-[18px] border border-orange-100 bg-white p-3 text-center">
          <p className="text-xs font-bold text-[#8A7567]">마감까지</p>
          <p className="text-xl font-black text-[#FF642A] mt-1">
            {remainingTimeText}
          </p>
        </div>
      </div>

      {!isLoggedIn ? (
          <Link
            href="/login?next=/prizes"
            className="w-full h-14 rounded-[20px] bg-[#FFF4DF] border border-orange-100 text-[#FF642A] text-lg font-black shadow-sm active:scale-95 transition flex items-center justify-center"
          >
            로그인하고 응모하기
          </Link>
        ) : (
          <button
            onClick={() => onEnterPrize(prize.id, prize.ticketCost, prize.title)}
            disabled={!canEnter}
            className={`w-full h-14 rounded-[20px] text-lg font-black transition ${
              canEnter
                ? "bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white shadow-lg shadow-orange-100 active:scale-95"
                : "bg-[#D9D1C8] text-white cursor-not-allowed"
            }`}
          >
            {canEnter ? `${prize.ticketCost}장 응모` : "응모권 부족"}
          </button>
        )}
    </article>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex flex-col items-center justify-center min-h-[112px]">
      <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs font-bold text-[#8A7567]">{title}</p>
      <p className="text-xl font-black mt-1">{value}</p>
    </div>
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