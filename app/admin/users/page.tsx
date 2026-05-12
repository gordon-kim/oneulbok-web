"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Gift,
  Ticket,
  User,
  Users,
  Wallet,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

type AdminUser = {
  id: string;
  user_id: string | null;
  nickname: string | null;
  points: number | null;
  scratch_tickets: number | null;
  entry_tickets: number | null;
  created_at: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);

      const { data, error } = await supabase.rpc("get_admin_users");

      if (error) {
        console.error("관리자 회원 목록 조회 실패:", error.message);

        if (error.message.includes("not allowed")) {
          setErrorMessage("관리자 권한이 필요해요.");
        } else {
          setErrorMessage("회원 목록을 불러오지 못했어요.");
        }

        setUsers([]);
        setIsLoading(false);
        return;
      }

      setErrorMessage("");
      setUsers((data ?? []) as AdminUser[]);
      setIsLoading(false);
    }

    loadUsers();
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
            <p className="text-xs font-bold text-[#FF642A]">오늘복 운영</p>
            <h1 className="text-2xl font-black">회원 목록</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                <Users size={26} />
              </div>

              <div>
                <p className="text-sm font-bold text-white/70">전체 회원 관리</p>
                <h2 className="text-2xl font-black mt-1">
                  총 {users.length}명
                </h2>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/75 mt-4">
              가입한 회원의 포인트, 복권, 응모권 보유 현황을 확인할 수 있어요.
            </p>
          </section>

          {isLoading ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#FF642A]">
                회원 목록을 불러오는 중...
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
          ) : users.length === 0 ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#3B2414]">회원이 없어요</p>
              <p className="text-sm text-[#7E6658] mt-2">
                아직 가입한 회원이 없어요.
              </p>
            </section>
          ) : (
            <section className="space-y-3">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </section>
          )}

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              현재는 조회 전용 회원 목록이에요. 다음 단계에서 회원 상세 보기와
              포인트/복권/응모권 조정 기능을 추가할 수 있어요.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

function UserCard({ user }: { user: AdminUser }) {
  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="block rounded-[26px] bg-white border border-orange-100 shadow-sm p-5 active:scale-[0.99] transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
            <User size={24} />
          </div>

          <div className="min-w-0">
            <h3 className="font-black text-lg leading-tight truncate">
              {user.nickname ?? "이름 없는 회원"}
            </h3>
            <p className="text-xs text-[#8A7567] mt-1">
              가입일:{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString("ko-KR")
                : "-"}
            </p>
          </div>
        </div>

        <ChevronRight size={20} className="text-[#C7B8AE] mt-2 shrink-0" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <MiniStat
          icon={<Wallet size={17} />}
          title="포인트"
          value={`${user.points ?? 0}P`}
        />
        <MiniStat
          icon={<Ticket size={17} />}
          title="복권"
          value={`${user.scratch_tickets ?? 0}장`}
        />
        <MiniStat
          icon={<Gift size={17} />}
          title="응모권"
          value={`${user.entry_tickets ?? 0}장`}
        />
      </div>
    </Link>
  );
}

function MiniStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-3 text-center">
      <div className="text-[#FF642A] flex justify-center mb-1">{icon}</div>
      <p className="text-[11px] font-bold text-[#8A7567]">{title}</p>
      <p className="text-sm font-black mt-0.5">{value}</p>
    </div>
  );
}