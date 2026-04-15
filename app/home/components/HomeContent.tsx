"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLangStore } from "../../lib/langStore";

export default function HomeContent() {
  const t = useLangStore((s) => s.t);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const head = document.head;
    const links: HTMLLinkElement[] = [];

    const appendLink = (rel: string, href: string) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (rel === "preconnect") {
        link.crossOrigin = "anonymous";
      }
      head.appendChild(link);
      links.push(link);
    };

    appendLink("dns-prefetch", "https://inftour.bookonline.pro");
    appendLink("preconnect", "https://inftour.bookonline.pro");

    return () => {
      links.forEach((link) => {
        if (link.parentNode) link.parentNode.removeChild(link);
      });
    };
  }, []);

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
          {!iframeLoaded && (
            <div className="absolute inset-0 z-1 flex min-h-[900px] flex-col items-center justify-center gap-4 bg-white px-6 text-center">
              <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-brand-gold animate-spin" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  {t("bookingCalendar")}
                </p>
                <p className="text-sm text-gray-500">
                  Cargando motor de reserva...
                </p>
              </div>
              <Link
                href="/reserva-directa-v2"
                className="inline-flex items-center justify-center rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-brand-gold hover:text-brand-gold"
              >
                Abrir reserva directa rápida
              </Link>
            </div>
          )}
          <iframe
            src="https://inftour.bookonline.pro/es/properties/91666?iframe=1"
            width="100%"
            style={{
              minHeight: "8200px",
              border: "none",
              overflow: "hidden",
              backgroundColor: "white",
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setIframeLoaded(true)}
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
