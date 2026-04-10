"use client";

import { useLangStore } from "../../lib/langStore";

export default function HomeContent() {
  const t = useLangStore((s) => s.t);
  return (
    <section
      id="booking-engine"
      className="relative z-20 pt-6 pb-12 container mx-auto px-4"
    >
      <div className="max-w-7xl mx-auto mb-4">
        <h2 className="text-xl md:text-2xl font-serif text-gray-900">Motor de reserva</h2>
        <p className="text-sm text-gray-600 mt-1">
          Consulta disponibilidad en tiempo real y completa tu reserva online.
        </p>
      </div>
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
          <noscript>
            <div className="p-4 text-sm text-gray-700">
              Si no ves el calendario, abre la reserva directa en{" "}
              <a
                href="https://inftour.bookonline.pro/es/properties/91666"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                este enlace
              </a>
              .
            </div>
          </noscript>
        </div>
      </div>
    </section>
  );
}
