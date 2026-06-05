# 오늘복 운영 전 최종 체크리스트

오늘복 MVP 운영 전 확인해야 할 항목을 정리한 문서입니다.

---

## 1. 배포 상태

- [ ] Vercel 배포 정상
- [ ] GitHub main 브랜치 최신 상태
- [ ] npm run build 성공
- [ ] .env.local GitHub 미업로드 확인
- [ ] 모바일 접속 정상
- [ ] PWA 홈 화면 추가 정상

확인 URL:

```text
https://oneulbok-web.vercel.app
```

---

## 2. 사용자 화면 확인

- [ ] 홈 화면 `/` 정상
- [ ] 공지사항 `/notice` 정상
- [ ] 문의하기 `/contact` 정상
- [ ] 로그인 `/login` 정상
- [ ] 광고 보기 `/ad` 정상
- [ ] 복권 긁기 `/scratch` 정상
- [ ] 경품 응모 `/prizes` 정상
- [ ] 지갑 `/wallet` 정상
- [ ] 전체 보상 내역 `/wallet/logs` 정상
- [ ] 내 당첨 내역 `/wallet/winners` 정상
- [ ] 내정보 `/my` 정상
- [ ] 이용약관 `/terms` 정상
- [ ] 개인정보처리방침 `/privacy` 정상

---

## 3. 로그인 확인

- [ ] 이메일 로그인 정상
- [ ] 이메일 회원가입 정상
- [ ] 카카오 로그인 정상
- [ ] `/login?next=/my` 로그인 후 `/my` 이동 정상
- [ ] `/login?next=/wallet` 로그인 후 `/wallet` 이동 정상
- [ ] `/login?next=/ad` 로그인 후 `/ad` 이동 정상
- [ ] `/login?next=/wallet/logs` 로그인 후 `/wallet/logs` 이동 정상
- [ ] `/login?next=/wallet/winners` 로그인 후 `/wallet/winners` 이동 정상
- [ ] 로그아웃 정상

---

## 4. 광고 보상 확인

- [ ] 광고 페이지 진입 정상
- [ ] 15초 카운트다운 정상
- [ ] 광고 시청 완료 후 보상 받기 버튼 표시 정상
- [ ] 보상 받기 클릭 정상
- [ ] 복권 1장 지급 정상
- [ ] 응모권 1장 지급 정상
- [ ] 하루 10회 제한 정상
- [ ] 지갑 최근 내역 저장 정상
- [ ] 전체 보상 내역 저장 정상
- [ ] 관리자 광고 보상 로그 저장 정상
- [ ] `claim_ad_reward` RPC 정상 동작

---

## 5. 복권 기능 확인

- [ ] 복권 보유 수량 표시 정상
- [ ] 복권이 없을 때 광고 보기 유도 정상
- [ ] 복권 긁기 정상
- [ ] 복권 1장 차감 정상
- [ ] 포인트 당첨 시 포인트 증가 정상
- [ ] 응모권 당첨 시 응모권 증가 정상
- [ ] 꽝 결과 처리 정상
- [ ] 복권 결과가 지갑 최근 내역에 저장됨
- [ ] 복권 결과 하단 AdFit 배너 영역 정상

---

## 6. 경품 응모 확인

- [ ] 경품 목록 표시 정상
- [ ] 응모권 보유 수량 표시 정상
- [ ] 응모권 부족 시 응모 제한 정상
- [ ] 응모권 사용 시 차감 정상
- [ ] `prize_entries` 저장 정상
- [ ] `reward_logs` 저장 정상
- [ ] 경품별 진행도 표시 정상
- [ ] 금일 확정 경품 수 표시 정상
- [ ] 다음 확정까지 남은 건수 표시 정상
- [ ] 내 당첨 내역 보기 버튼 정상
- [ ] 경품 목록 하단 AdFit 배너 영역 정상

---

## 7. 지갑 확인

- [ ] 포인트 표시 정상
- [ ] 복권 수량 표시 정상
- [ ] 응모권 수량 표시 정상
- [ ] 당첨 건수 표시 정상
- [ ] 당첨 카드 클릭 시 `/wallet/winners` 이동 정상
- [ ] 최근 내역 5건 표시 정상
- [ ] 전체보기 클릭 시 `/wallet/logs` 이동 정상
- [ ] 전체 보상 내역 최근 100건 표시 정상
- [ ] 비로그인 안내 정상
- [ ] 로그인 후 원래 페이지 이동 정상

---

## 8. 내 당첨 내역 확인

- [ ] `/wallet/winners` 접속 정상
- [ ] 비로그인 시 로그인 안내 정상
- [ ] 로그인 시 본인 당첨 내역만 표시
- [ ] 지급 전 상태 표시 정상
- [ ] 지급 완료 상태 표시 정상
- [ ] 지급 보류 상태 표시 정상
- [ ] 상태별 필터 정상
- [ ] 관리자 메모가 사용자 지급 안내에 표시됨
- [ ] 지갑으로 돌아가기 버튼 정상

---

## 9. 내정보 확인

- [ ] `/my` 접속 정상
- [ ] 로그인 사용자 닉네임 표시 정상
- [ ] 가입일 실제값 표시 정상
- [ ] 비로그인 안내 정상
- [ ] 공지사항 메뉴 정상
- [ ] 보상 내역 메뉴 정상
- [ ] 내 당첨 내역 메뉴 정상
- [ ] 문의하기 메뉴 정상
- [ ] 이용약관 메뉴 정상
- [ ] 개인정보처리방침 메뉴 정상
- [ ] 로그아웃 정상

---

## 10. 관리자 화면 확인

- [ ] `/admin` 접근 정상
- [ ] 일반 계정 관리자 접근 제한 정상
- [ ] 관리자 계정 접근 정상
- [ ] 회원 목록 `/admin/users` 정상
- [ ] 회원 상세 `/admin/users/[profileId]` 정상
- [ ] 회원 포인트/복권/응모권 수정 정상
- [ ] 관리자 조정 메모 저장 정상
- [ ] 조정 이력 `/admin/asset-logs` 정상
- [ ] 광고 보상 로그 `/admin/ad-rewards` 정상
- [ ] 전체 경품 응모 내역 `/admin/prize-entries` 정상
- [ ] 경품별 현황 `/admin/prizes` 정상
- [ ] 경품별 응모자 상세 `/admin/prizes/[prizeId]` 정상
- [ ] 당첨자 추첨 정상
- [ ] 재추첨 방지 정상
- [ ] 당첨 내역 `/admin/winners` 정상
- [ ] 지급 상태 변경 정상
- [ ] 지급 상태 필터 정상
- [ ] 관리자 메모 저장 정상

---

## 11. 관리자 조정 이력 확인

- [ ] 회원 상세에서 포인트 수정 정상
- [ ] 회원 상세에서 복권 수정 정상
- [ ] 회원 상세에서 응모권 수정 정상
- [ ] 관리자 메모 필수/입력 정상
- [ ] `admin_asset_logs` 저장 정상
- [ ] `/admin/asset-logs`에서 전체 조정 이력 표시 정상
- [ ] 회원 상세 보기 버튼 정상
- [ ] 최근 200건 기준 표시 정상

---

## 12. 당첨/지급 흐름 확인

- [ ] 사용자가 경품 응모
- [ ] 관리자에서 경품 응모자 상세 확인
- [ ] 관리자에서 당첨자 추첨
- [ ] 재추첨 방지 확인
- [ ] 사용자 `/wallet` 당첨 건수 반영
- [ ] 사용자 `/wallet/winners` 당첨 내역 표시
- [ ] 관리자에서 지급 상태를 지급 완료로 변경
- [ ] 사용자 당첨 내역에 지급 완료 표시
- [ ] 지급 보류 상태 표시 정상
- [ ] 관리자 메모가 사용자 지급 안내에 표시됨

---

## 13. AdFit 확인

- [ ] AdFit 매체 등록 완료
- [ ] 광고단위 3개 생성 완료
- [ ] 홈 하단 광고단위 연결
- [ ] 복권 결과 하단 광고단위 연결
- [ ] 경품 목록 하단 광고단위 연결
- [ ] `ba.min.js` 로딩 확인
- [ ] 매체 심사 상태 확인
- [ ] 심사 승인 후 요청수 확인
- [ ] 심사 승인 후 노출수 확인
- [ ] 심사 승인 후 실제 광고 노출 확인

광고단위:

```text
home-bottom
DAN-hdS3xKP5xGbFdfvM

scratch-result-bottom
DAN-uYBdIO5bNImvJQvy

prizes-list-bottom
DAN-7eNjnlY9Indbkeme
```

---

## 14. 약관/개인정보/문의 확인

- [ ] 이용약관에 리워드/경품 서비스 안내 문구 포함
- [ ] 이용약관에 현금성 도박/현금 환급 아님 문구 포함
- [ ] 개인정보처리방침에 광고 시청 및 보상 기록 문구 포함
- [ ] 개인정보처리방침에 외부 광고 서비스 이용 문구 포함
- [ ] 문의하기 페이지 정상
- [ ] 공지사항에서 문의하기 이동 정상
- [ ] 약관에서 문의하기 이동 정상
- [ ] 개인정보처리방침에서 문의하기 이동 정상

---

## 15. Supabase 확인

- [ ] `profiles` RLS 정상
- [ ] `reward_logs` 본인 데이터 접근 정상
- [ ] `ad_views` 본인 데이터 접근 정상
- [ ] `prize_entries` 본인 데이터 접근 정상
- [ ] `prize_winners` 본인 조회 RLS 정상
- [ ] 관리자 RPC 정상
- [ ] `claim_ad_reward` RPC 정상
- [ ] `get_admin_asset_logs` RPC 정상
- [ ] `admin_users` 관리자 계정 정상

중요 문서:

```text
docs/supabase-notes.md
```

---

## 16. 운영 전 삭제/정리 항목

- [ ] 테스트 당첨 데이터 삭제
- [ ] `test-cu-1000` 데이터 삭제 확인
- [ ] 테스트용 사용자 데이터 정리 여부 결정
- [ ] 불필요한 테스트 페이지 없음 확인
- [ ] `.env.local` GitHub 미업로드 확인
- [ ] 관리자 계정만 `admin_users`에 남아 있는지 확인

테스트 당첨 데이터 삭제 SQL은 `docs/supabase-notes.md` 참고.

---

## 17. 실제 경품 지급 운영 방식 결정 필요

- [ ] CU 상품권 구매 방식 확정
- [ ] 경품 발송 방식 확정
- [ ] 카카오톡 선물하기 수동 지급 여부 결정
- [ ] 이메일/문의 기반 지급 여부 결정
- [ ] 지급 완료 메모 작성 규칙 확정
- [ ] 지급 보류 기준 확정
- [ ] 당첨자 연락 방식 확정
- [ ] 정식 문의 채널 확정

초기 추천 방식:

```text
관리자 수동 확인
→ 상품권 수동 발송
→ /admin/winners에서 지급 완료 처리
→ 관리자 메모 기록
```

---

## 18. 정식 문의 채널 후보

- [ ] 구글폼
- [ ] 네이버폼
- [ ] 운영자 이메일
- [ ] 카카오톡 오픈채팅
- [ ] 카카오톡 채널

초기 MVP 추천:

```text
구글폼 또는 네이버폼
```

---

## 19. 최종 운영 판단

현재 상태:

```text
운영 MVP 가능
단, AdFit 심사 결과와 실제 경품 지급 방식은 별도 확인 필요
```

최종 오픈 전 필수 확인 흐름:

```text
1. 새 사용자 가입
2. 광고 보상
3. 복권 긁기
4. 경품 응모
5. 관리자 추첨
6. 사용자 당첨 확인
7. 관리자 지급 완료
8. 사용자 지급 상태 확인
```

---

## 20. 최종 확인 URL

사용자:

```text
https://oneulbok-web.vercel.app
https://oneulbok-web.vercel.app/notice
https://oneulbok-web.vercel.app/contact
https://oneulbok-web.vercel.app/login
https://oneulbok-web.vercel.app/ad
https://oneulbok-web.vercel.app/scratch
https://oneulbok-web.vercel.app/prizes
https://oneulbok-web.vercel.app/wallet
https://oneulbok-web.vercel.app/wallet/logs
https://oneulbok-web.vercel.app/wallet/winners
https://oneulbok-web.vercel.app/my
https://oneulbok-web.vercel.app/terms
https://oneulbok-web.vercel.app/privacy
```

관리자:

```text
https://oneulbok-web.vercel.app/admin
https://oneulbok-web.vercel.app/admin/users
https://oneulbok-web.vercel.app/admin/asset-logs
https://oneulbok-web.vercel.app/admin/ad-rewards
https://oneulbok-web.vercel.app/admin/prize-entries
https://oneulbok-web.vercel.app/admin/prizes
https://oneulbok-web.vercel.app/admin/winners
```