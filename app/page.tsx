"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gift, Home, Ticket, Wallet, User, Bell, Play, CalendarCheck, ChevronRight } from "lucide-react";

import { supabase } from "./lib/supabase";
import { getCurrentProfile } from "./lib/auth";

import AdBanner from "./components/AdBanner";

export default function OneulbokHome() {

  const DAILY_AD_LIMIT = 10;

  function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }
  const [scratchTickets, setScratchTickets] = useState(0);
  const [entryTickets, setEntryTickets] = useState(0);
  const [adViewsToday, setAdViewsToday] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function showComingSoon() {
    alert("준비 중인 기능이에요.");
  }

    useEffect(() => {
      async function loadHomeData() {
        const todayKey = getTodayKey();

        const profile = await getCurrentProfile();

        if (!profile) {
          setIsLoggedIn(false);
          setAdViewsToday(0);
          setScratchTickets(0);
          setEntryTickets(0);
          return;
        }

        setIsLoggedIn(true);
        setScratchTickets(profile.scratch_tickets ?? 0);
        setEntryTickets(profile.entry_tickets ?? 0);

        const { data: adViewData, error: adViewError } = await supabase
          .from("ad_views")
          .select("view_count")
          .eq("profile_id", profile.id)
          .eq("view_date", todayKey)
          .maybeSingle();

        if (adViewError) {
          console.error("오늘 광고 횟수 불러오기 실패:", adViewError.message);
          setAdViewsToday(0);
          return;
        }

        setAdViewsToday(adViewData?.view_count ?? 0);
      }

      loadHomeData();
    }, []);

  const remainingAds = Math.max(DAILY_AD_LIMIT - adViewsToday, 0);
  const visibleScratchTickets = isLoggedIn ? scratchTickets : 0;
  const visibleEntryTickets = isLoggedIn ? entryTickets : 0;
  const prizes = [
    {
      name: "스타벅스",
      desc: "아메리카노",
      emoji: "☕",
    },
    {
      name: "CU",
      desc: "5천원 상품권",
      emoji: "🏪",
    },
    {
      name: "배민",
      desc: "5천원권",
      emoji: "🛵",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100 relative">
        {/* 상단 상태 영역 */}
        <header className="px-6 pt-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFD67A] to-[#FF6A2A] flex items-center justify-center shadow-md overflow-hidden">
              <Image
                src="/images/bok-mascot-v2.png"
                alt="오늘복 마스코트"
                width={38}
                height={38}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              오늘<span className="text-[#FF642A]">복</span>
            </h1>
          </div>

          <button
            onClick={showComingSoon}
            className="relative w-11 h-11 rounded-full bg-white shadow-sm border border-orange-100 flex items-center justify-center active:scale-95 transition"
          >
            <Bell size={23} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FF642A]" />
          </button>
        </header>

        <div className="px-5 pb-32 space-y-5">
          {/* 메인 배너 */}
          <section className="rounded-[30px] bg-gradient-to-br from-[#FFF4DF] via-[#FFF8ED] to-[#FFE2C5] border border-orange-100 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 text-2xl">🍀</div>
            <div className="absolute right-28 top-9 text-xl">✨</div>
            <div className="absolute right-10 bottom-7 text-lg">💛</div>

            <div className="relative z-10 max-w-[58%]">
              <p className="text-sm font-bold text-[#FF642A] mb-2">매일 받는 작은 복</p>
              <h2 className="text-4xl leading-tight font-black tracking-tight">
                오늘도<br />
                <span className="text-[#FF642A]">복</span>이 왔어요
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6B4B38]">
                광고 보고 복권 받고,
                <br />
                경품까지 응모해보세요.
              </p>
            </div>

            <div className="absolute right-3 bottom-0 w-40 h-40 flex items-end justify-center">
              <Image
                src="/images/bok-mascot-v2.png"
                alt="오늘복 복주머니 캐릭터"
                width={150}
                height={150}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </section>

          {/* 오늘 광고 횟수 */}
          <section className="rounded-[26px] bg-white border border-orange-100 shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF7E6] flex items-center justify-center">
                <CalendarCheck className="text-[#43A047]" size={30} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#43A047]">
                  {isLoggedIn ? "오늘 광고 남은 횟수" : "광고 보상 이용"}
                </p>
                <div className="flex items-end gap-1 mt-1">
                  {isLoggedIn ? (
                      <>
                        <span className="text-4xl font-black">{remainingAds}</span>
                        <span className="text-xl font-bold text-[#8A7567] mb-1">
                          / {DAILY_AD_LIMIT}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-black text-[#FF642A]">로그인이 필요해요</span>
                    )}
                </div>
              </div>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-[#FFF4DF] flex items-center justify-center shadow-inner overflow-hidden">
              <Image
                src="/images/bok-mascot-v2.png"
                alt="오늘복 캐릭터"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </section>

          {/* 보유 복권 / 응모권 카드 */}
            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] flex items-center justify-center text-2xl">
                  🎟️
                </div>
                <div>
                  <p className="text-xs font-bold text-[#8A7567]">보유 복권</p>
                  <p className="text-2xl font-black mt-1">{visibleScratchTickets}장</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div>
                  <p className="text-xs font-bold text-[#8A7567]">응모권</p>
                  <p className="text-2xl font-black mt-1">{visibleEntryTickets}장</p>
                </div>
              </div>
            </section>

          {/* 광고 보기 버튼 */}
          {!isLoggedIn ? (
              <Link
                href="/login?next=/ad"
                className="w-full h-[72px] rounded-[24px] bg-[#FFF4DF] border border-orange-100 text-[#FF642A] font-black text-2xl shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition"
              >
                <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
                  <Play size={24} className="text-[#FF642A] fill-[#FF642A]" />
                </span>
                로그인하고 복권 받기
              </Link>
            ) : remainingAds > 0 ? (
              <Link
                href="/ad"
                className="w-full h-[72px] rounded-[24px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black text-2xl shadow-lg shadow-orange-200 flex items-center justify-center gap-3 active:scale-[0.98] transition"
              >
                <span className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center">
                  <Play size={24} className="text-[#FF642A] fill-[#FF642A]" />
                </span>
                광고 보고 복권 받기
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="w-full h-[72px] rounded-[24px] bg-[#D9D1C8] text-white font-black text-2xl shadow-sm flex items-center justify-center gap-3 cursor-not-allowed"
              >
                <span className="w-11 h-11 rounded-full bg-white/70 flex items-center justify-center">
                  <Play size={24} className="text-[#9B9087] fill-[#9B9087]" />
                </span>
                오늘 광고 완료
              </button>
            )}

          {/* 복권 카드 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">오늘의 복권 받기</h3>
              <button
                onClick={showComingSoon}
                className="text-sm font-bold text-[#8A7567] flex items-center gap-1"
              >
                더보기 <ChevronRight size={16} />
              </button>
            </div>

            <Link
              href="/scratch"
              className="w-full rounded-[26px] bg-gradient-to-br from-[#FFE8A8] to-[#FFF7D8] border border-yellow-200 p-5 shadow-sm flex items-center justify-between active:scale-[0.99] transition overflow-hidden relative"
            >
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-[repeating-linear-gradient(135deg,#d6d6d6_0px,#d6d6d6_4px,#eeeeee_4px,#eeeeee_8px)] opacity-70" />
              <div className="text-left relative z-10">
                <p className="text-sm text-[#7A5C31] font-bold mb-2">스크래치하고 행운을 확인하세요!</p>
                <p className="text-3xl font-black">긁어보세요!</p>
              </div>
              <div className="relative z-10 text-5xl pr-3">👉</div>
            </Link>
          </section>

          {/* 오늘의 경품 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">오늘의 경품</h3>
              <button
                onClick={showComingSoon}
                className="text-sm font-bold text-[#8A7567] flex items-center gap-1"
              >
                더보기 <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {prizes.map((item) => (
                <Link
                  key={item.name}
                  href="/prizes"
                  className="rounded-[22px] bg-white border border-orange-100 shadow-sm p-3 min-h-[128px] flex flex-col items-center justify-center active:scale-95 transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF4DF] flex items-center justify-center text-3xl mb-3">
                    {item.emoji}
                  </div>
                  <p className="font-black text-base leading-tight">{item.name}</p>
                  <p className="text-xs text-[#7E6658] mt-1 leading-tight">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* 하단 광고 배너 */}
          <AdBanner
            slotId="home-bottom"
            label="HOME AD"
            title="오늘복 홈 하단 광고"
            desc="홈 화면에서 상시 노출되는 배너 광고 영역이에요."
          />
        </div>


        {/* 하단 네비게이션 */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-orange-100 px-4 py-3 rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 gap-1">
            <BottomNav active href="/" icon={<Home size={24} />} label="홈" />
            <BottomNav href="/scratch" icon={<Ticket size={24} />} label="복권" />
            <BottomNav href="/prizes" icon={<Gift size={24} />} label="경품함" />
            <BottomNav href="/wallet" icon={<Wallet size={24} />} label="지갑" />
            <BottomNav href="/my" icon={<User size={24} />} label="내정보" />
          </div>
        </nav>
      </section>
    </main>
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
