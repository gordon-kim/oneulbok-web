type AdBannerProps = {
  slotId: string;
  label?: string;
  title?: string;
  desc?: string;
};

export default function AdBanner({
  slotId,
  label = "AD",
  title = "광고 배너 영역",
  desc = "추후 실제 광고가 노출될 위치예요.",
}: AdBannerProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <section
      data-ad-slot={slotId}
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
          광고
        </div>
      </div>
    </section>
  );
}