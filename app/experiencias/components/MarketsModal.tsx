"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";

type MarketsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sectionsMeta = [
  {
    key: "expMarketsModalSection1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h16.5m0 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5" />
      </svg>
    ),
  },
  {
    key: "expMarketsModalSection2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 103 0m-3 0h3m6-3V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v9.75m13.5 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 103 0m-3 0h3" />
      </svg>
    ),
  },
  {
    key: "expMarketsModalSection3",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-4.5-9h9m-9 6h9" />
      </svg>
    ),
  },
  {
    key: "expMarketsModalSection4",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 100-16.5A8.25 8.25 0 0012 21zM12 9v6m3-3H9" />
      </svg>
    ),
  },
  {
    key: "expMarketsModalSection5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18M4.5 7.5l1.5 12h12l1.5-12M9 11.25h6" />
      </svg>
    ),
  },
  {
    key: "expMarketsModalSection6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
      </svg>
    ),
  },
] as const;

export default function MarketsModal({ isOpen, onClose }: MarketsModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="markets-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-brand-bg border-b border-gray-200 px-8 py-6">
          <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
          <h3 id="markets-modal-title" className="text-3xl font-serif text-gray-900 leading-tight">
            {t("expMarketsModalTitle")}
          </h3>
          <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
            {t("expMarketsModalSubtitle")}
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

        <div className="overflow-y-auto flex-1 px-8 py-6">
          <p className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4">
            {t("expMarketsModalIntro")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionsMeta.map(({ key, icon }) => (
              <div
                key={key}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                <div className="text-brand-gold">{icon}</div>
                <p className="text-xs text-gray-700 leading-relaxed">{t(key)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-brand-gold mt-0.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <p className="text-xs leading-relaxed text-gray-300">
              {t("expMarketsModalTip")}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
