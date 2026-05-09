"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Gift, Home, RotateCcw, Sparkles, Ticket, Wallet, User } from "lucide-react";

import {
  getTodayKey,
} from "../lib/storage";

import { supabase } from "../lib/supabase";
import { getCurrentProfile } from "../lib/auth";

import AdBanner from "../components/AdBanner";

const scratchResults = [
  {
    label: "꽝",
    message: "아쉽지만 내일 또 복이 올 거예요!",
    emoji: "😅",
    type: "none",
    amount: 0,
  },
  {
    label: "1P 당첨",
    message: "작은 복이 들어왔어요!",
    emoji: "🧧",
    type: "point",
    amount: 1,
  },
  {
    label: "5P 당첨",
    message: "기분 좋은 복이에요!",
    emoji: "🎁",
    type: "point",
    amount: 5,
  },
  {
    label: "10P 당첨",
    message: "오늘 운이 괜찮은데요?",
    emoji: "✨",
    type: "point",
    amount: 10,
  },
  {
    label: "응모권 1장",
    message: "경품 응모 기회가 늘었어요!",
    emoji: "🎟️",
    type: "entryTicket",
    amount: 1,
  },
];

export default function ScratchPage() {
  const [isScratched, setIsScratched] = useState(false);
  const [result, setResult] = useState(scratchResults[1]);

  const [scratchTickets, setScratchTickets] = useState(0);
  const [entryTickets, setEntryTickets] = useState(0);
  const [points, setPoints] = useState(0);

  const DAILY_AD_LIMIT = 10;
  const [adViewsToday, setAdViewsToday] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);



  useEffect(() => {
      async function loadScratchData() {
        const todayKey = getTodayKey();

        const profile = await getCurrentProfile();

        if (!profile) {
          setIsLoggedIn(false);
          setProfileId(null);
          setScratchTickets(0);
          setEntryTickets(0);
          setPoints(0);
          setAdViewsToday(0);
          return;
        }

        setIsLoggedIn(true);
        setProfileId(profile.id);

        setScratchTickets(profile.scratch_tickets ?? 0);
        setEntryTickets(profile.entry_tickets ?? 0);
        setPoints(profile.points ?? 0);

        const { data: adViewData, error: adViewError } = await supabase
          .from("ad_views")
          .select("view_count")
          .eq("profile_id", profile.id)
          .eq("view_date", todayKey)
          .maybeSingle();

        if (adViewError) {
          console.error("복권 화면 광고 횟수 불러오기 실패:", adViewError.message);
          setAdViewsToday(0);
          return;
        }

        setAdViewsToday(adViewData?.view_count ?? 0);
      }

      loadScratchData();
    }, []);

      const remainingAds = Math.max(DAILY_AD_LIMIT - adViewsToday, 0);
      const visibleScratchTickets = isLoggedIn ? scratchTickets : 0;
      const visiblePoints = isLoggedIn ? points : 0;
      const visibleEntryTickets = isLoggedIn ? entryTickets : 0;

  async function handleScratch() {
      if (!isLoggedIn) {
        alert("로그인 후 복권을 긁을 수 있어요.");
        return;
      }

      if (!profileId) {
          alert("프로필 정보를 불러오지 못했어요. 다시 로그인해주세요.");
          return;
        }

      if (scratchTickets <= 0) {
        alert("보유한 복권이 없어요. 광고를 보고 복권을 받아주세요!");
        return;
      }

      const randomIndex = Math.floor(Math.random() * scratchResults.length);
      const selectedResult = scratchResults[randomIndex];

      const nextScratchTickets = scratchTickets - 1;

      let nextPoints = points;
      let nextEntryTickets = entryTickets;

      if (selectedResult.type === "point") {
        nextPoints = points + selectedResult.amount;
      }

      if (selectedResult.type === "entryTicket") {
        nextEntryTickets = entryTickets + selectedResult.amount;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          scratch_tickets: nextScratchTickets,
          points: nextPoints,
          entry_tickets: nextEntryTickets,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);

      if (error) {
        console.error("복권 결과 Supabase 저장 실패:", error.message);
        alert("복권 결과 저장에 실패했어요. 다시 시도해주세요.");
        return;
      }

      let logAmount = "";

      if (selectedResult.type === "point") {
        logAmount = `+${selectedResult.amount}P`;
      } else if (selectedResult.type === "entryTicket") {
        logAmount = `+${selectedResult.amount}장`;
      } else {
        logAmount = "꽝";
      }

      const { error: logError } = await supabase
          .from("reward_logs")
          .insert({
            profile_id: profileId,
            type: "scratch",
            title: "복권 긁기",
            description: selectedResult.label,
            amount: logAmount,
            emoji: selectedResult.emoji,
          });

        if (logError) {
          console.error("복권 긁기 내역 저장 실패:", logError.message);
        }

      setScratchTickets(nextScratchTickets);
      setPoints(nextPoints);
      setEntryTickets(nextEntryTickets);
      setResult(selectedResult);
      setIsScratched(true);
    }

  function handleReset() {
    setIsScratched(false);
    setResult(scratchResults[1]);
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
            <p className="text-xs font-bold text-[#FF642A]">오늘의 복권</p>
            <h1 className="text-2xl font-black">복권 긁기</h1>
          </div>

          <button
            onClick={handleReset}
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <RotateCcw size={21} />
          </button>
        </header>

        <div className="px-5 pb-32 space-y-5">
          {/* 안내 배너 */}
          <section className="rounded-[30px] bg-gradient-to-br from-[#FFF1DA] to-[#FFE0C4] border border-orange-100 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute right-5 top-5 text-2xl">✨</div>
            <div className="absolute right-16 bottom-5 text-xl">🍀</div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#FFD67A] to-[#FF6A2A] flex items-center justify-center shadow-md border-4 border-white overflow-hidden">
                <Image
                  src="/images/bok-mascot-v2.png"
                  alt="오늘복 복주머니 캐릭터"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[#FF642A] mb-1">광고를 보고 받은 복권</p>
                <h2 className="text-2xl font-black leading-tight">긁으면 오늘의 복이 나와요</h2>
                <p className="text-sm text-[#7E6658] mt-2">포인트 또는 응모권이 당첨될 수 있어요.</p>
              </div>
            </div>
          </section>

          {/* 보유 현황 */}
          <section className="grid grid-cols-3 gap-3">
            <InfoCard icon={<Ticket size={25} />} title="복권" value={`${visibleScratchTickets}장`} />
            <InfoCard icon={<Wallet size={25} />} title="포인트" value={`${visiblePoints}P`} />
            <InfoCard icon={<Gift size={25} />} title="응모권" value={`${visibleEntryTickets}장`} />
          </section>

          {/* 스크래치 카드 */}
          <section className="rounded-[32px] bg-white border border-orange-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-[#FF642A]">오늘복 스크래치</p>
                <h3 className="text-xl font-black">복권을 긁어보세요</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] flex items-center justify-center text-3xl">
                🎁
              </div>
            </div>

            <button
              onClick={handleScratch}
              disabled={isScratched || scratchTickets <= 0 || !isLoggedIn}
              className={`w-full h-[250px] rounded-[30px] border-2 border-dashed flex flex-col items-center justify-center transition active:scale-[0.99] overflow-hidden relative ${
                isScratched
                  ? "bg-gradient-to-br from-[#FFF7DF] to-[#FFE2C5] border-[#FFB36B]"
                  : scratchTickets <= 0
                  ? "bg-[#F1ECE7] border-[#D7CFC8] cursor-not-allowed"
                  : "bg-[repeating-linear-gradient(135deg,#d4d4d4_0px,#d4d4d4_8px,#eeeeee_8px,#eeeeee_16px)] border-[#BBBBBB]"
              }`}
            >
              {!isScratched ? (
                  !isLoggedIn ? (
                    <div className="text-center px-5">
                      <div className="text-6xl mb-4">🔐</div>
                      <p className="text-3xl font-black text-[#6B4B38]">로그인이 필요해요</p>
                      <p className="text-sm font-bold text-[#8A7567] mt-3">
                        로그인하면 복권을 받고 긁을 수 있어요.
                      </p>
                    </div>
                  ) : scratchTickets <= 0 ? (
                    <div className="text-center px-5">
                      <div className="text-6xl mb-4">🎟️</div>
                      <p className="text-3xl font-black text-[#6B4B38]">복권이 없어요</p>
                      <p className="text-sm font-bold text-[#8A7567] mt-3">
                        광고를 보고 오늘복 복권을 받아보세요.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center px-5">
                      <div className="text-6xl mb-4">👉</div>
                      <p className="text-3xl font-black text-[#4A4A4A]">눌러서 긁기</p>
                      <p className="text-sm font-bold text-[#777777] mt-3">
                        여기를 터치하면 결과가 열려요
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center px-5">
                    <div className="text-7xl mb-4">{result.emoji}</div>
                    <p className="text-4xl font-black text-[#FF642A]">{result.label}</p>
                    <p className="text-base font-bold text-[#6B4B38] mt-4">{result.message}</p>
                  </div>
                )}
            </button>

            <div className="mt-5 rounded-2xl bg-[#FFF8EF] border border-orange-100 p-4 flex items-start gap-3">
              <Sparkles className="text-[#FF642A] mt-0.5" size={22} />
              <p className="text-sm leading-relaxed text-[#6B4B38]">
                광고를 보고 받은 복권을 긁으면 결과가 지갑 최근 내역에 자동 저장돼요.
              </p>
            </div>

            {!isLoggedIn ? (
              <Link
                href="/login?next=/scratch"
                className="mt-4 w-full h-14 rounded-[20px] bg-[#FFF4DF] border border-orange-100 text-[#FF642A] font-black shadow-sm active:scale-95 transition flex items-center justify-center"
              >
                로그인하고 복권 받기
              </Link>
            ) : isScratched ? (
              scratchTickets > 0 ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 w-full h-14 rounded-[20px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black shadow-lg shadow-orange-100 active:scale-95 transition flex items-center justify-center"
                >
                  다음 복권 긁기
                </button>
              ) : remainingAds > 0 ? (
                <Link
                  href="/ad"
                  className="mt-4 w-full h-14 rounded-[20px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black shadow-lg shadow-orange-100 active:scale-95 transition flex items-center justify-center"
                >
                  광고 보고 복권 받기
                </Link>
              ) : (
                <div className="mt-4 w-full h-14 rounded-[20px] bg-[#D9D1C8] text-white font-black flex items-center justify-center">
                  오늘 광고 완료
                </div>
              )
            ) : (
              scratchTickets <= 0 && (
                remainingAds > 0 ? (
                  <Link
                    href="/ad"
                    className="mt-4 w-full h-14 rounded-[20px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black shadow-lg shadow-orange-100 active:scale-95 transition flex items-center justify-center"
                  >
                    광고 보고 복권 받기
                  </Link>
                ) : (
                  <div className="mt-4 w-full h-14 rounded-[20px] bg-[#D9D1C8] text-white font-black flex items-center justify-center">
                    오늘 광고 완료
                  </div>
                )
              )
            )}

          </section>

          {isScratched && (
            <AdBanner
              slotId="scratch-result-bottom"
              label="추천"
              title="결과 확인 완료!"
              desc="다른 혜택과 경품 소식도 함께 확인해보세요."
            />
          )}

          {/* 다음 행동 버튼 */}
          <section className="grid grid-cols-2 gap-3">
            <Link
              href="/wallet"
              className="h-16 rounded-[22px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] active:scale-95 transition flex items-center justify-center"
            >
              내 지갑 보기
            </Link>
            <Link
              href="/prizes"
              className="h-16 rounded-[22px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white shadow-lg shadow-orange-200 font-black active:scale-95 transition flex items-center justify-center"
            >
              경품 응모하기
            </Link>
          </section>
        </div>

        {/* 하단 네비게이션 */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-orange-100 px-4 py-3 rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 gap-1">
            <BottomNav href="/" icon={<Home size={24} />} label="홈" />
            <BottomNav active href="/scratch" icon={<Ticket size={24} />} label="복권" />
            <BottomNav href="/prizes" icon={<Gift size={24} />} label="경품함" />
            <BottomNav href="/wallet" icon={<Wallet size={24} />} label="지갑" />
            <BottomNav href="/my" icon={<User size={24} />} label="내정보" />
          </div>
        </nav>
      </section>
    </main>
  );
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
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

