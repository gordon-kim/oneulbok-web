"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Gift,
  Megaphone,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type RecentProfile = {
  id: string;
  nickname: string | null;
  created_at: string | null;
};

type RecentPrizeEntry = {
  id: string;
  prize_title: string;
  ticket_cost: number;
  created_at: string;
  nickname: string | null;
};

export default function AdminPage() {
  const [memberCount, setMemberCount] = useState(0);
  const [adViewTotal, setAdViewTotal] = useState(0);
  const [scratchLogCount, setScratchLogCount] = useState(0);
  const [prizeEntryCount, setPrizeEntryCount] = useState(0);

  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>([]);
  const [recentPrizeEntries, setRecentPrizeEntries] = useState<RecentPrizeEntry[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAdminData() {
      setIsLoading(true);

      const { data, error } = await supabase.rpc("get_admin_dashboard");

      if (error) {
        console.error("관리자 대시보드 조회 실패:", error.message);

        setMemberCount(0);
        setAdViewTotal(0);
        setScratchLogCount(0);
        setPrizeEntryCount(0);
        setRecentProfiles([]);
        setRecentPrizeEntries([]);

        if (error.message.includes("not allowed")) {
          setErrorMessage("관리자 권한이 필요해요.");
        } else {
          setErrorMessage("관리자 데이터를 불러오지 못했어요.");
        }

        setIsLoading(false);
        return;
      }

      setErrorMessage("");

      setMemberCount(data?.memberCount ?? 0);
      setAdViewTotal(data?.adViewTotal ?? 0);
      setScratchLogCount(data?.scratchLogCount ?? 0);
      setPrizeEntryCount(data?.prizeEntryCount ?? 0);
      setRecentProfiles(data?.recentProfiles ?? []);
      setRecentPrizeEntries(data?.recentPrizeEntries ?? []);

      setIsLoading(false);
    }

    loadAdminData();
  }, []);

 return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <header className="px-6 pt-6 pb-4 flex items-center gap-4">
          <Link
            href="/"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div>
            <p className="text-xs font-bold text-[#FF642A]">오늘복 운영</p>
            <h1 className="text-2xl font-black">관리자 대시보드</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
            <p className="text-sm font-bold text-white/70">운영 현황</p>
            <h2 className="text-2xl font-black mt-1">
              오늘복 MVP 관리자 화면
            </h2>
            <p className="text-sm leading-relaxed text-white/75 mt-3">
              회원, 광고 시청, 복권, 경품 응모 현황을 한눈에 확인하는
              운영용 대시보드예요.
            </p>
          </section>

          <Link
            href="/admin/users"
            className="h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Users size={21} className="text-[#FF642A]" />
            회원 목록 보기
          </Link>

          <Link
            href="/admin/prize-entries"
            className="h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Gift size={21} className="text-[#FF642A]" />
            경품 응모 내역 보기
          </Link>

          <Link
            href="/admin/prizes"
            className="h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Trophy size={21} className="text-[#FF642A]" />
            경품별 현황 보기
          </Link>

          <Link
            href="/admin/winners"
            className="h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Trophy size={21} className="text-[#FF642A]" />
            당첨 내역 보기
          </Link>

          <Link
            href="/admin/ad-rewards"
            className="h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#3B2414] flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Megaphone size={21} className="text-[#FF642A]" />
            광고 보상 로그 보기
          </Link>

          {isLoading ? (
              <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
                <p className="font-black text-[#FF642A]">
                  관리자 데이터를 불러오는 중...
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
            ) : (
              <>
                <section className="grid grid-cols-2 gap-3">
                  <AdminStatCard
                    icon={<Users size={24} />}
                    title="총 회원"
                    value={`${memberCount}명`}
                  />

                  <AdminStatCard
                    icon={<Megaphone size={24} />}
                    title="광고 시청"
                    value={`${adViewTotal}회`}
                  />

                  <AdminStatCard
                    icon={<Ticket size={24} />}
                    title="복권 긁기"
                    value={`${scratchLogCount}회`}
                  />

                  <AdminStatCard
                    icon={<Gift size={24} />}
                    title="경품 응모"
                    value={`${prizeEntryCount}건`}
                  />
                </section>

              <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={21} className="text-[#FF642A]" />
                  <h3 className="text-lg font-black">최근 가입자</h3>
                </div>

                {recentProfiles.length === 0 ? (
                  <p className="text-sm text-[#7E6658]">최근 가입자가 없어요.</p>
                ) : (
                  <div className="space-y-3">
                    {recentProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="rounded-[20px] bg-[#FFF8EF] border border-orange-100 p-4"
                      >
                        <p className="font-black">
                          {profile.nickname ?? "이름 없는 회원"}
                        </p>
                        <p className="text-xs text-[#8A7567] mt-1">
                          가입일:{" "}
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleString("ko-KR")
                            : "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Gift size={21} className="text-[#FF642A]" />
                  <h3 className="text-lg font-black">최근 경품 응모</h3>
                </div>

                {recentPrizeEntries.length === 0 ? (
                  <p className="text-sm text-[#7E6658]">최근 응모 내역이 없어요.</p>
                ) : (
                  <div className="space-y-3">
                    {recentPrizeEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-[20px] bg-[#FFF8EF] border border-orange-100 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-black">{entry.prize_title}</p>
                            <p className="text-xs text-[#8A7567] mt-1">
                              회원: {entry.nickname ?? "알 수 없음"}
                            </p>
                          </div>

                          <p className="font-black text-[#FF642A]">
                            -{entry.ticket_cost}장
                          </p>
                        </div>

                        <p className="text-xs text-[#8A7567] mt-2">
                          응모일:{" "}
                          {new Date(entry.created_at).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              현재 관리자 페이지는 기초 조회용 화면이에요. 다음 단계에서 관리자 권한 제한,
              회원 상세 조회, 당첨자 추첨 기능을 추가할 수 있어요.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

function AdminStatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 min-h-[118px]">
      <div className="w-11 h-11 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs font-bold text-[#8A7567]">{title}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}