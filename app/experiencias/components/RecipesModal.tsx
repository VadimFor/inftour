"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";

type RecipesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sectionsMeta = [
  { key: "expRecipesModalSection1" },
  { key: "expRecipesModalSection2" },
  { key: "expRecipesModalSection3" },
  { key: "expRecipesModalSection4" },
  { key: "expRecipesModalSection5" },
  { key: "expRecipesModalSection6" },
  { key: "expRecipesModalSection7" },
  { key: "expRecipesModalSection8" },
  { key: "expRecipesModalSection9" },
  { key: "expRecipesModalSection10" },
] as const;

export default function RecipesModal({ isOpen, onClose }: RecipesModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipes-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-brand-bg border-b border-gray-200 px-8 py-6">
          <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
          <h3 id="recipes-modal-title" className="text-3xl font-serif text-gray-900 leading-tight">
            {t("expRecipesModalTitle")}
          </h3>
          <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
            {t("expRecipesModalSubtitle")}
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
            {t("expRecipesModalIntro")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionsMeta.map(({ key }, index) => (
              <div
                key={key}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">
                  {index + 1}
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">{t(key)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 shrink-0 text-brand-gold mt-0.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <p className="text-xs leading-relaxed text-gray-300">
              {t("expRecipesModalTip")}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
