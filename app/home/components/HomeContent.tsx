"use client";

import Link from "next/link";
import { useLangStore } from "../../lib/langStore";

export default function HomeContent() {
  const t = useLangStore((s) => s.t);
  return (
    <section
      id="booking-engine"
      className="relative z-20 pt-6 pb-12 container mx-auto px-4"
    >
      <div className="sr-only">
        <h2 className="text-xl md:text-2xl font-serif text-gray-900">Motor de reserva</h2>
        <p className="text-sm text-gray-600 mt-1">
          Consulta disponibilidad en tiempo real y completa tu reserva online.
        </p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          En INFTOUR puedes reservar apartamento en Calpe con gestion directa, tarifas transparentes y
          asistencia local antes y durante la estancia. El calendario oficial muestra disponibilidad
          actualizada para apartamentos premium cerca del Penon de Ifach y las principales playas de la zona.
        </p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Antes de confirmar tu viaje, revisa nuestras secciones de{" "}
          <Link href="/experiencias" className="underline hover:text-brand-gold transition">
            experiencias
          </Link>
          ,{" "}
          <Link href="/services" className="underline hover:text-brand-gold transition">
            servicios
          </Link>{" "}
          y{" "}
          <Link href="/revista" className="underline hover:text-brand-gold transition">
            revista
          </Link>{" "}
          para planificar tu estancia en Calpe con informacion practica y recomendaciones locales.
        </p>
        <ul className="text-sm text-gray-600 mt-3 list-disc pl-5 space-y-1">
          <li>Reserva directa sin intermediarios.</li>
          <li>Atencion local y soporte al huesped en destino.</li>
          <li>Proceso de reserva online con disponibilidad en tiempo real.</li>
        </ul>
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
