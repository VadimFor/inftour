"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";

const MARKET_IMAGES = [
  "/sabores/pictures/Mercado Lonja 1.png",
  "/sabores/pictures/Mercado Lonja 2.jpg",
  "/sabores/pictures/Mercado Lonja 3.png",
  "/sabores/pictures/Mercado Lonja 4.jpg",
];

type MarketsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sectionsMeta = [
  { key: "expMarketsModalSection1" },
  { key: "expMarketsModalSection2" },
  { key: "expMarketsModalSection3" },
  { key: "expMarketsModalSection4" },
  { key: "expMarketsModalSection5" },
] as const;

export default function MarketsModal({ isOpen, onClose }: MarketsModalProps) {
  const t = useLangStore((s) => s.t);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  useModalBodyScrollLock(isOpen);
  useEffect(() => {
    MARKET_IMAGES.forEach((src) => { const img = new window.Image(); img.src = src; });
  }, []);
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
    onClose();
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

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="markets-modal-title"
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
            <h3 id="markets-modal-title" className={MODAL_TITLE_CLASS}>
              {t("expMarketsModalTitle")}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {t("expMarketsModalSubtitle")}
            </p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-8 border-l-2 border-brand-gold pl-4">
            {t("expMarketsModalIntro")}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {sectionsMeta.map(({ key }, index) =>
              (() => {
                const section = parseSection(key);
                return (
                  <div
                    key={key}
                    className="group bg-brand-bg border border-gray-100 rounded-sm overflow-hidden flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
                  >
                    <div className="px-5 pt-7">
                      <div className="h-px w-8 bg-brand-gold mb-3" />
                      <h4 className="text-base font-semibold text-gray-900 leading-snug">
                        {section.title}
                      </h4>
                    </div>

                    {MARKET_IMAGES[index] && !failedImages.has(index) && (
                      <div className="relative w-full h-72 overflow-hidden">
                        <Image
                          src={MARKET_IMAGES[index]}
                          alt={section.title}
                          fill
                          onError={() => setFailedImages((prev) => new Set(prev).add(index))}
                          className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500 ease-in-out"
                          sizes="(max-width: 896px) 100vw, 896px"
                        />
                      </div>
                    )}

                    <div className="px-5 pb-5 flex flex-col gap-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {section.description}
                      </p>

                      {section.bullets.length > 0 && (
                        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 leading-relaxed">
                          {section.bullets.map((bullet) => {
                            const [label, ...rest] = bullet.split(":");
                            const hasLabel = rest.length > 0;
                            return (
                              <li key={bullet}>
                                {hasLabel ? (
                                  <>
                                    <strong>{label}:</strong>{" "}
                                    {rest.join(":").trim()}
                                  </>
                                ) : (
                                  bullet
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })(),
            )}
          </div>

          <div
            className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start cursor-pointer"
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
              {t("expMarketsModalTip")}
            </p>
          </div>
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
