"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { ProgressiveNextImage } from "../../../components/ProgressiveNextImage";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";
import ascenso1 from "./pictures/Ascenso al Peñón 1.jpeg";
import ascenso2 from "./pictures/Ascenso al Peñón 2.jpeg";
import ascenso3 from "./pictures/Ascenso al Peñón 3.jpeg";

type IfachModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type IfachContentProps = {
  isModal?: boolean;
  onClose?: () => void;
};

function renderLabeledLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return <>{line}</>;

  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return <>{line}</>;

  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  if (labelWords > 6) return <>{line}</>;

  return (
    <>
      <span className="font-semibold">{rawLabel}</span>: {rest}
    </>
  );
}

function isHeaderLike(line: string) {
  const t = line.trim();
  if (!t) return false;
  if (/^inftour\s*:/i.test(t)) return true;
  if (t.endsWith(".") || t.endsWith("!") || t.endsWith("?")) return false;
  return t.length <= 72;
}

export default function IfachModal({ isOpen, onClose }: IfachModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ifach-modal-title"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <IfachContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-6 py-2 flex items-center justify-between gap-3">
          <a
            href="/experiencias/ifach"
            className="bg-white text-brand-darkgray border border-gray-300 rounded-sm px-5 py-2 font-semibold hover:bg-gray-50 transition"
          >
            {t("openPage")}
          </a>
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

export function IfachContent({
  isModal = false,
  onClose,
}: IfachContentProps) {
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
    onClose?.();
    openAIWidget();
  }, [onClose, openAIWidget]);

  const title = t("expIfachModalTitle");
  const subtitle = t("expIfachModalSubtitle");
  const bodyIntro = t("expIfachModalBodyIntro");
  const bodyTitan = t("expIfachModalBodyTitan");
  const bodyHeroRoute = t("expIfachModalBodyHeroRoute");
  const bodyRisk = t("expIfachModalBodyRisk");
  const inftourParagraph = t("expIfachModalInftourParagraph");
  const tip = t("expIfachModalInftourAdvice");
  const postscript = t("expIfachModalBodyPostscript");

  const parts = [
    bodyIntro,
    bodyTitan,
    bodyHeroRoute,
    bodyRisk,
    inftourParagraph,
    postscript,
  ]
    .filter(Boolean)
    .map((part) =>
      part
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0);

  const sections = parts.map((lines) => {
    const first = lines[0] ?? "";
    const sectionTitle = isHeaderLike(first) ? first : null;
    const rest = sectionTitle ? lines.slice(1) : lines;

    const isSubBullet = (line: string) => line.startsWith("--");
    const isBulletLine = (line: string) => {
      const text = isSubBullet(line) ? line.slice(2) : line;
      const colonIdx = text.indexOf(":");
      if (colonIdx === -1) return false;
      const rawLabel = text.slice(0, colonIdx).trim();
      const after = text.slice(colonIdx + 1).trim();
      if (!after) return false;
      const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
      return labelWords <= 3;
    };

    const allBullets = rest.filter(isBulletLine);
    const mainLines = rest.filter((line) => !allBullets.includes(line));

    type BulletItem = { text: string; subItems: string[] };
    const bulletLines: BulletItem[] = [];
    for (const line of allBullets) {
      if (isSubBullet(line)) {
        if (bulletLines.length > 0) {
          bulletLines[bulletLines.length - 1].subItems.push(line.slice(2));
        }
      } else {
        bulletLines.push({ text: line, subItems: [] });
      }
    }

    return { title: sectionTitle, mainLines, bulletLines };
  });

  return (
    <div className={isModal ? "overflow-y-auto flex-1 px-8 py-6 scrollbar-modal" : "container mx-auto px-4 py-12"}>
      <div
        className={
          isModal
            ? "bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14"
            : "bg-brand-bg border border-gray-100 rounded-sm px-8 pt-6 pb-6 mb-6"
        }
      >
        <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
        <h1
          id="ifach-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {title}
        </h1>
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, sIdx) => (
          <div
            key={`s-${sIdx}-${(section.title ?? section.mainLines[0] ?? "").slice(0, 20)}`}
            className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
          >
            {section.title ? (
              <p className="text-sm font-semibold text-gray-800">{section.title}</p>
            ) : null}

            {section.mainLines.map((line, idx) => (
              <p key={`m-${idx}-${line.slice(0, 18)}`} className="text-sm text-gray-900 leading-relaxed">
                {renderLabeledLine(line)}
              </p>
            ))}

            {section.bulletLines.length ? (
              <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                {section.bulletLines.map((bullet) => (
                  <li
                    key={bullet.text}
                    className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                  >
                    {renderLabeledLine(bullet.text)}
                    {bullet.subItems.length > 0 && (
                      <ul className="flex flex-col gap-1 mt-1 pl-4 border-l border-brand-gold/20">
                        {bullet.subItems.map((sub) => (
                          <li
                            key={sub}
                            className="text-sm text-gray-600 leading-relaxed list-disc list-inside"
                          >
                            {renderLabeledLine(sub)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}

            {sIdx === 0 ? (
              <div className="w-full border border-gray-200 bg-gray-100 p-2 rounded-sm overflow-hidden">
                <div className="relative h-72 overflow-hidden rounded-sm border border-gray-200/80 bg-white">
                  <ProgressiveNextImage
                    src={ascenso1}
                    alt={`${title} - Ascenso al Peñón 1`}
                    sizes="min(896px, 100vw)"
                    priority
                    imageClassName="object-cover"
                  />
                </div>
              </div>
            ) : null}

            {sIdx === 2 ? (
              <div className="flex w-full flex-row gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 p-2">
                {[ascenso2, ascenso3].map((src, i) => (
                  <div
                    key={i}
                    className="relative h-36 flex-1 overflow-hidden rounded-sm border border-gray-200/80 bg-white"
                  >
                    <ProgressiveNextImage
                      src={src}
                      alt={`${title} - Ascenso al Peñón ${i + 2}`}
                      sizes="50vw"
                      loading="eager"
                      imageClassName="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {tip ? (
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
          <p className="text-xs leading-relaxed text-gray-300 whitespace-pre-line">
            {tip}
          </p>
        </div>
      ) : null}
    </div>
  );
}
