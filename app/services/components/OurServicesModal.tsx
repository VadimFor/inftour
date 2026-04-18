"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { Fragment, type ReactNode, useEffect } from "react";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { useLangStore } from "../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../../experiencias/components/modalStyles";
import { useModalBodyScrollLock } from "../../experiencias/components/useModalBodyScrollLock";

type OurServicesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type OurServicesContentProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

function renderBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-brand-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const BODY_TEXT =
  "text-sm leading-relaxed text-gray-600 [text-wrap:pretty] sm:text-[0.9375rem]";

function P({ k }: { k: string }) {
  const t = useLangStore((s) => s.t);
  return <p className={BODY_TEXT}>{renderBold(t(k as never))}</p>;
}

const SERVICE_GROUP_BACKGROUNDS = [
  "bg-brand-bg",
  "bg-stone-100/80",
  "bg-amber-50/50",
  "bg-stone-50/95",
] as const;

function ServiceContentGroup({
  tone,
  children,
  compact,
}: {
  tone: number;
  children: ReactNode;
  compact?: boolean;
}) {
  const bg =
    SERVICE_GROUP_BACKGROUNDS[
      ((tone % SERVICE_GROUP_BACKGROUNDS.length) +
        SERVICE_GROUP_BACKGROUNDS.length) %
        SERVICE_GROUP_BACKGROUNDS.length
    ];
  return (
    <div
      className={`group ${bg} rounded-sm border border-gray-100 overflow-hidden transition-colors duration-200 hover:border-brand-gold/40`}
    >
      <div
        className={
          compact
            ? "space-y-3 px-3 py-4 sm:space-y-4 sm:px-4 sm:py-5"
            : "space-y-3 px-5 py-4 sm:space-y-4 sm:py-5"
        }
      >
        {children}
      </div>
    </div>
  );
}

function BulletList({ keys }: { keys: string[] }) {
  const t = useLangStore((s) => s.t);
  return (
    <div className="rounded-md bg-white/50 py-3.5 pl-3 pr-3 sm:py-4 sm:pl-4 sm:pr-5">
      <ul className="m-0 list-none space-y-2.5 pl-0 sm:space-y-3">
        {keys.map((key) => (
          <li key={key} className={`flex gap-3 ${BODY_TEXT}`}>
            <span
              className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold shadow-[0_0_0_3px_rgba(212,175,55,0.12)]"
              aria-hidden
            />
            <span className="min-w-0 flex-1 pt-0.5">
              {renderBold(t(key as never))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionTitle({ k }: { k: string }) {
  const t = useLangStore((s) => s.t);
  return (
    <h4 className="flex items-center gap-3 pb-1 text-base font-semibold leading-snug text-gray-900 sm:text-lg">
      <span
        className="h-9 w-1 shrink-0 rounded-full bg-linear-to-b from-brand-gold to-amber-600/90 shadow-sm"
        aria-hidden
      />
      <span className="min-w-0 flex-1">{t(k as never)}</span>
    </h4>
  );
}

function ExtraBlock({
  titleKey,
  descKey,
  priceKey,
}: {
  titleKey: string;
  descKey: string;
  priceKey: string;
}) {
  const t = useLangStore((s) => s.t);
  const desc = t(descKey as never);
  const descParagraphs = desc.split(/\n+/).filter(Boolean);
  const headingId = `our-services-extra-h-${titleKey}`;
  return (
    <div
      tabIndex={0}
      role="article"
      aria-labelledby={headingId}
      className="flex h-full flex-col rounded-sm border border-gray-100 border-l-[3px] border-l-brand-gold/75 bg-white/90 p-4 outline-none transition-colors duration-200 hover:border-brand-gold/40 focus-visible:border-brand-gold/50 sm:p-5"
    >
      <p
        id={headingId}
        className="text-sm font-semibold tracking-tight text-gray-900"
      >
        {t(titleKey as never)}
      </p>
      <div className="mt-2 flex-1 space-y-2">
        {descParagraphs.map((para, i) => (
          <p key={i} className={BODY_TEXT}>
            {renderBold(para)}
          </p>
        ))}
      </div>
      <p className="mt-3 border-t border-stone-200/50 pt-3 text-sm font-semibold tabular-nums text-brand-gold">
        {t(priceKey as never)}
      </p>
    </div>
  );
}

function KitSubheading({
  translationKey,
  className = "pt-1",
}: {
  translationKey: string;
  className?: string;
}) {
  const t = useLangStore((s) => s.t);
  return (
    <p
      className={`inline-flex max-w-full rounded-md bg-brand-gold/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-800 ${className}`.trim()}
    >
      {t(translationKey as never)}
    </p>
  );
}

export function OurServicesContent({
  isModal = false,
}: OurServicesContentProps) {
  const t = useLangStore((s) => s.t);
  return (
    <div className={isModal ? "space-y-6 pb-1 sm:space-y-8" : "container mx-auto space-y-6 px-4 py-12 sm:space-y-8"}>
      <div
        className={
          isModal
            ? "bg-brand-bg border-b border-gray-200 -mx-3 px-3 pt-6 pb-6 mb-6 pr-11 sm:-mx-4 sm:px-4 sm:pr-12"
            : "bg-brand-bg border border-gray-100 rounded-sm px-6 pt-6 pb-6 mb-6 sm:px-8"
        }
      >
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1
          id="our-services-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {t("ourServicesModalTitle")}
        </h1>
      </div>
      <ServiceContentGroup compact={isModal} tone={0}>
        <P k="ourServicesIntro1" />
        <P k="ourServicesIntro2" />
        <P k="ourServicesIntro3" />
        <P k="ourServicesIntro4" />
      </ServiceContentGroup>

      <ServiceContentGroup compact={isModal} tone={0}>
        <SectionTitle k="ourServicesSecCleaningTitle" />
        <P k="ourServicesCleaningP1" />
        <P k="ourServicesCleaningP2" />
        <BulletList
          keys={["ourServicesCleaningLi1", "ourServicesCleaningLi2"]}
        />
        <P k="ourServicesCleaningP3" />
        <P k="ourServicesCleaningP4" />
        <P k="ourServicesCleaningP5" />
      </ServiceContentGroup>

      <ServiceContentGroup compact={isModal} tone={0}>
        <SectionTitle k="ourServicesSecLinenTitle" />
        <P k="ourServicesLinenP1" />
        <BulletList keys={["ourServicesLinenLi1", "ourServicesLinenLi2"]} />
        <P k="ourServicesLinenP2" />
      </ServiceContentGroup>

      <ServiceContentGroup compact={isModal} tone={1}>
        <KitSubheading translationKey="ourServicesSecKitTitle" />
        <P k="ourServicesKitP1" />
        <P k="ourServicesKitP2" />
        <KitSubheading translationKey="ourServicesKitKitchenTitle" />
        <BulletList
          keys={[
            "ourServicesKitK1",
            "ourServicesKitK2",
            "ourServicesKitK3",
            "ourServicesKitK4",
          ]}
        />
        <KitSubheading
          translationKey="ourServicesKitBathTitle"
          className="mt-1"
        />
        <BulletList
          keys={["ourServicesKitB1", "ourServicesKitB2", "ourServicesKitB3"]}
        />
      </ServiceContentGroup>

      <ServiceContentGroup compact={isModal} tone={0}>
        <SectionTitle k="ourServicesSecExtrasTitle" />
        <P k="ourServicesExtrasIntro" />
        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 sm:gap-4">
          <ExtraBlock
            titleKey="ourServicesExtraPetsTitle"
            descKey="ourServicesExtraPetsDesc"
            priceKey="ourServicesExtraPetsPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraCleanTitle"
            descKey="ourServicesExtraCleanDesc"
            priceKey="ourServicesExtraCleanPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraBeddingTitle"
            descKey="ourServicesExtraBeddingDesc"
            priceKey="ourServicesExtraBeddingPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraTowelsTitle"
            descKey="ourServicesExtraTowelsDesc"
            priceKey="ourServicesExtraTowelsPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraLateCoTitle"
            descKey="ourServicesExtraLateCoDesc"
            priceKey="ourServicesExtraLateCoPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraEarlyCiTitle"
            descKey="ourServicesExtraEarlyCiDesc"
            priceKey="ourServicesExtraEarlyCiPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraLateArrTitle"
            descKey="ourServicesExtraLateArrDesc"
            priceKey="ourServicesExtraLateArrPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraSelfCiTitle"
            descKey="ourServicesExtraSelfCiDesc"
            priceKey="ourServicesExtraSelfCiPrice"
          />
          <ExtraBlock
            titleKey="ourServicesExtraCribTitle"
            descKey="ourServicesExtraCribDesc"
            priceKey="ourServicesExtraCribPrice"
          />
        </div>
      </ServiceContentGroup>

      <ServiceContentGroup compact={isModal} tone={0}>
        <SectionTitle k="ourServicesSecRulesTitle" />
        <P k="ourServicesRulesIntro" />
        <BulletList
          keys={[
            "ourServicesRulesLi1",
            "ourServicesRulesLi2",
            "ourServicesRulesLi3",
            "ourServicesRulesLi4",
            "ourServicesRulesLi5",
            "ourServicesRulesLi6",
          ]}
        />
      </ServiceContentGroup>

      <ServiceContentGroup compact={isModal} tone={0}>
        <SectionTitle k="ourServicesSecClosingTitle" />
        <P k="ourServicesClosingP1" />
        <P k="ourServicesClosingP2" />
        <P k="ourServicesClosingP3" />
      </ServiceContentGroup>
    </div>
  );
}

export default function OurServicesModal({
  isOpen,
  onClose,
}: OurServicesModalProps) {
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
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="our-services-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex min-h-0 w-full max-w-4xl max-h-[calc(100dvh-max(1rem,env(safe-area-inset-top,0px))-max(1rem,env(safe-area-inset-bottom,0px)))] flex-col overflow-hidden rounded-sm bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            triggerLightTapHaptic();
            onClose();
          }}
          aria-label={t("close")}
          className={`absolute right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-10 flex h-8 w-8 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-200 hover:text-gray-900 ${MODAL_PRESS}`}
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

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-4">
          <OurServicesContent isModal />
        </div>

        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between gap-3">
          <Link
            href="/services/our-services"
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
            className={`bg-brand-darkgray text-white rounded-sm px-5 py-2 font-semibold transition hover:opacity-90 ${MODAL_PRESS}`}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
