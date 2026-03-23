"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";

type CyclingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const routeNames = [
  "Coll de Rates",
  "Cumbre del Sol",
  "Puerto de Tudons",
  "Sierra de Aitana",
  "Vall de Pop",
  "El Castell de Guadalest",
  "Port de Bernia",
  "Cap de la Nau",
  "Calpe",
];

const routeNamesRegex = new RegExp(
  `(${routeNames
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g",
);

function renderTextWithBoldRoutes(text: string) {
  const parts = text.split(routeNamesRegex);
  return parts.map((part, idx) =>
    routeNames.includes(part) ? <strong key={`${part}-${idx}`}>{part}</strong> : part,
  );
}

export default function CyclingModal({ isOpen, onClose }: CyclingModalProps) {
  const t = useLangStore((s) => s.t);
  const introParagraphs = [t("expCyclingRichIntro1"), t("expCyclingRichIntro2")];
  const quotes = [t("expCyclingRichQuote1"), t("expCyclingRichQuote2"), t("expCyclingRichQuote3")];
  const routes = [
    t("expCyclingRichRoute1"),
    t("expCyclingRichRoute2"),
    t("expCyclingRichRoute3"),
    t("expCyclingRichRoute4"),
    t("expCyclingRichRoute5"),
    t("expCyclingRichRoute6"),
    t("expCyclingRichRoute7"),
  ];
  const calendarItems = [
    t("expCyclingRichCalendar1"),
    t("expCyclingRichCalendar2"),
    t("expCyclingRichCalendar3"),
    t("expCyclingRichCalendar4"),
    t("expCyclingRichCalendar5"),
  ];
  const baseCampParagraphs = [t("expCyclingRichBase1"), t("expCyclingRichBase2"), t("expCyclingRichBase3")];

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cycling-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-brand-bg border-b border-gray-200 px-8 py-6">
          <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
          <h3 id="cycling-modal-title" className="text-3xl font-serif text-gray-900 leading-tight">
            {t("expCyclingRichTitle")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            {introParagraphs.map((p, idx) => (
              <p key={`intro-${idx}`} className={idx === 0 ? "border-l-2 border-brand-gold pl-4" : ""}>
                {renderTextWithBoldRoutes(p)}
              </p>
            ))}

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                {t("expCyclingRichVoicesTitle")}
              </h4>
              <p className="mb-3">{t("expCyclingRichVoicesIntro")}</p>
              <div className="grid grid-cols-1 gap-4">
                {quotes.map((q, idx) => (
                  <blockquote
                    key={`quote-${idx}`}
                    className="relative bg-brand-bg border border-gray-100 border-l-2 border-l-brand-gold rounded-sm px-5 py-4 text-gray-700 italic"
                  >
                    <span className="absolute -top-2 left-3 text-brand-gold text-xl leading-none">
                      &quot;
                    </span>
                    <p className="text-sm leading-relaxed">{renderTextWithBoldRoutes(q)}</p>
                  </blockquote>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                {t("expCyclingRichRoutesTitle")}
              </h4>
              <p className="mb-3">{t("expCyclingRichRoutesIntro")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {routes.map((route, idx) => (
                  <div
                    key={`route-${idx}`}
                    className="bg-brand-bg border border-gray-100 rounded-sm p-5 hover:border-brand-gold/40 transition-colors"
                  >
                    <p className="text-xs leading-relaxed">
                      {renderTextWithBoldRoutes(route)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                {t("expCyclingRichCalendarTitle")}
              </h4>
              <p className="mb-3">{t("expCyclingRichCalendarIntro")}</p>
              <ul className="list-disc pl-5 space-y-2">
                {calendarItems.map((item, idx) => (
                  <li key={`cal-${idx}`}>{renderTextWithBoldRoutes(item)}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
                {t("expCyclingRichBaseTitle")}
              </h4>
              <div className="space-y-3">
                {baseCampParagraphs.map((p, idx) => (
                  <p key={`base-${idx}`}>{renderTextWithBoldRoutes(p)}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-brand-gold mt-0.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <p className="text-xs leading-relaxed text-gray-300">
              {t("expCyclingRichTip")}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
