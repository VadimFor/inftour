"use client";

import Link from "next/link";
import { useCallback } from "react";
import { createPortal } from "react-dom";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { ProgressiveNextImage } from "../../../components/ProgressiveNextImage";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";
import salinas1 from "./pictures/Las Salinas 1.jpg";
import salinas2 from "./pictures/Las Salinas 2.jpg";
import salinas3 from "./pictures/Las Salinas 3.png";
import salinas4 from "./pictures/Las Salinas 4.jpg";

type SalinasModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SalinasContentProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

function isHeaderLike(line: string) {
  const text = line.trim();
  if (!text) return false;
  if (text.endsWith(".") || text.endsWith("!") || text.endsWith("?")) return false;
  return text.length <= 96;
}

function isSubgroupLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return false;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return false;
  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  return labelWords <= 5;
}

function renderLabeledLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return <>{line}</>;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return <>{line}</>;
  return (
    <>
      <span className="font-semibold">{rawLabel}</span>: {rest}
    </>
  );
}

export default function SalinasModal({ isOpen, onClose }: SalinasModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="salinas-modal-title"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <SalinasContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between gap-3">
          <Link
            href="/experiencias/salinas"
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

export function SalinasContent({
  isModal = false,
  onClose,
}: SalinasContentProps) {
  const t = useLangStore((s) => s.t);

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

  const title = t("expSalinasModalTitle");
  const subtitle = t("expSalinasModalSubtitle");
  const paragraphs = [
    t("expSalinasModalParagraph1"),
    t("expSalinasModalParagraph2"),
    t("expSalinasModalParagraph3"),
    t("expSalinasModalParagraph4"),
    t("expSalinasModalParagraph5"),
    t("expSalinasModalParagraph6"),
    t("expSalinasModalParagraph7"),
    t("expSalinasModalParagraph8"),
    t("expSalinasModalParagraph9"),
    t("expSalinasModalParagraph10"),
    t("expSalinasModalParagraph11"),
    t("expSalinasModalParagraph12"),
    t("expSalinasModalParagraph13"),
    t("expSalinasModalParagraph14"),
    t("expSalinasModalParagraph15"),
  ].filter(Boolean);
  const tip = t("expSalinasModalInftourAdvice");

  type Section = { title: string | null; body: string[] };
  const sections: Section[] = [];
  for (const paragraph of paragraphs) {
    if (isHeaderLike(paragraph)) {
      sections.push({ title: paragraph, body: [] });
      continue;
    }
    const current = sections[sections.length - 1];
    if (current) current.body.push(paragraph);
    else sections.push({ title: null, body: [paragraph] });
  }

  return (
    <div className={isModal ? "min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-4 scrollbar-modal" : "container mx-auto px-4 py-12"}>
      <div
        className={
          isModal
            ? "bg-brand-bg border-b border-gray-200 -mx-3 px-3 pt-6 pb-6 mb-6 pr-11 sm:-mx-4 sm:px-4 sm:pr-12"
            : "bg-brand-bg border border-gray-100 rounded-sm px-6 pt-6 pb-6 mb-6 sm:px-8"
        }
      >
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1
          id="salinas-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {title}
        </h1>
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid w-full grid-cols-2 gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 p-2">
          {[salinas1, salinas2, salinas3, salinas4].map((src, i) => (
            <div
              key={i}
              className="relative h-36 overflow-hidden rounded-sm border border-gray-200/80 bg-white"
            >
              <ProgressiveNextImage
                src={src}
                alt={`${title} - Las Salinas ${i + 1}`}
                sizes="50vw"
                priority={i === 0}
                loading={i < 2 ? "eager" : "lazy"}
                imageClassName="object-cover"
              />
            </div>
          ))}
        </div>

        {sections.map((section, idx) => (
          <div
            key={`s-${idx}-${(section.title ?? section.body[0] ?? "").slice(0, 24)}`}
            className={`bg-brand-bg border border-gray-100 rounded-sm flex flex-col gap-3 hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5"}`}
          >
            {section.title ? (
              <p className="text-sm font-semibold text-gray-800">{section.title}</p>
            ) : null}
            {(() => {
              const subgroupLines = section.body.filter(isSubgroupLine);
              const mainLines = section.body.filter((line) => !isSubgroupLine(line));
              const useSubgroups = subgroupLines.length >= 2;
              return (
                <>
                  {(useSubgroups ? mainLines : section.body).map((line) => (
                    <p key={line} className="text-sm text-gray-900 leading-relaxed">
                      {line}
                    </p>
                  ))}
                  {useSubgroups ? (
                    <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                      {subgroupLines.map((line) => (
                        <li
                          key={line}
                          className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                        >
                          {renderLabeledLine(line)}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              );
            })()}
          </div>
        ))}
      </div>

      {tip ? (
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
          <p className="text-xs leading-relaxed text-gray-300 whitespace-pre-line">
            {tip}
          </p>
        </div>
      ) : null}
    </div>
  );
}
