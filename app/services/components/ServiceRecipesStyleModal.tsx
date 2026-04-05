"use client";

import { createPortal } from "react-dom";
import { ReactNode, useEffect } from "react";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../../experiencias/components/modalStyles";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

export type ServiceRecipesStyleModalKeys =
  | {
      titleKey: "referenceNumbersModalTitle";
      subtitleKey: "referenceNumbersModalSubtitle";
    }
  | {
      titleKey: "ourServicesModalTitle";
      subtitleKey: "ourServicesModalSubtitle";
    }
  | {
      titleKey: "requestsCommentsModalTitle";
      subtitleKey: "requestsCommentsModalSubtitle";
    };

type ServiceRecipesStyleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ariaTitleId: string;
  children?: ReactNode;
} & ServiceRecipesStyleModalKeys;

export function ServiceRecipesStyleModal({
  isOpen,
  onClose,
  titleKey,
  subtitleKey,
  ariaTitleId,
  children,
}: ServiceRecipesStyleModalProps) {
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
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 p-3 backdrop-blur-[2px] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaTitleId}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[min(92vh,100dvh)] w-full max-w-4xl flex-col overflow-hidden rounded-md bg-white shadow-2xl sm:rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 sm:right-5 sm:top-5 sm:h-8 sm:w-8"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="scrollbar-modal flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
          <div className="-mx-5 mb-6 border-b border-gray-200 bg-brand-bg px-5 pb-5 pt-5 pr-12 sm:-mx-8 sm:px-8 sm:pb-6 sm:pt-6 sm:pr-14">
            <div className="mb-3 h-px w-12 bg-brand-gold sm:mb-4" aria-hidden />
            <h3
              id={ariaTitleId}
              className={`${MODAL_TITLE_CLASS} max-w-[calc(100%-2.5rem)] wrap-break-word sm:max-w-none`}
            >
              {t(titleKey)}
            </h3>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold sm:tracking-[0.2em]">
              {t(subtitleKey)}
            </p>
          </div>
          {children}
        </div>

        <div className="flex shrink-0 justify-end border-t border-gray-200 bg-white px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-sm bg-brand-darkgray px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
