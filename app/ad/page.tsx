"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  Home,
  Play,
  Ticket,
  User,
  Wallet,
  Clock,
} from "lucide-react";

import {
  getTodayKey,
} from "../lib/storage";

import { supabase } from "../lib/supabase";
import { getCurrentProfile } from "../lib/auth";

export default function AdPage() {
  const DAILY_AD_LIMIT = 10;



  const [secondsLeft, setSecondsLeft] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adViewsToday, setAdViewsToday] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  const rewardGivenRef = useRef(false);

    useEffect(() => {
      async function loadAdViewData() {
        const profile = await getCurrentProfile();

        if (!profile) {
          setIsLoggedIn(false);
          setProfileId(null);
          setAdViewsToday(0);
          setIsLimitReached(false);
          return;
        }

        setIsLoggedIn(true);
        setProfileId(profile.id);

        const todayKey = getTodayKey();

        const { data, error } = await supabase
          .from("ad_views")
          .select("view_count")
          .eq("profile_id", profile.id)
          .eq("view_date", todayKey)
          .maybeSingle();

        if (error) {
          console.error("광고 시청 횟수 불러오기 실패:", error.message);
          setAdViewsToday(0);
          setIsLimitReached(false);
          return;
        }

        if (!data) {
          const { error: insertError } = await supabase
            .from("ad_views")
            .insert({
              profile_id: profile.id,
              view_date: todayKey,
              view_count: 0,
            });

          if (insertError) {
            console.error("오늘 광고 시청 row 생성 실패:", insertError.message);
          }

          setAdViewsToday(0);
          setIsLimitReached(false);
          return;
        }

        const currentAdViews = data.view_count ?? 0;

        setAdViewsToday(currentAdViews);

        if (currentAdViews >= DAILY_AD_LIMIT) {
          setIsLimitReached(true);
        }
      }

      loadAdViewData();
    }, []);

  useEffect(() => {
      if (!isLoggedIn || !profileId) {
        return;
      }

      if (isLimitReached) {
        return;
      }

      if (secondsLeft <= 0) {
        setIsCompleted(true);

        async function giveAdReward() {
          if (rewardGivenRef.current) {
            return;
          }
          if (!profileId) {
            rewardGivenRef.current = false;
            return;
          }

          rewardGivenRef.current = true;

          const todayKey = getTodayKey();

          const { data: adViewData, error: adViewReadError } = await supabase
            .from("ad_views")
            .select("view_count")
            .eq("profile_id", profileId)
            .eq("view_date", todayKey)
            .maybeSingle();

          if (adViewReadError) {
            console.error("광고 보상 전 시청 횟수 조회 실패:", adViewReadError.message);
            rewardGivenRef.current = false;
            return;
          }

          const currentAdViews = adViewData?.view_count ?? 0;

          if (currentAdViews >= DAILY_AD_LIMIT) {
            setIsLimitReached(true);
            return;
          }

          const { data: profile, error: readError } = await supabase
            .from("profiles")
            .select("scratch_tickets, entry_tickets")
            .eq("id", profileId)
            .single();

          if (readError) {
            console.error("광고 보상 지급 전 프로필 조회 실패:", readError.message);
            rewardGivenRef.current = false;
            return;
          }

          const nextScratchTickets = (profile.scratch_tickets ?? 0) + 1;
          const nextEntryTickets = (profile.entry_tickets ?? 0) + 1;

          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              scratch_tickets: nextScratchTickets,
              entry_tickets: nextEntryTickets,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profileId);

          if (updateError) {
            console.error("광고 보상 Supabase 저장 실패:", updateError.message);
            rewardGivenRef.current = false;
            return;
          }

          const nextAdViews = currentAdViews + 1;

          const { error: adViewUpdateError } = await supabase
            .from("ad_views")
            .upsert({
              profile_id: profileId,
              view_date: todayKey,
              view_count: nextAdViews,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: "profile_id,view_date",
            });

          if (adViewUpdateError) {
            console.error("광고 시청 횟수 저장 실패:", adViewUpdateError.message);
            rewardGivenRef.current = false;
            return;
          }

          const { error: logError } = await supabase
              .from("reward_logs")
              .insert({
                profile_id: profileId,
                type: "ad",
                title: "광고 시청",
                description: "복권 1장, 응모권 1장 지급",
                amount: "+1회",
                emoji: "🎬",
              });

            if (logError) {
              console.error("광고 보상 내역 저장 실패:", logError.message);
            }

          setAdViewsToday(nextAdViews);
        }

        giveAdReward();
        return;
      }

      const timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }, [secondsLeft, isLimitReached, isLoggedIn, profileId]);

  const progressPercent = ((15 - secondsLeft) / 15) * 100;

      if (!isLoggedIn) {
      return (
        <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
          <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100 relative flex flex-col justify-center px-6">
            <div className="text-center">
              <div className="w-28 h-28 rounded-[36px] bg-[#FFF4DF] border border-orange-100 mx-auto flex items-center justify-center overflow-hidden mb-6">
                <Image
                  src="/images/bok-mascot-v2.png"
                  alt="오늘복 캐릭터"
                  width={86}
                  height={86}
                  className="object-contain"
                />
              </div>

              <p className="text-sm font-bold text-[#FF642A] mb-2">
                로그인 필요
              </p>

              <h1 className="text-3xl font-black leading-tight">
                로그인하면 오늘의 복을
                <br />
                받을 수 있어요
              </h1>

              <p className="text-base text-[#6B4B38] mt-5 leading-relaxed">
                광고 보상, 복권, 응모권은 로그인 후 이용할 수 있어요.
              </p>

              <Link
                href="/login?next=/ad"
                className="mt-8 w-full h-16 rounded-[22px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white shadow-lg shadow-orange-200 font-black active:scale-95 transition flex items-center justify-center"
              >
                로그인하고 복 받기
              </Link>

              <Link
                href="/"
                className="mt-3 w-full h-14 rounded-[20px] bg-[#FFF4DF] text-[#FF642A] font-black active:scale-95 transition flex items-center justify-center"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </section>
        </main>
      );
    }

    if (isLimitReached) {
      return (
        <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
          <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100 relative flex flex-col justify-center px-6">
            <div className="text-center">
              <div className="w-28 h-28 rounded-[36px] bg-[#FFF4DF] border border-orange-100 mx-auto flex items-center justify-center overflow-hidden mb-6">
                <Image
                  src="/images/bok-mascot-v2.png"
                  alt="오늘복 캐릭터"
                  width={86}
                  height={86}
                  className="object-contain"
                />
              </div>

              <p className="text-sm font-bold text-[#FF642A] mb-2">
                오늘 광고 시청 완료
              </p>
              <h1 className="text-3xl font-black leading-tight">
                오늘 받을 수 있는 복을
                <br />
                모두 받았어요
              </h1>

              <p className="text-base text-[#6B4B38] mt-5 leading-relaxed">
                하루 광고는 최대 {DAILY_AD_LIMIT}회까지 볼 수 있어요.
                <br />
                내일 다시 새로운 복을 받아보세요.
              </p>

              <div className="mt-8 rounded-[24px] bg-white border border-orange-100 shadow-sm p-5">
                <p className="text-sm font-bold text-[#8A7567]">오늘 광고 시청</p>
                <p className="text-4xl font-black mt-2">
                  {adViewsToday} / {DAILY_AD_LIMIT}
                </p>
              </div>

              <Link
                href="/"
                className="mt-8 w-full h-16 rounded-[22px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white shadow-lg shadow-orange-200 font-black active:scale-95 transition flex items-center justify-center"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </section>
        </main>
      );
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
            <p className="text-xs font-bold text-[#FF642A]">광고 보기</p>
            <h1 className="text-2xl font-black">오늘복 받기</h1>
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
          {/* 광고 영역 */}
          <section className="rounded-[34px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] min-h-[340px] p-6 shadow-lg relative overflow-hidden text-white flex flex-col justify-between">
            <div className="absolute right-5 top-5 text-3xl opacity-30">✨</div>
            <div className="absolute left-5 bottom-5 text-6xl opacity-10">福</div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white/70">광고 시청 중</p>
                <h2 className="text-3xl font-black mt-1">오늘의 복 준비중</h2>
              </div>

              <div className="w-16 h-16 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Play size={30} className="fill-white" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center py-10">
              {!isCompleted ? (
                <>
                  <div className="w-36 h-36 rounded-full bg-white/15 border border-white/20 flex flex-col items-center justify-center shadow-inner">
                    <Clock size={30} className="mb-2 text-white/80" />
                    <p className="text-6xl font-black">{secondsLeft}</p>
                    <p className="text-sm font-bold text-white/70 mt-1">초 남음</p>
                  </div>
                  <p className="text-sm text-white/75 mt-5 text-center leading-relaxed">
                    광고가 끝나면 복권 1장과 응모권 1장이 지급돼요.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center shadow-lg">
                    <CheckCircle2 size={58} className="text-[#43A047]" />
                    <p className="text-lg font-black text-[#3B2414] mt-2">완료!</p>
                  </div>
                  <p className="text-lg font-black mt-5 text-center leading-relaxed">
                    복권과 응모권이 지급됐어요
                  </p>
                </>
              )}
            </div>

            <div className="relative z-10">
              <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD67A] to-[#FF8A3D] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </section>

          {/* 지급 보상 카드 */}
          <section className="grid grid-cols-2 gap-3">
            <RewardCard icon={<Ticket size={28} />} title="복권" value="1장" active={isCompleted} />
            <RewardCard icon={<Gift size={28} />} title="응모권" value="1장" active={isCompleted} />
          </section>

          {/* 완료 전/후 버튼 */}
          {!isCompleted ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4">
              <p className="text-sm font-black text-[#FF642A] mb-2">잠깐만 기다려주세요</p>
              <p className="text-sm leading-relaxed text-[#6B4B38]">
                지금은 실제 광고 대신 테스트용 카운트다운이에요. 나중에 실제 광고 네트워크를 연결하면 광고 완료 후 보상이 지급되도록 바꿀 거예요.
              </p>
            </section>
          ) : (
            <section className="space-y-3">
              <Link
                href="/scratch"
                className="w-full h-16 rounded-[22px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white shadow-lg shadow-orange-200 font-black active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Ticket size={22} />
                복권 긁으러 가기
              </Link>
              <Link
                href="/prizes"
                className="w-full h-16 rounded-[22px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Gift size={22} className="text-[#FF642A]" />
                경품 응모하러 가기
              </Link>
            </section>
          )}
        </div>

        {/* 하단 네비게이션 */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-orange-100 px-4 py-3 rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 gap-1">
            <BottomNav href="/" icon={<Home size={24} />} label="홈" />
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

function RewardCard({
  icon,
  title,
  value,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-[26px] border shadow-sm p-5 flex items-center gap-4 transition ${
        active ? "bg-white border-orange-100" : "bg-white/60 border-orange-50 opacity-70"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          active ? "bg-[#FFF4DF] text-[#FF642A]" : "bg-gray-100 text-gray-400"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-[#8A7567]">{title}</p>
        <p className="text-2xl font-black mt-1">{active ? value : "대기"}</p>
      </div>
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
