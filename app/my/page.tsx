"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getCurrentProfile } from "../lib/auth";

import { supabase } from "../lib/supabase";

import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Clock,
  FileText,
  Gift,
  HelpCircle,
  Home,
  LogOut,
  ShieldCheck,
  Ticket,
  User,
  Wallet,
} from "lucide-react";

const menuItems = [
  {
    icon: <Bell size={22} />,
    title: "공지사항",
    desc: "오늘복 운영 안내와 중요한 소식을 확인해요",
    href: "/notice",
  },
  {
    icon: <Clock size={22} />,
    title: "보상 내역",
    desc: "광고 보상, 복권, 경품 응모 기록을 확인해요",
    href: "/wallet/logs",
  },
  {
    icon: <HelpCircle size={22} />,
    title: "문의하기",
    desc: "광고 보상, 경품 지급, 계정 관련 안내를 확인해요",
    href: "/contact",
  },
  {
    icon: <FileText size={22} />,
    title: "이용약관",
    desc: "오늘복 서비스 이용 기준을 확인해요",
    href: "/terms",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "개인정보처리방침",
    desc: "개인정보 처리와 광고 운영 안내를 확인해요",
    href: "/privacy",
  },
];

export default function MyPage() {
  const router = useRouter();

  const [points, setPoints] = useState(0);
  const [entryTickets, setEntryTickets] = useState(0);
  const [entryCount, setEntryCount] = useState(0);
  const [userName, setUserName] = useState("복 많은 사용자님");
  const [joinedAtText, setJoinedAtText] = useState("로그인 후 확인 가능");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scratchTickets, setScratchTickets] = useState(0);

  useEffect(() => {
      async function loadMyData() {
        const profile = await getCurrentProfile();

        if (!profile) {
          setIsLoggedIn(false);
          setUserName("복 많은 사용자님");
          setJoinedAtText("로그인 후 확인 가능");
          setPoints(0);
          setScratchTickets(0);
          setEntryTickets(0);
          setEntryCount(0);
          return;
        }

        setIsLoggedIn(true);
        setUserName(profile.nickname ?? "오늘복 회원님");
        setJoinedAtText(formatJoinedAt(profile.created_at));
        setPoints(profile.points ?? 0);
        setScratchTickets(profile.scratch_tickets ?? 0);
        setEntryTickets(profile.entry_tickets ?? 0);

        const { count, error } = await supabase
          .from("prize_entries")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", profile.id);

        if (error) {
          console.error("내 응모중 건수 불러오기 실패:", error.message);
          setEntryCount(0);
          return;
        }

        setEntryCount(count ?? 0);
      }

      loadMyData();
    }, []);

  const visiblePoints = isLoggedIn ? points : 0;
  const visibleEntryTickets = isLoggedIn ? entryTickets : 0;
  const visibleEntryCount = isLoggedIn ? entryCount : 0;
  const visibleScratchTickets = isLoggedIn ? scratchTickets : 0;

  function formatJoinedAt(value: string | null | undefined) {
      if (!value) {
        return "가입일 확인 불가";
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "가입일 확인 불가";
      }

      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }


  async function handleMockLogout() {
      const isConfirmed = window.confirm("로그아웃할까요?");

      if (!isConfirmed) {
        return;
      }

      await supabase.auth.signOut();

      setIsLoggedIn(false);
      setUserName("복 많은 사용자님");
      setJoinedAtText("로그인 후 확인 가능");
      setPoints(0);
      setScratchTickets(0);
      setEntryTickets(0);
      setEntryCount(0);

      alert("로그아웃됐어요.");

      router.push("/");
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
            <p className="text-xs font-bold text-[#FF642A]">내 계정</p>
            <h1 className="text-2xl font-black">내정보</h1>
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
          {/* 프로필 카드 */}
          <section className="rounded-[32px] bg-gradient-to-br from-[#FFF1DA] to-[#FFE0C4] border border-orange-100 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute right-5 top-5 text-2xl">✨</div>
            <div className="absolute right-10 bottom-6 text-xl">🍀</div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#FFD67A] to-[#FF6A2A] flex items-center justify-center shadow-md border-4 border-white overflow-hidden">
                <Image
                  src="/images/bok-mascot-v2.png"
                  alt="오늘복 복주머니 캐릭터"
                  width={78}
                  height={78}
                  className="object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#FF642A] mb-1">
                  {isLoggedIn ? "오늘복 회원" : "둘러보기 이용자"}
                </p>
                <h2 className="text-2xl font-black leading-tight">{userName}</h2>
                <p className="text-sm text-[#7E6658] mt-2">
                  {isLoggedIn ? `가입일 ${joinedAtText}` : joinedAtText}
                </p>
              </div>
            </div>
          </section>

          {!isLoggedIn && (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5">
              <p className="text-sm font-black text-[#FF642A] mb-2">
                로그인이 필요해요
              </p>
              <p className="text-sm leading-relaxed text-[#6B4B38]">
                로그인하면 내 포인트, 복권, 응모권, 경품 응모 현황을 확인할 수 있어요.
              </p>

              <Link
                href="/login?next=/my"
                className="mt-4 h-12 rounded-[18px] bg-gradient-to-r from-[#FF5C22] to-[#FF7A2F] text-white font-black active:scale-95 transition flex items-center justify-center"
              >
                로그인하고 내정보 보기
              </Link>
            </section>
          )}

          {/* 내 요약 */}
          <section className="grid grid-cols-4 gap-2">
            <SummaryCard title="포인트" value={`${visiblePoints}P`} />
            <SummaryCard title="복권" value={`${visibleScratchTickets}장`} />
            <SummaryCard title="응모권" value={`${visibleEntryTickets}장`} />
            <SummaryCard title="응모중" value={`${visibleEntryCount}건`} />
          </section>

          {/* 베타 운영 안내 */}
          <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
                <Bell size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#FF642A]">베타 운영 중</p>
                <h3 className="text-xl font-black mt-1">오늘복 기능을 안정화하고 있어요</h3>
                <p className="text-sm text-[#7E6658] mt-2 leading-relaxed">
                  광고 보상, 복권, 경품 응모 기능은 운영 상황에 따라 조정될 수 있어요.
                  중요한 안내는 공지사항에서 확인할 수 있어요.
                </p>

                <Link
                  href="/notice"
                  className="mt-4 h-12 rounded-[18px] bg-[#FFF4DF] text-[#FF642A] font-black active:scale-95 transition flex items-center justify-center"
                >
                  공지사항 보기
                </Link>
              </div>
            </div>
          </section>

          {/* 메뉴 */}
          <section className="space-y-3">
            <h3 className="text-xl font-black">설정과 안내</h3>
            <div className="space-y-3">
              {menuItems.map((item) => (
                <MenuCard key={item.title} item={item} />
              ))}
            </div>
          </section>

          {/* 로그인 화면 이동 */}
            {isLoggedIn ? (
              <button
                onClick={handleMockLogout}
                className="w-full h-15 rounded-[22px] bg-white border border-orange-100 shadow-sm font-black text-[#8A7567] active:scale-95 transition flex items-center justify-center gap-2 py-4"
              >
                <LogOut size={20} />
                로그아웃
              </button>
            ) : (
              <Link
                href="/login?next=/my"
                className="w-full h-15 rounded-[22px] bg-white border border-orange-100 shadow-sm font-black text-[#8A7567] active:scale-95 transition flex items-center justify-center gap-2 py-4"
              >
                <LogOut size={20} />
                로그인하기
              </Link>
            )}
        </div>

        {/* 하단 네비게이션 */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-orange-100 px-4 py-3 rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 gap-1">
            <BottomNav href="/" icon={<Home size={24} />} label="홈" />
            <BottomNav href="/scratch" icon={<Ticket size={24} />} label="복권" />
            <BottomNav href="/prizes" icon={<Gift size={24} />} label="경품함" />
            <BottomNav href="/wallet" icon={<Wallet size={24} />} label="지갑" />
            <BottomNav active href="/my" icon={<User size={24} />} label="내정보" />
          </div>
        </nav>
      </section>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex flex-col items-center justify-center min-h-[104px]">
      <p className="text-xs font-bold text-[#8A7567]">{title}</p>
      <p className="text-xl font-black mt-2">{value}</p>
    </div>
  );
}

function MenuCard({ item }: { item: (typeof menuItems)[number] }) {
  const content = (
    <>
      <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black leading-tight">{item.title}</h4>
        <p className="text-sm text-[#7E6658] mt-1 leading-tight">{item.desc}</p>
      </div>
      <ChevronRight size={19} className="text-[#B8A99F] shrink-0" />
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className="w-full rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-center gap-4 text-left active:scale-[0.99] transition"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={() => alert("준비 중인 기능이에요.")}
      className="w-full rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-center gap-4 text-left active:scale-[0.99] transition"
    >
      {content}
    </button>
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
