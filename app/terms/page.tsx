import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <p className="text-xs font-bold text-[#FF642A]">오늘복 서비스 안내</p>
            <h1 className="text-2xl font-black">이용약관</h1>
          </div>
        </header>

        <div className="px-6 pb-10 space-y-5 text-sm leading-relaxed text-[#6B4B38]">
          <section className="rounded-[24px] bg-white border border-orange-100 shadow-sm p-5">
            <p className="text-xs font-bold text-[#B18B75] mb-2">
              시행일: 2026.05.01
            </p>
            <p>
              본 이용약관은 오늘복 서비스를 이용하는 회원과 서비스 운영자 간의
              권리, 의무 및 책임사항을 정하기 위한 문서입니다.
            </p>
          </section>

          <PolicySection title="제1조 목적">
            본 약관은 오늘복이 제공하는 광고 시청, 복권형 보상, 포인트 적립,
            경품 응모 등 서비스 이용과 관련하여 필요한 기본 사항을 정하는 것을
            목적으로 합니다.
          </PolicySection>

          <PolicySection title="제2조 서비스의 내용">
            오늘복은 회원에게 광고 시청을 통한 복권 및 응모권 지급, 복권 결과에
            따른 포인트 또는 응모권 지급, 경품 응모 기능 등을 제공합니다.
            서비스 내용은 운영 상황에 따라 변경될 수 있습니다.
          </PolicySection>

          <PolicySection title="제3조 회원가입 및 계정">
            회원은 카카오 로그인 또는 이메일 로그인을 통해 서비스를 이용할 수
            있습니다. 회원은 본인의 계정 정보를 안전하게 관리해야 하며, 계정의
            부정 사용으로 발생한 문제에 대해 책임을 질 수 있습니다.
          </PolicySection>

          <PolicySection title="제4조 포인트, 복권, 응모권">
            포인트, 복권, 응모권은 오늘복 서비스 내에서 제공되는 가상 보상
            수단입니다. 각 보상은 서비스 정책에 따라 지급, 사용, 소멸될 수
            있으며 현금과 동일한 가치를 보장하지 않습니다.
          </PolicySection>

          <PolicySection title="제5조 경품 응모">
            회원은 보유한 응모권을 사용하여 경품에 응모할 수 있습니다. 경품의
            종류, 당첨 기준, 지급 방식은 서비스 운영 정책에 따라 달라질 수
            있습니다.
          </PolicySection>

          <PolicySection title="제6조 금지행위">
            회원은 비정상적인 방법으로 광고 보상, 복권, 포인트, 응모권을
            획득하거나 시스템을 악용해서는 안 됩니다. 부정 이용이 확인될 경우
            보상 회수 또는 서비스 이용 제한이 이루어질 수 있습니다.
          </PolicySection>

          <PolicySection title="제7조 서비스 변경 및 중단">
            운영자는 서비스 개선, 시스템 점검, 운영상 필요에 따라 서비스의 전부
            또는 일부를 변경하거나 일시 중단할 수 있습니다.
          </PolicySection>

          <PolicySection title="제8조 책임의 제한">
            운영자는 천재지변, 시스템 장애, 제3자 서비스 장애 등 불가피한 사유로
            발생한 서비스 이용 장애에 대해 책임이 제한될 수 있습니다.
          </PolicySection>

          <PolicySection title="제9조 약관의 변경">
            본 약관은 서비스 운영 상황에 따라 변경될 수 있으며, 변경 시 서비스
            내 공지 또는 별도 안내를 통해 고지합니다.
          </PolicySection>

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p>
              본 문서는 MVP 운영을 위한 임시 이용약관입니다. 실제 정식 서비스
              전에는 서비스 정책과 법률 검토에 따라 내용이 수정될 수 있습니다.
            </p>
          </section>

          <Link
            href="/privacy"
            className="block rounded-[24px] bg-white border border-orange-100 shadow-sm p-5 font-black text-[#FF642A] active:scale-[0.99] transition"
          >
            개인정보처리방침 보기 →
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