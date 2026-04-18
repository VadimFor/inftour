"use client";

import Link from "next/link";
import { useCallback } from "react";
import { createPortal } from "react-dom";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { ProgressiveNextImage } from "../../../components/ProgressiveNextImage";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";
import areas1 from "./pictures/Áreas 1.png";

type BBQParksModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type BBQParksContentProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

const sectionsMeta = [
  { key: "expBBQParksModalSection1" },
  { key: "expBBQParksModalSection2" },
  { key: "expBBQParksModalSection3" },
] as const;

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

export default function BBQParksModal({ isOpen, onClose }: BBQParksModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bbq-parks-modal-title"
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

        <BBQParksContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between gap-3">
          <Link
            href="/experiencias/parques-bbq"
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

export function BBQParksContent({
  isModal = false,
  onClose,
}: BBQParksContentProps) {
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

  const parseSection = (key: string) => {
    const lines = t(key)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      title: lines[0] ?? "",
      description: lines[1] ?? "",
      bullets: lines.slice(2),
    };
  };

  const parseSpotBlock = (key: string) => {
    const lines = t(key)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return {
      title: lines[0] ?? "",
      description: lines[1] ?? "",
      addressLines: lines.slice(2),
    };
  };

  const section4Lead = parseSection("expBBQParksModalSection4Lead");
  const section4Spot1 = parseSpotBlock("expBBQParksModalSection4Spot1");
  const section4Spot2 = parseSpotBlock("expBBQParksModalSection4Spot2");

  return (
    <div className={isModal ? "min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-4" : "container mx-auto px-4 py-12"}>
      <div className={isModal ? "bg-brand-bg border-b border-gray-200 -mx-3 px-3 pt-6 pb-6 mb-6 pr-11 sm:-mx-4 sm:px-4 sm:pr-12" : "bg-brand-bg border border-gray-100 rounded-sm px-6 pt-6 pb-6 mb-6 sm:px-8"}>
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1 id="bbq-parks-modal-title" className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}>
          {t("expBBQParksModalTitle")}
        </h1>
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
          {t("expBBQParksModalSubtitle")}
        </p>
      </div>
      <p
        className={`text-sm text-gray-700 leading-relaxed mb-6 border-l-2 border-brand-gold ${isModal ? "pl-3" : "pl-4"}`}
      >
        {t("expBBQParksModalIntro")}
      </p>

      <div className="w-full border border-gray-200 bg-gray-100 p-2 rounded-sm overflow-hidden mb-6">
        <div className="overflow-hidden rounded-sm border border-gray-200/80 bg-white">
          <div
            className="relative w-full"
            style={{
              aspectRatio: `${areas1.width} / ${areas1.height}`,
            }}
          >
            <ProgressiveNextImage
              src={areas1}
              alt={t("expBBQParksModalTitle")}
              sizes="min(896px, 100vw)"
              priority
              imageClassName="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sectionsMeta.map(({ key }) => {
          const section = parseSection(key);
          return (
            <div
              key={key}
              className={`bg-brand-bg border border-gray-100 rounded-sm flex flex-col gap-3 hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5"}`}
            >
              <h4 className="text-base font-semibold text-gray-900 leading-snug">
                {section.title}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {section.description}
              </p>

              {section.bullets.length > 0 && (
                <ul
                  className={`list-disc space-y-2 text-sm text-gray-700 leading-relaxed ${isModal ? "pl-5 sm:pl-6" : "pl-6"}`}
                >
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{renderLabeledLine(bullet)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <div
          className={`bg-brand-bg border border-gray-100 rounded-sm flex flex-col gap-3 hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5"}`}
        >
          <h4 className="text-base font-semibold text-gray-900 leading-snug">
            {section4Lead.title}
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {section4Lead.description}
          </p>
          <div className="mt-2 pt-4 border-t border-gray-200 space-y-5">
            {[section4Spot1, section4Spot2].map((spot, i) => (
              <div key={`bbq-parks-s4-${i}`} className="space-y-2">
                <h5 className="text-sm font-semibold text-gray-900 leading-snug">
                  {spot.title}
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {spot.description}
                </p>
                {spot.addressLines.length > 0 && (
                  <ul
                    className={`list-disc space-y-1.5 text-sm text-gray-700 leading-relaxed ${isModal ? "pl-5 sm:pl-6" : "pl-6"}`}
                  >
                    {spot.addressLines.map((line) => (
                      <li key={line}>{renderLabeledLine(line)}</li>
                    ))}
                  </ul>
                )}
              </div>
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
          {t("expBBQParksModalTip")}
        </p>
      </div>
    </div>
  );
}
