"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { useLangStore } from "../../lib/langStore";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

type ReportingChannelModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ReportingChannelContentProps = {
  isModal?: boolean;
};

const BODY = "text-sm text-gray-600 leading-relaxed";
const LOBBY_COMPLAINT_EMAIL = "mail@inftour.com";
const LOBBY_COMPLAINT_WA_DISPLAY = "+34 640 748 732";
const LOBBY_COMPLAINT_WA_HREF = "https://wa.me/34640748732";

function renderComplaintEmailLine(text: string) {
  const idx = text.indexOf(LOBBY_COMPLAINT_EMAIL);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={`mailto:${LOBBY_COMPLAINT_EMAIL}`}
        className="font-medium text-brand-gold hover:underline"
      >
        {LOBBY_COMPLAINT_EMAIL}
      </a>
      {text.slice(idx + LOBBY_COMPLAINT_EMAIL.length)}
    </>
  );
}

function renderComplaintWhatsappLine(text: string) {
  const idx = text.indexOf(LOBBY_COMPLAINT_WA_DISPLAY);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={LOBBY_COMPLAINT_WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-gold hover:underline"
      >
        {LOBBY_COMPLAINT_WA_DISPLAY}
      </a>
      {text.slice(idx + LOBBY_COMPLAINT_WA_DISPLAY.length)}
    </>
  );
}

export function ReportingChannelContent({
  isModal = false,
}: ReportingChannelContentProps) {
  const t = useLangStore((s) => s.t);

  return (
    <div className={isModal ? "" : "container mx-auto px-4 py-12"}>
      <div
        className={
          isModal
            ? "w-full max-w-3xl bg-white overflow-hidden"
            : "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        }
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-8 py-6 bg-brand-stone">
          <div>
            <div className="mb-3 h-px w-10 bg-brand-gold" aria-hidden />
            <h1
              id="reporting-channel-modal-title"
              className={
                isModal
                  ? "text-2xl font-serif font-semibold text-brand-black leading-tight"
                  : "text-3xl md:text-4xl font-serif font-semibold text-brand-black leading-tight"
              }
            >
              {t("reportingChannelModalTitle")}
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              {t("reportingChannelModalSubtitle")}
            </p>
          </div>
        </div>

        <div className="px-8 pt-7 pb-0 space-y-5">
          <p className={BODY}>{t("lobComplaintsP1")}</p>
          <p className={BODY}>{t("lobComplaintsP2")}</p>
          <h3 className="pt-2 text-base font-semibold text-brand-black">
            {t("lobComplaintsHowTitle")}
          </h3>
          <p className={BODY}>
            {renderComplaintEmailLine(t("lobComplaintsLineEmail"))}
          </p>
          <p className={BODY}>
            {renderComplaintWhatsappLine(t("lobComplaintsLineWhatsapp"))}
          </p>
          <p className={BODY}>{t("lobComplaintsP3")}</p>
          <p className={BODY}>{t("lobComplaintsP4")}</p>
          <p className={BODY}>{t("lobComplaintsP5")}</p>
          <div className="pt-3 pb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${LOBBY_COMPLAINT_EMAIL}`}
              className="inline-flex items-center justify-center rounded-lg bg-brand-gold px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-500"
            >
              {t("lobComplaintsBtnEmail")}
            </a>
            <a
              href={LOBBY_COMPLAINT_WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-black transition hover:border-brand-gold hover:text-brand-gold"
            >
              {t("lobComplaintsBtnWhatsapp")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportingChannelModal({
  isOpen,
  onClose,
}: ReportingChannelModalProps) {
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
      className="fixed inset-0 z-9999 overflow-y-auto bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reporting-channel-modal-title"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center p-0 sm:p-6">
        <div
          className="relative w-full max-w-3xl bg-white shadow-2xl rounded-t-2xl sm:rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("lobCloseModal")}
            className="absolute top-6 right-6 z-10 mt-1 shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-900"
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

          <ReportingChannelContent isModal />

        <div className="shrink-0 border-t border-gray-100 bg-brand-stone px-8 py-4 flex items-center justify-between gap-3">
          <a
            href="/lobby/reporting-channel"
            className="bg-white text-brand-darkgray border border-gray-300 rounded-sm px-5 py-2 font-semibold hover:bg-gray-50 transition"
          >
            {t("openPage")}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-brand-black text-white hover:bg-brand-gold transition-colors duration-200"
          >
            {t("close")}
          </button>
        </div>
      </div>
      </div>
    </div>,
    document.body,
  );
}
