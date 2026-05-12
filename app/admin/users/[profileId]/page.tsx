"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Gift,
  History,
  Save,
  Ticket,
  Trophy,
  User,
  Wallet,
} from "lucide-react";

import { supabase } from "../../../lib/supabase";

type AdminUserProfile = {
  id: string;
  user_id: string | null;
  nickname: string | null;
  points: number | null;
  scratch_tickets: number | null;
  entry_tickets: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type AdminRewardLog = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  amount: string;
  emoji: string | null;
  created_at: string;
};

type AdminPrizeEntry = {
  id: string;
  prize_id: string;
  prize_title: string;
  ticket_cost: number;
  created_at: string;
};

type AdminWinner = {
  id: string;
  prize_id: string;
  prize_title: string;
  winner_nickname: string | null;
  status: string;
  admin_memo: string | null;
  selected_at: string;
};

type AdminAssetLog = {
  id: string;
  previous_points: number;
  previous_scratch_tickets: number;
  previous_entry_tickets: number;
  next_points: number;
  next_scratch_tickets: number;
  next_entry_tickets: number;
  memo: string | null;
  created_at: string;
};

type AdminUserDetail = {
  profile: AdminUserProfile | null;
  rewardLogs: AdminRewardLog[];
  prizeEntries: AdminPrizeEntry[];
  winners: AdminWinner[];
  assetLogs: AdminAssetLog[];
};

const statusLabels: Record<string, string> = {
  pending: "지급 전",
  completed: "지급 완료",
  hold: "지급 보류",
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const profileId = String(params.profileId || "");

  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [editPoints, setEditPoints] = useState(0);
  const [editScratchTickets, setEditScratchTickets] = useState(0);
  const [editEntryTickets, setEditEntryTickets] = useState(0);
  const [isSavingAssets, setIsSavingAssets] = useState(false);
  const [adjustmentMemo, setAdjustmentMemo] = useState("");

  useEffect(() => {
    async function loadUserDetail() {
      if (!profileId) {
        setErrorMessage("회원 정보를 찾을 수 없어요.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase.rpc("get_admin_user_detail", {
        target_profile_id: profileId,
      });

      if (error) {
        console.error("관리자 회원 상세 조회 실패:", error.message);

        if (error.message.includes("not allowed")) {
          setErrorMessage("관리자 권한이 필요해요.");
        } else if (error.message.includes("profile not found")) {
          setErrorMessage("회원 정보를 찾을 수 없어요.");
        } else {
          setErrorMessage("회원 상세 정보를 불러오지 못했어요.");
        }

        setDetail(null);
        setIsLoading(false);
        return;
      }

      const nextDetail = data as AdminUserDetail;

      setErrorMessage("");
      setDetail(nextDetail);

      setEditPoints(nextDetail.profile?.points ?? 0);
      setEditScratchTickets(nextDetail.profile?.scratch_tickets ?? 0);
      setEditEntryTickets(nextDetail.profile?.entry_tickets ?? 0);

      setIsLoading(false);
    }

    loadUserDetail();
  }, [profileId]);
    async function handleSaveAssets() {
      if (!profileId) {
        alert("회원 정보를 찾을 수 없어요.");
        return;
      }

      if (editPoints < 0 || editScratchTickets < 0 || editEntryTickets < 0) {
        alert("포인트, 복권, 응모권은 0보다 작을 수 없어요.");
        return;
      }

      const isConfirmed = window.confirm(
        "이 회원의 포인트, 복권, 응모권 수량을 수정할까요?"
      );

      if (!isConfirmed) {
        return;
      }

      setIsSavingAssets(true);

      const { data, error } = await supabase.rpc("update_admin_user_assets", {
        target_profile_id: profileId,
        next_points: editPoints,
        next_scratch_tickets: editScratchTickets,
        next_entry_tickets: editEntryTickets,
        adjustment_memo: adjustmentMemo || null,
      });

      if (error) {
        console.error("회원 보유 수량 수정 실패:", error.message);

        if (error.message.includes("not allowed")) {
          alert("관리자 권한이 필요해요.");
        } else if (error.message.includes("negative value")) {
          alert("포인트, 복권, 응모권은 0보다 작을 수 없어요.");
        } else {
          alert("회원 보유 수량 저장에 실패했어요.");
        }

        setIsSavingAssets(false);
        return;
      }

      setDetail((currentDetail) => {
          if (!currentDetail) {
            return currentDetail;
          }

          return {
            ...currentDetail,
            profile: data as AdminUserProfile,
          };
        });

        setAdjustmentMemo("");

        const { data: refreshedDetail, error: refreshError } = await supabase.rpc(
          "get_admin_user_detail",
          {
            target_profile_id: profileId,
          }
        );

        if (!refreshError) {
          setDetail(refreshedDetail as AdminUserDetail);
        }

        setIsSavingAssets(false);
        alert("회원 보유 수량이 저장됐어요.");
    }

  const profile = detail?.profile;

  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <header className="px-6 pt-6 pb-4 flex items-center gap-4">
          <Link
            href="/admin/users"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#FF642A]">회원 상세</p>
            <h1 className="text-2xl font-black truncate">
              {profile?.nickname ?? "회원 정보"}
            </h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          {isLoading ? (
            <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <p className="font-black text-[#FF642A]">
                회원 상세 정보를 불러오는 중...
              </p>
            </section>
          ) : errorMessage || !profile ? (
            <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-6 text-center">
              <div className="w-16 h-16 rounded-[24px] bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center mx-auto mb-4">
                <User size={30} />
              </div>

              <h2 className="text-xl font-black text-[#3B2414]">
                {errorMessage || "회원 정보를 찾을 수 없어요."}
              </h2>

              <p className="text-sm leading-relaxed text-[#7E6658] mt-3">
                관리자 권한이 있는 계정으로 다시 확인해주세요.
              </p>

              <Link
                href="/admin/users"
                className="mt-5 h-12 rounded-[18px] bg-[#FFF4DF] text-[#FF642A] font-black flex items-center justify-center active:scale-95 transition"
              >
                회원 목록으로 돌아가기
              </Link>
            </section>
          ) : (
            <>
              <section className="rounded-[28px] bg-gradient-to-br from-[#3B2414] to-[#6B3A1E] p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                    <User size={28} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white/70">회원</p>
                    <h2 className="text-2xl font-black mt-1 truncate">
                      {profile.nickname ?? "이름 없는 회원"}
                    </h2>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-white/75 mt-4">
                  가입일:{" "}
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleString("ko-KR")
                    : "-"}
                </p>
              </section>

              <section className="grid grid-cols-3 gap-2">
                <MiniStat
                  icon={<Wallet size={17} />}
                  title="포인트"
                  value={`${profile.points ?? 0}P`}
                />
                <MiniStat
                  icon={<Ticket size={17} />}
                  title="복권"
                  value={`${profile.scratch_tickets ?? 0}장`}
                />
                <MiniStat
                  icon={<Gift size={17} />}
                  title="응모권"
                  value={`${profile.entry_tickets ?? 0}장`}
                />
              </section>

              <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-5 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-[#FF642A]">관리자 조정</p>
                    <h3 className="text-lg font-black mt-1">보유 수량 수정</h3>
                    <p className="text-xs text-[#8A7567] mt-1">
                      운영상 필요한 경우 회원의 포인트, 복권, 응모권 수량을 수정할 수 있어요.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <label className="space-y-2">
                      <span className="block text-xs font-black text-[#8A7567]">포인트</span>
                      <input
                        type="number"
                        min={0}
                        value={editPoints}
                        onChange={(event) => setEditPoints(Number(event.target.value))}
                        className="w-full h-12 rounded-[18px] bg-[#FFF8EF] border border-orange-100 px-3 text-center font-black outline-none focus:border-[#FF642A]"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="block text-xs font-black text-[#8A7567]">복권</span>
                      <input
                        type="number"
                        min={0}
                        value={editScratchTickets}
                        onChange={(event) => setEditScratchTickets(Number(event.target.value))}
                        className="w-full h-12 rounded-[18px] bg-[#FFF8EF] border border-orange-100 px-3 text-center font-black outline-none focus:border-[#FF642A]"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="block text-xs font-black text-[#8A7567]">응모권</span>
                      <input
                        type="number"
                        min={0}
                        value={editEntryTickets}
                        onChange={(event) => setEditEntryTickets(Number(event.target.value))}
                        className="w-full h-12 rounded-[18px] bg-[#FFF8EF] border border-orange-100 px-3 text-center font-black outline-none focus:border-[#FF642A]"
                      />
                    </label>
                  </div>

                  <label className="space-y-2 block">
                    <span className="block text-xs font-black text-[#8A7567]">
                      조정 메모
                    </span>
                    <textarea
                      value={adjustmentMemo}
                      onChange={(event) => setAdjustmentMemo(event.target.value)}
                      placeholder="예: 이벤트 보상 지급, 오류 보정, 테스트 계정 초기화"
                      className="w-full min-h-[82px] rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-4 text-sm font-bold outline-none focus:border-[#FF642A] resize-none"
                    />
                  </label>

                  <button
                    onClick={handleSaveAssets}
                    disabled={isSavingAssets}
                    className="w-full h-14 rounded-[20px] bg-[#FF642A] text-white font-black shadow-sm active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={19} />
                    {isSavingAssets ? "저장 중..." : "보유 수량 저장"}
                  </button>
                </section>

                <DetailSection
                  icon={<Save size={21} />}
                  title="관리자 조정 이력"
                  emptyText="관리자 조정 이력이 없어요."
                >
                  {detail?.assetLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-4"
                    >
                      <div className="space-y-2">
                        <p className="font-black text-[#3B2414]">보유 수량 변경</p>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-[14px] bg-white border border-orange-100 p-2 text-center">
                            <p className="text-[10px] font-bold text-[#8A7567]">포인트</p>
                            <p className="text-xs font-black mt-1">
                              {log.previous_points} → {log.next_points}
                            </p>
                          </div>

                          <div className="rounded-[14px] bg-white border border-orange-100 p-2 text-center">
                            <p className="text-[10px] font-bold text-[#8A7567]">복권</p>
                            <p className="text-xs font-black mt-1">
                              {log.previous_scratch_tickets} → {log.next_scratch_tickets}
                            </p>
                          </div>

                          <div className="rounded-[14px] bg-white border border-orange-100 p-2 text-center">
                            <p className="text-[10px] font-bold text-[#8A7567]">응모권</p>
                            <p className="text-xs font-black mt-1">
                              {log.previous_entry_tickets} → {log.next_entry_tickets}
                            </p>
                          </div>
                        </div>

                        {log.memo && (
                          <p className="text-xs text-[#8A7567] leading-relaxed">
                            메모: {log.memo}
                          </p>
                        )}

                        <p className="text-xs text-[#8A7567]">
                          조정일: {new Date(log.created_at).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </DetailSection>

              <DetailSection
                icon={<History size={21} />}
                title="최근 활동 내역"
                emptyText="최근 활동 내역이 없어요."
              >
                {detail?.rewardLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black">
                          {log.emoji ?? "🍀"} {log.title}
                        </p>
                        <p className="text-xs text-[#8A7567] mt-1">
                          {log.description ?? "-"}
                        </p>
                      </div>
                      <p className="font-black text-[#FF642A]">
                        {log.amount}
                      </p>
                    </div>
                    <p className="text-xs text-[#8A7567] mt-2">
                      {new Date(log.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                ))}
              </DetailSection>

              <DetailSection
                icon={<Gift size={21} />}
                title="경품 응모 내역"
                emptyText="경품 응모 내역이 없어요."
              >
                {detail?.prizeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-black">{entry.prize_title}</p>
                        <p className="text-xs text-[#8A7567] mt-1">
                          경품 ID: {entry.prize_id}
                        </p>
                      </div>

                      <p className="font-black text-[#FF642A]">
                        -{entry.ticket_cost}장
                      </p>
                    </div>

                    <p className="text-xs text-[#8A7567] mt-2">
                      {new Date(entry.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                ))}
              </DetailSection>

              <DetailSection
                icon={<Trophy size={21} />}
                title="당첨 내역"
                emptyText="당첨 내역이 없어요."
              >
                {detail?.winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="rounded-[18px] bg-[#FFF8EF] border border-orange-100 p-4"
                  >
                    <p className="font-black">{winner.prize_title}</p>
                    <p className="text-xs text-[#8A7567] mt-1">
                      상태: {statusLabels[winner.status] ?? winner.status}
                    </p>
                    {winner.admin_memo && (
                      <p className="text-xs text-[#8A7567] mt-1">
                        메모: {winner.admin_memo}
                      </p>
                    )}
                    <p className="text-xs text-[#8A7567] mt-2">
                      추첨일: {new Date(winner.selected_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                ))}
              </DetailSection>
            </>
          )}
        </div>
      </section>
    </main>
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
    <div className="rounded-[20px] bg-white border border-orange-100 shadow-sm p-3 text-center">
      <div className="text-[#FF642A] flex justify-center mb-1">{icon}</div>
      <p className="text-[11px] font-bold text-[#8A7567]">{title}</p>
      <p className="text-sm font-black mt-0.5 truncate">{value}</p>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  emptyText,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <section className="rounded-[28px] bg-white border border-orange-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-[#FF642A]">{icon}</div>
        <h3 className="text-lg font-black">{title}</h3>
      </div>

      {hasChildren ? (
        <div className="space-y-3">{children}</div>
      ) : (
        <p className="text-sm text-[#7E6658]">{emptyText}</p>
      )}
    </section>
  );
}