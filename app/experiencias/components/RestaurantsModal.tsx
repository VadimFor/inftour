"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";
import { restaurantsDocSectionsByLang } from "./restaurantsDocSections";

type RestaurantsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function splitAdviceFromContent(html: string) {
  const advicePattern =
    /<li><strong>[^<]*INFTOUR[^<]*<\/strong><\/li><\/ul><p>([\s\S]*?)<\/p>\s*$/i;
  const match = html.match(advicePattern);
  if (!match) return { contentHtml: html, adviceHtml: null as string | null };

  return {
    contentHtml: html.replace(advicePattern, "</ul>"),
    adviceHtml: match[1],
  };
}

export default function RestaurantsModal({
  isOpen,
  onClose,
}: RestaurantsModalProps) {
  const t = useLangStore((s) => s.t);
  const lang = useLangStore((s) => s.lang);
  const { contentHtml, adviceHtml } = splitAdviceFromContent(restaurantsDocSectionsByLang[lang]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="restaurants-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-brand-bg border-b border-gray-200 px-8 py-6">
          <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
          <h3
            id="restaurants-modal-title"
            className="text-3xl font-serif text-gray-900 leading-tight"
          >
            {t("expRestaurantsModalTitle")}
          </h3>
          <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
            {t("expRestaurantsModalSubtitle")}
          </p>
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

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          {/* Intro */}
          <p className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4">
            {t("expRestaurantsModalIntro")}
          </p>

          <div
            className="text-sm text-gray-700 leading-relaxed space-y-3 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline hover:[&_a]:text-blue-900"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-brand-gold mt-0.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <p
              className="text-xs leading-relaxed text-gray-300"
              dangerouslySetInnerHTML={{ __html: adviceHtml ?? t("expRestaurantsModalTip") }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
