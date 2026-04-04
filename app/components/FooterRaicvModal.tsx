"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useLangStore } from "../lib/langStore";

type FooterRaicvModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FooterRaicvModal({ isOpen, onClose }: FooterRaicvModalProps) {
  const { t } = useLangStore(useShallow((s) => ({ t: s.t })));

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 overflow-y-auto bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="footer-raicv-modal-title"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-0 sm:p-6">
        <div
          className="relative w-full max-w-lg bg-white shadow-2xl rounded-t-2xl sm:rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-6 bg-brand-stone">
            <div>
              <div className="mb-3 h-px w-10 bg-brand-gold" aria-hidden />
              <h2
                id="footer-raicv-modal-title"
                className="text-xl sm:text-2xl font-serif font-semibold text-brand-black leading-tight pr-2"
              >
                {t("footerRaicvModalTitle")}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("priv_modalClose")}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="scrollbar-modal px-6 py-6 sm:px-8 sm:py-7">
            <p className="text-sm text-gray-600 leading-relaxed">{t("footerRaicvApi")}</p>
          </div>

          <div className="shrink-0 border-t border-gray-100 bg-brand-stone px-6 py-4 sm:px-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-brand-black text-white hover:bg-brand-gold transition-colors duration-200"
            >
              {t("priv_modalClose")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
