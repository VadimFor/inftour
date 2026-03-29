"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useLangStore } from "../../lib/langStore";

type PrivacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BODY = "text-sm text-gray-600 leading-relaxed";
const SECTION_TITLE =
  "text-xs font-bold uppercase tracking-[0.18em] text-brand-gold mt-8 mb-3 first:mt-0";
const LI = "text-sm text-gray-600 leading-relaxed";

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
      aria-labelledby="privacy-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-3xl flex-col bg-white shadow-2xl rounded-t-2xl sm:rounded-xl overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-8 py-6 bg-brand-stone">
          <div>
            <div className="mb-3 h-px w-10 bg-brand-gold" aria-hidden />
            <h2
              id="privacy-modal-title"
              className="text-2xl font-serif font-semibold text-brand-black leading-tight"
            >
              {t("priv_title")}
            </h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              {t("priv_subtitle")}
            </p>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-modal flex-1 overflow-y-auto px-8 py-7 space-y-4">
          <p className={BODY}>{t("priv_body1")}</p>
          <p className={BODY}>{t("priv_body2")}</p>

          <h3 className={SECTION_TITLE}>{t("priv_s1_title")}</h3>
          <p className={BODY}>{t("priv_s1_intro")}</p>
          <p className={BODY}>{t("priv_s1_contact")}</p>
          <p className={BODY}>{t("priv_s1_checkin")}</p>
          <p className={BODY}>{t("priv_s1_finance")}</p>
          <p className={BODY}>{t("priv_s1_usage")}</p>

          <h3 className={SECTION_TITLE}>{t("priv_s2_title")}</h3>
          <p className={BODY}>{t("priv_s2_intro")}</p>
          <ul className="space-y-2">
            {[
              t("priv_s2_b1"),
              t("priv_s2_b2"),
              t("priv_s2_b3"),
              t("priv_s2_b4"),
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-sm bg-brand-stone px-4 py-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3 w-3"
                    aria-hidden
                  >
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                </span>
                <span className="text-sm text-gray-600 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <h3 className={SECTION_TITLE}>{t("priv_s3_title")}</h3>
          <p className={BODY}>{t("priv_s3_intro")}</p>
          <p className={BODY}>{t("priv_s3_b1")}</p>
          <p className={BODY}>{t("priv_s3_b2")}</p>

          <h3 className={SECTION_TITLE}>{t("priv_s4_title")}</h3>
          <p className={BODY}>{t("priv_s4_p")}</p>

          <h3 className={SECTION_TITLE}>{t("priv_s5_title")}</h3>
          <p className={BODY}>{t("priv_s5_intro")}</p>
          <ul className="space-y-2">
            {[
              t("priv_s5_b1"),
              t("priv_s5_b2"),
              t("priv_s5_b3"),
              t("priv_s5_b4"),
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-sm bg-brand-stone px-4 py-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3 w-3"
                    aria-hidden
                  >
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                </span>
                <span className="text-sm text-gray-600 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <h3 className={SECTION_TITLE}>{t("priv_s6_title")}</h3>
          <p className={BODY}>{t("priv_s6_p")}</p>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 bg-brand-stone px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-brand-black text-white hover:bg-brand-gold transition-colors duration-200"
          >
            {t("priv_modalClose")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
