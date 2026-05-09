"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TestSupabasePage() {
  const [message, setMessage] = useState("Supabase 연결 확인 중...");

  useEffect(() => {
    async function checkSupabaseConnection() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setMessage(`Supabase 연결 실패: ${error.message}`);
        return;
      }

      setMessage("Supabase 연결 성공! 오늘복이 서버와 연결됐어요.");
      console.log("Supabase session data:", data);
    }

    checkSupabaseConnection();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex items-center justify-center px-4 text-[#3B2414]">
      <section className="w-full max-w-[430px] rounded-[32px] bg-white border border-orange-100 shadow-xl p-8 text-center">
        <p className="text-sm font-black text-[#FF642A] mb-3">
          Supabase 연결 테스트
        </p>

        <h1 className="text-2xl font-black leading-tight">
          오늘복 서버 연결 확인
        </h1>

        <p className="mt-6 text-base font-bold text-[#6B4B38] leading-relaxed">
          {message}
        </p>
      </section>
    </main>
  );
}