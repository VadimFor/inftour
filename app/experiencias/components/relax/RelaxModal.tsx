"use client";

import { Fragment } from "react";
import { createPortal } from "react-dom";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";
import { useModalBodyScrollLock } from "../useModalBodyScrollLock";
import { ProgressiveNextImage } from "../../../components/ProgressiveNextImage";
import relax1 from "./1 Gigantes de oro.png";
import relax2 from "./2 Un toque de historia.png";
import relax3 from "./3 Gastronomía y relax.png";
import relax4 from "./4 Mundos submarinos.png";
import relax5 from "./5 Libertad salvaje.png";
import relax6 from "./6 Fiordos secretos.png";

const relaxImages: Record<number, typeof relax1> = {
  1: relax1,
  2: relax2,
  3: relax3,
  4: relax4,
  5: relax5,
  6: relax6,
};

type RelaxModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type RelaxContentProps = {
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
  if (labelWords > 4) return <>{line}</>;

  const parenIdx = rawLabel.indexOf("(");
  const keyword = parenIdx !== -1 ? rawLabel.slice(0, parenIdx).trim() : rawLabel;
  const detail = parenIdx !== -1 ? " " + rawLabel.slice(parenIdx) : "";

  return (
    <>
      <span className="font-semibold">{keyword}</span>
      {detail}: {rest}
    </>
  );
}

function hasQuote(line: string) {
  return /[«»"“”„]/.test(line);
}

function isNumberedHeader(line: string) {
  return /^\d+\./.test(line.trim());
}

function isInftourHeader(line: string) {
  return /^inftour\s*:/i.test(line.trim());
}

function isLocationUnitLine(line: string) {
  return /\(\s*[\d.,]+\s*(m|km)\s*\)/i.test(line);
}

function renderMainLine(line: string) {
  const distanceRe = /\(\s*[\d.,]+\s*(?:m|km)\s*\)/gi;
  let lastMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = distanceRe.exec(line)) !== null) lastMatch = match;
  if (!lastMatch) return <>{line}</>;
  const boldPart = line.slice(0, lastMatch.index + lastMatch[0].length);
  const rest = line.slice(lastMatch.index + lastMatch[0].length).trim();
  return (
    <>
      <strong>{boldPart}</strong>
      {rest ? " " + rest : ""}
    </>
  );
}

function isTimeOrSeasonBullet(line: string) {
  return /\(\s*\d{1,2}:\d{2}/.test(line) || /\(\s*.*C\s*\)/i.test(line);
}

function openElevenLabsChat() {
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
}

export default function RelaxModal({ isOpen, onClose }: RelaxModalProps) {
  const t = useLangStore((s) => s.t);
  useModalBodyScrollLock(isOpen);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="relax-modal-title"
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

        <RelaxContent isModal onClose={onClose} />
        <div className="border-t border-gray-200 px-6 py-2 flex items-center justify-between gap-3">
          <a
            href="/experiencias/relax"
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

export function RelaxContent({
  isModal = false,
  onClose,
}: RelaxContentProps) {
  const t = useLangStore((s) => s.t);

  const title = t("expRelaxModalTitle");
  const subtitle = t("expRelaxModalSubtitle");
  const bodyRaw = [
    t("expRelaxModalBody"),
    t("expRelaxModalBodySeasons"),
    t("expRelaxModalBodyRhythm"),
    t("expRelaxModalBody1"),
    t("expRelaxModalBody2"),
    t("expRelaxModalBody3"),
    t("expRelaxModalBody4"),
    t("expRelaxModalBody5"),
    t("expRelaxModalBody6"),
  ]
    .filter(Boolean)
    .join("\n");

  const lines = bodyRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let tip = "";
  let tipIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/inftour/i.test(lines[i])) {
      tipIndex = i;
      tip = lines[i];
      break;
    }
  }
  const contentLines = tipIndex !== -1 ? lines.filter((_, idx) => idx !== tipIndex) : lines;

  type SubGroup = { main: string; bullets: string[] };
  type Section = { title: string | null; subgroups: SubGroup[] };
  const sections: Section[] = [];

  let prevWasImpression = false;

  for (const line of contentLines) {
    const numbered = isNumberedHeader(line);
    const locationUnit = isLocationUnitLine(line);

    const isImpression = line.includes(":") && hasQuote(line);
    const isAction = prevWasImpression && line.includes(":") && !numbered && !locationUnit;
    const isTimeSeasonBullet = isTimeOrSeasonBullet(line) && !locationUnit;
    const isBullet = isImpression || isAction || isTimeSeasonBullet;

    if (numbered || isInftourHeader(line)) {
      sections.push({ title: line, subgroups: [] });
    } else if (isBullet) {
      const currentSection = sections[sections.length - 1];
      const currentSubgroups = currentSection?.subgroups;
      if (currentSubgroups?.length) {
        currentSubgroups[currentSubgroups.length - 1].bullets.push(line);
      }
    } else {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        lastSection.subgroups.push({ main: line, bullets: [] });
      } else {
        sections.push({ title: null, subgroups: [{ main: line, bullets: [] }] });
      }
    }

    prevWasImpression = isImpression;
  }

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
          id="relax-modal-title"
          className={isModal ? MODAL_TITLE_CLASS : "text-3xl md:text-4xl font-serif text-gray-900"}
        >
          {title}
        </h1>
        <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, sectionIndex) => {
          const sectionNum = section.title
            ? parseInt(section.title.match(/^(\d+)\./)?.[1] ?? "0", 10)
            : 0;
          const sectionImg = sectionNum >= 1 && sectionNum <= 6 ? relaxImages[sectionNum] : null;

          return (
            <Fragment
              key={`s-${sectionIndex}-${(section.title ?? section.subgroups[0]?.main ?? "").slice(0, 20)}`}
            >
              <div className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors">
                {section.title ? (
                  <p className="text-sm font-semibold text-gray-800">{section.title}</p>
                ) : null}
                {section.subgroups.map((subgroup, subgroupIndex) => (
                  <div
                    key={`sg-${subgroupIndex}-${subgroup.main.slice(0, 20)}`}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-sm text-gray-900">{renderMainLine(subgroup.main)}</p>
                    {subgroup.bullets.length > 0 ? (
                      <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                        {subgroup.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                          >
                            {renderLabeledLine(bullet)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
              {sectionImg ? (
                <div className="relative w-full h-96 overflow-hidden rounded-sm border border-gray-200">
                  <ProgressiveNextImage
                    src={sectionImg}
                    alt={section.title ?? ""}
                    sizes="100vw"
                    priority={sectionNum === 1}
                    loading={sectionNum === 1 ? "eager" : "lazy"}
                    imageClassName="object-cover"
                  />
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {tip ? (
        <button
          type="button"
          onClick={() => {
            onClose?.();
            openElevenLabsChat();
          }}
          className="mt-6 w-full text-left bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start cursor-pointer"
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
        </button>
      ) : null}
    </div>
  );
}
