"use client";

import { createPortal } from "react-dom";
import { useLangStore } from "../../../lib/langStore";
import { MODAL_TITLE_CLASS } from "../modalStyles";

type RelaxModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function renderLabeledLine(line: string) {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return <>{line}</>;

  const rawLabel = line.slice(0, colonIdx).trim();
  const rest = line.slice(colonIdx + 1).trim();
  if (!rest) return <>{line}</>;

  const labelWords = rawLabel.split(/\s+/).filter(Boolean).length;
  if (labelWords > 4) return <>{line}</>;

  // Underline only the keyword before any parenthetical detail
  const parenIdx = rawLabel.indexOf("(");
  const keyword =
    parenIdx !== -1 ? rawLabel.slice(0, parenIdx).trim() : rawLabel;
  const detail = parenIdx !== -1 ? " " + rawLabel.slice(parenIdx) : "";

  return (
    <>
      <span className="font-semibold">{keyword}</span>
      {detail}: {rest}
    </>
  );
}

function hasQuote(line: string) {
  // Includes angle quotes and common double quote variants.
  return /[«»"“”„]/.test(line);
}

function isNumberedHeader(line: string) {
  return /^\d+\./.test(line.trim());
}

function isInftourHeader(line: string) {
  return /^inftour\s*:/i.test(line.trim());
}

function isLocationUnitLine(line: string) {
  // Location lines in the DOCX contain distances like "(60 m)", "(1,2 km)", etc.
  return /\(\s*[\d.,]+\s*(m|km)\s*\)/i.test(line);
}

function renderMainLine(line: string) {
  // Bold location names — everything up to and including the last distance marker e.g. "(40 m)", "(1,2 km)"
  const distanceRe = /\(\s*[\d.,]+\s*(?:m|km)\s*\)/gi;
  let lastMatch: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = distanceRe.exec(line)) !== null) lastMatch = m;
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
  // Seasons include degrees (..C) inside parentheses; times include HH:MM inside parentheses.
  return /\(\s*\d{1,2}:\d{2}/.test(line) || /\(\s*.*C\s*\)/i.test(line);
}

export default function RelaxModal({ isOpen, onClose }: RelaxModalProps) {
  const t = useLangStore((s) => s.t);

  if (!isOpen || typeof document === "undefined") return null;

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
    .map((l) => l.trim())
    .filter(Boolean);

  // Some DOCX versions include an extra trailing line (e.g. an English question).
  // Inftour tips are consistently marked with "Inftour" in all languages, so we
  // pick the last such paragraph as the tip and keep the rest as content.
  let tip = "";
  let tipIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/inftour/i.test(lines[i])) {
      tipIndex = i;
      tip = lines[i];
      break;
    }
  }
  const contentLines =
    tipIndex !== -1 ? lines.filter((_, idx) => idx !== tipIndex) : lines;

  type SubGroup = { main: string; bullets: string[] };
  type Section = { title: string | null; subgroups: SubGroup[] };
  const sections: Section[] = [];

  let prevWasImpression = false;

  for (const line of contentLines) {
    const numbered = isNumberedHeader(line);
    const locationUnit = isLocationUnitLine(line);

    const isImpression = line.includes(":") && hasQuote(line);
    const isAction =
      prevWasImpression && line.includes(":") && !numbered && !locationUnit;

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
        sections.push({
          title: null,
          subgroups: [{ main: line, bullets: [] }],
        });
      }
    }

    prevWasImpression = isImpression;
  }

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
          aria-label="Close"
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

        <div className="overflow-y-auto flex-1 px-8 py-6 scrollbar-modal">
          <div className="bg-brand-bg border-b border-gray-200 -mx-8 px-8 pt-6 pb-6 mb-6 pr-14">
            <div className="h-px w-12 bg-brand-gold mb-4" aria-hidden />
            <h3 id="relax-modal-title" className={MODAL_TITLE_CLASS}>
              {title}
            </h3>
            <p className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mt-2">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sections.map((section, sIdx) => (
              <div
                key={`s-${sIdx}-${(section.title ?? section.subgroups[0]?.main ?? "").slice(0, 20)}`}
                className="bg-brand-bg border border-gray-100 rounded-sm p-5 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
              >
                {section.title && (
                  <p className="text-sm font-semibold text-gray-800">
                    {section.title}
                  </p>
                )}
                {section.subgroups.map((sg, sgIdx) => (
                  <div
                    key={`sg-${sgIdx}-${sg.main.slice(0, 20)}`}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-sm text-gray-900">
                      {renderMainLine(sg.main)}
                    </p>
                    {sg.bullets.length > 0 && (
                      <ul className="flex flex-col gap-2 pl-4 border-l-2 border-brand-gold/30">
                        {sg.bullets.map((b: string) => (
                          <li
                            key={b}
                            className="text-sm text-gray-700 leading-relaxed list-disc list-inside"
                          >
                            {renderLabeledLine(b)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {tip ? (
            <div className="mt-6 bg-brand-darkgray text-white rounded-sm px-6 py-5 flex gap-4 items-start">
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
        <div className="border-t border-gray-200 px-6 py-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-brand-darkgray text-white rounded-sm px-5 py-2 font-semibold hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
