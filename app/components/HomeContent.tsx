"use client";

import { useLangStore } from "../lib/langStore";

export default function HomeContent() {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);
  return (
    <header
      id="booking-engine"
      className="relative z-20 pt-8 pb-12 container mx-auto px-4"
    >
      <div className="bg-white shadow-2xl rounded-t-xl overflow-hidden max-w-7xl mx-auto">
        <div className="bg-white h-[800px] relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <span className="animate-pulse text-gray-300 text-xs uppercase tracking-widest">
              {t("loadingCalendar")}
            </span>
          </div>
          <iframe
            src="https://inftour.bookonline.pro/es/properties/91666?iframe=1"
            width="100%"
            height="100%"
            className="relative z-10 border-0 w-full h-full"
            allowFullScreen
            title={t("bookingCalendar")}
          />
        </div>
      </div>
    </header>
  );
}
