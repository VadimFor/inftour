"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { useLangStore } from "../../lib/langStore";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

type ReportingChannelModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ReportingChannelContentProps = {
  isModal?: boolean;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

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
    <div
      className={
        isModal
          ? "flex min-h-0 flex-1 flex-col overflow-hidden"
          : "container mx-auto px-4 py-12"
      }
    >
      <div
        className={
          isModal
            ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-white"
            : "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        }
      >
        <div
          className={`flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-brand-stone py-6 ${isModal ? "px-3 sm:px-4" : "px-8"}`}
        >
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

        <div
          className={`scrollbar-modal min-h-0 flex-1 space-y-5 overflow-y-auto pt-7 pb-5 ${isModal ? "px-3 sm:px-4" : "px-8 pb-0"}`}
        >
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
          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${LOBBY_COMPLAINT_EMAIL}`}
              onClick={() => {
                triggerLightTapHaptic();
              }}
              className={`inline-flex items-center justify-center rounded-lg bg-brand-gold px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-500 ${MODAL_PRESS}`}
            >
              {t("lobComplaintsBtnEmail")}
            </a>
            <a
              href={LOBBY_COMPLAINT_WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                triggerLightTapHaptic();
              }}
              className={`inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-black transition hover:border-brand-gold hover:text-brand-gold ${MODAL_PRESS}`}
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
      className="fixed inset-0 z-9999 flex items-end justify-center bg-black/60 backdrop-blur-sm pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))] sm:items-center sm:pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pl-6 sm:pr-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reporting-channel-modal-title"
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
            aria-label={t("lobCloseModal")}
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

          <ReportingChannelContent isModal />

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-brand-stone px-3 py-4 sm:px-4">
          <Link
            href="/lobby/reporting-channel"
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
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
