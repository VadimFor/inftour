"use client";

import { useLangStore } from "../../lib/langStore";

export default function HomeContent() {
  const t = useLangStore((s) => s.t);
  return (
    <header
      id="booking-engine"
      className="relative z-20 pt-8 pb-12 container mx-auto px-4"
    >
      <div className="bg-white shadow-2xl rounded-t-xl overflow-hidden max-w-7xl mx-auto">
        <div className="relative">
          <iframe
            src="https://inftour.bookonline.pro/es/properties/91666?iframe=1"
            width="100%"
            style={{ minHeight: "8200px", border: "none", overflow: "hidden", backgroundColor: "white" }}
            allowFullScreen
            loading="lazy"
            title={t("bookingCalendar")}
          />
        </div>
      </div>
    </header>
  );
}
