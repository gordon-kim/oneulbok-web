"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Gift, Mail, MessageCircle, ShieldCheck } from "lucide-react";

import { supabase } from "../lib/supabase";
import { ensureCurrentProfile } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function getSafeNextUrl() {
    if (typeof window === "undefined") {
      return "/";
    }

    const searchParams = new URLSearchParams(window.location.search);
    const nextUrl = searchParams.get("next") || "/";

    if (!nextUrl.startsWith("/")) {
      return "/";
    }

    if (nextUrl.startsWith("//")) {
      return "/";
    }

    return nextUrl;
  }

  useEffect(() => {
      async function checkSession() {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          return;
        }

        await ensureCurrentProfile();

        const nextUrl = getSafeNextUrl();

        router.replace(nextUrl);
      }

      checkSession();
    }, [router]);


  async function handleEmailLogin() {
      setErrorMessage("");

      if (!email || !password) {
        setErrorMessage("이메일과 비밀번호를 입력해주세요.");
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage("로그인에 실패했어요. 회원가입이 안 되어 있다면 먼저 가입해주세요.");
        console.error("이메일 로그인 실패:", error.message);
        return;
      }

      await ensureCurrentProfile();

      const nextUrl = getSafeNextUrl();

      setIsLoading(false);
      router.push(nextUrl);
    }

  async function handleKakaoLogin() {
      setErrorMessage("");

      const nextUrl = getSafeNextUrl();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/login?next=${encodeURIComponent(nextUrl)}`,
        },
      });

      if (error) {
        setErrorMessage("카카오 로그인에 실패했어요. 다시 시도해주세요.");
        console.error("카카오 로그인 실패:", error.message);
      }
    }

  async function handleEmailSignUp() {
      setErrorMessage("");

      if (!email || !password) {
        setErrorMessage("이메일과 비밀번호를 입력해주세요.");
        return;
      }

      if (password.length < 6) {
        setErrorMessage("비밀번호는 6자리 이상으로 입력해주세요.");
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage("회원가입에 실패했어요. 이미 가입된 이메일일 수 있어요.");
        console.error("이메일 회원가입 실패:", error.message);
        return;
      }

      if (!data.user) {
      setIsLoading(false);
      setErrorMessage("회원가입 정보를 가져오지 못했어요. 다시 시도해주세요.");
      return;
      }

      const nickname = data.user.email?.split("@")[0] ?? "오늘복 회원님";

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: data.user.id,
          nickname,
          points: 0,
          scratch_tickets: 0,
          entry_tickets: 0,
        });

      if (profileError) {
        setIsLoading(false);
        setErrorMessage("프로필 생성에 실패했어요. 다시 시도해주세요.");
        console.error("프로필 생성 실패:", profileError.message);
        return;
      }

      const nextUrl = getSafeNextUrl();

      setIsLoading(false);
      router.push(nextUrl);
    }

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100 relative flex flex-col">
        <div className="flex-1 px-6 pt-14 pb-8 flex flex-col">
          {/* 로고 영역 */}
          <section className="text-center">
            <div className="w-32 h-32 rounded-[42px] bg-gradient-to-br from-[#FFD67A] to-[#FF6A2A] mx-auto flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
              <Image
                src="/images/bok-mascot-v2.png"
                alt="오늘복 마스코트"
                width={104}
                height={104}
                className="object-contain"
                priority
              />
            </div>

            <p className="text-sm font-black text-[#FF642A] mt-7">매일 받는 작은 복</p>
            <h1 className="text-4xl font-black mt-2 tracking-tight">오늘복</h1>
            <p className="text-base leading-relaxed text-[#7E6658] mt-4">
              광고 보고 복권 받고,
              <br />
              경품 응모로 오늘의 복을 받아보세요.
            </p>
          </section>

          {/* 혜택 요약 */}
          <section className="grid grid-cols-3 gap-3 mt-10">
            <BenefitCard emoji="🎬" title="광고 보기" />
            <BenefitCard emoji="🎟️" title="복권 받기" />
            <BenefitCard emoji="🎁" title="경품 응모" />
          </section>

          {/* 로그인 버튼 */}
          <section className="mt-auto space-y-3 pt-12">
            <button
              onClick={handleKakaoLogin}
              className="w-full h-16 rounded-[22px] bg-[#FEE500] text-[#3B2414] font-black text-lg shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-3"
            >
              <MessageCircle size={24} className="fill-[#3B2414]" />
              카카오로 시작하기
            </button>

            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="이메일"
                className="w-full h-14 rounded-[20px] bg-white border border-orange-100 px-4 font-bold outline-none focus:border-[#FF642A]"
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                className="w-full h-14 rounded-[20px] bg-white border border-orange-100 px-4 font-bold outline-none focus:border-[#FF642A]"
              />

              {errorMessage && (
                <p className="text-sm font-bold text-red-500 text-center">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={handleEmailLogin}
                disabled={isLoading}
                className="w-full h-16 rounded-[22px] bg-white border border-orange-100 text-[#3B2414] font-black text-lg shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <Mail size={23} className="text-[#FF642A]" />
                {isLoading ? "처리 중..." : "이메일로 로그인"}
              </button>

              <button
                onClick={handleEmailSignUp}
                disabled={isLoading}
                className="w-full h-14 rounded-[20px] bg-[#FFF4DF] border border-orange-100 text-[#FF642A] font-black active:scale-[0.98] transition flex items-center justify-center disabled:opacity-60"
              >
                이메일로 회원가입
              </button>
            </div>

            <Link
              href="/"
              className="w-full h-14 rounded-[20px] bg-[#FFF4DF] text-[#FF642A] font-black active:scale-[0.98] transition flex items-center justify-center"
            >
              지금은 둘러보기
            </Link>
          </section>

          {/* 안내 */}
          <section className="mt-6 rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex items-start gap-3">
            <ShieldCheck size={22} className="text-[#FF642A] mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed text-[#7E6658]">
              오늘복은 이메일 로그인과 카카오 로그인을 지원해요. 로그인하면 광고 보상,
              복권, 응모권, 경품 응모 내역이 내 계정에 안전하게 저장돼요.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

function BenefitCard({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4 flex flex-col items-center justify-center min-h-[104px]">
      <div className="text-3xl mb-3">{emoji}</div>
      <p className="text-xs font-black text-[#6B4B38] text-center leading-tight">{title}</p>
    </div>
  );
}
