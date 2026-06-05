# 오늘복 Supabase 운영 메모

이 문서는 오늘복 프로젝트에서 Supabase SQL Editor로 직접 실행한 주요 RPC, RLS 정책, 테스트 SQL을 기록하는 문서입니다.

GitHub에는 코드 파일만 올라가고, Supabase DB 함수와 RLS 정책은 자동으로 저장되지 않으므로 운영/복구용으로 기록합니다.

---

## 1. 광고 보상 지급 RPC

### 함수명

```sql
public.claim_ad_reward()
```

### 목적

광고 시청 보상을 Supabase RPC 하나로 처리합니다.

처리 내용:

- 로그인 사용자 확인
- 오늘 광고 시청 횟수 확인
- 하루 10회 제한 검사
- 복권 1장 지급
- 응모권 1장 지급
- 광고 시청 횟수 증가
- reward_logs 저장
- 관리자 광고 보상 로그 저장

---

## 2. 관리자 조정 이력 조회 RPC

### 함수명

```sql
public.get_admin_asset_logs()
```

### 목적

관리자 페이지 `/admin/asset-logs`에서 회원 포인트, 복권, 응모권 수동 조정 이력을 조회합니다.

관리자 권한이 있는 사용자만 조회할 수 있도록 `security definer` 구조로 만들었습니다.

---

## 3. 본인 당첨 내역 조회 RLS 정책

### 대상 테이블

```sql
public.prize_winners
```

### 목적

사용자 화면 `/wallet`, `/wallet/winners`에서 본인 당첨 내역을 볼 수 있게 허용합니다.

이 정책이 없으면 관리자 화면에서는 당첨 내역이 보이지만, 사용자 지갑에서는 당첨 건수가 0건으로 표시될 수 있습니다.

### SQL

```sql
alter table public.prize_winners enable row level security;

drop policy if exists "Users can view own prize winners"
on public.prize_winners;

create policy "Users can view own prize winners"
on public.prize_winners
for select
to authenticated
using (
  profile_id in (
    select id
    from public.profiles
    where user_id = auth.uid()
  )
);
```

---

## 4. 테스트용 당첨 데이터

### 목적

사용자 화면 `/wallet/winners` 확인을 위해 테스트 당첨 내역을 생성했습니다.

테스트 데이터:

```text
test-cu-1000
테스트 CU 1,000원권
```

### 삭제 SQL

운영 전 아래 테스트 데이터는 삭제합니다.

```sql
delete from public.prize_winners
where profile_id = 'b4ff64f6-dea4-49d9-8858-2f02408f3c15'::uuid
  and prize_id = 'test-cu-1000';

delete from public.prize_entries
where profile_id = 'b4ff64f6-dea4-49d9-8858-2f02408f3c15'::uuid
  and prize_id = 'test-cu-1000';
```

---

## 5. Kakao AdFit 메모

### 매체

```text
오늘복
https://oneulbok-web.vercel.app
```

### 광고 단위

```text
오늘복_홈_하단_320x100
DAN-hdS3xKP5xGbFdfvM

오늘복_복권결과_하단_320x100
DAN-uYBdIO5bNImvJQvy

오늘복_경품목록_하단_320x100
DAN-7eNjnlY9Indbkeme
```

### 확인 완료

```text
AdFit 광고단위 3개 생성 완료
AdBanner.tsx에 DAN 코드 연결 완료
ba.min.js 로딩 확인 완료
매체 심사 대기 상태 확인
```

---

## 6. 운영 전 확인할 것

운영 전 아래 테스트 데이터를 삭제했는지 확인합니다.

```text
test-cu-1000
테스트 CU 1,000원권
```

최종 확인 화면:

```text
/wallet
/wallet/logs
/wallet/winners
/my
/prizes
/admin
/admin/winners
/admin/asset-logs
/admin/ad-rewards
```