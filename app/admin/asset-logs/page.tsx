"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Coins,
  Gift,
  Ticket,
  User,
  FileText,
  Clock,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type AdminAssetLog = {
  id: string;
  profile_id: string;
  admin_user_id: string | null;
  nickname: string | null;
  email: string | null;
  previous_points: number;
  previous_scratch_tickets: number;
  previous_entry_tickets: number;
  next_points: number;
  next_scratch_tickets: number;
  next_entry_tickets: number;
  memo: string | null;
  created_at: string;
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDiff(next: number, previous: number) {
  const diff = next - previous;

  if (diff > 0) {
    return `+${diff}`;
  }

  return `${diff}`;
}

function getDiffClass(next: number, previous: number) {
  const diff = next - previous;

  if (diff > 0) {
    return "text-[#2E7D32]";
  }

  if (diff < 0) {
    return "text-[#D84315]";
  }

  return "text-[#8A7567]";
}

export default function AdminAssetLogsPage() {
  const [logs, setLogs] = useState<AdminAssetLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAssetLogs() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase.rpc("get_admin_asset_logs");

      if (error) {
        console.error("관리자 조정 이력 조회 실패:", error.message);
        setErrorMessage("관리자 조정 이력을 불러오지 못했어요.");
        setLogs([]);
        setIsLoading(false);
        return;
      }

      setLogs((data ?? []) as AdminAssetLog[]);
      setIsLoading(false);
    }

    loadAssetLogs();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <header className="px-6 pt-6 pb-4 flex items-center gap-4">
          <Link
            href="/admin"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div>
            <p className="text-xs font-bold text-[#FF642A]">관리자 운영</p>
            <h1 className="text-2xl font-black">조정 이력</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[28px] bg-[#4B2A16] text-white p-5 shadow-lg">
            <p className="text-sm font-bold text-white/70">운영 감사</p>
            <h2 className="text-2xl font-black mt-1">
              관리자 자산 조정 이력
            </h2>
            <p className="text-sm leading-relaxed text-white/80 mt-3">
              회원의 포인트, 복권, 응모권을 수동 조정한 내역을 최근순으로
              확인해요.
            </p>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mb-3">
                <FileText size={24} />
              </div>
              <p className="text-xs font-bold text-[#8A7567]">최근 이력</p>
              <p className="text-2xl font-black mt-1">{logs.length}건</p>
            </div>

            <div className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mb-3">
                <Clock size={24} />
              </div>
              <p className="text-xs font-bold text-[#8A7567]">조회 기준</p>
              <p className="text-2xl font-black mt-1">최대 200건</p>
            </div>
          </section>

          {isLoading && (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5 text-center">
              <p className="font-black text-[#FF642A]">
                조정 이력을 불러오는 중이에요...
              </p>
            </section>
          )}

          {!isLoading && errorMessage && (
            <section className="rounded-[24px] bg-red-50 border border-red-100 p-5">
              <p className="font-black text-red-600">{errorMessage}</p>
              <p className="text-sm text-red-500 mt-2">
                관리자 권한 또는 RPC 설정을 확인해 주세요.
              </p>
            </section>
          )}

          {!isLoading && !errorMessage && logs.length === 0 && (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5 text-center">
              <p className="font-black">아직 조정 이력이 없어요.</p>
              <p className="text-sm text-[#8A7567] mt-2">
                회원 상세에서 포인트/복권/응모권을 수정하면 여기에 표시돼요.
              </p>
            </section>
          )}

          {!isLoading && !errorMessage && logs.length > 0 && (
            <section className="space-y-3">
              {logs.map((log) => (
                <article
                  key={log.id}
                  className="rounded-[26px] bg-white border border-orange-100 shadow-sm p-4 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
                        <User size={24} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-black text-[#3B2414] truncate">
                          {log.nickname || "닉네임 없음"}
                        </p>
                        <p className="text-xs font-bold text-[#8A7567] mt-1 break-all">
                          {log.email || "관리자 정보 없음"}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] font-bold text-[#8A7567] shrink-0 text-right">
                      {formatDateTime(log.created_at)}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <AssetDiffBox
                      icon={<Coins size={18} />}
                      title="포인트"
                      previous={log.previous_points}
                      next={log.next_points}
                      unit="P"
                    />

                    <AssetDiffBox
                      icon={<Ticket size={18} />}
                      title="복권"
                      previous={log.previous_scratch_tickets}
                      next={log.next_scratch_tickets}
                      unit="장"
                    />

                    <AssetDiffBox
                      icon={<Gift size={18} />}
                      title="응모권"
                      previous={log.previous_entry_tickets}
                      next={log.next_entry_tickets}
                      unit="장"
                    />
                  </div>

                  <div className="rounded-[20px] bg-[#FFF8EF] border border-orange-100 p-3">
                    <p className="text-xs font-black text-[#FF642A] mb-1">
                      관리자 메모
                    </p>
                    <p className="text-sm leading-relaxed text-[#6B4B38] whitespace-pre-wrap">
                      {log.memo || "메모 없음"}
                    </p>
                  </div>

                  <Link
                    href={`/admin/users/${log.profile_id}`}
                    className="w-full h-12 rounded-[18px] bg-[#FFF4DF] text-[#FF642A] font-black active:scale-95 transition flex items-center justify-center"
                  >
                    회원 상세 보기
                  </Link>
                </article>
              ))}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

function AssetDiffBox({
  icon,
  title,
  previous,
  next,
  unit,
}: {
  icon: React.ReactNode;
  title: string;
  previous: number;
  next: number;
  unit: string;
}) {
  return (
    <div className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-3">
      <div className="flex items-center gap-1.5 text-[#FF642A] mb-2">
        {icon}
        <p className="text-xs font-black">{title}</p>
      </div>

      <p className="text-[11px] font-bold text-[#8A7567]">
        {previous}
        {unit} → {next}
        {unit}
      </p>

      <p className={`text-lg font-black mt-1 ${getDiffClass(next, previous)}`}>
        {formatDiff(next, previous)}
        {unit}
      </p>
    </div>
  );
}