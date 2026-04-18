"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useState } from "react";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { ProgressiveNextImage } from "../../../components/ProgressiveNextImage";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";

const CYCLING_IMAGES = [
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 1.png",
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 2.jpeg",
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 3.jpeg",
  "/estilo_de_vida/pictures/El Vaticano del ciclismo 4.png",
];

type CyclingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CyclingContentProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderTextWithBoldRoutes(text: string, routeNames: string[]) {
  if (!routeNames.length) return text;

  const routeNamesRegex = new RegExp(
    `(${routeNames
      .slice()
      .sort((a, b) => b.length - a.length)
      .map((name) => escapeRegExp(name))
      .join("|")})`,
    "g",
  );

  const parts = text.split(routeNamesRegex);
  return parts.map((part, idx) =>
    routeNames.includes(part) ? (
      <strong key={`${part}-${idx}`}>{part}</strong>
    ) : (
      part
    ),
  );
}

export default function CyclingModal({ isOpen, onClose }: CyclingModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cycling-modal-title"
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

        <CyclingContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between gap-3">
          <Link
            href="/experiencias/ciclismo"
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

export function CyclingContent({
  isModal = false,
  onClose,
}: CyclingContentProps) {
  const t = useLangStore((s) => s.t);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const openAIWidget = useCallback(() => {
    const widget = document.querySelector("elevenlabs-convai") as HTMLElement & {
      open?: () => void;
      toggle?: () => void;
      shadowRoot?: ShadowRoot | null;
    };
    if (!widget) return;

    const clickAcceptIfPresent = () => {
      const root = widget.shadowRoot;
      if (!root) return false;
      const buttons = Array.from(root.querySelectorAll("button"));
      for (const btn of buttons) {
        const text = (btn.textContent || "").trim().toLowerCase();
        if (text === "accept" || text === "aceptar" || text.includes("accept")) {
          (btn as HTMLButtonElement).click();
          return true;
        }
      }
      return false;
    };

    if (typeof widget.open === "function") {
      widget.open();
    } else if (typeof widget.toggle === "function") {
      widget.toggle();
    } else {
      const root = widget.shadowRoot;
      if (!root) return;
      const avatar = root.querySelector(
        "div.absolute.inset-0.rounded-full.overflow-hidden.bg-base.bg-cover",
      ) as HTMLElement | null;
      if (avatar) {
        avatar.click();
      } else {
        const clickable = root.querySelector("button, [role='button']") as HTMLElement | null;
        clickable?.click();
      }
    }

    let attempts = 0;
    const maxAttempts = 20;
    const timer = window.setInterval(() => {
      attempts += 1;
      const accepted = clickAcceptIfPresent();
      if (accepted || attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, 150);
  }, []);

  const handleAdviceBoxClick = useCallback(() => {
    triggerLightTapHaptic();
    onClose?.();
    openAIWidget();
  }, [onClose, openAIWidget]);

  const routeNames = [
    "Coll de Rates",
    "Cumbre del Sol",
    "Puerto de Tudons",
    "Sierra de Aitana",
    "Vall de Pop",
    "El Castell de Guadalest",
    "Port de Bèrnia",
    "Port de Bernia",
    "Sierra de Bernia",
    "Cap de la Nau",
    "Calpe",
  ];

  const introParagraphs = [t("expCyclingRichIntro1"), t("expCyclingRichIntro2")];
  const quotes = [
    t("expCyclingRichQuote1"),
    t("expCyclingRichQuote2"),
    t("expCyclingRichQuote3"),
  ];
  const routes = [
    t("expCyclingRichRoute1"),
    t("expCyclingRichRoute2"),
    t("expCyclingRichRoute3"),
    t("expCyclingRichRoute4"),
    t("expCyclingRichRoute5"),
    t("expCyclingRichRoute6"),
    t("expCyclingRichRoute7"),
  ];
  const calendarItems = [
    t("expCyclingRichCalendar1"),
    t("expCyclingRichCalendar2"),
    t("expCyclingRichCalendar3"),
    t("expCyclingRichCalendar4"),
    t("expCyclingRichCalendar5"),
  ];
  const baseCampParagraphs = [
    t("expCyclingRichBase1"),
    t("expCyclingRichBase2"),
    t("expCyclingRichBase3"),
  ];

  return (
    <div className={isModal ? "min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-4" : "container mx-auto px-4 py-12"}>
      <div
        className={
          isModal
            ? "bg-brand-bg border-b border-gray-200 -mx-3 px-3 pt-6 pb-6 mb-6 pr-11 sm:-mx-4 sm:px-4 sm:pr-12"
            : "bg-brand-bg border border-gray-100 rounded-sm px-6 pt-6 pb-6 mb-6 sm:px-8"
        }
      >
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1
          id="cycling-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {t("expCyclingRichTitle")}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {CYCLING_IMAGES.map((src, idx) =>
          !failedImages.has(idx) ? (
            <div
              key={idx}
              className="relative h-48 w-full overflow-hidden rounded-sm"
            >
              <ProgressiveNextImage
                src={src}
                alt=""
                priority={idx === 0}
                loading={idx < 2 ? "eager" : "lazy"}
                onError={() => setFailedImages((prev) => new Set(prev).add(idx))}
                sizes="(max-width: 896px) 50vw, 448px"
                imageClassName="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          ) : null,
        )}
      </div>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        {introParagraphs.map((p, idx) => (
          <p
            key={`intro-${idx}`}
            className={
              idx === 0
                ? `border-l-2 border-brand-gold ${isModal ? "pl-3" : "pl-4"}`
                : ""
            }
          >
            {renderTextWithBoldRoutes(p, routeNames)}
          </p>
        ))}

        <div>
          <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t("expCyclingRichVoicesTitle")}
          </h4>
          <p className="mb-3">{t("expCyclingRichVoicesIntro")}</p>
          <div className="grid grid-cols-1 gap-4">
            {quotes.map((q, idx) => (
              <blockquote
                key={`quote-${idx}`}
                className="relative bg-brand-bg border border-gray-100 border-l-2 border-l-brand-gold rounded-sm px-5 py-4 text-gray-700 italic"
              >
                <span className="absolute -top-2 left-3 text-brand-gold text-xl leading-none">
                  &quot;
                </span>
                <p className="text-sm leading-relaxed">
                  {renderTextWithBoldRoutes(q, routeNames)}
                </p>
              </blockquote>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t("expCyclingRichRoutesTitle")}
          </h4>
          <p className="mb-3">{t("expCyclingRichRoutesIntro")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {routes.map((route, idx) => (
              <div
                key={`route-${idx}`}
                className={`bg-brand-bg border border-gray-100 rounded-sm hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5"}`}
              >
                <p className="text-xs leading-relaxed">
                  {renderTextWithBoldRoutes(route, routeNames)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t("expCyclingRichCalendarTitle")}
          </h4>
          <p className="mb-3">{t("expCyclingRichCalendarIntro")}</p>
          <ul className="list-disc pl-5 space-y-2">
            {calendarItems.map((item, idx) => (
              <li key={`cal-${idx}`}>
                {renderTextWithBoldRoutes(item, routeNames)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {t("expCyclingRichBaseTitle")}
          </h4>
          <div className="space-y-3">
            {baseCampParagraphs.map((p, idx) => (
              <p key={`base-${idx}`}>
                {renderTextWithBoldRoutes(p, routeNames)}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`mt-6 bg-brand-darkgray text-white rounded-sm py-5 flex gap-4 items-start cursor-pointer ${isModal ? "px-3 sm:px-4" : "px-4 sm:px-5"} ${MODAL_PRESS}`}
        role="button"
        tabIndex={0}
        onClick={handleAdviceBoxClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleAdviceBoxClick();
          }
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5 shrink-0 text-brand-gold mt-0.5"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
          />
        </svg>
        <p className="text-xs leading-relaxed text-gray-300">
          {t("expCyclingRichTip")}
        </p>
      </div>
    </div>
  );
}
