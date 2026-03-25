"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "./modalStyles";

type IfachModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function IfachModal({ isOpen, onClose }: IfachModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

  const title = t("expIfachModalTitle");
  const subtitle = t("expIfachModalSubtitle");

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ifach-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
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

        <div className="overflow-y-auto flex-1 px-8 py-6 scrollbar-modal">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3 id="ifach-modal-title" className={MODAL_TITLE_CLASS}>
              {title}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
