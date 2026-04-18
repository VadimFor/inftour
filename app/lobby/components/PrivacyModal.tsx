"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { useLangStore } from "../../lib/langStore";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

type PrivacyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type PrivacyContentProps = {
  isModal?: boolean;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

const BODY = "text-sm text-gray-600 leading-relaxed";
const SECTION_TITLE =
  "text-xs font-bold uppercase tracking-[0.18em] text-brand-gold mt-8 mb-3 first:mt-0";
const LI = "text-sm text-gray-600 leading-relaxed";

export function PrivacyContent({ isModal = false }: PrivacyContentProps) {
  const t = useLangStore((s) => s.t);

  return (
    <div className={isModal ? "flex min-h-0 flex-1 flex-col overflow-hidden" : "container mx-auto px-4 py-12"}>
      <div
        className={
          isModal
            ? "flex w-full flex-1 flex-col bg-white overflow-hidden"
            : "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        }
      >
        <div
          className={`flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-brand-stone py-6 ${isModal ? "px-3 sm:px-4" : "px-8"}`}
        >
          <div>
            <div className="mb-3 h-px w-10 bg-brand-gold" aria-hidden />
            <h1
              id="privacy-modal-title"
              className={
                isModal
                  ? "text-2xl font-serif font-semibold text-brand-black leading-tight"
                  : "text-3xl md:text-4xl font-serif font-semibold text-brand-black leading-tight"
              }
            >
              {t("priv_title")}
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              {t("priv_subtitle")}
            </p>
          </div>
        </div>

        <div
          className={`scrollbar-modal flex-1 overflow-y-auto py-7 space-y-4 ${isModal ? "px-3 sm:px-4" : "px-8"}`}
        >
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
                <span className={LI}>{item}</span>
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
                <span className={LI}>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className={SECTION_TITLE}>{t("priv_s6_title")}</h3>
          <p className={BODY}>{t("priv_s6_p")}</p>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);

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
      className="fixed inset-0 z-9999 flex items-end justify-center bg-black/60 backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] sm:items-center sm:pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pl-6 sm:pr-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex min-h-0 w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem)] sm:max-h-[calc(100dvh-max(1rem,env(safe-area-inset-top,0px))-max(1rem,env(safe-area-inset-bottom,0px)))] sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            triggerLightTapHaptic();
            onClose();
          }}
          aria-label={t("priv_modalClose")}
          className={`absolute right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-10 mt-1 shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 ${MODAL_PRESS}`}
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

        <PrivacyContent isModal />

        <div className="shrink-0 border-t border-gray-100 bg-brand-stone px-3 py-4 sm:px-4 flex items-center justify-between gap-3">
          <Link
            href="/lobby/privacy-policy"
            onClick={() => {
              triggerLightTapHaptic();
            }}
            className={`inline-flex items-center justify-center bg-white text-brand-darkgray border border-gray-300 rounded-sm px-5 py-2 font-semibold transition hover:bg-gray-50 ${MODAL_PRESS}`}
          >
            {t("openPage")}
          </Link>
          <button
            type="button"
            onClick={() => {
              triggerLightTapHaptic();
              onClose();
            }}
            className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-brand-black text-white transition-colors duration-200 hover:bg-brand-gold ${MODAL_PRESS}`}
          >
            {t("priv_modalClose")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
