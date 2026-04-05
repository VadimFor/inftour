"use client";

import { createPortal } from "react-dom";
import { Fragment, type ReactNode, useEffect } from "react";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../../experiencias/components/modalStyles";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

type ReferenceNumbersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LINK_CLASS =
  "break-all font-medium text-brand-gold underline decoration-brand-gold/35 underline-offset-2 transition hover:text-amber-700 hover:decoration-amber-700/50";

/** Phone links: real tel: URLs, same color/weight as body copy (Our Services–style clarity). */
const TEL_LINK_CLASS =
  "break-words cursor-pointer rounded-sm font-inherit font-normal text-inherit no-underline decoration-none underline-offset-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold/50 hover:text-brand-gold/90";

/** Bordered tile inside a RefContentGroup (matches OurServices ExtraBlock hover). */
const CARD =
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

function trimUrlTrailingPunct(url: string): string {
  return url.replace(/[.,;:)]+$/g, "");
}

function telHref(digits: string): string {
  if (!digits) return "#";
  if (digits === "112") return "tel:112";
  if (digits.startsWith("34")) return `tel:+${digits}`;
  if (digits.length === 9) return `tel:+34${digits}`;
  return `tel:+${digits}`;
}

function linkifyPlain(text: string, keyPrefix: string): ReactNode[] {
  // Tel/Tél/Тел + number (3+ digit part so "Tel: 112" is one link); then bare +34…; then lone 112.
  const tokenRe =
    /(https?:\/\/[^\s]+)|((?:T[eé]l|Тел)\.?\s*:?\s*\+?[\d\s().-]{3,})|(\+34[\d\s]{8,})|(\b112\b)/gi;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let idx = 0;
  while ((m = tokenRe.exec(text)) !== null) {
    if (m.index > last) {
      out.push(
        <span key={`${keyPrefix}-pre-${idx}`}>{text.slice(last, m.index)}</span>,
      );
    }
    if (m[1]) {
      const href = trimUrlTrailingPunct(m[1]);
      out.push(
        <a key={`${keyPrefix}-url-${idx}`} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {href}
        </a>,
      );
    } else if (m[2]) {
      const phrase = m[2].trim();
      const digits = phrase.replace(/\D/g, "");
      out.push(
        <a key={`${keyPrefix}-tel-${idx}`} href={telHref(digits)} className={TEL_LINK_CLASS}>
          {phrase}
        </a>,
      );
    } else if (m[3]) {
      const raw = m[3].trim();
      out.push(
        <a key={`${keyPrefix}-tel34-${idx}`} href={telHref(raw.replace(/\D/g, ""))} className={TEL_LINK_CLASS}>
          {raw}
        </a>,
      );
    } else if (m[4]) {
      out.push(
        <a key={`${keyPrefix}-112-${idx}`} href="tel:112" className={TEL_LINK_CLASS}>
          112
        </a>,
      );
    }
    last = m.index + m[0].length;
    idx += 1;
  }
  if (last < text.length) {
    out.push(<span key={`${keyPrefix}-tail`}>{text.slice(last)}</span>);
  }
  return out.length ? out : [<span key={`${keyPrefix}-all`}>{text}</span>];
}

function renderRichText(text: string, keyPrefix: string): ReactNode[] {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-brand-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return (
      <Fragment key={`${keyPrefix}-f-${i}`}>
        {linkifyPlain(part, `${keyPrefix}-l-${i}`)}
      </Fragment>
    );
  });
}

function RichP({ k, className = "text-sm text-gray-700 leading-relaxed" }: { k: string; className?: string }) {
  const t = useLangStore((s) => s.t);
  return <p className={className}>{renderRichText(t(k as never), k)}</p>;
}

function RichInline({ k }: { k: string }) {
  const t = useLangStore((s) => s.t);
  return <>{renderRichText(t(k as never), k)}</>;
}

function SectionTitle({ k, icon }: { k: string; icon?: ReactNode }) {
  const t = useLangStore((s) => s.t);
  return (
    <h4 className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5 text-base font-semibold leading-snug text-gray-900 sm:text-lg">
      {icon && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
          {icon}
        </span>
      )}
      {t(k as never)}
    </h4>
  );
}

const EMERG_CARD =
  "rounded-sm border border-gray-100 border-l-[3px] border-l-red-500/50 bg-red-50/60 p-4 transition-colors duration-200 hover:border-brand-gold/40 sm:p-5";

/** Emergency number pill card */
function EmergCard({ k }: { k: string }) {
  return (
    <li className={`${EMERG_CARD} flex items-start gap-3`}>
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
        <span className="h-2 w-2 rounded-full bg-red-500" />
      </span>
      <span className="text-sm leading-relaxed text-gray-800">
        <RichInline k={k} />
      </span>
    </li>
  );
}

/** Card for transfers / medical entries with heading + nested details */
function InfoCard({
  headKey,
  children,
}: {
  headKey: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${CARD} space-y-2.5`}>
      <p className="text-sm font-semibold text-gray-900">
        <RichInline k={headKey} />
      </p>
      {children && (
        <div className="space-y-1.5 border-l-2 border-brand-gold/30 pl-3.5 text-sm text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}

function MarketBlock({
  titleKey,
  line1Key,
  line2Key,
  urlKey,
  noteKey,
}: {
  titleKey: string;
  line1Key: string;
  line2Key?: string;
  urlKey?: string;
  noteKey?: string;
}) {
  const t = useLangStore((s) => s.t);
  return (
    <div className={`${CARD} space-y-2`}>
      <p className="text-sm font-semibold text-gray-900">{t(titleKey as never)}</p>
      <div className="space-y-1 text-sm text-gray-700 leading-relaxed">
        <p><RichInline k={line1Key} /></p>
        {line2Key && <p><RichInline k={line2Key} /></p>}
      </div>
      {noteKey && <RichP k={noteKey} className="text-sm text-gray-500 italic" />}
      {urlKey && <RichP k={urlKey} className="text-sm" />}
    </div>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 1.5a4 4 0 0 1 4 4c0 3-4 9-4 9S4 8.5 4 5.5a4 4 0 0 1 4-4Z" />
      <circle cx="8" cy="5.5" r="1.25" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5H4a8 8 0 0 0 6 6v-.5A1.5 1.5 0 0 1 11.5 10h1A1.5 1.5 0 0 1 14 11.5v1A1.5 1.5 0 0 1 12.5 14C6.701 14 2 9.299 2 3.5Z" />
    </svg>
  );
}

function TourismOfficeCard() {
  const t = useLangStore((s) => s.t);
  return (
    <div className={`${CARD} space-y-2.5`}>
      <p className="text-sm font-semibold text-gray-900">
        {t("refTourismOfficeName" as never)}
      </p>
      <div className="space-y-1.5 border-l-2 border-brand-gold/30 pl-3.5 text-sm text-gray-600">
        <div className="flex items-start gap-1.5">
          <IconPin />
          <RichP k="refTourismOfficeAddr" className="text-sm leading-relaxed" />
        </div>
        <div className="flex items-start gap-1.5">
          <IconPhone />
          <RichP k="refTourismOfficeTel" className="text-sm leading-relaxed" />
        </div>
      </div>
    </div>
  );
}

const IconEmergency = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-3.5 w-3.5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m0 4h.01M3.515 3.515a6.5 6.5 0 1 0 9.192 9.192A6.5 6.5 0 0 0 3.515 3.515Z" />
  </svg>
);

const IconInfo = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-3.5 w-3.5" aria-hidden>
    <circle cx="8" cy="8" r="6.5" />
    <path strokeLinecap="round" d="M8 7.5v4M8 5.5h.01" />
  </svg>
);

const IconCar = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-3.5 w-3.5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 8.5h12M3.5 11.5v1m9 0v-1M4 8.5l1.5-3.5h5L12 8.5M3.5 11.5h9" />
  </svg>
);

const IconMedical = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-3.5 w-3.5" aria-hidden>
    <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
    <path strokeLinecap="round" d="M8 5v6M5 8h6" />
  </svg>
);

const IconCart = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-3.5 w-3.5" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h2l1.5 7.5h7.5l1-5H4.5" />
    <circle cx="6.5" cy="13" r="1" />
    <circle cx="11.5" cy="13" r="1" />
  </svg>
);

function ReferenceNumbersBody() {
  return (
    <div className="space-y-6 pb-1 sm:space-y-8">
      <RefContentGroup tone={0}>
        <SectionTitle k="refSecEmergencyTitle" icon={IconEmergency} />
        <RichP k="refEmergIntro" />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <EmergCard k="refEmergLi1" />
          <EmergCard k="refEmergLi2" />
          <EmergCard k="refEmergLi3" />
          <EmergCard k="refEmergLi4" />
        </ul>
      </RefContentGroup>

      <RefContentGroup tone={1}>
        <SectionTitle k="refTourismOfficeName" icon={IconInfo} />
        <RichP k="refTourismIntro" />
        <TourismOfficeCard />
      </RefContentGroup>

      <RefContentGroup tone={2}>
        <SectionTitle k="refSecTransferTitle" icon={IconCar} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={`${CARD} flex items-start gap-3 text-sm text-gray-700 leading-relaxed`}>
            <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden />
            <span><RichInline k="refTransferTaxi" /></span>
          </div>
          <InfoCard headKey="refTransferVictoriaHead">
            <div className="flex items-start gap-1.5"><IconPin /><RichP k="refTransferVictoriaAddr" className="text-sm leading-relaxed" /></div>
            <div className="flex items-start gap-1.5"><IconPhone /><RichP k="refTransferVictoriaTel" className="text-sm leading-relaxed" /></div>
          </InfoCard>
          <InfoCard headKey="refTransferNeptunoHead">
            <div className="flex items-start gap-1.5"><IconPin /><RichP k="refTransferNeptunoAddr" className="text-sm leading-relaxed" /></div>
            <div className="flex items-start gap-1.5"><IconPhone /><RichP k="refTransferNeptunoTel" className="text-sm leading-relaxed" /></div>
          </InfoCard>
          <InfoCard headKey="refTransferBeniHead">
            <div className="flex items-start gap-1.5"><IconPhone /><RichP k="refTransferBeniTel" className="text-sm leading-relaxed" /></div>
            <div className="flex items-start gap-1.5"><span className="mt-0.5 h-3.5 w-3.5 shrink-0" /><RichP k="refTransferBeniUrl" className="text-sm leading-relaxed" /></div>
          </InfoCard>
          <InfoCard headKey="refTransferBus">
            <RichP k="refTransferBusUrl" className="text-sm leading-relaxed" />
          </InfoCard>
        </div>
      </RefContentGroup>

      <RefContentGroup tone={3}>
        <SectionTitle k="refSecMedicalTitle" icon={IconMedical} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoCard headKey="refMedHealthHead">
            <div className="flex items-start gap-1.5"><IconPin /><RichP k="refMedHealthAddr" className="text-sm leading-relaxed" /></div>
            <div className="flex items-start gap-1.5"><IconPhone /><RichP k="refMedHealthTel" className="text-sm leading-relaxed" /></div>
          </InfoCard>
          <InfoCard headKey="refMedHcbHead">
            <div className="flex items-start gap-1.5"><IconPin /><RichP k="refMedHcbAddr" className="text-sm leading-relaxed" /></div>
            <div className="flex items-start gap-1.5"><IconPhone /><RichP k="refMedHcbTel" className="text-sm leading-relaxed" /></div>
          </InfoCard>
          <InfoCard headKey="refMedPharmacyHead">
            <RichP k="refMedPharmacyUrl" className="text-sm leading-relaxed" />
          </InfoCard>
        </div>
      </RefContentGroup>

      <RefContentGroup tone={0}>
        <SectionTitle k="refSecMarketsTitle" icon={IconCart} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <MarketBlock titleKey="refMarketLidlTitle" line1Key="refMarketLidlLine1" line2Key="refMarketLidlLine2" urlKey="refMarketLidlUrl" />
          <MarketBlock titleKey="refMarketMyMercatTitle" line1Key="refMarketMyLine1" line2Key="refMarketMyLine2" urlKey="refMarketMyUrl" />
          <MarketBlock titleKey="refMarket24Title" line1Key="refMarket24Line1" line2Key="refMarket24Line2" noteKey="refMarket24Note" />
          <MarketBlock titleKey="refMarketMercadonaTitle" line1Key="refMercadonaLine1" line2Key="refMercadonaLine2" urlKey="refMercadonaUrl" />
          <MarketBlock titleKey="refMarketAldiTitle" line1Key="refAldiLine1" urlKey="refAldiUrl" />
        </div>
      </RefContentGroup>
    </div>
  );
}

export default function ReferenceNumbersModal({ isOpen, onClose }: ReferenceNumbersModalProps) {
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
      aria-labelledby="reference-numbers-modal-title"
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3 id="reference-numbers-modal-title" className={MODAL_TITLE_CLASS}>
              {t("referenceNumbersModalTitle")}
            </h3>
          </div>
          <ReferenceNumbersBody />
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
