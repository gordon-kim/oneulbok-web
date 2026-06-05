import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  Megaphone,
  Gift,
  User,
  ShieldCheck,
  Mail,
} from "lucide-react";

const contactItems = [
  {
    icon: <Megaphone size={24} />,
    title: "광고 보상 문의",
    desc: "광고를 봤는데 복권이나 응모권이 지급되지 않은 경우, 지갑의 최근 내역과 광고 시청 시간을 함께 확인해주세요.",
  },
  {
    icon: <Gift size={24} />,
    title: "경품 지급 문의",
    desc: "당첨된 경품은 운영자 확인 후 순차적으로 지급됩니다. 지급 상태는 당첨 내역 관리 기준에 따라 변경될 수 있어요.",
  },
  {
    icon: <User size={24} />,
    title: "계정/로그인 문의",
    desc: "이메일 로그인 또는 카카오 로그인이 정상적으로 되지 않는 경우, 사용 중인 로그인 방식을 확인해주세요.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "개인정보 문의",
    desc: "개인정보 조회, 수정, 삭제 요청은 운영자 확인 후 처리될 수 있습니다.",
  },
];

export default function ContactPage() {
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
            <p className="text-xs font-bold text-[#FF642A]">오늘복 고객 안내</p>
            <h1 className="text-2xl font-black">문의하기</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[30px] bg-gradient-to-br from-[#FFF1DA] to-[#FFE0C4] border border-orange-100 p-5 shadow-sm relative overflow-hidden">

            <div className="w-14 h-14 rounded-2xl bg-white border border-orange-100 text-[#FF642A] flex items-center justify-center shadow-sm mb-4">
              <HelpCircle size={29} />
            </div>

            <p className="text-sm font-bold text-[#FF642A] mb-2">
              이용 중 문제가 있나요?
            </p>
            <h2 className="text-2xl font-black leading-tight">
              문의 전 확인사항을
              <br />
              먼저 확인해주세요
            </h2>
            <p className="text-sm leading-relaxed text-[#6B4B38] mt-3">
              광고 보상, 복권, 경품 지급, 로그인 관련 문의는 아래 안내를
              참고해주세요.
            </p>
          </section>

          <section className="space-y-3">
            {contactItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[26px] bg-white border border-orange-100 shadow-sm p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#3B2414]">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-[#6B4B38] mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-[26px] bg-white border border-orange-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>

              <div>
                <h2 className="text-lg font-black">운영자 연락 안내</h2>
                <p className="text-sm leading-relaxed text-[#6B4B38] mt-2">
                  현재 오늘복은 MVP 베타 운영 단계입니다. 정식 문의 채널은
                  추후 공지사항을 통해 안내될 예정입니다.
                </p>
                <p className="text-xs leading-relaxed text-[#8A7567] mt-3">
                  문의 시에는 발생 시간, 이용 화면, 로그인 방식, 지갑 최근 내역
                  여부를 함께 알려주시면 확인에 도움이 됩니다.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              부정 이용, 중복 계정, 비정상적인 광고 보상 획득이 확인될 경우
              보상 또는 경품 지급이 제한될 수 있어요.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}