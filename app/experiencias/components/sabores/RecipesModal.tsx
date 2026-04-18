"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useState } from "react";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { useLangStore } from "../../../lib/langStore";
import { SaboresProgressiveImage } from "./SaboresProgressiveImage";
import { recipesModalSectionsByLang } from "./recipes_modal_sections";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";

const RECIPE_IMAGES = [
  "/sabores/pictures/Recetas 1.png",
  "/sabores/pictures/Recetas 2.png",
  "/sabores/pictures/Recetas 3.png",
  "/sabores/pictures/Recetas 4.png",
  "/sabores/pictures/Recetas 5.png",
  "/sabores/pictures/Recetas 6.png",
  "/sabores/pictures/Recetas 7.png",
  "/sabores/pictures/Recetas 8.png",
  "/sabores/pictures/Recetas 9.png",
  "/sabores/pictures/Recetas 10.png",
];

type RecipesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type RecipesContentProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

/** Bold text before the first colon (e.g. "Source: …", "The ritual: …"). */
function renderLabeledLine(line: string) {
  const [label, ...rest] = line.split(":");
  const hasLabel = rest.length > 0;
  if (!hasLabel) return line;
  return (
    <>
      <strong>{label}:</strong> {rest.join(":").trim()}
    </>
  );
}

export default function RecipesModal({ isOpen, onClose }: RecipesModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipes-modal-title"
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

        <RecipesContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between gap-3">
          <Link
            href="/experiencias/recetas"
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

export function RecipesContent({
  isModal = false,
  onClose,
}: RecipesContentProps) {
  const t = useLangStore((s) => s.t);
  const lang = useLangStore((s) => s.lang);
  const sections = recipesModalSectionsByLang[lang];
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

  return (
    <div className={`${isModal ? "min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-4" : "container mx-auto px-4 py-12"}`}>
      <div className={`${isModal ? "bg-brand-bg border-b border-gray-200 -mx-3 px-3 pt-6 pb-6 mb-6 pr-11 sm:-mx-4 sm:px-4 sm:pr-12" : "bg-brand-bg border border-gray-100 rounded-sm px-6 pt-6 pb-6 mb-6 sm:px-8"}`}>
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1
          id="recipes-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {t("expRecipesModalTitle")}
        </h1>
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
          {t("expRecipesModalSubtitle")}
        </p>
      </div>
      <p
        className={`text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold ${isModal ? "pl-3" : "pl-4"}`}
      >
        {t("expRecipesModalIntro")}
      </p>

      <div className="grid grid-cols-1 gap-5">
        {sections.map((section, sectionIndex) => (
          <article
            key={`recipe-section-${sectionIndex}`}
            className={`group bg-brand-bg border border-gray-100 rounded-sm flex flex-col gap-4 hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5 sm:p-6"}`}
          >
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                {section.title}
              </h4>
              {section.description && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {section.description}
                </p>
              )}
            </div>

            {RECIPE_IMAGES[sectionIndex] && !failedImages.has(sectionIndex) && (
              <div className="relative h-72 w-full overflow-hidden rounded-sm">
                <div className="absolute inset-0 scale-110 transition-transform duration-500 ease-in-out group-hover:scale-100">
                  <SaboresProgressiveImage
                    src={RECIPE_IMAGES[sectionIndex]}
                    alt={section.title}
                    priority={sectionIndex === 0}
                    loading={
                      sectionIndex === 0
                        ? undefined
                        : sectionIndex < 4
                          ? "eager"
                          : "lazy"
                    }
                    quality={65}
                    onError={() =>
                      setFailedImages((prev) =>
                        new Set(prev).add(sectionIndex),
                      )
                    }
                    sizes="(max-width: 640px) 100vw, (max-width: 896px) calc(100vw - 4rem), 800px"
                  />
                </div>
              </div>
            )}

            {section.source.length > 0 && (
              <div className="bg-white/80 border border-gray-200 rounded-sm px-4 py-3">
                <ul className="space-y-1 text-sm text-gray-500">
                  {section.source.map((line, lineIndex) => (
                    <li
                      key={`${sectionIndex}-source-${lineIndex}`}
                      className="flex items-start gap-2"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-4 h-4 shrink-0 mt-0.5 text-gray-400"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                      <span className="leading-relaxed">
                        {renderLabeledLine(line)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.ingredients.length > 0 && (
              <div className="bg-white/80 border border-brand-gold/20 rounded-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-4 h-4 text-brand-gold"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                    {t("expRecipesModalIngredientsLabel")}
                  </span>
                </div>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {section.ingredients.map((line, lineIndex) => (
                    <li
                      key={`${sectionIndex}-ing-${lineIndex}`}
                      className="flex items-start gap-2"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5"
                        aria-hidden
                      />
                      <span className="leading-relaxed">
                        {renderLabeledLine(line)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.notes.length > 0 && (
              <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                {section.notes.map((line, lineIndex) => (
                  <p key={`${sectionIndex}-note-${lineIndex}`}>{line}</p>
                ))}
              </div>
            )}

            {section.steps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-4 h-4 text-brand-gold"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
                    {t("expRecipesModalStepsLabel")}
                  </span>
                </div>
                <ol className="relative ml-[18px] space-y-0">
                  {section.steps.map((body, i) => {
                    const isLast = i === section.steps.length - 1;
                    return (
                      <li
                        key={`${sectionIndex}-step-${i}`}
                        className={`relative pl-6 ${isLast ? "pb-0" : "pb-5 border-l-2 border-brand-gold/25"}`}
                      >
                        <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center text-white text-[11px] font-bold shadow-sm ring-2 ring-white">
                          {i + 1}
                        </div>
                        <div className="bg-white/70 border border-gray-100 rounded-sm px-4 py-3 text-sm text-gray-700 leading-relaxed hover:border-brand-gold/30 transition-colors">
                          {body}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </article>
        ))}
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
          {t("expRecipesModalTip")}
        </p>
      </div>
    </div>
  );
}
