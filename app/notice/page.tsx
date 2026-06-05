import Link from "next/link";
import { ArrowLeft, Bell, Gift, Megaphone, ShieldCheck, Trophy } from "lucide-react";

const notices = [
  {
    icon: <Bell size={24} />,
    title: "오늘복 베타 운영 안내",
    date: "2026.06.05",
    desc: "오늘복은 현재 MVP 베타 운영 단계입니다. 광고 보상, 복권, 경품 응모 기능을 순차적으로 안정화하고 있어요.",
  },
  {
    icon: <Megaphone size={24} />,
    title: "광고 보상 안내",
    date: "2026.06.05",
    desc: "광고 시청 보상은 하루 최대 10회까지 받을 수 있으며, 광고 1회 완료 시 복권 1장과 응모권 1장이 지급돼요.",
  },
  {
    icon: <Gift size={24} />,
    title: "복권 및 응모권 안내",
    date: "2026.06.05",
    desc: "오늘복의 복권과 응모권은 앱 내 이벤트 참여용 보상이며, 현금성 도박이나 현금 환급 서비스가 아니에요.",
  },
  {
    icon: <Trophy size={24} />,
    title: "경품 지급 안내",
    date: "2026.06.05",
    desc: "당첨된 경품은 운영자 확인 후 지급 상태가 변경됩니다. 지급 완료 또는 보류 상태는 운영 기준에 따라 관리돼요.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "부정 이용 제한 안내",
    date: "2026.06.05",
    desc: "비정상적인 방법으로 광고 보상, 복권, 응모권을 획득하거나 시스템을 악용하는 경우 보상 또는 경품 지급이 제한될 수 있어요.",
  },
];

export default function NoticePage() {
  return (
    <main className="min-h-screen bg-[#FFF8EF] flex justify-center px-4 py-6 text-[#3B2414]">
      <section className="w-full max-w-[430px] min-h-[860px] bg-[#FFFCF7] rounded-[36px] shadow-2xl overflow-hidden border border-orange-100">
        <header className="px-6 pt-6 pb-4 flex items-center gap-4">
          <Link
            href="/"
            className="w-11 h-11 rounded-full bg-white border border-orange-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={23} />
          </Link>

          <div>
            <p className="text-xs font-bold text-[#FF642A]">오늘복 소식</p>
            <h1 className="text-2xl font-black">공지사항</h1>
          </div>
        </header>

        <div className="px-5 pb-10 space-y-5">
          <section className="rounded-[30px] bg-gradient-to-br from-[#FFF1DA] to-[#FFE0C4] border border-orange-100 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute right-5 top-5 text-2xl">📢</div>
            <div className="absolute right-14 bottom-5 text-xl">✨</div>

            <p className="text-sm font-bold text-[#FF642A] mb-2">
              운영 안내
            </p>
            <h2 className="text-2xl font-black leading-tight">
              오늘복의 새로운 소식을
              <br />
              확인해보세요
            </h2>
            <p className="text-sm leading-relaxed text-[#6B4B38] mt-3">
              광고 보상, 복권, 경품 응모, 지급 안내 등 중요한 운영 소식을
              이곳에서 확인할 수 있어요.
            </p>
          </section>

          <section className="space-y-3">
            {notices.map((notice) => (
              <article
                key={notice.title}
                className="rounded-[26px] bg-white border border-orange-100 shadow-sm p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4DF] text-[#FF642A] flex items-center justify-center shrink-0">
                    {notice.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black text-[#B18B75]">
                      {notice.date}
                    </p>
                    <h2 className="text-lg font-black text-[#3B2414] mt-1">
                      {notice.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-[#6B4B38] mt-2">
                      {notice.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-[24px] bg-[#FFF4DF] border border-orange-100 p-5">
            <p className="text-sm font-black text-[#FF642A] mb-2">안내</p>
            <p className="text-sm leading-relaxed text-[#6B4B38]">
              공지사항은 베타 운영 중 필요에 따라 업데이트될 수 있어요.
              중요한 변경사항은 서비스 화면을 통해 안내할 예정입니다.
            </p>
          </section>

          <Link
            href="/contact"
            className="w-full h-14 rounded-[20px] bg-white border border-orange-100 shadow-sm font-black text-[#FF642A] active:scale-95 transition flex items-center justify-center"
          >
            문의하기 보기
          </Link>
        </div>
      </section>
    </main>
  );
}