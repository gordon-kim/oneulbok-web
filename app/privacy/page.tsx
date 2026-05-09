import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <header className="px-6 pt-6 pb-4 flex items-center gap-4">
          <Link
            href="/my"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div>
            <p className="text-xs font-bold text-[#FF642A]">오늘복 개인정보 안내</p>
            <h1 className="text-2xl font-black">개인정보처리방침</h1>
          </div>
        </header>

        <div className="px-6 pb-10 space-y-5 text-sm leading-relaxed text-[#6B4B38]">
          <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5">
            <p className="text-xs font-bold text-[#B18B75] mb-2">
              시행일: 2026.05.01
            </p>
            <p>
              오늘복은 회원의 개인정보를 중요하게 생각하며, 서비스 제공에 필요한
              최소한의 정보만을 처리하기 위해 노력합니다.
            </p>
          </section>

          <PolicySection title="1. 수집하는 개인정보 항목">
            오늘복은 회원가입 및 로그인 과정에서 카카오 계정 정보 또는 이메일
            계정 정보를 통해 서비스 이용에 필요한 정보를 수집할 수 있습니다.
            수집 항목은 이메일, 닉네임, 서비스 이용 기록, 포인트 및 응모 내역
            등이 포함될 수 있습니다.
          </PolicySection>

          <PolicySection title="2. 개인정보의 수집 및 이용 목적">
            수집한 개인정보는 회원 식별, 로그인 처리, 포인트 및 복권/응모권 관리,
            경품 응모 내역 관리, 부정 이용 방지, 서비스 개선을 위해 사용됩니다.
          </PolicySection>

          <PolicySection title="3. 개인정보의 보관 및 이용 기간">
            개인정보는 회원이 서비스를 이용하는 동안 보관되며, 회원 탈퇴 또는
            보관 목적이 달성된 경우 관련 법령 및 내부 정책에 따라 삭제 또는
            분리 보관될 수 있습니다.
          </PolicySection>

          <PolicySection title="4. 개인정보의 제3자 제공">
            오늘복은 회원의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만,
            법령에 따라 요구되는 경우에는 예외적으로 제공될 수 있습니다.
          </PolicySection>

          <PolicySection title="5. 개인정보 처리 위탁">
            오늘복은 서비스 운영을 위해 Supabase, Vercel, Kakao 등 외부 서비스를
            사용할 수 있습니다. 해당 서비스는 로그인, 데이터 저장, 웹 서비스
            배포 등 서비스 제공을 위해 활용됩니다.
          </PolicySection>

          <PolicySection title="6. 회원의 권리">
            회원은 본인의 개인정보 조회, 수정, 삭제, 처리 정지를 요청할 수
            있습니다. 관련 요청은 서비스 내 문의 또는 운영자 연락 수단을 통해
            처리될 수 있습니다.
          </PolicySection>

          <PolicySection title="7. 쿠키 및 접속 정보">
            오늘복은 로그인 상태 유지, 서비스 이용 분석, 보안 관리를 위해 브라우저
            저장 정보 또는 접속 정보를 활용할 수 있습니다.
          </PolicySection>

          <PolicySection title="8. 개인정보 보호를 위한 조치">
            오늘복은 회원 개인정보 보호를 위해 계정별 접근 제한, 데이터베이스
            보안 정책, 인증 기반 접근 제어 등을 적용합니다.
          </PolicySection>

          <PolicySection title="9. 개인정보처리방침의 변경">
            본 개인정보처리방침은 서비스 운영 상황 또는 관련 법령 변경에 따라
            수정될 수 있으며, 변경 시 서비스 내 공지 또는 별도 안내를 통해
            고지합니다.
          </PolicySection>

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p>
              본 문서는 MVP 운영을 위한 임시 개인정보처리방침입니다. 정식 출시
              전에는 실제 수집 항목, 보관 기간, 문의처, 위탁업체 현황 등을
              기준으로 보완해야 합니다.
            </p>
          </section>
          <Link
            href="/terms"
            className="block rounded-[24px] bg-white border border-orange-100 shadow-sm p-5 font-black text-[#FF642A] active:scale-[0.99] transition"
          >
            이용약관 보기 →
          </Link>

        </div>
      </section>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5">
      <h2 className="font-black text-[#3B2414] mb-2">{title}</h2>
      <p>{children}</p>
    </section>
  );
}