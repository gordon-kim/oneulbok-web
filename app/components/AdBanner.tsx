type AdBannerProps = {
  slotId: string;
  label?: string;
  title?: string;
  desc?: string;
};

/**
 * 나중에 카카오 AdFit 광고 단위 ID가 생기면 여기에 넣으면 됨.
 *
 * 예시:
 * const KAKAO_ADFIT_SLOTS: Record<string, string> = {
 *   "home-bottom": "DAN-xxxxxxxxxxxx",
 *   "scratch-result-bottom": "DAN-yyyyyyyyyyyy",
 *   "prizes-list-bottom": "DAN-zzzzzzzzzzzz",
 * };
 */
const KAKAO_ADFIT_SLOTS: Record<string, string> = {
  "home-bottom": "",
  "scratch-result-bottom": "",
  "prizes-list-bottom": "",
};

export default function AdBanner({
  slotId,
  label = "추천",
  title = "오늘복 추천 소식",
  desc = "오늘의 혜택과 이벤트를 확인해보세요.",
}: AdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const kakaoAdfitUnit = KAKAO_ADFIT_SLOTS[slotId];

  /**
   * 아직 실제 광고 단위 ID가 없으면 오늘복 자체 배너를 보여줌.
   * 나중에 kakaoAdfitUnit 값이 들어가면 아래 실제 광고 영역으로 전환 가능.
   */
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

  /**
   * 실제 카카오 AdFit 광고 단위 ID가 들어갔을 때 사용할 영역.
   * 지금은 ID가 비어 있으므로 이 영역은 아직 화면에 나오지 않음.
   */
  return (
    <section
      data-ad-slot={slotId}
      data-ad-provider="kakao-adfit"
      className="rounded-[24px] bg-white border border-orange-100 shadow-sm overflow-hidden"
    >
      <div className="min-h-[86px] flex items-center justify-center bg-[#FFF8EF] px-4 py-3">
        <ins
          className="kakao_ad_area"
          style={{ display: "none" }}
          data-ad-unit={kakaoAdfitUnit}
          data-ad-width="320"
          data-ad-height="100"
        />

        {isDevelopment && (
          <p className="text-xs font-bold text-[#B8A99F]">
            Kakao AdFit slot: {slotId}
          </p>
        )}
      </div>
    </section>
  );
}