"use client";

import { useEffect } from "react";

type AdBannerProps = {
  slotId: string;
  label?: string;
  title?: string;
  desc?: string;
};

const KAKAO_ADFIT_SLOTS: Record<string, string> = {
  "home-bottom": "DAN-hdS3xKP5xGbFdfvM",
  "scratch-result-bottom": "DAN-uYBdIO5bNImvJQvy",
  "prizes-list-bottom": "DAN-7eNjnlY9Indbkeme",
};

export default function AdBanner({
  slotId,
  label = "추천",
  title = "오늘복 추천 소식",
  desc = "오늘의 혜택과 이벤트를 확인해보세요.",
}: AdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const kakaoAdfitUnit = KAKAO_ADFIT_SLOTS[slotId];

  useEffect(() => {
    if (!kakaoAdfitUnit) {
      return;
    }

    const scriptId = "kakao-adfit-script";

    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "https://t1.daumcdn.net/kas/static/ba.min.js";

    document.body.appendChild(script);
  }, [kakaoAdfitUnit]);

  if (!kakaoAdfitUnit) {
    return (
      <section
        data-ad-slot={slotId}
        data-ad-provider="internal"
        className="rounded-[24px] bg-white border border-orange-100 shadow-sm overflow-hidden"
      >
        <div className="min-h-[86px] bg-gradient-to-br from-[#F7F2EC] to-[#FFF8EF] flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex items-center justify-center text-xl shadow-sm">
              📢
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-black text-[#B18B75] tracking-wide">
                  {label}
                </p>

                {isDevelopment && (
                  <p className="text-[10px] font-bold text-[#B8A99F]">
                    slot: {slotId}
                  </p>
                )}
              </div>

              <p className="text-sm font-black text-[#3B2414] mt-1">
                {title}
              </p>

              <p className="text-xs font-bold text-[#8A7567] mt-0.5">
                {desc}
              </p>
            </div>
          </div>

          <div className="text-xs font-black text-[#B18B75] bg-white border border-orange-100 rounded-full px-3 py-1">
            혜택
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-ad-slot={slotId}
      data-ad-provider="kakao-adfit"
      className="rounded-[24px] bg-white border border-orange-100 shadow-sm overflow-hidden"
    >
      <div className="min-h-[120px] flex flex-col items-center justify-center bg-[#FFF8EF] px-4 py-3">
        <ins
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit={kakaoAdfitUnit}
          data-ad-width="320"
          data-ad-height="100"
        />

        {isDevelopment && (
          <p className="mt-2 text-[10px] font-bold text-[#B8A99F]">
            Kakao AdFit slot: {slotId} / {kakaoAdfitUnit}
          </p>
        )}
      </div>
    </section>
  );
}