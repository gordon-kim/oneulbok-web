"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Database,
  Gift,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type AdRewardLog = {
  id: string;
  user_id: string;
  ad_type: string;
  reward_type: string;
  reward_amount: number;
  provider: string;
  provider_event_id: string | null;
  status: string;
  memo: string | null;
  created_at: string;
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRewardLabel(rewardType: string) {
  if (rewardType === "scratch_ticket_entry_ticket") {
    return "복권 + 응모권";
  }

  if (rewardType === "scratch_ticket") {
    return "복권";
  }

  if (rewardType === "entry_ticket") {
    return "응모권";
  }

  if (rewardType === "point") {
    return "포인트";
  }

  return rewardType;
}

function getStatusLabel(status: string) {
  if (status === "completed") {
    return "지급 완료";
  }

  if (status === "pending") {
    return "대기";
  }

  if (status === "failed") {
    return "실패";
  }

  return status;
}

function shortenId(value: string) {
  if (!value) {
    return "-";
  }

  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

export default function AdminAdRewardsPage() {
  const [logs, setLogs] = useState<AdRewardLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase.rpc("admin_get_ad_reward_logs");

      if (error) {
        console.error("광고 보상 로그 조회 실패:", error.message);
        setErrorMessage("광고 보상 로그를 불러오지 못했어요.");
        setLogs([]);
        setIsLoading(false);
        return;
      }

      setLogs((data ?? []) as AdRewardLog[]);
      setIsLoading(false);
    }

    loadLogs();
  }, []);

  const completedCount = logs.filter((log) => log.status === "completed").length;

  const totalRewardAmount = logs.reduce((sum, log) => {
    return sum + (log.reward_amount ?? 0);
  }, 0);

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <div className="px-5 pt-6 pb-8">
          <header className="mb-5 flex items-center justify-between gap-3">
            <Link
              href="/admin"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-white shadow-sm active:scale-95"
            >
              <ArrowLeft size={22} />
            </Link>

            <div className="flex-1">
              <p className="text-sm font-black text-[#FF642A]">관리자</p>
              <h1 className="text-2xl font-black">광고 보상 로그</h1>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-[#FFF4DF] text-[#FF642A] shadow-sm">
              <Database size={22} />
            </div>
          </header>

          <section className="mb-5 grid grid-cols-1 gap-3">
            <SummaryCard
              icon={<Clock size={22} />}
              label="최근 로그"
              value={`${logs.length}건`}
            />

            <SummaryCard
              icon={<ShieldCheck size={22} />}
              label="지급 완료"
              value={`${completedCount}건`}
            />

            <SummaryCard
              icon={<Gift size={22} />}
              label="보상 수량 합계"
              value={`${totalRewardAmount}`}
            />
          </section>

          <section className="rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">최근 광고 보상 내역</h2>
                <p className="mt-1 text-sm font-bold text-[#8A7567]">
                  최근 200건까지 표시돼요.
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4DF] text-[#FF642A]">
                <Ticket size={22} />
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-[22px] bg-[#FFF8EF] p-8 text-center font-black text-[#8A7567]">
                불러오는 중...
              </div>
            ) : errorMessage ? (
              <div className="rounded-[22px] bg-red-50 p-8 text-center font-black text-red-500">
                {errorMessage}
              </div>
            ) : logs.length === 0 ? (
              <div className="rounded-[22px] bg-[#FFF8EF] p-8 text-center font-black text-[#8A7567]">
                아직 광고 보상 로그가 없어요.
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <AdRewardLogCard key={log.id} log={log} />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-orange-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF4DF] text-[#FF642A]">
        {icon}
      </div>

      <p className="text-sm font-bold text-[#8A7567]">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

function AdRewardLogCard({ log }: { log: AdRewardLog }) {
  return (
    <article className="rounded-[24px] border border-orange-100 bg-[#FFFCF7] p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#8A7567]">보상</p>
          <h3 className="mt-1 text-lg font-black text-[#FF642A]">
            {getRewardLabel(log.reward_type)}
          </h3>
        </div>

        <span className="shrink-0 rounded-full bg-[#FFF4DF] px-3 py-1 text-xs font-black text-[#FF642A]">
          {getStatusLabel(log.status)}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <InfoRow label="지급 시간" value={formatDateTime(log.created_at)} />
        <InfoRow label="광고 유형" value={log.ad_type} />
        <InfoRow label="보상 수량" value={`${log.reward_amount}`} />
        <InfoRow label="제공자" value={log.provider} />
        <InfoRow label="사용자 ID" value={shortenId(log.user_id)} mono />
        <InfoRow label="메모" value={log.memo ?? "-"} />
      </div>
    </article>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl bg-white px-3 py-2">
      <span className="shrink-0 text-xs font-black text-[#8A7567]">
        {label}
      </span>
      <span
        className={`text-right text-sm font-bold text-[#3B2414] break-all ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}