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
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaTitleId}
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-6 right-6 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"
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

        <div className="scrollbar-modal overflow-y-auto flex-1 px-8 py-6">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3 id={ariaTitleId} className={MODAL_TITLE_CLASS}>
              {t(titleKey)}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {t(subtitleKey)}
            </p>
          </div>
          {children}
        </div>

        <div className="border-t border-gray-200 px-6 py-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-brand-darkgray text-white rounded-sm px-5 py-2 font-semibold hover:opacity-90 transition"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
