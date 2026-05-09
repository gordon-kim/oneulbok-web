import { supabase } from "./supabase";

export type CurrentProfile = {
  id: string;
  user_id: string | null;
  nickname: string | null;
  points: number | null;
  scratch_tickets: number | null;
  entry_tickets: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("현재 로그인 유저 조회 실패:", error.message);
    return null;
  }

  return user;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, user_id, nickname, points, scratch_tickets, entry_tickets, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("현재 유저 프로필 조회 실패:", error.message);
    return null;
  }

  return data;
}

export async function ensureCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select(
      "id, user_id, nickname, points, scratch_tickets, entry_tickets, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("프로필 확인 실패:", selectError.message);
    return null;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const emailNickname = user.email?.split("@")[0];
  const kakaoNickname =
    user.user_metadata?.name ||
    user.user_metadata?.nickname ||
    user.user_metadata?.full_name;

  const nickname = kakaoNickname || emailNickname || "오늘복 회원님";

  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      nickname,
      points: 0,
      scratch_tickets: 0,
      entry_tickets: 0,
    })
    .select(
      "id, user_id, nickname, points, scratch_tickets, entry_tickets, created_at, updated_at"
    )
    .single();

  if (insertError) {
    console.error("프로필 자동 생성 실패:", insertError.message);
    return null;
  }

  return newProfile;
}