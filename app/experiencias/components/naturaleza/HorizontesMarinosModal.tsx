"use client";

import Link from "next/link";
import { useCallback } from "react";
import { createPortal } from "react-dom";
import { triggerLightTapHaptic } from "@/app/lib/haptics";
import { ProgressiveNextImage } from "../../../components/ProgressiveNextImage";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";
import playas1 from "./pictures/Playas 1.jpeg";
import playas2 from "./pictures/Playas 2.jpeg";
import playas3 from "./pictures/Playas 3.jpeg";
import playas4 from "./pictures/Playas 4.jpeg";
import horizontes1 from "./pictures/Horizontes marinos 1.jpeg";
import horizontes2 from "./pictures/Horizontes marinos 2.jpeg";
import horizontes3 from "./pictures/Horizontes marinos 3.jpeg";
import horizontes4 from "./pictures/Horizontes marinos 4.jpeg";

type HorizontesMarinosModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type HorizontesMarinosContentProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const MODAL_PRESS =
  "touch-manipulation transition-transform duration-150 ease-out active:scale-[0.96]";

function renderLabeledLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return <>{line}</>;

  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return <>{line}</>;

  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  if (labelWords > 4) return <>{line}</>;

  return (
    <>
      <span className="font-semibold">{rawLabel}</span>: {rest}
    </>
  );
}

function isSectionHeader(line: string) {
  const text = line.trim();
  if (!text) return false;
  if (text.endsWith(".") || text.endsWith("!") || text.endsWith("?")) return false;
  return text.length <= 96;
}

function isInftourHeader(line: string) {
  return /^inftour\s*:/i.test(line.trim());
}

function isShortLabeledBullet(line: string) {
  if (isInftourHeader(line)) return false;
  if (/^paseo\s+mar[ií]timo\s+infanta/i.test(line.trim())) return true;
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return false;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return false;
  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  return labelWords <= 3;
}

function isGroupHeader(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return false;
  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (rest) return false;
  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  return labelWords <= 3;
}

export default function HorizontesMarinosModal({
  isOpen,
  onClose,
}: HorizontesMarinosModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="horizontes-marinos-modal-title"
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

        <HorizontesMarinosContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-3 py-2 flex items-center justify-between gap-3">
          <Link
            href="/experiencias/horizontes-marinos"
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

export function HorizontesMarinosContent({
  isModal = false,
  onClose,
}: HorizontesMarinosContentProps) {
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

  const title = t("expHorizontesMarinosModalTitle");
  const subtitle = t("expHorizontesMarinosModalSubtitle");
  const intro = t("expHorizontesMarinosModalIntro");
  const body = t("expHorizontesMarinosModalBody");
  const ecoWalkBox = t("expHorizontesMarinosEcoWalkBox");
  const calpeWalkBox = t("expHorizontesMarinosCalpeWalkBox");
  const tip = t("expHorizontesMarinosModalInftourAdvice");

  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const ecoLines = ecoWalkBox
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const calpeLines = calpeWalkBox
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  type Section = {
    title: string | null;
    mainLines: string[];
    bullets: string[];
  };
  const sections: Section[] = [];

  for (const line of lines) {
    const lineIsHeader = isSectionHeader(line);
    const lineIsBullet = isShortLabeledBullet(line);

    if (lineIsHeader && !lineIsBullet) {
      sections.push({ title: line, mainLines: [], bullets: [] });
      continue;
    }

    if (lineIsBullet) {
      const current = sections[sections.length - 1];
      if (current) current.bullets.push(line);
      else sections.push({ title: null, mainLines: [], bullets: [line] });
      continue;
    }

    const current = sections[sections.length - 1];
    if (current) current.mainLines.push(line);
    else sections.push({ title: null, mainLines: [line], bullets: [] });
  }

  const ecoTitle = ecoLines[0] ?? "";
  const ecoIntro = ecoLines[1] ?? "";
  const ecoBullets = ecoLines.slice(2);
  const calpeTitle = calpeLines[0] ?? "";
  const calpeIntro = calpeLines[1] ?? "";
  const calpeBullets = calpeLines.slice(2);

  type EcoBulletGroup = { text: string; subItems: string[] };
  const ecoBulletGroups: EcoBulletGroup[] = [];
  for (const line of ecoBullets) {
    if (isGroupHeader(line)) {
      ecoBulletGroups.push({ text: line, subItems: [] });
      continue;
    }
    if (ecoBulletGroups.length > 0 && isShortLabeledBullet(line)) {
      ecoBulletGroups[ecoBulletGroups.length - 1].subItems.push(line);
      continue;
    }
    ecoBulletGroups.push({ text: line, subItems: [] });
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
          id="horizontes-marinos-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {title}
        </h1>
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {intro ? (
          <div
            className={`bg-brand-bg border border-gray-100 rounded-sm ${isModal ? "p-4 sm:p-5" : "p-5"}`}
          >
            <p className="text-sm text-gray-900 leading-relaxed">{intro}</p>
          </div>
        ) : null}

        <div className="flex w-full flex-row gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 p-2">
          {[playas1, playas2].map((src, i) => (
            <div
              key={i}
              className="relative h-36 flex-1 overflow-hidden rounded-sm border border-gray-200/80 bg-white"
            >
              <ProgressiveNextImage
                src={src}
                alt={`${title} - Playas ${i + 1}`}
                sizes="50vw"
                priority={i === 0}
                loading={i < 2 ? "eager" : "lazy"}
                imageClassName="object-cover"
              />
            </div>
          ))}
        </div>

        {ecoLines.length > 0 ? (
          <div
            className={`bg-brand-bg border border-gray-100 rounded-sm flex flex-col gap-3 hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5"}`}
          >
            {ecoTitle ? <p className="text-sm font-semibold text-gray-800">{ecoTitle}</p> : null}
            {ecoIntro ? <p className="text-sm text-gray-900 leading-relaxed">{ecoIntro}</p> : null}
            {ecoBulletGroups.length > 0 ? (
              <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                {ecoBulletGroups.map((item) => (
                  <li
                    key={item.text}
                    className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                  >
                    {renderLabeledLine(item.text)}
                    {item.subItems.length > 0 ? (
                      <ul className="flex flex-col gap-1 mt-1 pl-4 border-l border-brand-gold/20">
                        {item.subItems.map((sub) => (
                          <li
                            key={sub}
                            className="text-sm text-gray-600 leading-relaxed list-disc list-inside"
                          >
                            {renderLabeledLine(sub)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="flex w-full flex-row gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 p-2">
          {[playas3, playas4].map((src, i) => (
            <div
              key={i}
              className="relative h-36 flex-1 overflow-hidden rounded-sm border border-gray-200/80 bg-white"
            >
              <ProgressiveNextImage
                src={src}
                alt={`${title} - Playas ${i + 3}`}
                sizes="50vw"
                loading="lazy"
                imageClassName="object-cover"
              />
            </div>
          ))}
        </div>

        {calpeLines.length > 0 ? (
          <div
            className={`bg-brand-bg border border-gray-100 rounded-sm flex flex-col gap-3 hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5"}`}
          >
            {calpeTitle ? <p className="text-sm font-semibold text-gray-800">{calpeTitle}</p> : null}
            {calpeIntro ? <p className="text-sm text-gray-900 leading-relaxed">{calpeIntro}</p> : null}
            {calpeBullets.length > 0 ? (
              <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                {calpeBullets.map((line) => (
                  <li
                    key={line}
                    className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                  >
                    {renderLabeledLine(line)}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="flex w-full flex-row gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 p-2">
          {[horizontes1, horizontes2].map((src, i) => (
            <div
              key={i}
              className="relative h-36 flex-1 overflow-hidden rounded-sm border border-gray-200/80 bg-white"
            >
              <ProgressiveNextImage
                src={src}
                alt={`${title} - Horizontes marinos ${i + 1}`}
                sizes="50vw"
                loading="lazy"
                imageClassName="object-cover"
              />
            </div>
          ))}
        </div>

        {sections.map((section, index) => (
          <div
            key={`s-${index}-${(section.title ?? section.mainLines[0] ?? "").slice(0, 20)}`}
            className={`bg-brand-bg border border-gray-100 rounded-sm flex flex-col gap-3 hover:border-brand-gold/40 transition-colors ${isModal ? "p-4 sm:p-5" : "p-5"}`}
          >
            {section.title ? <p className="text-sm font-semibold text-gray-800">{section.title}</p> : null}

            {section.mainLines.map((line) => (
              <p key={line} className="text-sm text-gray-900 leading-relaxed">
                {line}
              </p>
            ))}

            {section.bullets.length > 0 ? (
              <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                {section.bullets.map((line) => (
                  <li
                    key={line}
                    className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                  >
                    {renderLabeledLine(line)}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        <div className="flex w-full flex-row gap-2 overflow-hidden rounded-sm border border-gray-200 bg-gray-100 p-2">
          {[horizontes3, horizontes4].map((src, i) => (
            <div
              key={i}
              className="relative h-36 flex-1 overflow-hidden rounded-sm border border-gray-200/80 bg-white"
            >
              <ProgressiveNextImage
                src={src}
                alt={`${title} - Horizontes marinos ${i + 3}`}
                sizes="50vw"
                loading="lazy"
                imageClassName="object-cover"
              />
            </div>
          ))}
        </div>
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
