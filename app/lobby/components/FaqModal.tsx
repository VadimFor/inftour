"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useLangStore } from "../../lib/langStore";

type FaqModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const t = useLangStore((s) => s.t);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col bg-white shadow-2xl rounded-t-2xl sm:rounded-xl overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-8 py-6 bg-brand-stone">
          <div>
            <div className="mb-3 h-px w-10 bg-brand-gold" aria-hidden />
            <h2
              id="faq-modal-title"
              className="text-2xl font-serif font-semibold text-brand-black leading-tight"
            >
              {t("faqModalTitle")}
            </h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              {t("faqModalSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("lobCloseModal")}
            className="mt-1 shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="scrollbar-modal flex-1 overflow-y-auto px-8 py-7 min-h-[220px]" />

        <div className="shrink-0 border-t border-gray-100 bg-brand-stone px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-brand-black text-white hover:bg-brand-gold transition-colors duration-200"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
