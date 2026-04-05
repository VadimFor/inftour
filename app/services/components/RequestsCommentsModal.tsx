"use client";

import { createPortal } from "react-dom";
import { type ReactNode, useEffect } from "react";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../../experiencias/components/modalStyles";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

type RequestsCommentsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const REQUEST_EMAIL = "mail@inftour.net";
const REQUEST_WA_HREF = "https://wa.me/34640748732";

const BODY_TEXT = "text-sm text-gray-700 leading-relaxed";

/** Inner tiles (same as ReferenceNumbersModal / Our Services extras). */
const SUBITEM_CARD =
  "rounded-sm border border-gray-100 border-l-[3px] border-l-brand-gold/55 bg-white/85 p-4 transition-colors duration-200 hover:border-brand-gold/40 sm:p-5";

const REF_GROUP_BACKGROUNDS = [
  "bg-brand-bg",
  "bg-stone-100/80",
  "bg-amber-50/50",
  "bg-stone-50/95",
] as const;

function RefContentGroup({
  tone,
  children,
}: {
  tone: number;
  children: ReactNode;
}) {
  const bg =
    REF_GROUP_BACKGROUNDS[
      ((tone % REF_GROUP_BACKGROUNDS.length) + REF_GROUP_BACKGROUNDS.length) %
        REF_GROUP_BACKGROUNDS.length
    ];
  return (
    <section
      className={`group ${bg} rounded-sm border border-gray-100 overflow-hidden transition-colors duration-200 hover:border-brand-gold/40`}
    >
      <div className="space-y-3 px-5 py-4 sm:space-y-4 sm:py-5">{children}</div>
    </section>
  );
}

function Tp({ k, className = BODY_TEXT }: { k: string; className?: string }) {
  const t = useLangStore((s) => s.t);
  return <p className={className}>{t(k as never)}</p>;
}

function SectionTitle({ k }: { k: string }) {
  const t = useLangStore((s) => s.t);
  return (
    <h4 className="border-b border-gray-200 pb-2 text-base font-semibold leading-snug text-gray-900 sm:text-lg">
      {t(k as never)}
    </h4>
  );
}

function BulletItem({ children }: { children: ReactNode }) {
  return (
    <li className={`flex items-baseline gap-3 ${BODY_TEXT}`}>
      <span
        className="inline-block h-1.5 w-1.5 shrink-0 translate-y-px rounded-full bg-brand-gold"
        aria-hidden
      />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

function BulletT({ k }: { k: string }) {
  const t = useLangStore((s) => s.t);
  return <BulletItem>{t(k as never)}</BulletItem>;
}

function IconEnvelope({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.322-.011c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

function ActionButtons() {
  const t = useLangStore((s) => s.t);
  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-3">
      <a
        href={`mailto:${REQUEST_EMAIL}`}
        className="inline-flex min-h-14 w-full min-w-0 items-center justify-center gap-2 rounded-md bg-brand-gold bg-linear-to-b from-brand-gold to-amber-600 px-2 py-3.5 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(180,140,50,0.35)] transition duration-200 hover:shadow-[0_4px_16px_rgba(180,140,50,0.42)] hover:brightness-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold/70 active:scale-[0.99] sm:min-h-16 sm:gap-2.5 sm:px-4 sm:py-4"
      >
        <IconEnvelope className="h-5 w-5 shrink-0 opacity-95 sm:h-6 sm:w-6" />
        <span className="min-w-0 text-center leading-tight">
          {t("reqBtnEmail" as never)}
        </span>
      </a>
      <a
        href={REQUEST_WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-16 w-full min-w-0 items-center justify-center gap-2 rounded-md border border-gray-200/90 bg-white px-2 py-3.5 text-sm font-semibold text-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition duration-200 hover:border-[#25D366]/45 hover:bg-emerald-50/50 hover:text-gray-900 hover:shadow-[0_2px_10px_rgba(37,211,102,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]/55 active:scale-[0.99] sm:min-h-16 sm:gap-2.5 sm:px-4 sm:py-4"
      >
        <IconWhatsApp className="h-5 w-5 shrink-0 text-[#25D366] sm:h-6 sm:w-6" />
        <span className="min-w-0 text-center leading-tight">
          {t("reqBtnWhatsapp" as never)}
        </span>
      </a>
    </div>
  );
}

function RequestsCommentsBody() {
  return (
    <div className="space-y-6 pb-1 sm:space-y-8">
      <RefContentGroup tone={0}>
        <Tp k="reqIntro1" />
        <Tp k="reqIntro2" />
      </RefContentGroup>

      <RefContentGroup tone={1}>
        <SectionTitle k="reqSecServicesTitle" />
        <Tp k="reqServicesLead" />
        <div className={SUBITEM_CARD}>
          <ul className="m-0 list-none space-y-3 pl-0">
            <BulletT k="reqServicesLi1" />
            <BulletT k="reqServicesLi2" />
            <BulletT k="reqServicesLi3" />
          </ul>
        </div>
      </RefContentGroup>

      <RefContentGroup tone={2}>
        <SectionTitle k="reqSecIdeaTitle" />
        <Tp k="reqIdeaLead" />
        <div className={`${SUBITEM_CARD} space-y-4`}>
          <ul className="m-0 list-none space-y-3 pl-0">
            <BulletT k="reqIdeaLi1" />
            <BulletT k="reqIdeaLi2" />
            <BulletT k="reqIdeaLi3" />
          </ul>
          <Tp
            k="reqOpinionP"
            className="m-0 border-t border-stone-200/60 pt-4 text-sm font-medium leading-relaxed text-gray-800"
          />
        </div>
      </RefContentGroup>

      <RefContentGroup tone={0}>
        <SectionTitle k="reqSecContactTitle" />
        <Tp k="reqContactLead" />
        <div className={SUBITEM_CARD}>
          <ul className="m-0 list-none space-y-3 pl-0">
            <BulletT k="reqContactLi1" />
            <BulletT k="reqContactLi2" />
          </ul>
        </div>
      </RefContentGroup>

      <RefContentGroup tone={1}>
        <Tp k="reqClosingP" className={`m-0 ${BODY_TEXT}`} />
        <ActionButtons />
      </RefContentGroup>
    </div>
  );
}

export default function RequestsCommentsModal({
  isOpen,
  onClose,
}: RequestsCommentsModalProps) {
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
      aria-labelledby="requests-comments-modal-title"
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

        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3
              id="requests-comments-modal-title"
              className={MODAL_TITLE_CLASS}
            >
              {t("requestsCommentsModalTitle")}
            </h3>
          </div>
          <RequestsCommentsBody />
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
